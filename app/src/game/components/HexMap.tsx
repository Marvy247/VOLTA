'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import HexTile from './HexTile';
import { useGameStore } from '../store/gameStore';
import { getHexesInRadius, hexToKey } from '../utils/hexGrid';
import type { HexCoordinates, Territory } from '../types';

interface HexMapProps {
  territories: Territory[];
  onTerritoryClick: (coordinates: HexCoordinates) => void;
}

export default function HexMap({ territories, onTerritoryClick }: HexMapProps) {
  const {
    viewportCenter,
    selectedTerritory,
    setSelectedTerritory,
    currentPlayer,
  } = useGameStore();

  const [hoveredHex, setHoveredHex] = useState<HexCoordinates | null>(null);

  // Generate visible hexes around viewport center
  const visibleRadius = 10; // Show hexes within 10 radius
  const visibleHexes = getHexesInRadius(viewportCenter, visibleRadius);

  // Create a map of territories for quick lookup
  const territoryMap = new Map<string, Territory>();
  territories.forEach((t) => {
    territoryMap.set(hexToKey(t.coordinates), t);
  });

  const handleTileClick = (coordinates: HexCoordinates) => {
    const territory = territoryMap.get(hexToKey(coordinates));
    setSelectedTerritory(territory || null);
    onTerritoryClick(coordinates);
  };

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, -15, 15]} fov={50} />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, 10]} intensity={0.5} color="#00C58E" />
          <hemisphereLight intensity={0.3} color="#00C58E" groundColor="#0A0A0A" />

          {/* Fog */}
          <fog attach="fog" args={['#0A0A0A', 20, 60]} />

          {/* Hex Grid */}
          <group>
            {visibleHexes.map((hex) => {
              const key = hexToKey(hex);
              const territory = territoryMap.get(key);
              const isOwned = !!territory;
              const isSelected =
                selectedTerritory?.coordinates.x === hex.x &&
                selectedTerritory?.coordinates.y === hex.y;

              return (
                <HexTile
                  key={key}
                  coordinates={hex}
                  owner={territory?.owner}
                  isOwned={isOwned}
                  isSelected={isSelected}
                  onClick={() => handleTileClick(hex)}
                  onHover={(hovered) => {
                    if (hovered) {
                      setHoveredHex(hex);
                    } else if (hoveredHex?.x === hex.x && hoveredHex?.y === hex.y) {
                      setHoveredHex(null);
                    }
                  }}
                />
              );
            })}
          </group>

          {/* Grid plane (for reference) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#0A0A0A" metalness={0.1} roughness={0.9} />
          </mesh>
        </Suspense>
      </Canvas>

      {/* Hover info overlay */}
      {hoveredHex && (
        <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-lg p-3">
          <div className="text-sm text-zinc-300">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium">Hex: {hoveredHex.x}, {hoveredHex.y}</span>
            </div>
            {territoryMap.get(hexToKey(hoveredHex)) ? (
              <div className="text-xs text-zinc-500 mt-1">
                Owned Territory
              </div>
            ) : (
              <div className="text-xs text-emerald-400 mt-1">
                Available to Claim
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
