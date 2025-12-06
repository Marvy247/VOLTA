import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { GameState, Territory, Player, HexCoordinates } from '../types';

interface GameStore extends GameState {
  // Actions
  setCurrentPlayer: (player: Player | null) => void;
  setSelectedTerritory: (territory: Territory | null) => void;
  setViewportCenter: (coordinates: HexCoordinates) => void;
  setZoomLevel: (zoom: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updatePlayerEnergy: (amount: number) => void;
  addTerritory: (territory: Territory) => void;
  removeTerritory: (territoryId: number) => void;
  updateTerritory: (territoryId: number, updates: Partial<Territory>) => void;
  reset: () => void;
}

const initialState: GameState = {
  currentPlayer: null,
  selectedTerritory: null,
  viewportCenter: { x: 0, y: 0 },
  zoomLevel: 1,
  isLoading: false,
  error: null,
};

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setCurrentPlayer: (player) =>
          set((state) => {
            state.currentPlayer = player;
          }),

        setSelectedTerritory: (territory) =>
          set((state) => {
            state.selectedTerritory = territory;
          }),

        setViewportCenter: (coordinates) =>
          set((state) => {
            state.viewportCenter = coordinates;
          }),

        setZoomLevel: (zoom) =>
          set((state) => {
            state.zoomLevel = Math.max(0.5, Math.min(3, zoom));
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        updatePlayerEnergy: (amount) =>
          set((state) => {
            if (state.currentPlayer) {
              state.currentPlayer.energyBalance += amount;
            }
          }),

        addTerritory: (territory) =>
          set((state) => {
            if (state.currentPlayer) {
              state.currentPlayer.territories.push(territory);
            }
          }),

        removeTerritory: (territoryId) =>
          set((state) => {
            if (state.currentPlayer) {
              state.currentPlayer.territories = state.currentPlayer.territories.filter(
                (t) => t.tokenId !== territoryId
              );
            }
          }),

        updateTerritory: (territoryId, updates) =>
          set((state) => {
            if (state.currentPlayer) {
              const territory = state.currentPlayer.territories.find(
                (t) => t.tokenId === territoryId
              );
              if (territory) {
                Object.assign(territory, updates);
              }
            }
          }),

        reset: () => set(initialState),
      })),
      {
        name: 'energy-clash-game-store',
        partialize: (state) => ({
          viewportCenter: state.viewportCenter,
          zoomLevel: state.zoomLevel,
        }),
      }
    ),
    { name: 'GameStore' }
  )
);
