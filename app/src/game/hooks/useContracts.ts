import { usePublicClient, useWalletClient } from 'wagmi';
import { getContract } from 'viem';

// Contract ABIs (simplified for now - will be generated from Foundry)
const TERRITORY_NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'x', type: 'int256' },
      { name: 'y', type: 'int256' },
    ],
    name: 'claimTerritory',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getTerritory',
    outputs: [
      { name: 'x', type: 'int256' },
      { name: 'y', type: 'int256' },
      { name: 'claimedAt', type: 'uint256' },
      { name: 'lastEnergyCollected', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'getTerritoriesByOwner',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const ENERGY_TOKEN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const BUILDING_ABI = [
  {
    inputs: [
      { name: 'territoryId', type: 'uint256' },
      { name: 'buildingType', type: 'uint8' },
    ],
    name: 'buildBuilding',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'territoryId', type: 'uint256' }],
    name: 'collectEnergy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'territoryId', type: 'uint256' }],
    name: 'getTerritoryBuildings',
    outputs: [{ name: '', type: 'tuple[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Contract addresses (will be set after deployment)
const CONTRACT_ADDRESSES = {
  TERRITORY_NFT: '0x0000000000000000000000000000000000000000',
  ENERGY_TOKEN: '0x0000000000000000000000000000000000000000',
  BUILDING: '0x0000000000000000000000000000000000000000',
  BATTLE: '0x0000000000000000000000000000000000000000',
  ALLIANCE: '0x0000000000000000000000000000000000000000',
} as const;

export function useContracts() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const territoryNFT = publicClient
    ? getContract({
        address: CONTRACT_ADDRESSES.TERRITORY_NFT as `0x${string}`,
        abi: TERRITORY_NFT_ABI,
        client: publicClient,
      })
    : null;

  const energyToken = publicClient
    ? getContract({
        address: CONTRACT_ADDRESSES.ENERGY_TOKEN as `0x${string}`,
        abi: ENERGY_TOKEN_ABI,
        client: publicClient,
      })
    : null;

  const building = publicClient
    ? getContract({
        address: CONTRACT_ADDRESSES.BUILDING as `0x${string}`,
        abi: BUILDING_ABI,
        client: publicClient,
      })
    : null;

  return {
    territoryNFT,
    energyToken,
    building,
    walletClient,
    publicClient,
  };
}
