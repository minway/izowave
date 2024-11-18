import { Building } from '..';
import { DIFFICULTY } from '../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../types';

import type { BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';

export class BuildingWall extends Building {
  static Category = BuildingCategory.DEFENSE;

  static Texture = BuildingTexture.WALL;

  static Cost = DIFFICULTY.BUILDING_WALL_COST;

  static AllowByWave = DIFFICULTY.BUILDING_WALL_ALLOW_BY_WAVE;

  static MaxLevel = 3;

  static CityRequired = false;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.WALL,
      health: DIFFICULTY.BUILDING_WALL_HEALTH,
      texture: BuildingWall.Texture,
    });
  }
  
  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y += (this.upgradeLevel === 1) ? 6 : -2;

    return position;
  }
}
