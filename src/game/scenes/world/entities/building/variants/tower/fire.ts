import { DIFFICULTY } from '../../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../../types';

import { BuildingTower } from '.';

import type { BuildingVariantData } from '../../types';
import type { IWorld } from '~scene/world/types';

import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';
import { ShotBallFire } from '~scene/world/entities/shot/ball/variants/fire';
import { AssetType } from '~scene/world/level/types';
import { PlayerTechnology } from '~scene/world/entities/player/types';

export class BuildingTowerFire extends BuildingTower {
  static Category = BuildingCategory.ATTACK;

  static Texture = BuildingTexture.TOWER_FIRE;

  static Asset = AssetType.STONE;

  static Cost = DIFFICULTY.BUILDING_TOWER_FIRE_COST;

  static Radius = DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS;

  static MaxLevel = 10;

  static UpgradeByTechnology = PlayerTechnology.TOWER_FIRE;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFire(scene, {
      damage: DIFFICULTY.BUILDING_TOWER_FIRE_DAMAGE,
      speed: DIFFICULTY.BUILDING_TOWER_FIRE_SHOT_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FIRE,
      health: DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH,
      texture: BuildingTowerFire.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY_GROWTH,
      },
    }, shot);

    this.bindTutorialHint(
      TutorialStep.UPGRADE_BUILDING,
      this.scene.game.isDesktop()
        ? 'TUTORIAL_HOVER_TO_UPGRADE'
        : 'TUTORIAL_CLICK_TO_UPGRADE',
    );

    this.bindTutorialHint(
      TutorialStep.RELOAD_TOWER,
      'TUTORIAL_RELOAD_TOWER',
      () => this.ammo === 0,
    );

    if (Tutorial.IsInProgress(TutorialStep.BUILD_TOWER_FIRE)) {
      Tutorial.Complete(TutorialStep.BUILD_TOWER_FIRE);
      Tutorial.Start(TutorialStep.BUILD_GENERATOR);
    }
  }
}
