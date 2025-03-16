import React from 'react';
import { View, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Heart, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text } from '@/components/rnr/ui/text';
import { Pressable } from 'react-native';
import { useHaptics } from '@/hooks/useHaptics';

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { triggerImpact } = useHaptics();
  const tabWidth = Dimensions.get('window').width / state.routes.length;

  // Animation value for the indicator
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(tabWidth * 0.5);

  // Update indicator position when tab changes
  React.useEffect(() => {
    indicatorPosition.value = withSpring(state.index * tabWidth + tabWidth / 2 - indicatorWidth.value / 2, {
      damping: 15,
      stiffness: 120,
    });
  }, [state.index, tabWidth]);

  // Animated style for the indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }, { translateY: 0 }],
      width: indicatorWidth.value,
    };
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingBottom: insets.bottom,
        borderTopWidth: 1,
        borderTopColor: 'hsl(var(--border))',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;

        const isFocused = state.index === index;

        // Get icon based on route name
        let Icon;
        switch (route.name) {
          case 'index':
            Icon = Home;
            break;
          case 'favorites':
            Icon = Heart;
            break;
          default:
            Icon = ShoppingBag;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            triggerImpact('light');
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
            }}
          >
            <Animated.View
              style={{
                alignItems: 'center',
                transform: [
                  {
                    translateY: withTiming(isFocused ? -5 : 0, { duration: 200 }),
                  },
                ],
              }}
            >
              <Icon
                size={24}
                color={isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                fill={isFocused ? 'hsl(var(--primary))' : 'transparent'}
                fillOpacity={isFocused ? 0.2 : 0}
              />
              <Text className={`text-xs mt-1 ${isFocused ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {label}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}

      {/* Animated indicator */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: -3,
            height: 3,
            backgroundColor: 'hsl(var(--primary))',
            borderRadius: 2,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
}
