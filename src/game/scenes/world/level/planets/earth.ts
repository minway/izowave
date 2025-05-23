import type { LevelBiomes } from '~scene/world/level/types';

import { BiomeType, SpawnTarget } from '~scene/world/level/types';

export const LEVEL_BIOMES_EARTH: LevelBiomes = [{
  params: { upperBound: 0.12 },
  data: {
    type: BiomeType.WATER,  // deepwater - [0]
    tileIndex: 0,
    z: 0,
    collide: false,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.12, upperBound: 0.15 },
  data: {
    type: BiomeType.WATER,
    tileIndex: 1,
    z: 0,
    collide: false,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.15, upperBound: 0.17 },
  data: {
    type: BiomeType.WATER,  // water - [2] 
    tileIndex: 2,
    z: 0,
    collide: false,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.17, upperBound: 0.20 },
  data: {
    type: BiomeType.SAND,
    tileIndex: 6,
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.CRYSTAL],
  },
}, {
  params: { lowerBound: 0.20, upperBound: 0.24 },
  data: {
    type: BiomeType.SAND,
    tileIndex: [7, 8],
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.CRYSTAL],
  },
}, {
  params: { lowerBound: 0.24, upperBound: 0.34 },
  data: {
    type: BiomeType.GRASS,  // hill - [5]
    tileIndex: 12,
    z: 0,
    collide: false,
    solid: true,
    friction: 2,  // slow down in hills
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.SCENERY, SpawnTarget.CRYSTAL],
  },
}, {
  params: { lowerBound: 0.34, upperBound: 0.44 },
  data: {
    type: BiomeType.GRASS,
    tileIndex: [13, 14],
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.SCENERY],
  },
}, {
  params: { lowerBound: 0.44, upperBound: 0.54 },
  data: {
    type: BiomeType.GRASS,  // plain - [7] 
    tileIndex: [15, 17],
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.SCENERY, SpawnTarget.CRYSTAL],
  },
}, {
  params: { lowerBound: 0.54, upperBound: 0.59 },
  data: {
    type: BiomeType.MOUNT,  // mountain - [8]
    tileIndex: 24,
    z: 0,                 // z-index = 0 - no piled mountains
    collide: false,
    solid: true,
    friction: 4,  // slow down in mountains
    spawn: [],
  },
}, {
  params: { lowerBound: 0.59, upperBound: 0.63 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 26,
    z: 1,
    collide: true,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.63, upperBound: 0.72 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 27,
    z: 2,
    collide: true,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.72 },
  data: {
    type: BiomeType.SNOW, // snow/fog - [11]
    tileIndex: 30,
    z: 3,
    collide: true,
    solid: false,
    spawn: [],
  },
}, {
  data: {
    type: BiomeType.RUBBLE,
    tileIndex: [18, 19],
    z: 0,
    collide: false,
    solid: true,
    friction: 0.8,
    spawn: [SpawnTarget.PLAYER],
  },
}];
