import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArtTool } from '@/api/art-tools/types';

interface FavoritesState {
  favorites: ArtTool[];
  addFavorite: (artTool: ArtTool) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (artTool) => {
        const { favorites } = get();
        // Check if already in favorites
        if (!favorites.some((item) => item.id === artTool.id)) {
          set({ favorites: [...favorites, artTool] });
        }
      },

      removeFavorite: (id) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((item) => item.id !== id) });
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some((item) => item.id === id);
      },
    }),
    {
      name: 'art-tools-favorites',
      storage: createJSONStorage(() => AsyncStorage),
      // Optional: only persist specific parts of the state
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
);
