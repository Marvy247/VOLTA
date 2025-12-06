'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Wind, Droplet, Shield, Database, Lock } from 'lucide-react';
import { useState } from 'react';
import { BuildingType } from '../types';
import { BUILDING_STATS, BUILDING_COLORS } from '../constants/buildings';
import { Button } from '@/components/ui/button';

interface BuildingMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuilding: (buildingType: BuildingType) => void;
  playerEnergy: number;
}

const BUILDING_ICONS: Record<BuildingType, any> = {
  [BuildingType.SOLAR_PANEL]: Zap,
  [BuildingType.WIND_TURBINE]: Wind,
  [BuildingType.HYDRO_DAM]: Droplet,
  [BuildingType.DEFENSE_TOWER]: Shield,
  [BuildingType.SHIELD_GENERATOR]: Lock,
  [BuildingType.STORAGE]: Database,
};

export default function BuildingMenu({
  isOpen,
  onClose,
  onSelectBuilding,
  playerEnergy,
}: BuildingMenuProps) {
  const [selectedType, setSelectedType] = useState<BuildingType | null>(null);

  if (!isOpen) return null;

  const buildingTypes = Object.values(BuildingType);

  const handleBuild = () => {
    if (selectedType) {
      onSelectBuilding(selectedType);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-zinc-900 border-l border-zinc-700 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Build Structure</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Energy Display */}
            <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Available Energy</span>
                <span className="text-lg font-bold text-yellow-400">{playerEnergy.toLocaleString()}</span>
              </div>
            </div>

            {/* Building List */}
            <div className="p-4 space-y-3">
              {buildingTypes.map((type) => {
                const stats = BUILDING_STATS[type];
                const Icon = BUILDING_ICONS[type];
                const canAfford = playerEnergy >= stats.baseCost;
                const isSelected = selectedType === type;

                return (
                  <motion.div
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : canAfford
                        ? 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                        : 'border-zinc-800 bg-zinc-900/50 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${BUILDING_COLORS[type]}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: BUILDING_COLORS[type] }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-white">{stats.name}</h3>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                              {stats.baseCost}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 mb-2">{stats.description}</p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {stats.energyGeneration && stats.energyGeneration > 0 && (
                            <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded">
                              +{stats.energyGeneration}/block
                            </div>
                          )}
                          {stats.defense && stats.defense > 0 && (
                            <div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                              🛡️ {stats.defense}
                            </div>
                          )}
                          {stats.storage && stats.storage > 0 && (
                            <div className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                              📦 {stats.storage}
                            </div>
                          )}
                          <div className="bg-zinc-700/50 text-zinc-300 px-2 py-1 rounded">
                            Max Lv.{stats.maxLevel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Build Button */}
            <div className="sticky bottom-0 p-4 bg-zinc-900 border-t border-zinc-700">
              <Button
                onClick={handleBuild}
                disabled={!selectedType || (selectedType && playerEnergy < BUILDING_STATS[selectedType].baseCost)}
                className="w-full h-12 text-base font-bold"
              >
                {selectedType
                  ? `Build ${BUILDING_STATS[selectedType].name}`
                  : 'Select a Building'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
