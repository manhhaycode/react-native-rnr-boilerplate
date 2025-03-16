import React, { useEffect, useRef } from 'react';
import { View, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useArtToolQuery } from '@/api/art-tools';
import { Text } from '@/components/rnr/ui/text';
import { Button } from '@/components/rnr/ui/button';
import { FavoriteButton } from '@/components/FavoriteButton';
import { RatingSummary } from '@/components/RatingSummary';
import { FeedbackItem } from '@/components/FeedbackItem';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/rnr/ui/accordion';
import { ArrowLeft, Info, MessageSquare, Star, Glasses } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';
import { Badge } from '@/components/rnr/ui/badge';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandFilter } from '@/components/BrandFilter';

const IMAGE_HEIGHT = 300;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const feedbackRef = useRef<Animated.ScrollView>(null);
  const { bottom, top } = useSafeAreaInsets();

  const { data: artTool, isLoading } = useArtToolQuery(id);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Parallax effect for the image
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
            [-IMAGE_HEIGHT / 2, 0, IMAGE_HEIGHT * 0.75],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(scrollY.value, [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT], [2, 1, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });

  // Header opacity based on scroll
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 100], [0, 1], Extrapolation.CLAMP),
      backgroundColor: `rgba(255, 255, 255, ${interpolate(scrollY.value, [0, 100], [0, 0.9], Extrapolation.CLAMP)})`,
    };
  });

  const scrollToFeedback = () => {
    feedbackRef.current?.scrollTo({ y: IMAGE_HEIGHT + 300, animated: true });
  };

  if (isLoading || !artTool) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="var(--primary))" />
      </View>
    );
  }

  return (
    <>
      <Animated.View style={headerAnimatedStyle} className="absolute left-0 right-0 z-10 px-4 border-b border-border">
        <View style={{ marginTop: top }} className="flex-row items-center">
          <Button variant="ghost" size="icon" onPress={() => router.back()} className="mr-2">
            <ArrowLeft size={24} className="text-foreground" />
          </Button>
          <Text className="flex-1 text-lg font-medium" numberOfLines={1}>
            {artTool.artName}
          </Text>
          <FavoriteButton artTool={artTool} size={24} />
        </View>
      </Animated.View>
      <SafeAreaView className="flex-1 bg-background">
        {/* Back Button (visible when scrolled to top) */}
        <View className="absolute top-10 left-4 z-20">
          <Button variant="secondary" size="icon" onPress={() => router.back()} className="rounded-full opacity-80">
            <ArrowLeft size={24} className="text-foreground" />
          </Button>
        </View>

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ref={feedbackRef}
        >
          <View className="h-[300px] overflow-hidden">
            <Animated.View style={imageAnimatedStyle}>
              <Image resizeMode="cover" source={{ uri: artTool.image }} className="w-full h-[300px]" />
            </Animated.View>
          </View>

          <View className="bg-background rounded-t-3xl -mt-6 pt-6 px-4">
            <Animated.View entering={FadeInDown.duration(400)}>
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-4">
                  <Text className="text-2xl font-bold">{artTool.artName}</Text>
                  <Text className="text-muted-foreground mt-1">{artTool.brand}</Text>
                </View>
                <FavoriteButton artTool={artTool} size={28} />
              </View>
              <View className="flex-row items-center justify-between">
                {artTool.glassSurface && (
                  <Badge variant="secondary" className="gap-2 flex-row items-center">
                    <Glasses size={12} className="mr-1" />
                    <Text className="text-xs">Glass Compatible</Text>
                  </Badge>
                )}

                <View className="flex-row flex-wrap mt-2">
                  {artTool.limitedTimeDeal > 0 && (
                    <Badge variant="destructive" className="mr-2 mb-2">
                      <Text>Limited Time Deal</Text>
                    </Badge>
                  )}
                </View>
              </View>
              <View className="flex-row items-center mt-4">
                <Text className="text-2xl font-bold">${artTool.price}</Text>
                {artTool.limitedTimeDeal > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    <Text>{Math.round(artTool.limitedTimeDeal * 100)}% OFF</Text>
                  </Badge>
                )}
              </View>

              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="description">
                  <AccordionTrigger className="py-3">
                    <View className="flex-row gap-2 items-center">
                      <Info size={18} className="mr-2 text-foreground" />
                      <Text className="text-lg font-medium">Description</Text>
                    </View>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text className="text-base leading-relaxed">{artTool.description}</Text>

                    <View className="mt-4 flex-row flex-wrap">
                      <Badge variant="outline" className="m-1">
                        <Text>{artTool.glassSurface ? 'Glass Surface Compatible' : 'Not for Glass Surfaces'}</Text>
                      </Badge>
                    </View>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reviews">
                  <AccordionTrigger className="py-3">
                    <View className="flex-row gap-2 items-center">
                      <MessageSquare size={18} className="mr-2 text-foreground" />
                      <Text className="text-lg font-medium">Reviews & Ratings</Text>
                    </View>
                  </AccordionTrigger>
                  <AccordionContent>
                    {artTool.feedbacks && artTool.feedbacks.length > 0 ? (
                      <>
                        <RatingSummary feedbacks={artTool.feedbacks} />
                        <View className="mt-4 px-4">
                          <Text className="text-lg font-medium mb-3">Customer Reviews</Text>
                          {artTool.feedbacks.map((feedback, index) => (
                            <FeedbackItem key={`${feedback.author}-${index}`} feedback={feedback} index={index} />
                          ))}
                        </View>
                      </>
                    ) : (
                      <View className="p-4 items-center">
                        <Text className="text-muted-foreground">No reviews yet</Text>
                      </View>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Animated.View>
          </View>

          {/* Extra space at bottom */}
          <View className="h-20" />
        </Animated.ScrollView>

        {/* Bottom Action Bar */}
        <View
          style={{ bottom }}
          className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-4"
        >
          <View className="flex-row">
            <Button variant="outline" className="mr-2 flex-1" onPress={scrollToFeedback}>
              <Star size={18} className="mr-2" />
              <Text>See Reviews</Text>
            </Button>
            <Button className="flex-1">
              <Text>Add to Cart</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
