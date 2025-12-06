import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useContracts } from './useContracts';
import { HexCoordinates } from '../types';
import toast from 'react-hot-toast';

export function useTerritory() {
  const { address } = useAccount();
  const { territoryNFT, walletClient } = useContracts();
  const [isLoading, setIsLoading] = useState(false);

  const claimTerritory = async (coordinates: HexCoordinates) => {
    if (!address || !territoryNFT || !walletClient) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const { request } = await territoryNFT.simulate.claimTerritory([
        address,
        BigInt(coordinates.x),
        BigInt(coordinates.y),
      ]);

      const hash = await walletClient.writeContract(request);

      toast.success('Territory claimed successfully!');
      return hash;
    } catch (error: any) {
      console.error('Error claiming territory:', error);
      toast.error(error.message || 'Failed to claim territory');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPlayerTerritories = async (playerAddress?: string) => {
    if (!territoryNFT) return [];

    const targetAddress = playerAddress || address;
    if (!targetAddress) return [];

    try {
      const tokenIds = await territoryNFT.read.getTerritoriesByOwner([targetAddress as `0x${string}`]);
      return tokenIds;
    } catch (error) {
      console.error('Error fetching territories:', error);
      return [];
    }
  };

  const getTerritoryData = async (tokenId: number) => {
    if (!territoryNFT) return null;

    try {
      const data = await territoryNFT.read.getTerritory([BigInt(tokenId)]);
      return {
        x: Number(data[0]),
        y: Number(data[1]),
        claimedAt: Number(data[2]),
        lastEnergyCollected: Number(data[3]),
      };
    } catch (error) {
      console.error('Error fetching territory data:', error);
      return null;
    }
  };

  return {
    claimTerritory,
    getPlayerTerritories,
    getTerritoryData,
    isLoading,
  };
}
