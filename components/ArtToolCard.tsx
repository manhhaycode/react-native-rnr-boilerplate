import React, { useEffect } from 'react';
import { View, Pressable, Image } from 'react-native';
import { Card, CardContent } from '@/components/rnr/ui/card';
import { Text } from '@/components/rnr/ui/text';
import { FavoriteButton } from './FavoriteButton';
import { ArtTool } from '@/api/art-tools/types';
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/libs/rnr/utils';
import { useHaptics } from '@/hooks/useHaptics';
import { Badge } from '@/components/rnr/ui/badge';
import { Glasses } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';

interface ArtToolCardProps {
  artTool: ArtTool;
  onPress: () => void;
  index?: number;
}

export function ArtToolCard({ artTool, onPress, index = 0 }: ArtToolCardProps) {
  const { triggerImpact } = useHaptics();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Animation for price when it has a limited time deal
  const priceAnimation = useSharedValue(artTool.limitedTimeDeal > 0 ? 1 : 0);

  useEffect(() => {
    // Animate price when limitedTimeDeal changes
    priceAnimation.value = withTiming(artTool.limitedTimeDeal > 0 ? 1 : 0, { duration: 500 });
  }, [artTool.limitedTimeDeal]);

  const priceStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 + priceAnimation.value * 0.1 }],
      color: `rgba(220, 38, 38, ${priceAnimation.value})`,
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
    triggerImpact('light');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      exiting={FadeOutDown.duration(400)}
      style={cardStyle}
      className="flex-1 m-2"
    >
      <Card className="overflow-hidden">
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Image style={{ resizeMode: 'contain' }} source={{ uri: artTool.image }} className="w-full h-32" />
          {artTool.limitedTimeDeal > 0 && (
            <Animated.View
              className="absolute top-2 right-2 bg-destructive rounded-full px-2 py-1"
              entering={FadeInDown.springify().damping(12)}
            >
              <Text className="text-xs text-destructive-foreground font-medium">
                -{Math.round(artTool.limitedTimeDeal * 100)}% OFF
              </Text>
            </Animated.View>
          )}
          <CardContent className="p-3">
            <Text className="font-medium text-sm" numberOfLines={2}>
              {artTool.artName}
            </Text>

            <View className="flex-row justify-between items-center mt-2">
              <Text className={twMerge('text-base font-semibold', artTool.limitedTimeDeal > 0 && 'text-red-500')}>
                ${artTool.price}
              </Text>
              <FavoriteButton artTool={artTool} size={20} />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-muted-foreground mt-1">{artTool.brand}</Text>
              {artTool.glassSurface && (
                <Badge variant="secondary" className="flex-row gap-2 items-center mt-1">
                  <Glasses size={12} className="mr-1" />
                  <Text className="text-[10px]">Glass</Text>
                </Badge>
              )}
            </View>
          </CardContent>
        </Pressable>
      </Card>
    </Animated.View>
  );
}
