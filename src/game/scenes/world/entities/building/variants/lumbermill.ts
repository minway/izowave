import { Building } from '..';
import { DIFFICULTY } from '../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../types';

import type { BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';
import { ResourceType } from '~scene/world/level/types';
import { BuildingIcon, BuildingParam } from '../types';
import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';

export class BuildingLumberMill extends Building {
  static Category = BuildingCategory.RESOURCES;

  static Texture = BuildingTexture.LUMBERMILL;

  static Cost = DIFFICULTY.BUILDING_LUMBERMILL_COST;

  static Limit = true;

  static MaxLevel = 4;

  static ResourceRequired = ResourceType.FOREST;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.LUMBERMILL,
      health: DIFFICULTY.BUILDING_GENERATOR_HEALTH,
      texture: BuildingLumberMill.Texture,
      delay: {
        default: DIFFICULTY.BUILDING_GENERATOR_DELAY,
        growth: DIFFICULTY.BUILDING_GENERATOR_DELAY_GROWTH,
      },
    });

  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_PRODUCTION',
      icon: BuildingIcon.POWER,
      value: `+${this.getProduction()}`,      
    }];

    return info.concat(super.getInfo());
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

  public getProduction(): number {
    return 1;
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.scene.player.giveLumber(1); 
    this.scene.fx.createGenerationEffect(this);
  }
}
