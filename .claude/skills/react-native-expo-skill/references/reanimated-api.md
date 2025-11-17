# Reanimated API Reference

Complete reference for react-native-reanimated v3+ hooks, utilities, and animation patterns.

## Core Hooks

### useSharedValue

Create a shared value that persists across re-renders and can be accessed from worklets.

```tsx
import { useSharedValue } from 'react-native-reanimated';

const offset = useSharedValue(0);
const isActive = useSharedValue(false);

// Update value
offset.value = 100;
offset.value += 50;
```

### useAnimatedStyle

Create animated styles that respond to shared value changes.

```tsx
import { useAnimatedStyle } from 'react-native-reanimated';

const animatedStyles = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: offset.value }],
    opacity: isActive.value ? 1 : 0.5,
  };
});

<Animated.View style={animatedStyles} />
```

### useAnimatedProps

Animate props of non-style properties.

```tsx
import { useAnimatedProps } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const animatedProps = useAnimatedProps(() => {
  return {
    text: progress.value.toFixed(2),
  };
});

<AnimatedTextInput animatedProps={animatedProps} />
```

### useDerivedValue

Derive a value from other shared values.

```tsx
import { useDerivedValue } from 'react-native-reanimated';

const progress = useSharedValue(0);

const progressText = useDerivedValue(() => {
  return `${Math.round(progress.value * 100)}%`;
});
```

### useAnimatedReaction

Run side effects when shared values change.

```tsx
import { useAnimatedReaction } from 'react-native-reanimated';

useAnimatedReaction(
  () => position.value,
  (current, previous) => {
    if (current > 100 && previous <= 100) {
      runOnJS(handleThresholdCrossed)();
    }
  }
);
```

### useAnimatedScrollHandler

Handle scroll events with worklets.

```tsx
import { useAnimatedScrollHandler } from 'react-native-reanimated';

const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
  onBeginDrag: (event) => {
    isDragging.value = true;
  },
  onEndDrag: (event) => {
    isDragging.value = false;
  },
});

<Animated.ScrollView onScroll={scrollHandler} />
```

## Animation Functions

### withTiming

Animate to a value over time with easing.

```tsx
import { withTiming, Easing } from 'react-native-reanimated';

// Basic usage
offset.value = withTiming(100);

// With configuration
offset.value = withTiming(100, {
  duration: 500,
  easing: Easing.inOut(Easing.quad),
});

// With callback
offset.value = withTiming(100, { duration: 300 }, (finished) => {
  if (finished) {
    runOnJS(onAnimationComplete)();
  }
});
```

### withSpring

Animate with spring physics.

```tsx
import { withSpring } from 'react-native-reanimated';

// Basic usage
scale.value = withSpring(1.2);

// With configuration
scale.value = withSpring(1.2, {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
});

// With callback
scale.value = withSpring(1, {}, (finished) => {
  if (finished) {
    runOnJS(onBounceComplete)();
  }
});
```

### withDelay

Delay an animation.

```tsx
import { withDelay, withSpring } from 'react-native-reanimated';

opacity.value = withDelay(500, withSpring(1));
```

### withSequence

Chain multiple animations in sequence.

```tsx
import { withSequence, withTiming } from 'react-native-reanimated';

scale.value = withSequence(
  withTiming(1.2, { duration: 200 }),
  withTiming(1, { duration: 200 })
);
```

### withRepeat

Repeat an animation.

```tsx
import { withRepeat, withTiming } from 'react-native-reanimated';

// Repeat forever
rotation.value = withRepeat(
  withTiming(360, { duration: 1000 }),
  -1, // -1 = infinite
  true  // reverse on each iteration
);

// Repeat 3 times
offset.value = withRepeat(
  withTiming(100, { duration: 500 }),
  3,
  true
);
```

### withDecay

Animate with decay physics (momentum).

```tsx
import { withDecay } from 'react-native-reanimated';

offset.value = withDecay({
  velocity: gestureVelocity,
  clamp: [0, maxOffset],
  deceleration: 0.998,
  rubberBandEffect: true,
  rubberBandFactor: 0.6,
});
```

## Worklets

### Basic Worklet

Functions marked with 'worklet' run on UI thread.

```tsx
const calculateOffset = (input: number) => {
  'worklet';
  return input * 2 + 10;
};

const animatedStyles = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: calculateOffset(offset.value) }],
  };
});
```

### runOnUI

Execute a function on UI thread.

```tsx
import { runOnUI } from 'react-native-reanimated';

const updatePosition = (x: number) => {
  'worklet';
  position.value = withSpring(x);
};

// Call from JS thread
const handlePress = () => {
  runOnUI(updatePosition)(100);
};
```

### runOnJS

Execute a function on JS thread from worklet.

```tsx
import { runOnJS } from 'react-native-reanimated';

const logToConsole = (message: string) => {
  console.log(message);
};

const animatedStyles = useAnimatedStyle(() => {
  if (offset.value > 100) {
    runOnJS(logToConsole)('Threshold exceeded');
  }
  return { transform: [{ translateX: offset.value }] };
});
```

## Gestures (with react-native-gesture-handler)

### Pan Gesture

```tsx
import { Gesture } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onStart(() => {
    startX.value = offset.value;
  })
  .onChange((event) => {
    offset.value = startX.value + event.translationX;
  })
  .onEnd((event) => {
    offset.value = withDecay({
      velocity: event.velocityX,
      clamp: [0, maxOffset],
    });
  });
```

### Tap Gesture

```tsx
const tapGesture = Gesture.Tap()
  .numberOfTaps(1)
  .onStart(() => {
    scale.value = withSpring(0.95);
  })
  .onEnd(() => {
    scale.value = withSpring(1);
    runOnJS(handleTap)();
  });
```

### Long Press Gesture

```tsx
const longPressGesture = Gesture.LongPress()
  .minDuration(500)
  .onStart(() => {
    runOnJS(onLongPress)();
  })
  .onEnd(() => {
    scale.value = withSpring(1);
  });
```

### Pinch Gesture

```tsx
const pinchGesture = Gesture.Pinch()
  .onStart(() => {
    startScale.value = scale.value;
  })
  .onChange((event) => {
    scale.value = startScale.value * event.scale;
  })
  .onEnd(() => {
    scale.value = withSpring(1);
  });
```

### Rotation Gesture

```tsx
const rotationGesture = Gesture.Rotation()
  .onStart(() => {
    startRotation.value = rotation.value;
  })
  .onChange((event) => {
    rotation.value = startRotation.value + event.rotation;
  })
  .onEnd(() => {
    rotation.value = withSpring(0);
  });
```

### Composing Gestures

```tsx
// Simultaneous gestures
const composed = Gesture.Simultaneous(panGesture, pinchGesture);

// Exclusive gestures (only one active)
const exclusive = Gesture.Exclusive(tapGesture, longPressGesture);

// Race (first to activate wins)
const race = Gesture.Race(swipeGesture, panGesture);
```

## Layout Animations

### Entering Animations

```tsx
import { FadeIn, SlideInLeft, ZoomIn } from 'react-native-reanimated';

<Animated.View entering={FadeIn}>
  {/* content */}
</Animated.View>

<Animated.View entering={SlideInLeft.duration(500).springify()}>
  {/* content */}
</Animated.View>

<Animated.View entering={ZoomIn.delay(200)}>
  {/* content */}
</Animated.View>
```

Available entering animations:
- `FadeIn`, `FadeInDown`, `FadeInUp`, `FadeInLeft`, `FadeInRight`
- `SlideInDown`, `SlideInUp`, `SlideInLeft`, `SlideInRight`
- `ZoomIn`, `ZoomInDown`, `ZoomInUp`, `ZoomInLeft`, `ZoomInRight`
- `BounceIn`, `BounceInDown`, `BounceInUp`, `BounceInLeft`, `BounceInRight`
- `FlipInEasyX`, `FlipInEasyY`, `FlipInXDown`, `FlipInYLeft`

### Exiting Animations

```tsx
import { FadeOut, SlideOutRight } from 'react-native-reanimated';

<Animated.View exiting={FadeOut}>
  {/* content */}
</Animated.View>

<Animated.View exiting={SlideOutRight.duration(300)}>
  {/* content */}
</Animated.View>
```

Available exiting animations:
- `FadeOut`, `FadeOutDown`, `FadeOutUp`, `FadeOutLeft`, `FadeOutRight`
- `SlideOutDown`, `SlideOutUp`, `SlideOutLeft`, `SlideOutRight`
- `ZoomOut`, `ZoomOutDown`, `ZoomOutUp`, `ZoomOutLeft`, `ZoomOutRight`
- `BounceOut`, `BounceOutDown`, `BounceOutUp`, `BounceOutLeft`, `BounceOutRight`
- `FlipOutEasyX`, `FlipOutEasyY`, `FlipOutXDown`, `FlipOutYLeft`

### Layout Transitions

```tsx
import { Layout } from 'react-native-reanimated';

<Animated.View layout={Layout.springify()}>
  {/* content changes size/position */}
</Animated.View>

<Animated.View layout={Layout.duration(500).delay(100)}>
  {/* content */}
</Animated.View>
```

## Easing Functions

```tsx
import { Easing } from 'react-native-reanimated';

// Predefined easings
Easing.linear
Easing.ease
Easing.quad
Easing.cubic
Easing.sin
Easing.circle
Easing.exp

// Directional easings
Easing.in(Easing.quad)
Easing.out(Easing.quad)
Easing.inOut(Easing.quad)

// Bezier curve
Easing.bezier(0.25, 0.1, 0.25, 1)

// Steps
Easing.steps(5)

// Bounce
Easing.bounce

// Elastic
Easing.elastic(1)

// Back
Easing.back(1.5)
```

## Common Patterns

### Fade In/Out Toggle

```tsx
const opacity = useSharedValue(0);

const fadeIn = () => {
  opacity.value = withTiming(1, { duration: 300 });
};

const fadeOut = () => {
  opacity.value = withTiming(0, { duration: 300 });
};

const animatedStyles = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));
```

### Scale Button Press

```tsx
const scale = useSharedValue(1);

const pressIn = () => {
  scale.value = withSpring(0.95);
};

const pressOut = () => {
  scale.value = withSpring(1);
};

const animatedStyles = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

### Scroll-based Animation

```tsx
const scrollY = useSharedValue(0);

const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});

const headerStyle = useAnimatedStyle(() => {
  const opacity = interpolate(
    scrollY.value,
    [0, 100],
    [1, 0],
    Extrapolate.CLAMP
  );
  
  return { opacity };
});
```

### Parallax Effect

```tsx
const scrollY = useSharedValue(0);

const parallaxStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateY: scrollY.value * 0.5 },
    ],
  };
});
```

### Drag and Snap

```tsx
const position = useSharedValue(0);

const panGesture = Gesture.Pan()
  .onChange((event) => {
    position.value += event.changeX;
  })
  .onEnd(() => {
    const snapPoints = [0, 100, 200, 300];
    const nearest = snapPoints.reduce((prev, curr) => 
      Math.abs(curr - position.value) < Math.abs(prev - position.value) 
        ? curr 
        : prev
    );
    position.value = withSpring(nearest);
  });
```

## Interpolation

```tsx
import { interpolate, Extrapolate } from 'react-native-reanimated';

const animatedStyles = useAnimatedStyle(() => {
  // Basic interpolation
  const opacity = interpolate(
    progress.value,
    [0, 1],
    [0, 1]
  );
  
  // With extrapolation
  const scale = interpolate(
    progress.value,
    [0, 0.5, 1],
    [1, 1.5, 1],
    Extrapolate.CLAMP // or EXTEND, IDENTITY
  );
  
  return { opacity, transform: [{ scale }] };
});
```

## Performance Tips

1. **Use worklets** - Keep complex calculations on UI thread
2. **Avoid runOnJS** - Minimize JS thread communication
3. **Use useDerivedValue** - Derive values instead of recalculating
4. **Memoize worklets** - Use useCallback for worklet functions
5. **Batch updates** - Update multiple shared values together
6. **Cancel animations** - Clean up on unmount with cancelAnimation()

## Debugging

```tsx
import { makeMutable } from 'react-native-reanimated';

// Log from worklet
const animatedStyles = useAnimatedStyle(() => {
  console.log('Offset:', offset.value); // Works in worklets
  return { transform: [{ translateX: offset.value }] };
});

// Cancel animation
import { cancelAnimation } from 'react-native-reanimated';

useEffect(() => {
  return () => {
    cancelAnimation(offset);
  };
}, []);
```
