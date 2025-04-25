import type { ILive } from '../addons/live/types';
import type { IEnemyTarget } from '../npc/enemy/types';
import type { ISprite } from '../types';
import type { AssetType, PositionAtMatrix } from '~scene/world/level/types';
import type { Nation } from '~scene/world/nation';
import type { IBuilder } from '~scene/world/builder/types';

export interface IPlayer extends ISprite, IEnemyTarget {
  
  readonly ai: boolean

  /**
   * Total number of killed enemies.
   */
  readonly kills: number

  /**
   * Player experience.
   */
  experience: number

  /**
   * Score amount.
   */
  readonly score: number

  /**
   * Resourses amount.
   */
  readonly resources: number

  /**
   * Spiritual Power (Aether).
   * Aether is a resource that is used to cast spells and use abilities.
   */
  readonly aether: number

  /**
   * Silver amount.
   * Silver is a resource that is used to buy items and upgrades.
   */
  readonly silver: number 

  /**
   * Research points amount.
   * Research points are used to unlock new technologies and upgrades.
   */
  readonly research: number

  /**
   * Lumber amount.
   * Lumber is a resource that is used to build structures and units.
   */
  readonly lumber: number

  /**
   * Stone amount.
   * Stone is a resource that is used to build structures and units.  
   */
  readonly stone: number

  /**
   * Health management.
   */
  readonly live: ILive

  /**
   * Levels of upgrades.
   */
  readonly upgradeLevel: Record<PlayerSkill, number>

  /**
   * Levels of technologies.
   */
  readonly techLevel: Record<PlayerTechnology, number>

  /**
   * Unlocked superskills.
   */
  readonly unlockedSuperskills: Partial<Record<PlayerSuperskill, boolean>>

  /**
   * Active superskills.
   */
  readonly activeSuperskills: Partial<Record<PlayerSuperskill, Phaser.Time.TimerEvent>>

  /**
   * Last visible position at matrix.
   */
  readonly lastVisiblePosition: PositionAtMatrix

  setNation(nation: Nation): void

  getNation(): Nation

  setBuilder(builder: IBuilder): void
  
  getBuilder(): IBuilder

  /** 
   * Get player asset amount.
   */
  getAssetAmount(type: AssetType): number

  /**
   * Take player asset amount.
   */
  takeAsset(type: AssetType, amount: number): void

  /**
   * Upgrade player skill.
   */
  upgrade(type: PlayerSkill): void

  /**
   * Get experience amount need to upgrade.
   */
  getExperienceToUpgrade(type: PlayerSkill): number

  /**
   * Advance player technology.
   */
  advance(type: PlayerTechnology): void

  /**
   * Get research amount need to advance.
   */
  getResearchToAdvance(type: PlayerTechnology): number

  /**
   * Get technology level.
   */
  getTechnologyLevel(type: PlayerTechnology): number

  /**
   * Inremeting number of killed enemies.
   */
  incrementKills(): void

  /**
   * Give player score.
   * @param amount - Amount
   */
  giveScore(amount: number): void

  /**
   * Give player experience.
   * @param amount - Amount
   */
  giveExperience(amount: number): void

  /**
   * Give player resources.
   * @param amount - Resources amount
   */
  giveResources(amount: number): void

  /**
   * Take player resources.
   * @param amount - Resources amount
   */
  takeResources(amount: number): void

  /**
   * Give player aether.
   * @param amount - Amount
   */
  giveAether(amount: number): void


  /**
   * Take player aether.
   * @param amount - Amount
   */
  takeAether(amount: number): void

  /**
   * Give player silver.
   * @param amount - Amount
   */

  giveSilver(amount: number): void

  /**
   * Take player silver.
   * @param amount - Amount
   */
  takeSilver(amount: number): void

  /**
   * Give player research points.
   * @param amount - Amount
   */
  giveResearch(amount: number): void

  /**
   * Take player research points.
   * @param amount - Amount
   */
  takeResearch(amount: number): void

  /**
   * Give player lumber.
   * @param amount - Amount
   */
  giveLumber(amount: number): void

  /**
   * Take player lumber.
   * @param amount - Amount
   */
  takeLumber(amount: number): void

  /**
   * Give player stone.
   * @param amount - Amount
   */

  giveStone(amount: number): void

  /**
   * Take player stone.
   * @param amount - Amount
   */
  takeStone(amount: number): void
  
  /**
   * Use superskill.
   * @param type - Superskill
   */
  useSuperskill(type: PlayerSuperskill): void

  /**
   * Unlock next superskill.
   */
  unlockSuperskill(): void

  /**
   * Get current cost of superskill.
   * @param type - Superskill
   */
  getSuperskillCost(type: PlayerSuperskill): number

  /**
   * Set angle of target movement direction.
   * @param angle - Angle
   */
  setMovementTarget(angle: Nullable<number>): void

  /**
   * Get data for saving.
   */
  getSavePayload(): PlayerSavePayload

  /**
   * Load saved data.
   * @param data - Data
   */
  loadSavePayload(data: PlayerSavePayload): void
}

export enum PlayerTexture {
  PLAYER = 'player/player',
  SUPERSKILL = 'player/superskill',
}

export enum PlayerSkillIcon {
  MAX_HEALTH = 'player/skills/max_health',
  SPEED = 'player/skills/speed',
  STAMINA = 'player/skills/stamina',
  BUILD_SPEED = 'player/skills/build_speed',
  ATTACK_DAMAGE = 'player/skills/attack_damage',
  ATTACK_DISTANCE = 'player/skills/attack_distance',
  ATTACK_SPEED = 'player/skills/attack_speed',
}

export enum PlayerSuperskillIcon {
  INVISIBLE = 'player/superskills/invisible',
  FROST = 'player/superskills/frost',
  SHIELD = 'player/superskills/shield',
  RAGE = 'player/superskills/rage',
  FIRE = 'player/superskills/fire',
  HIRE = 'player/superskills/shield',
}

export enum PlayerAudio {
  UPGRADE = 'player/upgrade',
  WALK = 'player/walk',
  DEAD = 'player/dead',
  DAMAGE_1 = 'player/damage_1',
  DAMAGE_2 = 'player/damage_2',
  DAMAGE_3 = 'player/damage_3',
  SUPERSKILL = 'player/superskill',
}

export enum PlayerSkillTarget {
  CHARACTER = 'CHARACTER',
  ASSISTANT = 'ASSISTANT',
}

export enum PlayerSkill {
  MAX_HEALTH = 'MAX_HEALTH',
  SPEED = 'SPEED',
  STAMINA = 'STAMINA',
  BUILD_SPEED = 'BUILD_SPEED',
  ATTACK_DAMAGE = 'ATTACK_DAMAGE',
  ATTACK_DISTANCE = 'ATTACK_DISTANCE',
  ATTACK_SPEED = 'ATTACK_SPEED',
}

export enum PlayerTechnologyGroup {
  BUILDING = 'BUILDING',
  MILITARY = 'MILITARY',
}

export enum PlayerTechnology {
  CITYCENTER = 'CITYCENTER',
  FARM = 'FARM',
  LUMBERMILL = 'LUMBERMILL',
  QUARRY = 'QUARRY',
  TOWER_FIRE = 'TOWER_FIRE',
  WALL = 'WALL',
  COMBAT = 'COMBAT',
}

export enum PlayerTechnologyIcon {
  CITYCENTER = 'player/technologies/citycenter',
  FARM = 'player/technologies/farm',
  LUMBERMILL = 'player/technologies/lumbermill',
  QUARRY = 'player/technologies/quarry',
  TOWER_FIRE = 'player/technologies/tower_fire',
  WALL = 'player/technologies/wall',
  COMBAT = 'player/technologies/combat',
} 


export enum PlayerSuperskill {
  HIRE = 'HIRE',
  SHIELD = 'SHIELD',
  INVISIBLE = 'INVISIBLE',
  FROST = 'FROST',
  FIRE = 'FIRE',
  RAGE = 'RAGE',
}

export enum PlayerEvent {
  USE_SUPERSKILL = 'use_superskill',
  UNLOCK_SUPERSKILL = 'unlock_superskill',
  UPGRADE_SKILL = 'upgrade_skill',
  ADVANCE_TECHNOLOGY = 'advance_technology',
  UPDATE_EXPERIENCE = 'update_experience',
  UPDATE_SCORE = 'update_score',
  UPDATE_RESOURCES = 'update_resources',
  UPDATE_AETHER = 'update_aether',
  UPDATE_SILVER = 'update_silver',
  UPDATE_RESEARCH = 'update_research',
  UPDATE_LUMBER = 'update_lumber',
  UPDATE_STONE = 'update_stone',
}

export enum MovementDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export type PlayerData = {
  positionAtMatrix: PositionAtMatrix
  ai: boolean
};

export type PlayerSkillInfo = {
  experience: number
  target: PlayerSkillTarget
};

export type PlayerSkillData = {
  experience: number
  type: PlayerSkill
  currentLevel: number
};

export type PlayerTechnologyInfo = {
  research: number
  group: PlayerTechnologyGroup
};

export type PlayerTechnologyData = {
  research: number
  type: PlayerTechnology
  currentLevel: number
};

export type PlayerSavePayload = {
  position: PositionAtMatrix
  score: number
  experience: number
  resources: number
  kills: number
  health: number
  unlockedSuperskills: Partial<Record<PlayerSuperskill, boolean>>
  upgradeLevel: Record<PlayerSkill, number>
};
