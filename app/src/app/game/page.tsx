'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import GameHUD from '@/game/components/GameHUD';
import BuildingMenu from '@/game/components/BuildingMenu';
import TerritoryInfo from '@/game/components/TerritoryInfo';
import { useGameStore } from '@/game/store/gameStore';
import { useEnergy } from '@/game/hooks/useEnergy';
import { useTerritory } from '@/game/hooks/useTerritory';
import { useBuilding } from '@/game/hooks/useBuilding';
import type { HexCoordinates, Territory, BuildingType } from '@/game/types';
import { Toaster } from 'react-hot-toast';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Dynamically import 3D components (avoid SSR issues)
const HexMap = dynamic(() => import('@/game/components/HexMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
    </div>
  ),
});

export default function GamePage() {
  const { address, isConnected } = useAccount();
  const { currentPlayer, setCurrentPlayer, selectedTerritory, setSelectedTerritory } = useGameStore();
  const { balance: energyBalance } = useEnergy();
  const { claimTerritory, getPlayerTerritories } = useTerritory();
  const { buildBuilding, collectEnergy } = useBuilding();

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useState(false);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [clickedHex, setClickedHex] = useState<HexCoordinates | null>(null);

  // Initialize player when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      setCurrentPlayer({
        address,
        username: undefined,
        territories: [],
        energyBalance: energyBalance,
        powerScore: 0,
        allianceId: undefined,
      });
    } else {
      setCurrentPlayer(null);
    }
  }, [isConnected, address, energyBalance]);

  // Load player territories
  useEffect(() => {
    if (currentPlayer) {
      loadPlayerTerritories();
    }
  }, [currentPlayer?.address]);

  const loadPlayerTerritories = async () => {
    // TODO: Fetch actual territories from blockchain
    // For now, just initialize empty
    setTerritories([]);
  };

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  const handleTerritoryClick = async (coordinates: HexCoordinates) => {
    setClickedHex(coordinates);
    // TODO: Check if territory is claimed and show info
  };

  const handleClaimTerritory = async () => {
    if (!clickedHex) return;

    try {
      await claimTerritory(clickedHex);
      // Reload territories
      await loadPlayerTerritories();
      setClickedHex(null);
    } catch (error) {
      console.error('Failed to claim territory:', error);
    }
  };

  const handleCollectEnergy = async () => {
    if (!selectedTerritory) return;

    try {
      await collectEnergy(selectedTerritory.tokenId);
    } catch (error) {
      console.error('Failed to collect energy:', error);
    }
  };

  const handleBuildBuilding = async (buildingType: BuildingType) => {
    if (!selectedTerritory) return;

    try {
      await buildBuilding(selectedTerritory.tokenId, buildingType);
      setIsBuildMenuOpen(false);
    } catch (error) {
      console.error('Failed to build:', error);
    }
  };

  // Loading / Welcome Screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="mb-8">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-wider">
              VOLTA
            </h1>
            <p className="text-2xl text-emerald-400 font-semibold mb-2">
              The Energy Empire Game
            </p>
            <p className="text-xl text-zinc-400">
              Build. Battle. Electrify.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
            <ul className="text-left text-zinc-300 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">1.</span>
                <span>Claim hexagonal territories on the world map</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">2.</span>
                <span>Build renewable energy sources (solar, wind, hydro)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">3.</span>
                <span>Generate energy tokens passively over time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">4.</span>
                <span>Attack neighbors to expand your empire</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">5.</span>
                <span>Form alliances and dominate the leaderboards</span>
              </li>
            </ul>
          </div>

          <ConnectButton />

          <div className="mt-6 text-sm text-zinc-500">
            Powered by X1 EcoChain • Ultra-low fees (~$0.01) • Instant finality
          </div>
        </motion.div>
      </div>
    );
  }

  // Game Interface
  return (
    <div className="relative w-full h-screen bg-zinc-950 overflow-hidden">
      <Toaster position="top-center" />

      {/* Game HUD */}
      <GameHUD />

      {/* 3D Game Map */}
      <div className="w-full h-full">
        <Suspense fallback={<div className="w-full h-full bg-zinc-950" />}>
          <HexMap territories={territories} onTerritoryClick={handleTerritoryClick} />
        </Suspense>
      </div>

      {/* Territory Info Panel */}
      {clickedHex && (
        <TerritoryInfo
          territory={null} // TODO: Get actual territory data
          isOwned={false}
          onClose={() => setClickedHex(null)}
          onClaim={handleClaimTerritory}
          onAttack={() => {}}
          onCollectEnergy={handleCollectEnergy}
          onBuild={() => setIsBuildMenuOpen(true)}
        />
      )}

      {/* Building Menu */}
      <BuildingMenu
        isOpen={isBuildMenuOpen}
        onClose={() => setIsBuildMenuOpen(false)}
        onSelectBuilding={handleBuildBuilding}
        playerEnergy={energyBalance}
      />

      {/* Quick Action Bar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-full px-6 py-3 flex items-center gap-4"
        >
          <Button
            onClick={() => setIsBuildMenuOpen(true)}
            className="rounded-full"
            disabled={!selectedTerritory}
          >
            Build
          </Button>
          <Button
            onClick={handleCollectEnergy}
            className="rounded-full bg-green-600 hover:bg-green-700"
            disabled={!selectedTerritory}
          >
            Collect Energy
          </Button>
          <div className="h-6 w-px bg-zinc-700" />
          <div className="text-sm text-zinc-400">
            Press <kbd className="px-2 py-1 bg-zinc-800 rounded">ESC</kbd> to deselect
          </div>
        </motion.div>
      </div>
    </div>
  );
}
