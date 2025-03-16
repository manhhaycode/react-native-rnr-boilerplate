import React from 'react';
import { TouchableOpacity, View, Image, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import { Card, CardContent } from '@/components/rnr/ui/card';
import { Text } from '@/components/rnr/ui/text';
import { Button } from '@/components/rnr/ui/button';
import { ArtTool } from '@/api/art-tools/types';
import { useFavorites } from '@/hooks/useFavorites';

interface SwipeableFavoriteItemProps {
  artTool: ArtTool;
  onPress: () => void;
}

export function SwipeableFavoriteItem({ artTool, onPress }: SwipeableFavoriteItemProps) {
  const { removeFromFavorites } = useFavorites();

  const renderRightActions = () => {
    return (
      <Pressable onPress={() => removeFromFavorites(artTool.id)}>
        <View className="flex justify-center bg-destructive w-20 h-full">
          <Button variant="destructive" className="h-full justify-center items-center">
            <Trash2 color="#fff" size={24} />
          </Button>
        </View>
      </Pressable>
    );
  };

  return (
    <Animated.View entering={FadeInRight.duration(300)} exiting={FadeOutRight.duration(300)}>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity onLongPress={onPress}>
          <Card className="m-2">
            <CardContent className="p-4 flex-row">
              <Image
                style={{ resizeMode: 'contain' }}
                source={{ uri: artTool.image }}
                className="w-20 h-20 rounded-md mr-4"
              />
              <View className="flex-1 justify-center">
                <Text className="font-semibold text-base" numberOfLines={2}>
                  {artTool.artName}
                </Text>
                <Text className="text-muted-foreground mt-1">${artTool.price}</Text>
                <Text className="text-xs text-muted-foreground mt-1">{artTool.brand}</Text>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}
