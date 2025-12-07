'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, Users, MapPin } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function GameHUD() {
  const { currentPlayer } = useGameStore();

  if (!currentPlayer) {
    return null;
  }

  const stats = [
    {
      icon: Zap,
      label: 'Energy',
      value: currentPlayer.energyBalance.toLocaleString(),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      icon: MapPin,
      label: 'Territories',
      value: currentPlayer.territories.length.toString(),
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      icon: TrendingUp,
      label: 'Power Score',
      value: currentPlayer.powerScore.toLocaleString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: Users,
      label: 'Alliance',
      value: currentPlayer.allianceId ? 'Yes' : 'None',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top HUD Bar */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          {/* Player Info */}
          <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentPlayer.username?.[0]?.toUpperCase() || currentPlayer.address.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {currentPlayer.username || `${currentPlayer.address.slice(0, 6)}...${currentPlayer.address.slice(-4)}`}
              </div>
              <div className="text-xs text-zinc-500">Commander</div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 flex items-center gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`flex-1 ${stat.bgColor} backdrop-blur border ${stat.borderColor} rounded-xl px-4 py-3 hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div>
                      <div className="text-xs text-zinc-400">{stat.label}</div>
                      <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Energy Generation Rate */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <div>
                <div className="text-xs text-zinc-400">Generation</div>
                <div className="text-sm font-bold text-green-400">+150/hr</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Notifications Area */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-3 flex justify-center"
        >
          <div className="bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-300">
            <span className="text-emerald-400 font-bold">⚡ VOLTA</span> <span className="text-emerald-400 font-medium">Welcome back, Commander!</span> Ready to expand your energy empire?
          </div>
        </motion.div>
      </div>
    </div>
  );
}
