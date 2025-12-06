// Game Types for Energy Clash

export interface HexCoordinates {
  x: number;
  y: number;
}

export interface Territory {
  tokenId: number;
  owner: string;
  coordinates: HexCoordinates;
  claimedAt: number;
  lastEnergyCollected: number;
  buildings: Building[];
}

export enum BuildingType {
  SOLAR_PANEL = 'solar_panel',
  WIND_TURBINE = 'wind_turbine',
  HYDRO_DAM = 'hydro_dam',
  DEFENSE_TOWER = 'defense_tower',
  SHIELD_GENERATOR = 'shield_generator',
  STORAGE = 'storage',
}

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  territoryId: number;
  position: { x: number; y: number }; // Position within territory
  builtAt: number;
  energyGeneration?: number; // Energy per block
  defense?: number; // Defense value
  storage?: number; // Storage capacity
}

export interface Player {
  address: string;
  username?: string;
  territories: Territory[];
  energyBalance: number;
  powerScore: number;
  allianceId?: string;
}

export interface Alliance {
  id: string;
  name: string;
  leader: string;
  members: string[];
  territories: number;
  totalPower: number;
  createdAt: number;
}

export interface Battle {
  id: string;
  attacker: string;
  defender: string;
  targetTerritoryId: number;
  attackPower: number;
  defensePower: number;
  timestamp: number;
  result?: 'victory' | 'defeat' | 'pending';
  loot?: number;
}

export interface GameState {
  currentPlayer: Player | null;
  selectedTerritory: Territory | null;
  viewportCenter: HexCoordinates;
  zoomLevel: number;
  isLoading: boolean;
  error: string | null;
}

export interface BuildingStats {
  type: BuildingType;
  name: string;
  description: string;
  baseCost: number;
  energyGeneration?: number;
  defense?: number;
  storage?: number;
  upgradeCost: (level: number) => number;
  maxLevel: number;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  username?: string;
  powerScore: number;
  territoryCount: number;
  allianceName?: string;
}

export interface Transaction {
  hash: string;
  type: 'claim' | 'build' | 'attack' | 'collect' | 'trade';
  from: string;
  to?: string;
  amount?: number;
  territoryId?: number;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}
