import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useContracts } from './useContracts';
import { BuildingType } from '../types';
import toast from 'react-hot-toast';

export function useBuilding() {
  const { address } = useAccount();
  const { building, walletClient } = useContracts();
  const [isLoading, setIsLoading] = useState(false);

  const buildBuilding = async (territoryId: number, buildingType: BuildingType) => {
    if (!address || !building || !walletClient) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      // Convert BuildingType to number
      const buildingTypeIndex = Object.values(BuildingType).indexOf(buildingType);

      const { request } = await building.simulate.buildBuilding([
        BigInt(territoryId),
        buildingTypeIndex,
      ]);

      const hash = await walletClient.writeContract(request);

      toast.success('Building constructed successfully!');
      return hash;
    } catch (error: any) {
      console.error('Error building:', error);
      toast.error(error.message || 'Failed to build structure');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const collectEnergy = async (territoryId: number) => {
    if (!address || !building || !walletClient) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const { request } = await building.simulate.collectEnergy([BigInt(territoryId)]);

      const hash = await walletClient.writeContract(request);

      toast.success('Energy collected!');
      return hash;
    } catch (error: any) {
      console.error('Error collecting energy:', error);
      toast.error(error.message || 'Failed to collect energy');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTerritoryBuildings = async (territoryId: number) => {
    if (!building) return [];

    try {
      const buildings = await building.read.getTerritoryBuildings([BigInt(territoryId)]);
      return buildings;
    } catch (error) {
      console.error('Error fetching buildings:', error);
      return [];
    }
  };

  return {
    buildBuilding,
    collectEnergy,
    getTerritoryBuildings,
    isLoading,
  };
}
