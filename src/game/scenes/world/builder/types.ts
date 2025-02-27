import type { BuildingVariant, IBuilding, BuildingBuildData } from '../entities/building/types';
import type { PositionAtMatrix } from '../level/types';
import type Phaser from 'phaser';
import type { IWorld } from '~scene/world/types';
import type { IPlayer } from '../entities/player/types';

export interface IBuilder extends Phaser.Events.EventEmitter {
  readonly scene: IWorld

  readonly player: IPlayer

  /**
   * Build state.
   */
  readonly isBuild: boolean

  /**
   * Selected building variant.
   */
  readonly variant: Nullable<BuildingVariant>

  /**
   * Current position to build.
   */
  readonly supposedPosition: Nullable<PositionAtMatrix>

  setSupposedPosition(position: PositionAtMatrix): void

  /**
   * Current active building.
   */
  selectedBuilding: Nullable<IBuilding>

  /**
   * Destroy builder.
   */
  destroy(): void

  /**
   * Toggle build state and update build area.
   */
  update(): void

  /**
   * Close builder.
   */
  close(): void

  toBuild(): void
  
  /**
   * Create building.
   * @param data - Building data
   */
  createBuilding(data: BuildingBuildData): IBuilding

  /**
   * Set current building variant.
   */
  setBuildingVariant(variant: BuildingVariant): void

  /**
   * Unset building variant.
   */
  unsetBuildingVariant(): void

  /**
   * Get building limit on current wave.
   * @param variant - Building variant
   */
  getBuildingLimit(variant: BuildingVariant): Nullable<number>

  /**
   * Check is building limit reached.
   * @param variant - Building variant
   */
  isBuildingLimitReached(variant: BuildingVariant): boolean

  /**
   * Check is current wave allow building variant.
   * @param variant - Building variant
   * @param number - Wave number
   */
  isBuildingAllowByWave(variant: BuildingVariant, number?: number): boolean

  /**
   * Check is tutorial allow building variant.
   * @param variant - Building variant
   */
  isBuildingAllowByTutorial(variant: BuildingVariant): boolean

  /**
   * Get list of buildings with a specific variant.
   * @param variant - Varaint
   */
  getBuildingsByVariant<T extends IBuilding>(variant: BuildingVariant): T[]
}

export enum BuilderEvent {
  BUILD_START = 'build_start',
  BUILD_STOP = 'build_stop',
}
