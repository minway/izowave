import { Building } from '..';
import { DIFFICULTY } from '../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../types';

import type { BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';
import { ResourceType } from '~scene/world/level/types';

import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';

export class BuildingQuarry extends Building {
  static Category = BuildingCategory.RESOURCES;

  static Texture = BuildingTexture.QUARRY;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Limit = true;

  static MaxLevel = 4;

  static ResourceRequired = ResourceType.STONE;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.QUARRY,
      health: DIFFICULTY.BUILDING_GENERATOR_HEALTH,
      texture: BuildingQuarry.Texture,
      delay: {
        default: DIFFICULTY.BUILDING_GENERATOR_DELAY,
        growth: DIFFICULTY.BUILDING_GENERATOR_DELAY_GROWTH,
      },
    });

  }

  public update() {
    super.update();

    try {
      if (this.isActionAllowed()) {
        this.generateResource();
        this.pauseActions();
      }
    } catch (error) {
      console.warn('Failed to update generator generator', error as TypeError);
    }
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y += (this.upgradeLevel === 1) ? 5 : -4;

    return position;
  }

  public getFoodProduction(): number {
    return 10;
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.scene.player.giveStone(1);
    this.scene.fx.createGenerationEffect(this);
  }
}
