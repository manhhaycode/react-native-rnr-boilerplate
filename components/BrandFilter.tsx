import React from 'react';
import { ScrollView } from 'react-native';
import { Button } from '@/components/rnr/ui/button';
import Animated, { FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from './rnr/ui/text';

interface BrandFilterProps {
  brands: string[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

export function BrandFilter({ brands, selectedBrand, onSelectBrand }: BrandFilterProps) {
  const selectedIndex = useSharedValue(0);

  // Provide haptic feedback on selection
  const handleSelectBrand = (brand: string, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectBrand(brand);
    selectedIndex.value = index;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-2 pt-4 border-b border-border"
    >
      <Button
        variant={!selectedBrand ? 'default' : 'outline'}
        className="mx-1"
        onPress={() => handleSelectBrand('', 0)}
      >
        <Text>All</Text>
      </Button>

      {brands.map((brand, index) => (
        <Button
          key={brand}
          variant={selectedBrand === brand ? 'default' : 'outline'}
          className="mx-1"
          onPress={() => handleSelectBrand(brand, index + 1)}
        >
          <Text>{brand}</Text>
        </Button>
      ))}
    </ScrollView>
  );
}
