import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/rnr/ui/alert-dialog';
import { Button } from '@/components/rnr/ui/button';
import { Text } from '@/components/rnr/ui/text';
import { Trash2, PackageOpen } from 'lucide-react-native';
import { SwipeableFavoriteItem } from '@/components/SwipeableFavoriteItem';
import { useFavorites } from '@/hooks/useFavorites';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, clearAllFavorites } = useFavorites();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClearAll = () => {
    clearAllFavorites();
  };

  if (favorites.length === 0) {
    return (
      <Animated.View entering={FadeIn.duration(400)} className="flex-1 justify-center items-center p-4">
        <PackageOpen size={80} className="text-muted-foreground mb-4" />
        <Text className="text-xl font-semibold text-center">Your favorites list is empty</Text>
        <Text className="text-muted-foreground text-center mt-2 mb-6">
          Add some art tools to your favorites to see them here
        </Text>
        <Button onPress={() => router.push('/')}>
          <Text>Browse Art Tools</Text>
        </Button>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableFavoriteItem artTool={item} onPress={() => router.push(`/details/${item.id}`)} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View className="p-4 pb-0 border-t border-border">
        {/* <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full flex-row items-center justify-center gap-3">
              <Trash2 color="#fff" size={18} className="mr-2" />
              <Text>Clear All Favorites</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove all art tools from your favorites list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onPress={handleClearAll}>Clear All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}

        <Button
          onPress={handleClearAll}
          variant="destructive"
          className="w-full flex-row items-center justify-center gap-3"
        >
          <Trash2 color="#fff" size={18} className="mr-2" />
          <Text>Clear All Favorites</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
