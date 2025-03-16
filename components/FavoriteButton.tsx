import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useFavorites } from '@/hooks/useFavorites';
import { ArtTool } from '@/api/art-tools/types';
import { cn } from '@/libs/rnr/utils';

interface FavoriteButtonProps {
  artTool: ArtTool;
  size?: number;
  className?: string;
}

export function FavoriteButton({ artTool, size = 24, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(artTool.id);

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Animate when favorite status changes
  useEffect(() => {
    if (isFav) {
      scale.value = withSequence(withTiming(0.8, { duration: 50 }), withSpring(1.2), withSpring(1));
      rotation.value = withSequence(
        withTiming(-0.1, { duration: 100 }),
        withTiming(0.1, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      );
    }
  }, [isFav]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}rad` }],
    };
  });

  return (
    <Pressable onPress={() => toggleFavorite(artTool)} className={cn('p-2', className)}>
      <Animated.View style={animatedStyle}>
        <Heart color={isFav ? 'red' : 'black'} size={size} fill={isFav ? 'red' : 'none'} />
      </Animated.View>
    </Pressable>
  );
}
