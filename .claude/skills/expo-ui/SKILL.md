---
name: expo-ui
description: SwiftUI integration for React Native apps using Expo UI. Use when building iOS apps with SwiftUI components in React Native, creating native iOS interfaces, building Settings-style forms, implementing iOS system UI patterns, using SwiftUI modifiers and effects, or integrating native iOS components like CircularProgress, Switch, or Picker.
---

# Expo UI with SwiftUI

Expo UI brings native SwiftUI components directly into React Native, providing a 1-to-1 mapping from SwiftUI to JavaScript. This enables native iOS UI patterns without re-implementation.

## Quick Start

Install Expo UI in your project:
```bash
npx expo install @expo/ui
```

Import SwiftUI components:
```javascript
import { Host, Text, Button, HStack, VStack } from '@expo/ui/swift-ui';
import { padding, background, clipShape } from '@expo/ui/swift-ui/modifiers';
```

## Core Concept: The Host Component

The Host component is the bridge between React Native (UIKit) and SwiftUI. It acts like `<svg>` in DOM or `<Canvas>` in react-native-skia. **Always wrap SwiftUI components in Host**.

```javascript
import { Host, CircularProgress } from '@expo/ui/swift-ui';

export default function LoadingView() {
  return (
    <Host matchContents>
      <CircularProgress />
    </Host>
  );
}
```

Host props:
- `matchContents`: Sizes Host to fit its SwiftUI content
- `style`: Apply React Native flexbox styles to Host container

## Layout Components

Use HStack and VStack for SwiftUI layouts (flexbox is not available inside Host):

```javascript
<Host style={{ flex: 1, padding: 20 }}>
  <VStack spacing={16}>
    <HStack spacing={8}>
      <Text>Label</Text>
      <Spacer />
      <Switch value={isOn} onValueChange={setIsOn} />
    </HStack>
    <Divider />
    <Button onPress={handlePress}>
      <Text>Tap Me</Text>
    </Button>
  </VStack>
</Host>
```

## Common Components Reference

See [references/api_reference.md](references/api_reference.md) for complete component API.
See [references/patterns.md](references/patterns.md) for common implementation patterns.

Essential components:
- `Text`: SwiftUI text with size and color props
- `Image`: System icons via `systemName` prop
- `Button`, `Switch`, `Slider`, `Picker`: Interactive controls
- `Form`, `Section`: iOS Settings-style layouts
- `CircularProgress`, `LinearProgress`: Loading indicators
- `HStack`, `VStack`, `ZStack`, `Spacer`: Layout primitives

## Modifiers

Apply SwiftUI modifiers through the `modifiers` prop array:

```javascript
import { padding, background, clipShape, frame, glassEffect } from '@expo/ui/swift-ui/modifiers';

<Text 
  modifiers={[
    padding({ all: 16 }),
    background('#007aff'),
    clipShape('roundedRectangle')
  ]}
>
  Styled Text
</Text>
```

## Implementation Patterns

### iOS Settings Form
```javascript
<Host style={{ flex: 1 }}>
  <Form>
    <Section header="General">
      <HStack>
        <Image systemName="wifi" />
        <Text>Wi-Fi</Text>
        <Spacer />
        <Text color="secondary">Connected</Text>
        <Image systemName="chevron.right" size={14} />
      </HStack>
    </Section>
  </Form>
</Host>
```

### Glass Effect with Mesh Gradient
Requires iOS 18+ and expo-mesh-gradient:
```javascript
import { MeshGradientView } from 'expo-mesh-gradient';

<View style={{ flex: 1 }}>
  <MeshGradientView style={{ flex: 1 }} {...gradientProps} />
  <Host style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
    <Text modifiers={[padding({ all: 16 }), glassEffect({ glass: { variant: 'clear' } })]}>
      Glass Text
    </Text>
  </Host>
</View>
```

### React Native Interop
You can place React Native components as children of SwiftUI components:
```javascript
<Host>
  <VStack>
    <Text>SwiftUI Text</Text>
    {/* React Native component automatically wrapped in UIViewRepresentable */}
    <View><Text>React Native Text</Text></View>
    {/* Need another Host to re-enter SwiftUI context */}
    <Host matchContents>
      <Button><Text>Back to SwiftUI</Text></Button>
    </Host>
  </VStack>
</Host>
```

## Critical Rules

1. **Always use Host** - SwiftUI components must be wrapped in Host
2. **No flexbox in SwiftUI** - Use HStack/VStack instead
3. **iOS-only currently** - Android/Web support coming later
4. **Keep boundaries clear** - Minimize React Native ↔ SwiftUI transitions
5. **Check modifier compatibility** - Some modifiers require specific iOS versions

## Common Issues

**Components not rendering**: Ensure they're wrapped in Host
**Layout issues**: Remember flexbox only works on Host, not inside it
**Modifier not working**: Check iOS version requirements
**Performance**: Minimize nested Host components
