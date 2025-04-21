import type { IBuildingFactory } from './factory/types';
import type { ILive } from '../addons/live/types';
import type { IEnemyTarget } from '../npc/enemy/types';
import type { IShotInitiator } from '../shot/types';
import type Phaser from 'phaser';
import type { LangPhrase } from '~lib/lang/types';
import type { IParticlesParent } from '~scene/world/fx-manager/particles/types';
import type { PositionAtMatrix, PositionAtWorld } from '~scene/world/level/types';
import type { IWorld } from '~scene/world/types';
import { IPlayer } from '../player/types';
import { City } from '~scene/world/nation/city';

export interface IBuilding extends Phaser.GameObjects.Image, IEnemyTarget, IParticlesParent, IShotInitiator {
  readonly scene: IWorld

  /**
   * Health management.
   */
  readonly live: ILive

  /**
   * Current upgrade level.
   */
  readonly upgradeLevel: number

  /**
   * Position at matrix.
   */
  readonly positionAtMatrix: PositionAtMatrix

  /**
   * Variant name.
   */
  readonly variant: BuildingVariant

  /**
   * Is cursor on building.
   */
  readonly isFocused: boolean
  
  setCity(City: City): void

  getCity(): City

  getFoodProduction(): number
  
  associateCity(player: IPlayer): void

  /**
   * Check is position inside action area.
   * @param position - Position at world
   */
  actionsAreaContains(position: PositionAtWorld): boolean

  /**
   * Get building information params.
   */
  getInfo(): BuildingParam[]

  /**
   * Get building controls.
   */
  getControls(): BuildingControl[]

  /**
   * Get building meta.
   */
  getMeta(): IBuildingFactory

  /**
   * Toggle indicators visible.
   */
  toggleIndicators(): void

  /**
   * Get actions pause.
   */
  getActionsDelay(): number

  /**
   * Get resources need to upgrade level.
   * @param level - Specified upgrade level
   */
  getUpgradeCost(level?: number): number

  /**
   * Get top face center position.
   */
  getTopEdgePosition(): PositionAtWorld

  /**
   * Get bottom face center position.
   */
  getBottomEdgePosition(): PositionAtWorld

  /**
   * Set building active state.
   */
  select(): void

  /**
   * Remove building active state.
   */
  unselect(): void

  /**
   * Get data for saving.
   */
  getSavePayload(): BuildingSavePayload

  /**
   * Load saved data.
   * @param data - Data
   */
  loadSavePayload(data: BuildingSavePayload): void
}

export interface IBuildingAmmunition extends IBuilding {
  /**
   * Current ammo count.
   */
  readonly ammo: number

  /**
   * Use ammunition.
   * Returns count of ammo which was used.
   */
  use(amount: number): number
}

export interface IBuildingBooster extends IBuilding {
  /**
   * Increase power.
   */
  readonly power: number
}

export interface IBuildingTower extends IBuilding {
  /**
   * Current ammo in clip.
   */
  readonly ammo: number

  /**
   * Power multiplier.
   */
  readonly power: number
}

export enum BuildingEvent {
  UPGRADE = 'upgrade',
  BUY_AMMO = 'buy_ammo',
  BREAK = 'break',
  CREATE = 'create',
}

export enum BuildingVariant {
  WALL = 'WALL',
  TOWER_FIRE = 'TOWER_FIRE',
  TOWER_LAZER = 'TOWER_LAZER',
  TOWER_FROZEN = 'TOWER_FROZEN',
  TOWER_ELECTRO = 'TOWER_ELECTRO',
  GENERATOR = 'GENERATOR',
  AMMUNITION = 'AMMUNITION',
  RADAR = 'RADAR',
  BOOSTER = 'BOOSTER',
  CITYCENTER = 'CITYCENTER',
  FARM = 'FARM',
  QUARRY = 'QUARRY',
  LUMBERMILL = 'LUMBERMILL',
}

export enum BuildingTexture {
  WALL = 'building/textures/wall',
  TOWER_FIRE = 'building/textures/tower_fire',
  TOWER_FROZEN = 'building/textures/tower_frozen',
  TOWER_LAZER = 'building/textures/tower_lazer',
  TOWER_ELECTRO = 'building/textures/tower_electro',
  GENERATOR = 'building/textures/generator',
  AMMUNITION = 'building/textures/ammunition',
  RADAR = 'building/textures/radar',
  BOOSTER = 'building/textures/booster',
  CITYCENTER = 'building/textures/citycenter',
  FARM = 'building/textures/farm',
  QUARRY = 'building/textures/quarry',
  LUMBERMILL = 'building/textures/lumbermill',  
}

export enum BuildingIcon {
  CONFIRM = 'building/icons/confirm',
  CONFIRM_DISABLED = 'building/icons/confirm_disabled',
  DECLINE = 'building/icons/decline',
  ALERT = 'building/icons/alert',
  UPGRADE = 'building/icons/upgrade',
  AMMO = 'building/icons/params/ammo',
  DAMAGE = 'building/icons/params/damage',
  SPEED = 'building/icons/params/speed',
  DELAY = 'building/icons/params/delay',
  POWER = 'building/icons/params/power',
  FREEZE = 'building/icons/params/freeze',
}

export enum BuildingAudio {
  SELECT = 'building/select',
  UNSELECT = 'building/unselect',
  BUILD = 'building/build',
  UPGRADE = 'building/upgrade',
  DEAD = 'building/dead',
  OVER = 'building/over',
  RELOAD = 'building/reload',
  REPAIR = 'building/repair',
  DAMAGE_1 = 'building/damage_1',
  DAMAGE_2 = 'building/damage_2',
  ELECTRO = 'building/electro',
}

export enum BuildingOutlineState {
  NONE = 'NONE',
  FOCUSED = 'FOCUSED',
  SELECTED = 'SELECTED',
}

export enum BuildingCategory {
  DEFENSE = 'DEFENSE',
  ATTACK = 'ATTACK',
  RESOURCES = 'RESOURCES',
  OTHER = 'OTHER',
}

export type BuildingGrowthValue = {
  default: number
  growth: number
};

export type BuildingParam = {
  label: LangPhrase
  value: string | number
  icon: BuildingIcon
  attention?: boolean
};

export type BuildingControl = {
  label: LangPhrase
  cost?: number
  disabled?: boolean
  hotkey: string
  onClick: () => void
};

export type BuildingVariantData = {
  buildDuration?: number
  positionAtMatrix: PositionAtMatrix
};

export type BuildingBuildData = BuildingVariantData & {
  variant: BuildingVariant
};

export type BuildingData = BuildingVariantData & {
  variant: BuildingVariant
  health: number
  texture: BuildingTexture
  radius?: BuildingGrowthValue
  delay?: BuildingGrowthValue
};

export type BuildingSavePayload = {
  variant: BuildingVariant
  position: PositionAtMatrix
  health: number
  upgradeLevel: number
  ammo?: number
};
