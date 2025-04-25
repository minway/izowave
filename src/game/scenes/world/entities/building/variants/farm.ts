import { Building } from '..';
import { DIFFICULTY } from '../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../types';

import type { BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';

import { BuildingIcon, BuildingParam } from '../types';
import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';
import { TerrainType } from '~scene/world/level/types';
import { PlayerTechnology } from '~scene/world/entities/player/types';

export class BuildingFarm extends Building {
  static Category = BuildingCategory.RESOURCES;

  static Texture = BuildingTexture.FARM;

  static Cost = DIFFICULTY.BUILDING_FARM_COST;

  static Limit = true;

  static MaxLevel = 10;

  static UpgradeByTechnology = PlayerTechnology.FARM;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.FARM,
      health: DIFFICULTY.BUILDING_GENERATOR_HEALTH,
      texture: BuildingFarm.Texture,
      delay: {
        default: DIFFICULTY.BUILDING_GENERATOR_DELAY,
        growth: DIFFICULTY.BUILDING_GENERATOR_DELAY_GROWTH,
      },
    });

    if (Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR)) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR);
    } else if (
      Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR_SECOND)
      && this.scene.builder.getBuildingsByVariant(BuildingVariant.GENERATOR).length > 0
    ) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR_SECOND);
      Tutorial.Start(TutorialStep.UPGRADE_BUILDING);
    }
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_POPULATION_MAX',
      icon: BuildingIcon.POWER,
      value: `+${this.getFoodProduction()}`,      
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

  public getFoodProduction(): number {
    const terrain = this.scene.level.terrainMap[this.positionAtMatrix.y][this.positionAtMatrix.x]; 

    if (terrain === TerrainType.PLAIN) {
      return 8;
    } else if (terrain === TerrainType.HILL) {
      return 4;
    } else if (terrain === TerrainType.MOUNTAIN) {
      return 2;
    }

    return 0;
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.scene.fx.createGenerationEffect(this);
  }
}
