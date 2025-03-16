import { useFavoritesStore } from '@/libs/store/favorites';
import { useCallback } from 'react';
import { ArtTool } from '@/api/art-tools/types';
import * as Haptics from 'expo-haptics';

export function useFavorites() {
  const { favorites, addFavorite, removeFavorite, clearFavorites, isFavorite } = useFavoritesStore();

  // Add with haptic feedback
  const addToFavorites = useCallback(
    (artTool: ArtTool) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addFavorite(artTool);
    },
    [addFavorite],
  );

  // Remove with haptic feedback
  const removeFromFavorites = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      removeFavorite(id);
    },
    [removeFavorite],
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (artTool: ArtTool) => {
      if (isFavorite(artTool.id)) {
        removeFromFavorites(artTool.id);
      } else {
        addToFavorites(artTool);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites],
  );

  // Clear all with haptic feedback
  const clearAllFavorites = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    clearFavorites();
  }, [clearFavorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearAllFavorites,
    isFavorite,
  };
}
