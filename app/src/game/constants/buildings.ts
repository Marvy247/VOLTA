import { BuildingType, BuildingStats } from '../types';

// Building configurations and stats
export const BUILDING_STATS: Record<BuildingType, BuildingStats> = {
  [BuildingType.SOLAR_PANEL]: {
    type: BuildingType.SOLAR_PANEL,
    name: 'Solar Panel',
    description: 'Generates clean energy from sunlight. Low cost, steady output.',
    baseCost: 100,
    energyGeneration: 10, // Energy per block
    upgradeCost: (level: number) => 100 * Math.pow(1.5, level),
    maxLevel: 10,
  },
  [BuildingType.WIND_TURBINE]: {
    type: BuildingType.WIND_TURBINE,
    name: 'Wind Turbine',
    description: 'Harnesses wind power. Medium cost, good efficiency.',
    baseCost: 250,
    energyGeneration: 25,
    upgradeCost: (level: number) => 250 * Math.pow(1.5, level),
    maxLevel: 10,
  },
  [BuildingType.HYDRO_DAM]: {
    type: BuildingType.HYDRO_DAM,
    name: 'Hydro Dam',
    description: 'Uses water flow for maximum power. High cost, highest output.',
    baseCost: 500,
    energyGeneration: 50,
    upgradeCost: (level: number) => 500 * Math.pow(1.5, level),
    maxLevel: 10,
  },
  [BuildingType.DEFENSE_TOWER]: {
    type: BuildingType.DEFENSE_TOWER,
    name: 'Defense Tower',
    description: 'Protects your territory from attacks.',
    baseCost: 300,
    defense: 50,
    upgradeCost: (level: number) => 300 * Math.pow(1.6, level),
    maxLevel: 8,
  },
  [BuildingType.SHIELD_GENERATOR]: {
    type: BuildingType.SHIELD_GENERATOR,
    name: 'Shield Generator',
    description: 'Creates a temporary protective shield.',
    baseCost: 400,
    defense: 100,
    upgradeCost: (level: number) => 400 * Math.pow(1.7, level),
    maxLevel: 5,
  },
  [BuildingType.STORAGE]: {
    type: BuildingType.STORAGE,
    name: 'Energy Storage',
    description: 'Increases your energy storage capacity.',
    baseCost: 150,
    storage: 1000,
    upgradeCost: (level: number) => 150 * Math.pow(1.4, level),
    maxLevel: 15,
  },
};

// Building colors for 3D rendering
export const BUILDING_COLORS: Record<BuildingType, string> = {
  [BuildingType.SOLAR_PANEL]: '#FFD700', // Gold
  [BuildingType.WIND_TURBINE]: '#87CEEB', // Sky Blue
  [BuildingType.HYDRO_DAM]: '#4169E1', // Royal Blue
  [BuildingType.DEFENSE_TOWER]: '#FF4444', // Red
  [BuildingType.SHIELD_GENERATOR]: '#9370DB', // Purple
  [BuildingType.STORAGE]: '#00C58E', // X1 Green
};

// Energy generation rates
export const ENERGY_GENERATION = {
  BASE_RATE: 1, // Base rate multiplier
  BLOCK_TIME: 7.5, // X1 EcoChain block time in seconds
  COLLECTION_INTERVAL: 3600, // Collect every hour (in seconds)
};

// Combat constants
export const COMBAT = {
  ATTACK_MULTIPLIER: 1.2,
  DEFENSE_MULTIPLIER: 1.0,
  COOLDOWN_PERIOD: 300, // 5 minutes between attacks
  MAX_ATTACK_RANGE: 3, // Can attack territories within 3 hexes
};

// Territory constants
export const TERRITORY = {
  MAX_PER_PLAYER: 100,
  CLAIM_COST: 50, // Energy cost to claim new territory
  MAX_BUILDINGS_PER_TERRITORY: 5,
};

// Alliance constants
export const ALLIANCE = {
  MAX_MEMBERS: 50,
  CREATION_COST: 1000,
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 30,
};
