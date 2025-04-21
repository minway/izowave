import { DIFFICULTY } from '../../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../../types';

import { BuildingTower } from '.';

import type { BuildingVariantData } from '../../types';
import type { IWorld } from '~scene/world/types';

import { ShotBallFrozen } from '~scene/world/entities/shot/ball/variants/frozen';

export class BuildingTowerFrozen extends BuildingTower {
  // Depreciated buildings are not available in the game anymore.
  static Deprecated: boolean = true;
    
  static Category = BuildingCategory.DEFENSE;

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = DIFFICULTY.BUILDING_TOWER_FROZEN_COST;

  static Radius = DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFrozen(scene, {
      freeze: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_DURATION,
      speed: DIFFICULTY.BUILDING_TOWER_FROZEN_SHOT_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FROZEN,
      health: DIFFICULTY.BUILDING_TOWER_FROZEN_HEALTH,
      texture: BuildingTowerFrozen.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_FROZEN_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_FROZEN_DELAY_GROWTH,
      },
    }, shot);
  }
}
