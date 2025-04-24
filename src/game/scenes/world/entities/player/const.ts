import { DIFFICULTY } from '../../../../../const/difficulty';

import {
  PlayerSkill, PlayerSkillTarget, MovementDirection,
  PlayerTechnologyGroup,
} from './types';

import { PlayerSkillInfo, PlayerTechnology, PlayerTechnologyInfo } from './types';

export const PLAYER_TILE_SIZE = {
  width: 20,
  height: 30,
  gamut: 4,
};

export const PLAYER_MAX_SKILL_LEVEL = 10;

export const PLAYER_SKILLS: Record<PlayerSkill, PlayerSkillInfo> = {
  [PlayerSkill.MAX_HEALTH]: {
    experience: DIFFICULTY.PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.SPEED]: {
    experience: DIFFICULTY.PLAYER_SPEED_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.STAMINA]: {
    experience: DIFFICULTY.PLAYER_STAMINA_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.BUILD_SPEED]: {
    experience: DIFFICULTY.BUILDER_BUILD_SPEED_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.ATTACK_DAMAGE]: {
    experience: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_DISTANCE]: {
    experience: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_SPEED]: {
    experience: DIFFICULTY.ASSISTANT_ATTACK_PAUSE_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
  },
};

export const PLAYER_MAX_TECHNOLOGY_LEVEL = 10;

export const PLAYER_TECHNOLOGY: Record<PlayerTechnology, PlayerTechnologyInfo> = {
  [PlayerTechnology.CITYCENTER]: {
    research: DIFFICULTY.TECHNOLOGY_UPGRADE_COST,
    group: PlayerTechnologyGroup.BUILDING,
  },
  [PlayerTechnology.FARM]: {
    research: DIFFICULTY.TECHNOLOGY_UPGRADE_COST,
    group: PlayerTechnologyGroup.BUILDING,
  },
  [PlayerTechnology.LUMBERMILL]: {
    research: DIFFICULTY.TECHNOLOGY_UPGRADE_COST,
    group: PlayerTechnologyGroup.BUILDING,
  },
  [PlayerTechnology.QUARRY]: {
    research: DIFFICULTY.TECHNOLOGY_UPGRADE_COST,
    group: PlayerTechnologyGroup.BUILDING,
  },
  [PlayerTechnology.FIRE_TOWER]: {
    research: DIFFICULTY.TECHNOLOGY_UPGRADE_COST,
    group: PlayerTechnologyGroup.BUILDING,
  },
  [PlayerTechnology.WALL]: {
    research: DIFFICULTY.TECHNOLOGY_UPGRADE_COST,
    group: PlayerTechnologyGroup.BUILDING,
  },
  [PlayerTechnology.COMBAT]: {
    research: DIFFICULTY.TECHNOLOGY_UPGRADE_COST,
    group: PlayerTechnologyGroup.MILITARY,
  },
};





export const PLAYER_MOVEMENT_KEYS: Record<string, MovementDirection> = {
  KeyW: MovementDirection.UP,
  ArrowUp: MovementDirection.UP,
  KeyS: MovementDirection.DOWN,
  ArrowDown: MovementDirection.DOWN,
  KeyA: MovementDirection.LEFT,
  ArrowLeft: MovementDirection.LEFT,
  KeyD: MovementDirection.RIGHT,
  ArrowRight: MovementDirection.RIGHT,
};
