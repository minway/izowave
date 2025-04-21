import { Building } from '..';
import { DIFFICULTY } from '../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../types';

import type { BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';

import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';

export class BuildingRadar extends Building {
  // Depreciated buildings are not available in the game anymore.
  static Deprecated: boolean = true;
    
  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.RADAR;

  static Cost = DIFFICULTY.BUILDING_RADAR_COST;

  static Radius = DIFFICULTY.BUILDING_RADAR_RADIUS;

  static AllowByWave = DIFFICULTY.BUILDING_RADAR_ALLOW_BY_WAVE;

  static MaxLevel = 4;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.RADAR,
      health: DIFFICULTY.BUILDING_RADAR_HEALTH,
      texture: BuildingRadar.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_RADAR_RADIUS,
        growth: DIFFICULTY.BUILDING_RADAR_RADIUS_GROWTH,
      },
    });

    Tutorial.Complete(TutorialStep.BUILD_RADAR);
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y -= (this.upgradeLevel === 1) ? 2 : 8;

    return position;
  }
}
