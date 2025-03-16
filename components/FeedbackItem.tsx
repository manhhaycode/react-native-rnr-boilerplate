import React from 'react';
import { View } from 'react-native';
import { Card, CardContent } from '@/components/rnr/ui/card';
import { Text } from '@/components/rnr/ui/text';
import { RatingStars } from './RatingStars';
import { Feedback } from '@/api/art-tools/types';
import { formatDistanceToNow } from 'date-fns';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FeedbackItemProps {
  feedback: Feedback;
  index: number;
}

export function FeedbackItem({ feedback, index }: FeedbackItemProps) {
  const date = new Date(feedback.date);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)} className="mb-3">
      <Card>
        <CardContent className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <RatingStars rating={feedback.rating} size={18} showValue />
            <Text className="text-xs text-muted-foreground">{timeAgo}</Text>
          </View>

          <Text className="text-sm mb-2">{feedback.comment}</Text>

          <Text className="text-xs font-medium">{feedback.author}</Text>
        </CardContent>
      </Card>
    </Animated.View>
  );
}
