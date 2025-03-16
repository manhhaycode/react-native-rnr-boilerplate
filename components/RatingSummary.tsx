import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/rnr/ui/text';
import { Progress } from '@/components/rnr/ui/progress';
import { Feedback } from '@/api/art-tools/types';
import { RatingStars } from './RatingStars';
import Animated, { FadeIn } from 'react-native-reanimated';

interface RatingSummaryProps {
  feedbacks: Feedback[];
}

export function RatingSummary({ feedbacks }: RatingSummaryProps) {
  const { averageRating, ratingCounts, totalCount } = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) {
      return { averageRating: 0, ratingCounts: {}, totalCount: 0 };
    }

    const total = feedbacks.length;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const average = sum / total;

    // Count ratings by value (5 star, 4 star, etc.)
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      counts[i] = feedbacks.filter((f) => Math.floor(f.rating) === i).length;
    }

    return {
      averageRating: average,
      ratingCounts: counts,
      totalCount: total,
    };
  }, [feedbacks]);

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <View className="p-4 items-center">
        <Text className="text-muted-foreground">No ratings yet</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(500)} className="p-4">
      <View className="flex-row items-center justify-between mb-6">
        <View className="items-center">
          <Text className="text-3xl font-bold">{averageRating.toFixed(1)}</Text>
          <RatingStars rating={averageRating} size={20} className="mt-1" animated />
          <Text className="text-xs text-muted-foreground mt-1">
            {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
          </Text>
        </View>

        <View className="flex-1 ml-6">
          {[5, 4, 3, 2, 1].map((rating) => (
            <View key={rating} className="flex-row items-center my-1">
              <Text className="text-xs font-medium w-6">{rating}</Text>
              <Progress className="flex-1 h-2 mx-2" value={(ratingCounts[rating] / totalCount) * 100} />
              <Text className="text-xs text-muted-foreground w-6 text-right">{ratingCounts[rating]}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
