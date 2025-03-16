import React from 'react';
import { View } from 'react-native';
import { Star } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { cn } from '@/libs/rnr/utils';

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
  animated?: boolean;
  showValue?: boolean;
  maxStars?: number;
}

export function RatingStars({
  rating,
  size = 16,
  className,
  animated = false,
  showValue = false,
  maxStars = 5,
}: RatingStarsProps) {
  // Ensure rating is between 0 and maxStars
  const clampedRating = Math.max(0, Math.min(rating, maxStars));

  // Calculate filled and partial stars more precisely
  const filledStars = Math.floor(clampedRating);
  const partialStar = clampedRating - filledStars;
  const emptyStars = maxStars - filledStars - (partialStar > 0 ? 1 : 0);

  // Create arrays for each type of star
  const stars = [
    ...Array(filledStars).fill('filled'),
    ...(partialStar > 0 ? [partialStar] : []),
    ...Array(emptyStars).fill('empty'),
  ];

  return (
    <View className={cn('flex-row items-center', className)}>
      {stars.map((star, index) => {
        if (animated) {
          return (
            <Animated.View key={index} entering={FadeIn.delay(index * 100).duration(300)}>
              {renderStar(star, size)}
            </Animated.View>
          );
        }

        return <View key={index}>{renderStar(star, size)}</View>;
      })}

      {showValue && (
        <Animated.Text
          className="ml-1 text-sm text-muted-foreground"
          entering={animated ? FadeIn.delay(stars.length * 100).duration(300) : undefined}
        >
          {clampedRating.toFixed(1)}
        </Animated.Text>
      )}
    </View>
  );
}

// Helper function to render different types of stars
function renderStar(star: 'filled' | 'empty' | number, size: number) {
  if (star === 'filled') {
    return <Star fill="blue" size={size} />;
  } else if (star === 'empty') {
    return <Star size={size} />;
  } else {
    // Partial star - we'll use a custom implementation
    return (
      <View className="relative">
        {/* Empty star as background */}
        <Star size={size} className="text-muted-foreground" />

        {/* Filled portion of the star */}
        <View className="absolute top-0 left-0 overflow-hidden" style={{ width: `${star * 100}%` }}>
          <Star size={size} className="fill-primary text-primary" />
        </View>
      </View>
    );
  }
}
