import { WorldGenerator } from 'gen-biome';
import Phaser from 'phaser';

import { GameEvent, GameSettings } from '../../../types';

import {
  LEVEL_MAP_TILE,
  LEVEL_MAP_SIZE,
  LEVEL_MAP_MAX_HEIGHT,
  LEVEL_BIOME_PARAMETERS,
  LEVEL_SCENERY_TILE,
  LEVEL_PLANETS,
  LEVEL_SEED_SIZE,
  LEVEL_MAP_PERSPECTIVE,
} from './const';
import { TileMatrix } from './tile-matrix';
import {
  LevelPlanet,
  LevelSceneryTexture,
  LevelResourceTexture,
  LevelTilesetTexture,
  TerrainType,
  ResourceType,
  SpawnTarget,
  TileType,
} from './types';

import type { ITile } from './tile-matrix/types';
import type {
  BiomeType,
  ILevel,
  LevelBiome,
  LevelData,
  LevelSavePayload,
  PositionAtMatrix,
  PositionAtWorld,
  TilePosition } from './types';
import type { Effect } from '../fx-manager/effect';
import type { IWorld } from '../types';
import type { World } from 'gen-biome';
import type { INavigator } from '~lib/navigator/types';

import { Assets } from '~lib/assets';
import { isPositionsEqual } from '~lib/dimension';
import { Navigator } from '~lib/navigator';
import { WORLD_DEPTH_FOG } from '~scene/world/const';

import twMap from './realmaps/tw.json';
import japanMap from './realmaps/japan.json';
import britainMap from './realmaps/britain.json';

Assets.RegisterSprites(LevelTilesetTexture, LEVEL_MAP_TILE);
Assets.RegisterSprites(LevelSceneryTexture, LEVEL_SCENERY_TILE);
Assets.RegisterSprites(LevelResourceTexture, LEVEL_SCENERY_TILE);

export class Level extends TileMatrix implements ILevel {
  readonly scene: IWorld;

  readonly navigator: INavigator;

  readonly map: World<LevelBiome>;

  readonly terrainMap: TerrainType[][] = [];

  readonly resourceMap: ResourceType[][] = [];

  readonly planet: LevelPlanet;

  readonly gridCollide: boolean[][] = [];

  readonly gridSolid: boolean[][] = [];

  private _effectsOnGround: Effect[] = [];

  private mapWidth: number;

  private mapHeight: number;

  private mapData: any;

  public get effectsOnGround() { return this._effectsOnGround; }

  private set effectsOnGround(v) { this._effectsOnGround = v; }

  private _groundLayer: Phaser.Tilemaps.TilemapLayer;

  public get groundLayer() { return this._groundLayer; }

  private set groundLayer(v) { this._groundLayer = v; }

  private sceneryTiles: Phaser.GameObjects.Group;

  private _fogLayer: Phaser.Tilemaps.TilemapLayer;

  public get fogLayer() { return this._fogLayer; }

  private set fogLayer(v) { this._fogLayer = v; }

  private gridFog: boolean[][] = [];

  constructor(scene: IWorld, { planet, seed }: LevelData) {
    super(LEVEL_MAP_SIZE, LEVEL_MAP_MAX_HEIGHT);

    this.scene = scene;
    this.planet = planet ?? LevelPlanet.EARTH;

    // Load the map data from JSON file
    this.mapData = twMap;
    let newScenario = false;

    if (planet === LevelPlanet.TAIWAN) {
      this.mapData = twMap;
      newScenario = true;
    } else if (planet === LevelPlanet.JAPAN) {
      this.mapData = japanMap;
      newScenario = true;
    } else if (planet === LevelPlanet.BRITAIN) {
      this.mapData = britainMap;
      newScenario = true;
    }    
    
    if (newScenario) {    
      // Map width and height from JSON
      this.mapWidth = this.mapData.width;
      this.mapHeight = this.mapData.height;
      console.log("mapWidth: ", this.mapWidth, "mapHeight: ", this.mapHeight);
    } else {
      this.mapWidth = LEVEL_MAP_SIZE;
      this.mapHeight = LEVEL_MAP_SIZE;
    }

    const generator = new WorldGenerator<LevelBiome>({
      width: this.mapWidth,
      height: this.mapHeight,
    });

    const layer = generator.addLayer(LEVEL_BIOME_PARAMETERS);

    LEVEL_PLANETS[this.planet].BIOMES.forEach((biome) => {
      if (biome.params) {
        layer.addBiome(biome.params, biome.data);
      }
    });

    // This map contains the terain type (water, deepwater, plain, hill, mountain) - using the name of the biome at the moment
    this.map = generator.generate({
      seed,
      seedSize: LEVEL_SEED_SIZE,
    });

    this.terrainMap = Array.from({ length: this.mapHeight }, () =>
      Array(this.mapWidth).fill(TerrainType.DEEPWATER)
    );

    if (newScenario) {
      const plain = LEVEL_PLANETS[this.planet].BIOMES[7].data;  
      const hill = LEVEL_PLANETS[this.planet].BIOMES[5].data;  
      const mountain = LEVEL_PLANETS[this.planet].BIOMES[8].data;
      const water = LEVEL_PLANETS[this.planet].BIOMES[2].data;
      const deepwater = LEVEL_PLANETS[this.planet].BIOMES[0].data;

      // Iterate over each tile in the JSON map and update the biome
      for (let y = 0; y < this.mapHeight; y++) {
        for (let x = 0; x < this.mapWidth; x++) {        
          // Find the corresponding tile object from JSON
          const terrain = this.mapData.layers[0].objects.find((obj: any) => {
            return Math.floor(obj.x / 32) === x && Math.floor(obj.y / 32) === y;
          });        

          if (terrain) {
            // Set biome based on terrain type
            if (terrain.type === "water") {
              this.terrainMap[y][x] = TerrainType.WATER;
              this.map.replaceAt({ x, y }, water);
            } else if (terrain.type === "deepwater") {
              this.map.replaceAt({ x, y }, deepwater);
            } else if (terrain.type === "plain") {
              this.terrainMap[y][x] = TerrainType.PLAIN;
              this.map.replaceAt({ x, y }, plain);
            } else if (terrain.type === "hill") {
              this.terrainMap[y][x] = TerrainType.HILL;
              this.map.replaceAt({ x, y }, hill);
            } else if (terrain.type === "mountain") {
              this.terrainMap[y][x] = TerrainType.MOUNTAIN;
              this.map.replaceAt({ x, y }, mountain);
            }
          }
        }
      }
    }
        
    this.resourceMap = Array.from({ length: this.mapHeight }, () =>
      Array(this.mapWidth).fill(ResourceType.NONE)
    );
    
    this.gridCollide = this.map.getMatrix().map((y) => y.map((x) => x.collide));
    this.gridSolid = this.map.getMatrix().map((y) => y.map((x) => !x.solid));
    this.gridFog = this.map.getMatrix().map((y) => y.map((x) => true));

    this.navigator = new Navigator();

    this.addTilemap();
    this.addMapTiles();
    this.addScenery();

    this.scene.game.events.on(`${GameEvent.UPDATE_SETTINGS}.${GameSettings.EFFECTS}`, (value: string) => {
      if (value === 'off') {
        this.removeEffects();
      }
    });
  }

  public looseEffects() {
    this.effectsOnGround.forEach((effect) => {
      effect.setAlpha(effect.alpha - 0.2);
      if (effect.alpha <= 0) {
        effect.destroy();
      }
    });
  }

  private removeEffects() {
    this.effectsOnGround.forEach((effect) => {
      effect.destroy();
    });
    this.effectsOnGround = [];
  }

  public readSpawnPositions(target: SpawnTarget, grid: number = 2) {
    const positions: PositionAtMatrix[] = [];

    for (let sX = grid; sX < this.map.width - grid; sX += grid) {
      for (let sY = grid; sY < this.map.height - grid; sY += grid) {
        const position = {
          x: sX + Phaser.Math.Between(-1, 1),
          y: sY + Phaser.Math.Between(-1, 1),
          z: 1,
        };
        const targets = this.map.getAt(position)?.spawn;

        if (targets && targets.includes(target)) {
          positions.push(position);
        }
      }
    }

    return positions;
  }

  public hasTilesBetweenPositions(positionA: PositionAtWorld, positionB: PositionAtWorld) {
    const positionAtMatrixA = Level.ToMatrixPosition(positionA);
    const positionAtMatrixB = Level.ToMatrixPosition(positionB);
    const current: TilePosition = { ...positionAtMatrixA, z: 1 };
    const dx = Math.abs(positionAtMatrixB.x - positionAtMatrixA.x);
    const dy = Math.abs(positionAtMatrixB.y - positionAtMatrixA.y);
    let err = dx - dy;

    while (!isPositionsEqual(current, positionAtMatrixB)) {
      const shift = 2 * err;

      if (shift > -dy) {
        err -= dy;
        current.x += (positionAtMatrixA.x < positionAtMatrixB.x) ? 1 : -1;
      }
      if (shift < dx) {
        err += dx;
        current.y += (positionAtMatrixA.y < positionAtMatrixB.y) ? 1 : -1;
      }

      if (this.getTile(current)?.tileType === TileType.MAP) {
        return true;
      }
    }

    return false;
  }

  public getBiome(type: BiomeType): Nullable<LevelBiome> {
    return LEVEL_PLANETS[this.planet].BIOMES.find((biome) => (biome.data.type === type))?.data ?? null;
  }

  public getFreeAdjacentTiles(position: PositionAtMatrix) {
    const positions: PositionAtMatrix[] = [
      { x: position.x + 1, y: position.y },
      { x: position.x, y: position.y + 1 },
      { x: position.x - 1, y: position.y },
      { x: position.x, y: position.y - 1 },
      { x: position.x + 1, y: position.y - 1 },
      { x: position.x + 1, y: position.y + 1 },
      { x: position.x - 1, y: position.y + 1 },
      { x: position.x - 1, y: position.y - 1 },
    ];

    return positions.filter((point) => this.isFreePoint({ ...point, z: 1 }));
  }

  private addTilemap() {
    const data = new Phaser.Tilemaps.MapData({
      width: this.mapWidth,
      height: this.mapHeight,
      tileWidth: LEVEL_MAP_TILE.width,
      tileHeight: LEVEL_MAP_TILE.height * 0.5,
      orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
      format: Phaser.Tilemaps.Formats.ARRAY_2D,
    });

    const tilemap = new Phaser.Tilemaps.Tilemap(this.scene, data);
    const tileset = tilemap.addTilesetImage(
      LevelTilesetTexture[this.planet],
      undefined,
      LEVEL_MAP_TILE.width,
      LEVEL_MAP_TILE.height,
      LEVEL_MAP_TILE.margin,
      LEVEL_MAP_TILE.spacing,
    );

    if (!tileset) {
      throw Error('Unable to create map tileset');
    }

    this.addFogLayer(tilemap, tileset);
    this.addFalloffLayer(tilemap, tileset);
    this.addGroundLayer(tilemap, tileset);
  }

  // Add ground layer which contains tiles in the main map area 
  private addGroundLayer(tilemap: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) {
    const layer = tilemap.createBlankLayer(
      'ground',
      tileset,
      -LEVEL_MAP_TILE.width * 0.5,
      -LEVEL_MAP_TILE.height * 0.25,
    );

    if (!layer) {
      throw Error('Unable to create map layer');
    }

    this.groundLayer = layer;
  }

  // Add ground layer which contains tiles in the main map area 
  private addFogLayer(tilemap: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) {
    const layer = tilemap.createBlankLayer(
      'fog',
      tileset,
      -LEVEL_MAP_TILE.width * 0.5,
      -LEVEL_MAP_TILE.height * 0.25,
    );

    if (!layer) {
      throw Error('Unable to create fog layer');
    }

    this.fogLayer = layer;
    this.fogLayer.setDepth(WORLD_DEPTH_FOG);

    // Set the biome for the fog - use snow defined in the planets/earth.ts 
    const biome = LEVEL_PLANETS[this.planet].BIOMES[11].data;  

    const index = Array.isArray(biome.tileIndex)
        ? Phaser.Math.Between(...biome.tileIndex)
        : biome.tileIndex;
      
    this.fogLayer.fill(index, 0, 0, this.mapWidth, this.mapHeight, false);
    
  } 
 
  private checkFogAt(x: number, y: number) {
    if (y >= 0 && y < this.gridFog.length && x >= 0 && x < this.gridFog[y].length) {
      return this.gridFog[y][x];
    } else {
      console.error('Tile coordinates out of bounds.');
      return false; // Return false or handle as per game logic (e.g., always foggy out of bounds)
    }
  }
  
  public clearFog(position: PositionAtMatrix, radiusInTile: number) {
    const { x, y } = position;

    for (let i = -radiusInTile; i <= radiusInTile; i++) {
      for (let j = -radiusInTile; j <= radiusInTile; j++) {
        const tileX = x + i;
        const tileY = y + j;
        const tile = this.map.getAt({ x: tileX, y: tileY });

        if (tile && this.checkFogAt(tileX, tileY)) {
          this.gridFog[tileY][tileX] = false;
          this.fogLayer.putTileAt(-1, tileX, tileY, false);
        }
      }
    }
  }

  // Add falloff layer to hide the edge of the map
  private addFalloffLayer(tilemap: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) {
    // Calculate the size of the visible area 
    const tileAngle = Math.atan2(1 / LEVEL_MAP_PERSPECTIVE, 1);
    const visibleDiagonal = (this.scene.game.canvas.clientWidth / 2) / Math.sin(tileAngle);
    const edgeSize = Math.ceil(visibleDiagonal / LEVEL_MAP_TILE.edgeLength);
    //const sizeInTiles = (edgeSize * 2) + LEVEL_MAP_SIZE;
    const widthInTiles = (edgeSize * 2) + this.mapWidth;
    const heightInTiles = (edgeSize * 2) + this.mapHeight;
    const position = Level.ToWorldPosition({ x: -edgeSize, y: -edgeSize }, 0);

    const layer = tilemap.createBlankLayer(
      'falloff',
      tileset,
      position.x - LEVEL_MAP_TILE.width * 0.5,
      position.y - LEVEL_MAP_TILE.height * LEVEL_MAP_TILE.origin,
      widthInTiles,
      heightInTiles,
    );

    if (!layer) {
      return;
    }
    
    // Set the biome for the edge - defined in the planets/earth.ts 
    const biome = LEVEL_PLANETS[this.planet].BIOMES[0].data;  
    // Get the tile index from the biome 
    const index = Array.isArray(biome.tileIndex)
      ? biome.tileIndex[0]
      : biome.tileIndex;

    for (let y = 0; y < heightInTiles; y++) {
      for (let x = 0; x < widthInTiles; x++) {
        if (
          x < edgeSize
          || x >= widthInTiles - edgeSize
          || y < edgeSize
          || y >= heightInTiles - edgeSize
        ) {
          layer.putTileAt(index, x, y, false);
        }
      }
    }
  }

  // Add tiles to the map according to the biome data 
  private addMapTiles() {
    const addTile = (position: PositionAtMatrix, biome: LevelBiome) => {
      const index = Array.isArray(biome.tileIndex)
        ? Phaser.Math.Between(...biome.tileIndex)
        : biome.tileIndex;

      if (biome.z === 0) {
        // Add tile to static tilemap layer
        this.groundLayer.putTileAt(index, position.x, position.y, false);
      } else {
        // Add tile as image
        // Need for correct calculate depth
        this.addMountTile(index, position, biome.z);
      }
    };

    this.map.each((position, biome) => {
      addTile(position, biome);

      // Add tile to hole
      if (biome.z > 1) {
        const z = biome.z - 1;
        const shiftX = this.map.getAt({ x: position.x + 1, y: position.y });
        const shiftY = this.map.getAt({ x: position.x, y: position.y + 1 });

        if ((shiftX && shiftX.z !== z) || (shiftY && shiftY.z !== z)) {
          const patch = LEVEL_PLANETS[this.planet].BIOMES.find((b) => (b.data.z === z));

          if (patch) {
            addTile(position, patch.data);
          }
        }
      }
    });
  }

  private addMountTile(index: number, position: PositionAtMatrix, z: number) {
    const positionAtWorld = Level.ToWorldPosition(position, z);
    const depth = positionAtWorld.y + ((z - 1) * LEVEL_MAP_TILE.height);
    const tile = this.scene.add.image(
      positionAtWorld.x,
      positionAtWorld.y,
      LevelTilesetTexture[this.planet],
      index,
    ) as ITile;

    tile.tileType = TileType.MAP;

    tile.setDepth(depth);
    tile.setOrigin(0.5, LEVEL_MAP_TILE.origin);
    this.putTile(tile, { ...position, z }, false);
  }
  

  private addScenery() {
    
    this.sceneryTiles = this.scene.add.group();

    const positions = this.readSpawnPositions(SpawnTarget.SCENERY);

    // Iterate over each tile in the JSON map and update the resource type
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {       
      
      const tilePosition: TilePosition = {x, y, z: 1};
      
      if (this.isFreePoint(tilePosition)) {      
        const terrain = this.mapData.layers[0].objects.find((obj: any) => {
          return Math.floor(obj.x / 32) === x && Math.floor(obj.y / 32) === y;
        });        

        let resourceType = ResourceType.NONE;
        const r = Math.random();

        if (terrain) {          
          if (terrain.type === "plain") {
            // 20% chance for forest
            if (r < 0.20) {
              resourceType = ResourceType.FOREST;
            }
          } else if (terrain.type === "hill") {
            // 5% chance for stone, 50% for forest            
            if (r < 0.02) {
              resourceType = ResourceType.STONE;
            } else if (r < 0.6) { // 0.1 to 0.6 = 50% for forest
              resourceType = ResourceType.FOREST;
            }
          } else if (terrain.type === "mountain") {
            // 20% chance for stone, 70% for forest            
            if (r < 0.1) {
              resourceType = ResourceType.STONE;
            } else if (r < 0.9) { // 0.1 to 0.6 = 50% for forest
              resourceType = ResourceType.FOREST;
            }
          }
        }

        if (resourceType === ResourceType.NONE) {        
          continue;
        }
        
        this.resourceMap[y][x] = resourceType;

        const positionAtMatrix = { x, y, z: 1 };
        const positionAtWorld = Level.ToWorldPosition(positionAtMatrix);
        const tile = this.scene.add.image(
          positionAtWorld.x,
          positionAtWorld.y,
          LevelResourceTexture[resourceType],
          0,
        ) as ITile;

        tile.tileType = TileType.SCENERY;
        tile.resourceType = resourceType;
        tile.clearable = true;

        tile.setDepth(positionAtWorld.y);
        tile.setOrigin(0.5, LEVEL_SCENERY_TILE.origin);
        this.putTile(tile, tilePosition);
        this.sceneryTiles.add(tile);
        //console.log(`  Placed ${resourceType} at ${x}, ${y} (${terrain?.type})`);

      }
    }
    }
  }

  private addScenery1() {
    this.sceneryTiles = this.scene.add.group();

    const positions = this.readSpawnPositions(SpawnTarget.SCENERY);
    //const count = Math.ceil(LEVEL_MAP_SIZE * LEVEL_PLANETS[this.planet].SCENERY_DENSITY);
    const count = Math.ceil(this.mapWidth * LEVEL_PLANETS[this.planet].SCENERY_DENSITY);

    for (let i = 0; i < count; i++) {
      const positionAtMatrix = Phaser.Utils.Array.GetRandom(positions);
      const tilePosition: TilePosition = { ...positionAtMatrix, z: 1 };

      if (this.isFreePoint(tilePosition)) {
        const positionAtWorld = Level.ToWorldPosition(positionAtMatrix);
        const tile = this.scene.add.image(
          positionAtWorld.x,
          positionAtWorld.y,
          LevelSceneryTexture[this.planet],
          Phaser.Math.Between(0, LEVEL_PLANETS[this.planet].SCENERY_VARIANTS_COUNT - 1),
        ) as ITile;

        tile.tileType = TileType.SCENERY;
        tile.resourceType = ResourceType.FOREST;
        tile.clearable = true;

        tile.setDepth(positionAtWorld.y);
        tile.setOrigin(0.5, LEVEL_SCENERY_TILE.origin);
        this.putTile(tile, tilePosition);
        this.sceneryTiles.add(tile);
      }
    }
  }

  public getSavePayload(): LevelSavePayload {
    return {
      planet: this.planet,
      seed: this.map.seed,
    };
  }

  static ToMatrixPosition(position: PositionAtWorld): PositionAtMatrix {
    const { width, height } = LEVEL_MAP_TILE;
    const n = {
      x: (position.x / (width * 0.5)),
      y: (position.y / (height * 0.25)),
    };

    return {
      x: Math.round((n.x + n.y) / 2),
      y: Math.round((n.y - n.x) / 2),
    };
  }

  static ToWorldPosition(position: PositionAtMatrix, z: number = 1): PositionAtWorld {
    const { width, height } = LEVEL_MAP_TILE;

    return {
      x: (position.x - position.y) * (width * 0.5),
      y: (position.x + position.y) * (height * 0.25) - ((z - 1) * (height * 0.5)),
    };
  }
}
