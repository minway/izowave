import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';
import { v4 as uuidv4 } from 'uuid';

import { Scene } from '..';
import { DIFFICULTY } from '../../../const/difficulty';
import { GameScene, GameState, GameEvent } from '../../types';

import { Builder } from './builder';
import { Camera } from './camera';
import { LiveEvent } from './entities/addons/live/types';
import { BuildingVariant } from './entities/building/types';
import { Crystal } from './entities/crystal';
import { Assistant } from './entities/npc/assistant';
import { Player } from './entities/player';
import { EntityType } from './entities/types';
import { FXManager } from './fx-manager';
import { WorldUI } from './interface';
import { Level } from './level';
import { LEVEL_PLANETS } from './level/const';
import { SpawnTarget,
} from './level/types';
import { Spawner } from './spawner';
import {
  WorldModeIcon, WorldMode, WorldEvent,
} from './types';
import { Wave } from './wave';
import { WaveEvent } from './wave/types';

import type { IBuilder } from './builder/types';
import type { ICamera } from './camera/types';
import type { IBuilding } from './entities/building/types';
import type { ICrystal } from './entities/crystal/types';
import type { IAssistant } from './entities/npc/assistant/types';
import type { IPlayer } from './entities/player/types';
import type { ISprite } from './entities/types';
import type { IFXManager } from './fx-manager/types';
import type {
  ILevel, LevelData, PositionAtWorld, PositionAtMatrix } from './level/types';
import type { ISpawner } from './spawner/types';
import type { IWorld, WorldHint, WorldTimerParams, WorldSavePayload } from './types';
import type { IWave } from './wave/types';

import { Assets } from '~lib/assets';
import { aroundPosition } from '~lib/dimension';
import { progressionLinear } from '~lib/progression';
import { Utils } from '~lib/utils';
import { Nation } from './nation';

Assets.RegisterImages(WorldModeIcon);

export class World extends Scene implements IWorld {
  private entityGroups: Record<EntityType, Phaser.GameObjects.Group>;

  private _player: IPlayer;

  public get player() { return this._player; }

  private set player(v) { this._player = v; }

  private _assistant: IAssistant;

  public get assistant() { return this._assistant; }

  private set assistant(v) { this._assistant = v; }

  private _level: ILevel;

  public get level() { return this._level; }

  private set level(v) { this._level = v; }

  private _wave: IWave;

  public get wave() { return this._wave; }

  private set wave(v) { this._wave = v; }

  private _builder: IBuilder;

  public get builder() { return this._builder; }

  private set builder(v) { this._builder = v; }

  private _spawner: ISpawner;

  public get spawner() { return this._spawner; }

  private set spawner(v) { this._spawner = v; }

  private _fx: IFXManager;

  public get fx() { return this._fx; }

  private set fx(v) { this._fx = v; }

  private _camera: ICamera;

  public get camera() { return this._camera; }

  private set camera(v) { this._camera = v; }

  private lifecyle: Phaser.Time.TimerEvent;

  private _deltaTime: number = 1;

  public get deltaTime() { return this._deltaTime; }

  private set deltaTime(v) { this._deltaTime = v; }

  private timers: Phaser.Time.TimerEvent[] = [];

  private nations: Nation[] = [];

  private aiPlayers: IPlayer[] = [];
  
  private modes: Record<WorldMode, boolean> = {
    [WorldMode.TIME_SCALE]: false,
    [WorldMode.BUILDING_INDICATORS]: false,
    [WorldMode.AUTO_REPAIR]: false,
    [WorldMode.PATH_TO_CRYSTAL]: false,
  };

  constructor() {
    super(GameScene.WORLD);
  }

  public create(data: LevelData) {
    this.input.setPollAlways();

    this.level = new Level(this, data);
    this.fx = new FXManager(this);
    this.camera = new Camera(this);
    this.spawner = new Spawner(this);

    this.timers = [];
    this.modes = {
      [WorldMode.TIME_SCALE]: false,
      [WorldMode.BUILDING_INDICATORS]: false,
      [WorldMode.AUTO_REPAIR]: false,
      [WorldMode.PATH_TO_CRYSTAL]: false,
    };

    this.addEntityGroups();
  }

  public start() {
    new Interface(this, WorldUI);

    this.addLifecycle();

    this.camera.addZoomControl();

    this.addWaveManager();    
    this.addPlayer();
    this.addBuilder();
    this.addAssistant();
    this.addCrystals();
    this.addAIPlayer();

    if (this.game.usedSave?.payload.world) {
      this.loadSavePayload(this.game.usedSave.payload.world);
    }
  }

  public update(time: number, delta: number) {
    if (this.game.state !== GameState.STARTED) {
      return;
    }

    try {
      this.deltaTime = delta;

      this.builder.update();
      this.wave.update();
    } catch (error) {
      console.warn('Failed to update world', error as TypeError);
    }
  }

  public showHint(hint: WorldHint) {
    const id = hint.unique
      ? Utils.HashString(hint.label)
      : uuidv4();

    this.events.emit(WorldEvent.SHOW_HINT, id, hint);

    return id;
  }

  public hideHint(id: string) {
    this.events.emit(WorldEvent.HIDE_HINT, id);
  }

  public getTime() {
    return Math.floor(this.lifecyle.getElapsed());
  }

  public isTimePaused() {
    return this.lifecyle.paused;
  }

  // Time pause
  // Stop increasing time, but player's hero still can move 
  // Mainly used for hints/tutorials
  public setTimePause(state: boolean) {
    this.lifecyle.paused = state;
  }

  public getTimeScale() {
    return this.lifecyle.timeScale;
  }

  public setTimeScale(scale: number) {
    this.physics.world.timeScale = 1 / scale;

    this.timers.forEach((timer) => {
      // eslint-disable-next-line no-param-reassign
      timer.timeScale = scale;
    });
  }

  public addProgression(params: WorldTimerParams) {
    const delay = params.frequence ?? 50;
    const repeat = Math.ceil(params.duration / delay);
    const timer = this.time.addEvent({
      timeScale: this.getTimeScale(),
      delay,
      repeat,
      callback: () => {
        const left = timer.getRepeatCount() - 1;

        if (params.onProgress) {
          params.onProgress?.(left, repeat);
        }
        if (left <= 0) {
          params.onComplete();
          this.removeProgression(timer);
        }
      },
    });

    this.timers.push(timer);

    return timer;
  }

  public removeProgression(timer: Phaser.Time.TimerEvent): void {
    const index = this.timers.indexOf(timer);

    if (index !== -1) {
      timer.destroy();
      this.timers.splice(index, 1);
    }
  }

  public setModeActive(mode: WorldMode, state: boolean) {
    this.modes[mode] = state;

    this.events.emit(WorldEvent.TOGGLE_MODE, mode, state);
  }

  public isModeActive(mode: WorldMode) {
    return this.modes[mode];
  }

  public getResourceExtractionSpeed() {
    const generators = this.builder.getBuildingsByVariant(BuildingVariant.GENERATOR);
    const countPerSecond = generators.reduce((current, generator) => (
      current + ((1 / generator.getActionsDelay()) * 1000)
    ), 0);

    return countPerSecond;
  }

  public addEntityToGroup(gameObject: Phaser.GameObjects.GameObject, type: EntityType) {
    this.entityGroups[type].add(gameObject);
  }

  public getEntitiesGroup(type: EntityType) {
    return this.entityGroups[type];
  }

  public getEntities<T = Phaser.GameObjects.GameObject>(type: EntityType) {
    return this.entityGroups[type].getChildren() as T[];
  }

  public getFuturePosition(sprite: ISprite, seconds: number): PositionAtWorld {
    const fps = this.game.loop.actualFps;
    const drag = 0.3 ** (1 / fps);
    const per = 1 - drag ** (seconds * fps);
    const offset = {
      x: ((sprite.body.velocity.x / fps) * per) / (1 - drag),
      y: ((sprite.body.velocity.y / fps) * per) / (1 - drag),
    };

    return {
      x: sprite.body.center.x + offset.x,
      y: sprite.body.center.y + offset.y,
    };
  }

  private addEntityGroups() {
    this.entityGroups = {
      [EntityType.CRYSTAL]: this.add.group(),
      [EntityType.NPC]: this.add.group(),
      [EntityType.ENEMY]: this.add.group(),
      [EntityType.BUILDING]: this.add.group({
        runChildUpdate: true,
      }),
      [EntityType.SHOT]: this.add.group({
        runChildUpdate: true,
      }),
      [EntityType.SPRITE]: this.add.group({
        runChildUpdate: true,
      }),
    };
  }

  private addLifecycle() {
    this.lifecyle = this.time.addEvent({
      delay: Number.MAX_SAFE_INTEGER,
      loop: true,
      startAt: this.game.usedSave?.payload.world.time ?? 0,
    });

    this.timers.push(this.lifecyle);
  }

  private addWaveManager() {
    this.wave = new Wave(this);

    if (this.game.usedSave?.payload.wave) {
      this.wave.loadSavePayload(this.game.usedSave.payload.wave);
    } else {
      this.wave.runTimeleft();
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.wave.destroy();
    });
  }

  private addBuilder() {

  }

  private addPlayer() {
    const positionAtMatrix = (
      this.game.usedSave?.payload.player.position
      ?? Phaser.Utils.Array.GetRandom(
        this.level.readSpawnPositions(SpawnTarget.PLAYER),
      )
    );

    this.player = new Player(this, { positionAtMatrix, ai: false });
    console.log('Player position', this.player.positionAtMatrix);

    // Add player's nation
    let nation = new Nation(this, this.player, 'Player Nation');
    this.nations.push(nation);
    this.player.setNation(nation);

    this.builder = new Builder(this, this.player);

    this.game.events.once(GameEvent.FINISH, () => {
      this.builder.close();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.builder.destroy();
    });

    this.player.setBuilder(this.builder);

    if (this.game.usedSave?.payload.player) {
      this.player.loadSavePayload(this.game.usedSave.payload.player);
    }

    //this.level.clearFog(this.player.positionAtMatrix, 4);
    
    this.camera.focusOn(this.player);

    this.player.live.on(LiveEvent.DEAD, () => {
      this.camera.zoomOut();
      this.game.finishGame();
    });
  }

  private addAssistant() {
    const positionAtMatrix = aroundPosition(this.player.positionAtMatrix).find((spawn) => {
      const biome = this.level.map.getAt(spawn);

      return biome?.solid;
    });

    this.assistant = new Assistant(this, {
      owner: this.player,
      positionAtMatrix: positionAtMatrix || this.player.positionAtMatrix,
      speed: this.player.speed,
    });
  }

  private addAIPlayer() {
    const positionAtMatrix = (
      this.game.usedSave?.payload.player.position
      ?? Phaser.Utils.Array.GetRandom(
        this.level.readSpawnPositions(SpawnTarget.PLAYER),
      )
    );

    let aiPlayer = new Player(this, { positionAtMatrix, ai: true });
    this.aiPlayers.push(aiPlayer);

    let nation = new Nation(this, this.player, 'AI-1');
    this.nations.push(nation);
    aiPlayer.setNation(nation);

    let builder = new Builder(this, aiPlayer);

    this.game.events.once(GameEvent.FINISH, () => {
      builder.close();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      builder.destroy();
    });

    aiPlayer.setBuilder(builder);

    //if (this.game.usedSave?.payload.player) {
    //  this.player.loadSavePayload(this.game.usedSave.payload.player);
    //}

    //this.camera.focusOn(this.player);

    //this.player.live.on(LiveEvent.DEAD, () => {
    //  this.camera.zoomOut();
    //  this.game.finishGame();
    //});
  }

  private addCrystals() {
    const positions = this.level.readSpawnPositions(SpawnTarget.CRYSTAL);

    const getRandomPosition = () => {
      const freePositions = positions.filter((position) => this.level.isFreePoint({ ...position, z: 1 }));

      return Phaser.Utils.Array.GetRandom(freePositions);
    };

    const create = (position: PositionAtMatrix) => {
      const variants = LEVEL_PLANETS[this.level.planet].CRYSTAL_VARIANTS;

      new Crystal(this, {
        positionAtMatrix: position,
        variant: Phaser.Utils.Array.GetRandom(variants),
      });
    };

    const getMaxCount = () => progressionLinear({
      defaultValue: DIFFICULTY.CRYSTAL_COUNT / this.game.getDifficultyMultiplier(),
      scale: DIFFICULTY.CRYSTAL_COUNT_GROWTH,
      level: this.wave.number,
      maxLevel: DIFFICULTY.CRYSTAL_COUNT_GROWTH_MAX_LEVEL,
    });

    if (this.game.usedSave?.payload.world.crystals) {
      this.game.usedSave.payload.world.crystals.forEach((crystal) => {
        create(crystal.position);
      });
    } else {
      const maxCount = getMaxCount();

      for (let i = 0; i < maxCount; i++) {
        const position = getRandomPosition();

        create(position);
      }
    }

    this.wave.on(WaveEvent.COMPLETE, () => {
      const newCount = getMaxCount() - this.getEntitiesGroup(EntityType.CRYSTAL).getTotalUsed();

      for (let i = 0; i < newCount; i++) {
        const position = getRandomPosition();

        create(position);
      }
    });
  }

  public getSavePayload(): WorldSavePayload {
    return {
      time: this.getTime(),
      crystals: this.getEntities<ICrystal>(EntityType.CRYSTAL)
        .map((crystal) => crystal.getSavePayload()),
      buildings: this.getEntities<IBuilding>(EntityType.BUILDING)
        .map((building) => building.getSavePayload()),
    };
  }

  private loadSavePayload(data: WorldSavePayload) {
    data.buildings.forEach((buildingData) => {
      try {
        // PATCH: For saves with old version
        // @ts-ignore
        const variant = (buildingData.variant === 'ELECTRO')
          ? BuildingVariant.TOWER_ELECTRO
          : buildingData.variant;

        const building = this.builder.createBuilding({
          variant,
          positionAtMatrix: buildingData.position,
        });

        building.loadSavePayload(buildingData);
      } catch (error) {
        console.warn(`Failed to load '${buildingData.variant}' building`, error as TypeError);
      }
    });
  }
}
