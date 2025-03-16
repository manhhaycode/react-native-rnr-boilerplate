import React from 'react';
import { View } from 'react-native';
import { Input } from '@/components/rnr/ui/input';
import { Search, X } from 'lucide-react-native';
import { Button } from '@/components/rnr/ui/button';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const isFocused = useSharedValue(false);

  // Animation for focus state
  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(isFocused.value ? 1.02 : 1, { duration: 200 }),
        },
      ],
      shadowOpacity: withTiming(isFocused.value ? 0.1 : 0, { duration: 200 }),
    };
  });

  React.useEffect(() => {
    onChange(localValue);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
  };

  return (
    <Animated.View
      style={[inputContainerStyle, { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 }]}
      className={className}
    >
      <View className="relative">
        <Input
          value={localValue}
          onChangeText={(text) => setLocalValue(text)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => {
            isFocused.value = true;
          }}
          onBlur={() => {
            isFocused.value = false;
          }}
        />
        {localValue.length > 0 && (
          <Animated.View entering={FadeIn.duration(200)} className="absolute right-2 top-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onPress={handleClear}>
              <X size={16} className="text-muted-foreground" />
            </Button>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}
