import { DifficultyPowers } from '~type/world/difficulty';

export const DIFFICULTY = {
  /**
   * Player
   */

  PLAYER_SPEED: 90, // Default player speed
  PLAYER_SPEED_GROWTH: 0.015, // Player speed growth by level
  PLAYER_HEALTH: 100, // Default player health
  PLAYER_HEALTH_GROWTH: 0.1, // Player health growth by level
  PLAYER_START_RESOURCES: 70, // Player start resources
  PLAYER_EXPERIENCE_TO_NEXT_LEVEL: 200, // Need experience count to next level
  PLAYER_EXPERIENCE_TO_NEXT_LEVEL_GROWTH: 0.3, // Experience count growth by level

  /**
   * Assistant
   */

  ASSISTANT_SPEED: 90, // Default assistant speed
  ASSISTANT_SPEED_GROWTH: 0.015, // Assistant speed growth by player level
  ASSISTANT_HEALTH: 50, // Default assistant health
  ASSISTANT_HEALTH_GROWTH: 0.1, // Assistant health growth by player level
  ASSISTANT_ATTACK_DAMAGE: 15, // Default assistant damage
  ASSISTANT_ATTACK_DAMAGE_GROWTH: 0.2, // Assistant damage growth by player level
  ASSISTANT_ATTACK_SPEED: 500, // Assistant attack speed
  ASSISTANT_ATTACK_SPEED_GROWTH: 0.3, // Attack speed growth by player level
  ASSISTANT_ATTACK_DISTANCE: 70, // Assistant maximum attack distance
  ASSISTANT_ATTACK_DISTANCE_GROWTH: 0.03, // Attack distance growth by player level
  ASSISTANT_ATTACK_PAUSE: 1000, // Assistant attack pause
  ASSISTANT_ATTACK_PAUSE_GROWTH: -0.05, // Attack pause growth by player level

  /**
   * Wave
   */

  WAVE_PAUSE: 30000, // Pause in milliseconds between waves
  WAVE_ENEMIES_COUNT: 5, // Enemies count on first wave
  WAVE_ENEMIES_COUNT_GROWTH: 0.5, // Enemies count growth by wave number
  WAVE_ENEMIES_SPAWN_PAUSE: 2300, // Default pause in milliseconds between enemies spawn
  WAVE_ENEMIES_SPAWN_PAUSE_GROWTH: -0.025, // Enemies spawn pause growth by wave number
  WAVE_BOSS_SPAWN_RATE: 5, // Every Nth wave a boss will spawn
  WAVE_EXPERIENCE: 200, // Gained experience per complete wave
  WAVE_EXPERIENCE_GROWTH: 0.1, // Experience count growth by wave number

  /**
   * Chests
   */

  CHEST_EXPERIENCE: 8, // Gained experience per open chest
  CHEST_EXPERIENCE_GROWTH: 0.3, // Experience growth by wave number
  CHEST_RESOURCES: 4, // Default resources count in chest
  CHEST_RESOURCES_GROWTH: 0.2, // Resources count growth by wave number

  /**
   * Enemies
   */

  ENEMY_HEALTH_GROWTH: 0.15, // Enemy health growth by wave number
  ENEMY_SPEED_GROWTH: 0.058, // Enemy speed growth by wave number
  ENEMY_DAMAGE_GROWTH: 0.05, // Enemy damage growth by wave number
  ENEMY_KILL_EXPERIENCE: 10, // Gained experience per kill enemy
  ENEMY_KILL_EXPERIENCE_GROWTH: 0.07, // Experience growth by wave number

  /**
   * Buildings
   */

  BUILDING_ACTION_RADIUS_GROWTH: 0.2, // Actions radius growth by upgrade
  BUILDING_ACTION_PAUSE_GROWTH: -0.1, // Actions pause growth by upgrade
  BUILDING_UPGRADE_EXPERIENCE: 30, // Gained experience per upgrade building
  BUILDING_BUILD_AREA: 180, // Default radius of build area
  BUILDING_BUILD_AREA_GROWTH: 0.05, // Radius growth by level

  /**
   * Building: Wall
   */

  BUILDING_WALL_COST: 15, // Wall cost
  BUILDING_WALL_HEALTH: 2000, // Default wall health
  BUILDING_WALL_HEALTH_UPGRADE: 2000, // Amount of health added per upgrade (N * level)

  /**
   * Building: Towers
   */

  BUIDLING_TOWER_SHOT_DAMAGE_GROWTH: 0.6, // Shot damage growth by upgrade
  BUIDLING_TOWER_SHOT_FREEZE_GROWTH: 0.5, // Frozen duration growth by upgrade
  BUIDLING_TOWER_SHOT_SPEED_GROWTH: 0.3, // Shot speed growth by upgrade
  BUIDLING_TOWER_AMMO_AMOUNT: 30, // Ammo in clip (N * level)

  /**
   * Building: Tower: Fire
   */

  BUILDING_TOWER_FIRE_COST: 30, // Tower fire cost
  BUILDING_TOWER_FIRE_HEALTH: 600, // Default tower fire health
  BUILDING_TOWER_FIRE_ATTACK_RADIUS: 200, // Tower fire attack radius
  BUILDING_TOWER_FIRE_ATTACK_PAUSE: 1400, // Tower fire pause between attacks
  BUILDING_TOWER_FIRE_ATTACK_DAMAGE: 35, // Tower fire attack damage
  BUILDING_TOWER_FIRE_ATTACK_SPEED: 550, // Tower fire attack speed

  /**
   * Building: Tower: Frozen
   */

  BUILDING_TOWER_FROZEN_COST: 35, // Tower frozen cost
  BUILDING_TOWER_FROZEN_HEALTH: 900, // Default tower frozen health
  BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE: 3, // Minimal wave for allow tower frozen
  BUILDING_TOWER_FROZEN_FREEZE_RADIUS: 190, // Tower frozen freeze radius
  BUILDING_TOWER_FROZEN_FREEZE_PAUSE: 1400, // Tower frozen pause between freezs
  BUILDING_TOWER_FROZEN_FREEZE_DURATION: 1000, // Tower frozen freeze duration
  BUILDING_TOWER_FROZEN_FREEZE_SPEED: 550, // Tower frozen freeze speed

  /**
   * Building: Tower: Lazer
   */

  BUILDING_TOWER_LAZER_COST: 60, // Tower lazer cost
  BUILDING_TOWER_LAZER_HEALTH: 300, // Default tower lazer health
  BUILDING_TOWER_LAZER_ALLOW_BY_WAVE: 5, // Minimal wave for allow tower lazer
  BUILDING_TOWER_LAZER_ATTACK_RADIUS: 170, // Tower lazer attack radius
  BUILDING_TOWER_LAZER_ATTACK_PAUSE: 1600, // Tower lazer pause between attacks
  BUILDING_TOWER_LAZER_ATTACK_DAMAGE: 70, // Tower lazer attack damage

  /**
   * Building: Generator
   */

  BUILDING_GENERATOR_COST: 30, // Generator cost
  BUILDING_GENERATOR_HEALTH: 400, // Generator health
  BUILDING_GENERATOR_LIMIT: 4, // Maximum count generators on world (N * (wave / 5))
  BUILDING_GENERATOR_GENERATE_PAUSE: 1500, // Generator pause between resource generations
  BUILDING_GENERATOR_RESOURCES: 150, // Maximum amount of resources that generator can
  BUILDING_GENERATOR_RESOURCES_UPGRADE: 100, // Amount of resources added per upgrade (N * level)

  /**
   * Building: Ammunition
   */

  BUILDING_AMMUNITION_COST: 30, // Ammunition cost
  BUILDING_AMMUNITION_HEALTH: 300, // Ammunition health
  BUILDING_AMMUNITION_LIMIT: 4, // Maximum count ammunition on world (N * (wave / 5))
  BUILDING_AMMUNITION_ALLOW_BY_WAVE: 2, // Minimal wave for allow ammunition
  BUILDING_AMMUNITION_RELOAD_RADIUS: 160, // Ammunition reload ammo radius
  BUILDING_AMMUNITION_AMMO: 200, // Maximum amount of ammo
  BUILDING_AMMUNITION_AMMO_UPGRADE: 120, // Amount of ammo added per upgrade (N * level)

  /**
   * Building: Medic
   */

  BUILDING_MEDIC_COST: 80, // Medic cost
  BUILDING_MEDIC_HEALTH: 150, // Medic health
  BUILDING_MEDIC_LIMIT: 1, // Maximum count medic on world (N * (wave / 5))
  BUILDING_MEDIC_ALLOW_BY_WAVE: 4, // Minimal wave for allow medic
  BUILDING_MEDIC_HEAL_RADIUS: 160, // Medic heal radius
  BUILDING_MEDIC_HEAL_PAUSE: 3000, // Medic heal pause
  BUILDING_MEDIC_HEAL_AMOUNT: 10, // Default medic heal
};

export const DIFFICULTY_POWERS: DifficultyPowers = {
  EASY: 0.8,
  NORMAL: 1.0,
  HARD: 1.3,
};