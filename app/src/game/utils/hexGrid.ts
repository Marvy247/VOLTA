/**
 * Hexagonal Grid Utilities
 * Using axial coordinates system for hex grid
 * Reference: https://www.redblobgames.com/grids/hexagons/
 */

import { HexCoordinates } from '../types';

// Hex grid constants
export const HEX_SIZE = 1; // Size of each hex
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
export const HEX_HEIGHT = 2 * HEX_SIZE;

/**
 * Convert axial coordinates to pixel position
 */
export function axialToPixel(hex: HexCoordinates): { x: number; y: number } {
  const x = HEX_SIZE * (Math.sqrt(3) * hex.x + (Math.sqrt(3) / 2) * hex.y);
  const y = HEX_SIZE * ((3 / 2) * hex.y);
  return { x, y };
}

/**
 * Convert pixel position to axial coordinates
 */
export function pixelToAxial(x: number, y: number): HexCoordinates {
  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / HEX_SIZE;
  const r = ((2 / 3) * y) / HEX_SIZE;
  return axialRound(q, r);
}

/**
 * Round fractional axial coordinates to nearest hex
 */
function axialRound(q: number, r: number): HexCoordinates {
  let x = q;
  let z = r;
  let y = -x - z;

  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  const xDiff = Math.abs(rx - x);
  const yDiff = Math.abs(ry - y);
  const zDiff = Math.abs(rz - z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { x: rx, y: rz };
}

/**
 * Get all 6 neighbors of a hex
 */
export function getNeighbors(hex: HexCoordinates): HexCoordinates[] {
  const directions = [
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
  ];

  return directions.map((dir) => ({
    x: hex.x + dir.x,
    y: hex.y + dir.y,
  }));
}

/**
 * Calculate distance between two hexes
 */
export function hexDistance(a: HexCoordinates, b: HexCoordinates): number {
  return (Math.abs(a.x - b.x) + Math.abs(a.x + a.y - b.x - b.y) + Math.abs(a.y - b.y)) / 2;
}

/**
 * Get all hexes within a certain radius
 */
export function getHexesInRadius(center: HexCoordinates, radius: number): HexCoordinates[] {
  const results: HexCoordinates[] = [];

  for (let x = -radius; x <= radius; x++) {
    const minY = Math.max(-radius, -x - radius);
    const maxY = Math.min(radius, -x + radius);

    for (let y = minY; y <= maxY; y++) {
      results.push({ x: center.x + x, y: center.y + y });
    }
  }

  return results;
}

/**
 * Get hexes in a ring at specific radius
 */
export function getHexRing(center: HexCoordinates, radius: number): HexCoordinates[] {
  if (radius === 0) return [center];

  const results: HexCoordinates[] = [];
  let hex = { x: center.x + radius, y: center.y };

  const directions = [
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  for (const dir of directions) {
    for (let i = 0; i < radius; i++) {
      results.push({ ...hex });
      hex = { x: hex.x + dir.x, y: hex.y + dir.y };
    }
  }

  return results;
}

/**
 * Check if two hex coordinates are equal
 */
export function hexEquals(a: HexCoordinates, b: HexCoordinates): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Generate a unique key for hex coordinates
 */
export function hexToKey(hex: HexCoordinates): string {
  return `${hex.x},${hex.y}`;
}

/**
 * Parse hex key back to coordinates
 */
export function keyToHex(key: string): HexCoordinates {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

/**
 * Get hex vertices for rendering
 */
export function getHexVertices(hex: HexCoordinates): Array<{ x: number; y: number }> {
  const center = axialToPixel(hex);
  const vertices: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30;
    const angleRad = (Math.PI / 180) * angleDeg;
    vertices.push({
      x: center.x + HEX_SIZE * Math.cos(angleRad),
      y: center.y + HEX_SIZE * Math.sin(angleRad),
    });
  }

  return vertices;
}

/**
 * Check if a point is inside a hex
 */
export function isPointInHex(point: { x: number; y: number }, hex: HexCoordinates): boolean {
  const hexAtPoint = pixelToAxial(point.x, point.y);
  return hexEquals(hexAtPoint, hex);
}

/**
 * Get line of hexes between two points (for pathfinding/range checks)
 */
export function hexLine(a: HexCoordinates, b: HexCoordinates): HexCoordinates[] {
  const n = hexDistance(a, b);
  if (n === 0) return [a];

  const results: HexCoordinates[] = [];

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const lerpX = a.x + (b.x - a.x) * t;
    const lerpY = a.y + (b.y - a.y) * t;
    results.push(axialRound(lerpX, lerpY));
  }

  return results;
}
