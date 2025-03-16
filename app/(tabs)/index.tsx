import React, { useState } from 'react';
import { View, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { SearchBar } from '@/components/SearchBar';
import { BrandFilter } from '@/components/BrandFilter';
import { ArtToolCard } from '@/components/ArtToolCard';
import { Text } from '@/components/rnr/ui/text';
import { useArtToolsQuery, useBrandsQuery } from '@/api/art-tools';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  // Fetch all brands
  const { data: brands = [] } = useBrandsQuery();

  // Fetch art tools with filters
  const {
    data: artTools = [],
    isLoading,
    refetch,
    isRefetching,
  } = useArtToolsQuery({
    brand: selectedBrand,
    artName: searchQuery,
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Search Bar */}
      <Animated.View entering={FadeIn.duration(400)} className="p-4 border-b border-border">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search art tools..." />
      </Animated.View>

      {/* Brand Filter */}
      <View className="flex-row basis-[70px]">
        <BrandFilter brands={brands} selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} />
      </View>

      <View className="flex-1 flex-shrink-0">
        {/* Art Tools List */}
        <FlashList
          data={artTools}
          numColumns={2}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ArtToolCard artTool={item} onPress={() => router.push(`/details/${item.id}`)} index={index} />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="hsl(var(--primary))" />
          }
          ListEmptyComponent={
            isLoading ? (
              <View className="flex-1 justify-center items-center p-4 h-60">
                <ActivityIndicator size="large" color="hsl(var(--primary))" />
              </View>
            ) : (
              <View className="flex-1 justify-center items-center p-4 h-60">
                <Text className="text-muted-foreground">No art tools found</Text>
              </View>
            )
          }
          contentContainerStyle={{ padding: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}
