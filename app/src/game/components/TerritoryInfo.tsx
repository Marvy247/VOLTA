'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Zap, Calendar, TrendingUp, Swords } from 'lucide-react';
import { Territory } from '../types';
import { Button } from '@/components/ui/button';
import { BUILDING_STATS } from '../constants/buildings';

interface TerritoryInfoProps {
  territory: Territory | null;
  isOwned: boolean;
  onClose: () => void;
  onClaim?: () => void;
  onCollectEnergy?: () => void;
  onAttack?: () => void;
  onBuild?: () => void;
}

export default function TerritoryInfo({
  territory,
  isOwned,
  onClose,
  onClaim,
  onCollectEnergy,
  onAttack,
  onBuild,
}: TerritoryInfoProps) {
  if (!territory) return null;

  const calculateTotalGeneration = () => {
    return territory.buildings.reduce((total, building) => {
      const stats = BUILDING_STATS[building.type];
      return total + (stats.energyGeneration || 0) * building.level;
    }, 0);
  };

  const calculateTotalDefense = () => {
    return territory.buildings.reduce((total, building) => {
      const stats = BUILDING_STATS[building.type];
      return total + (stats.defense || 0) * building.level;
    }, 0);
  };

  const timeSinceClaim = Math.floor((Date.now() - territory.claimedAt) / 1000);
  const timeSinceCollection = Math.floor((Date.now() - territory.lastEnergyCollected) / 1000);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 ${isOwned ? 'bg-emerald-500/10' : 'bg-zinc-800/50'} border-b border-zinc-700`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${isOwned ? 'bg-emerald-500' : 'bg-zinc-700'} flex items-center justify-center`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Territory</h2>
                  <p className="text-sm text-zinc-400">
                    {territory.coordinates.x}, {territory.coordinates.y}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Owner Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Owner</span>
              <span className="text-sm font-mono text-white">
                {territory.owner.slice(0, 6)}...{territory.owner.slice(-4)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-4">
            {/* Time Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-zinc-400">Claimed</span>
                </div>
                <span className="text-sm font-medium text-white">{formatTime(timeSinceClaim)}</span>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-zinc-400">Last Collection</span>
                </div>
                <span className="text-sm font-medium text-white">{formatTime(timeSinceCollection)}</span>
              </div>
            </div>

            {/* Production & Defense */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-zinc-400">Generation</span>
                </div>
                <span className="text-lg font-bold text-green-400">+{calculateTotalGeneration()}/hr</span>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Swords className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-zinc-400">Defense</span>
                </div>
                <span className="text-lg font-bold text-blue-400">{calculateTotalDefense()}</span>
              </div>
            </div>

            {/* Buildings */}
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-2">
                Buildings ({territory.buildings.length}/5)
              </h3>
              {territory.buildings.length > 0 ? (
                <div className="space-y-2">
                  {territory.buildings.map((building) => {
                    const stats = BUILDING_STATS[building.type];
                    return (
                      <div
                        key={building.id}
                        className="bg-zinc-800/50 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{stats.name}</div>
                          <div className="text-xs text-zinc-500">Level {building.level}/{stats.maxLevel}</div>
                        </div>
                        {stats.energyGeneration && stats.energyGeneration > 0 && (
                          <div className="text-xs text-green-400">
                            +{stats.energyGeneration * building.level}/hr
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-zinc-800/30 rounded-lg p-4 text-center text-sm text-zinc-500">
                  No buildings yet
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-zinc-700 space-y-2">
            {isOwned ? (
              <>
                <Button
                  onClick={onCollectEnergy}
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Collect Energy
                </Button>
                <Button
                  onClick={onBuild}
                  variant="outline"
                  className="w-full h-12"
                  disabled={territory.buildings.length >= 5}
                >
                  Build Structure
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onClaim}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                >
                  Claim Territory (50 Energy)
                </Button>
                <Button
                  onClick={onAttack}
                  variant="outline"
                  className="w-full h-12 border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Swords className="w-5 h-5 mr-2" />
                  Attack Territory
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
