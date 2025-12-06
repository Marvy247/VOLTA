'use client';

import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { HexCoordinates } from '../types';
import { axialToPixel } from '../utils/hexGrid';

interface HexTileProps {
  coordinates: HexCoordinates;
  owner?: string;
  isOwned: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export default function HexTile({
  coordinates,
  owner,
  isOwned,
  isSelected,
  onClick,
  onHover,
}: HexTileProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const position = axialToPixel(coordinates);
  const hexHeight = 0.1;

  // Animate selected tile
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.1 + hexHeight;
    } else if (meshRef.current) {
      meshRef.current.position.z = hexHeight;
    }
  });

  // Determine hex color based on state
  const getColor = () => {
    if (isSelected) return '#00D9FF'; // Cyan (selected)
    if (hovered) return '#00C58E'; // X1 Green (hover)
    if (isOwned) return '#4169E1'; // Blue (owned)
    return '#2A2A2A'; // Dark gray (unclaimed)
  };

  return (
    <group position={[position.x, position.y, 0]}>
      {/* Hex base */}
      <mesh
        ref={meshRef}
        rotation={[0, 0, 0]}
        position={[0, 0, hexHeight]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover(false);
        }}
      >
        <cylinderGeometry args={[1, 1, 0.2, 6]} />
        <meshStandardMaterial
          color={getColor()}
          metalness={0.3}
          roughness={0.7}
          emissive={isSelected || hovered ? getColor() : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Hex border */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, hexHeight]}>
        <cylinderGeometry args={[1.05, 1.05, 0.05, 6]} />
        <meshBasicMaterial
          color={isSelected ? '#00D9FF' : '#666666'}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Coordinates label (for debugging) */}
      {(hovered || isSelected) && (
        <Text
          position={[0, 0, hexHeight + 0.5]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`${coordinates.x},${coordinates.y}`}
        </Text>
      )}

      {/* Owner indicator */}
      {isOwned && owner && (
        <mesh position={[0, 0, hexHeight + 0.15]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}
