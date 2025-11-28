import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreen {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

const ONBOARDING_SCREENS: OnboardingScreen[] = [
  {
    id: '1',
    icon: 'checkbox-outline',
    title: 'Organize Your Tasks',
    description:
      'Create tasks with ease, set priorities from P1 to P4, add due dates, and never forget what matters most.',
    color: theme.colors.primary,
  },
  {
    id: '2',
    icon: 'folder-outline',
    title: 'Stay Organized with Projects',
    description:
      'Group tasks into color-coded projects, mark favorites, and keep everything organized in one place.',
    color: theme.colors.info,
  },
  {
    id: '3',
    icon: 'calendar-outline',
    title: 'Never Miss a Deadline',
    description:
      'View tasks for Today, check Upcoming deadlines in the next 7 days, and stay on top of your schedule.',
    color: theme.colors.success,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index !== null && viewableItems[0]?.index !== undefined) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SCREENS.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleGetStarted = async () => {
    try {
      await completeOnboarding();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const renderItem = ({ item, index }: { item: OnboardingScreen; index: number }) => {
    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
        <Animated.View
          entering={FadeIn.delay(200)}
          style={styles.contentContainer}
        >
          {/* Icon with gradient background */}
          <Animated.View
            entering={SlideInRight.delay(300).springify()}
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${item.color}20`,
                borderColor: `${item.color}40`,
              },
            ]}
          >
            <Ionicons name={item.icon} size={80} color={item.color} />
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeIn.delay(400)}
            style={styles.title}
          >
            {item.title}
          </Animated.Text>

          {/* Description */}
          <Animated.Text
            entering={FadeIn.delay(500)}
            style={styles.description}
          >
            {item.description}
          </Animated.Text>
        </Animated.View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {ONBOARDING_SCREENS.map((_, index) => {
          const dotStyle = useAnimatedStyle(() => {
            const isActive = index === currentIndex;
            return {
              width: withSpring(isActive ? 24 : 8),
              backgroundColor: isActive
                ? theme.colors.primary
                : theme.colors.textTertiary,
            };
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, dotStyle]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding screens */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SCREENS}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
      />

      {/* Footer with pagination and button */}
      <View style={styles.footer}>
        {renderPagination()}

        {currentIndex === ONBOARDING_SCREENS.length - 1 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 17,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});
