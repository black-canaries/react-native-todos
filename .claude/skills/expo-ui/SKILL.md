---
name: expo-ui
description: Enables native SwiftUI component integration in React Native via Expo UI's JavaScript API. Use when building iOS-native interfaces (Settings forms, system UI patterns, glass effects) without reimplementation overhead.
---

<objective>
Enable native SwiftUI components in React Native applications through Expo UI, providing a 1-to-1 mapping from SwiftUI to JavaScript. Build authentic iOS interfaces with native performance and system-level UI patterns without reimplementation.
</objective>

<quick_start>
<installation>
Install Expo UI in your project:
```bash
npx expo install @expo/ui
```
</installation>

<basic_usage>
Import SwiftUI components and create your first native UI:

```javascript
import { Host, Text, Button, HStack, VStack } from '@expo/ui/swift-ui';
import { padding, background, clipShape } from '@expo/ui/swift-ui/modifiers';

export default function MyComponent() {
  return (
    <Host matchContents>
      <VStack spacing={16}>
        <Text>Hello from SwiftUI</Text>
        <Button onPress={() => console.log('Pressed')}>
          <Text>Tap Me</Text>
        </Button>
      </VStack>
    </Host>
  );
}
```

**Key imports:**
- Components: `Host`, `Text`, `Button`, `HStack`, `VStack`, `Image`, `Switch`, `Form`, `Section`
- Modifiers: `padding`, `background`, `clipShape`, `frame`, `glassEffect`
</basic_usage>

<host_component_concept>
**The Host Component** creates a SwiftUI rendering context that bridges React Native's UIKit layer. All SwiftUI components MUST be wrapped in `<Host>` to render.

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

**Host props:**
- `matchContents` - Auto-sizes Host to fit SwiftUI content
- `style` - Apply React Native flexbox to Host container
</host_component_concept>
</quick_start>

<workflow>
**Typical implementation flow:**

1. **Install** - `npx expo install @expo/ui`
2. **Import components** - Import from `@expo/ui/swift-ui` (components) and `@expo/ui/swift-ui/modifiers` (styling)
3. **Wrap in Host** - Create `<Host>` wrapper with `matchContents` or flexbox `style`
4. **Build UI** - Use `VStack`/`HStack` for layout, add Text/Button/Form components
5. **Apply modifiers** - Add styling via `modifiers` prop array (padding, background, clipShape)
6. **Test iOS version** - Verify advanced features (glassEffect requires iOS 18+)

**Key decision points:**
- Use `matchContents` when Host should size to content
- Use `style={{ flex: 1 }}` when Host should fill parent
- Minimize Host nesting for better performance
- Check iOS version requirements for modifiers
</workflow>

<layout_system>
<swiftui_layouts>
Inside `<Host>`, use SwiftUI layout components. **Flexbox is NOT available inside Host.**

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

**Layout components:**
- `HStack` - Horizontal stack (like flexbox row)
- `VStack` - Vertical stack (like flexbox column)
- `ZStack` - Overlapping layers (like absolute positioning)
- `Spacer` - Flexible space (like flex: 1)
- `Divider` - Horizontal or vertical line separator
</swiftui_layouts>

<react_native_style_boundary>
**Important boundary:** React Native styles (flexbox) only work on the Host container, NOT on SwiftUI components inside it.

```javascript
// ✅ Correct: Flexbox on Host
<Host style={{ flex: 1, justifyContent: 'center' }}>
  <VStack spacing={8}>
    <Text>Centered content</Text>
  </VStack>
</Host>

// ❌ Wrong: Flexbox doesn't work inside Host
<Host>
  <View style={{ flex: 1 }}>  {/* This won't work as expected */}
    <Text>Content</Text>
  </View>
</Host>
```
</react_native_style_boundary>
</layout_system>

<essential_components>
<text_and_images>
```javascript
<Text size="title">Large Title</Text>
<Text size="body" color="secondary">Body text</Text>

<Image systemName="wifi" size={20} color="#007aff" />
<Image systemName="heart.fill" size={24} />
```

**Text sizes:** `largeTitle`, `title`, `title2`, `title3`, `headline`, `body`, `callout`, `subheadline`, `footnote`, `caption`, `caption2`

**Colors:** Hex codes or semantic values (`"primary"`, `"secondary"`, `"label"`, `"systemBackground"`)
</text_and_images>

<interactive_controls>
```javascript
<Button onPress={handlePress}>
  <Text>Tap Me</Text>
</Button>

<Switch value={isEnabled} onValueChange={setIsEnabled} />

<Slider value={volume} onValueChange={setVolume} minimumValue={0} maximumValue={100} />

<Picker selection={selected} onSelectionChange={setSelected}>
  <PickerItem label="Option 1" value="opt1" />
  <PickerItem label="Option 2" value="opt2" />
</Picker>
```
</interactive_controls>

<progress_indicators>
```javascript
<CircularProgress />  {/* Indeterminate */}
<CircularProgress value={0.75} />  {/* Determinate */}
<LinearProgress value={progress} />
```
</progress_indicators>

<forms_and_sections>
iOS Settings-style forms:

```javascript
<Host style={{ flex: 1 }}>
  <Form>
    <Section header="General">
      <HStack spacing={12}>
        <Image systemName="wifi" size={20} color="#007aff" />
        <Text>Wi-Fi</Text>
        <Spacer />
        <Text color="secondary">Connected</Text>
        <Image systemName="chevron.right" size={14} color="secondary" />
      </HStack>
    </Section>

    <Section header="Privacy">
      <HStack>
        <Text>Location Services</Text>
        <Spacer />
        <Switch value={locationOn} onValueChange={setLocationOn} />
      </HStack>
    </Section>
  </Form>
</Host>
```
</forms_and_sections>
</essential_components>

<modifiers>
<basic_modifiers>
Apply SwiftUI modifiers through the `modifiers` prop array:

```javascript
import { padding, background, clipShape, frame } from '@expo/ui/swift-ui/modifiers';

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

**Common modifiers:**
- `padding({ all: 16 })` or `padding({ horizontal: 12, vertical: 8 })`
- `background('#color')` - Background color
- `clipShape('roundedRectangle')` or `clipShape('circle')`
- `frame({ width: 100, height: 50 })` - Fixed dimensions
</basic_modifiers>

<glass_effect>
Glass effect modifier (requires iOS 18+):

```javascript
import { glassEffect } from '@expo/ui/swift-ui/modifiers';
import { MeshGradientView } from 'expo-mesh-gradient';

<View style={{ flex: 1 }}>
  {/* Background gradient */}
  <MeshGradientView style={{ flex: 1 }} {...gradientProps} />

  {/* Glass effect overlay */}
  <Host style={{ position: 'absolute', inset: 0 }}>
    <VStack modifiers={[
      padding({ all: 24 }),
      glassEffect({ glass: { variant: 'clear' } })
    ]}>
      <Text size="title">Glass Text</Text>
      <Text>With blur background</Text>
    </VStack>
  </Host>
</View>
```

**Glass variants:** `'clear'`, `'regular'`, `'prominent'`, `'ultraThin'`
</glass_effect>
</modifiers>

<interop_patterns>
<react_native_children>
You can place React Native components as children of SwiftUI components:

```javascript
<Host>
  <VStack spacing={12}>
    <Text>SwiftUI Text</Text>

    {/* React Native component - automatically wrapped */}
    <View style={{ padding: 10 }}>
      <Text>React Native Text</Text>
    </View>

    {/* Re-enter SwiftUI context with nested Host */}
    <Host matchContents>
      <Button onPress={() => {}}>
        <Text>Back to SwiftUI</Text>
      </Button>
    </Host>
  </VStack>
</Host>
```

**How it works:**
- React Native components are automatically wrapped in `UIViewRepresentable`
- Use nested `<Host>` to re-enter SwiftUI rendering context
- Minimize transitions for better performance
</react_native_children>

<conditional_rendering>
```javascript
<Host style={{ flex: 1 }}>
  <VStack spacing={16}>
    {isLoading ? (
      <CircularProgress />
    ) : (
      <Text>Content loaded</Text>
    )}

    {items.map((item) => (
      <Host key={item.id} matchContents>
        <HStack spacing={8}>
          <Image systemName={item.icon} />
          <Text>{item.label}</Text>
        </HStack>
      </Host>
    ))}
  </VStack>
</Host>
```
</conditional_rendering>
</interop_patterns>

<common_patterns>
<settings_screen>
iOS Settings-style screen:

```javascript
<Host style={{ flex: 1 }}>
  <Form>
    <Section header="Account">
      <HStack>
        <Image systemName="person.circle.fill" size={32} />
        <VStack spacing={2}>
          <Text size="body">John Doe</Text>
          <Text size="caption" color="secondary">john@example.com</Text>
        </VStack>
        <Spacer />
        <Image systemName="chevron.right" size={14} />
      </HStack>
    </Section>

    <Section header="Preferences">
      <HStack>
        <Text>Notifications</Text>
        <Spacer />
        <Switch value={notificationsOn} onValueChange={setNotificationsOn} />
      </HStack>

      <Divider />

      <HStack>
        <Text>Dark Mode</Text>
        <Spacer />
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </HStack>
    </Section>
  </Form>
</Host>
```
</settings_screen>

<card_layout>
Card-style layout:

```javascript
<Host matchContents>
  <VStack
    spacing={12}
    modifiers={[
      padding({ all: 16 }),
      background('#ffffff'),
      clipShape('roundedRectangle'),
      shadow({ radius: 8, x: 0, y: 4 })
    ]}
  >
    <Text size="headline">Card Title</Text>
    <Text size="body" color="secondary">
      Card content goes here
    </Text>
    <Button onPress={handleAction}>
      <Text>Action</Text>
    </Button>
  </VStack>
</Host>
```
</card_layout>

<loading_overlay>
Loading overlay with glass effect:

```javascript
{isLoading && (
  <Host style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }}>
    <ZStack>
      <VStack
        modifiers={[
          glassEffect({ glass: { variant: 'prominent' } })
        ]}
      >
        <CircularProgress />
        <Text>Loading...</Text>
      </VStack>
    </ZStack>
  </Host>
)}
```
</loading_overlay>
</common_patterns>

<critical_rules>
1. **Always use Host** - SwiftUI components MUST be wrapped in `<Host>` (❌ `<Text>Hello</Text>` won't render)
2. **No flexbox in SwiftUI** - Use `HStack`/`VStack`/`ZStack`, not `<View style={{ flexDirection: 'row' }}>`
3. **iOS-only currently** - Android and Web support planned but not available yet
4. **Clear boundaries** - Minimize React Native ↔ SwiftUI transitions for performance
5. **Check iOS versions** - Some modifiers (like `glassEffect`) require iOS 18+
6. **One Host per tree** - Don't nest Host unnecessarily (performance overhead)

**Correct pattern:**
```javascript
<Host style={{ flex: 1 }}>
  <VStack spacing={8}>
    <Text>Item 1</Text>
    <Text>Item 2</Text>
  </VStack>
</Host>
```
</critical_rules>

<troubleshooting>
**Components not rendering:**
- Ensure all SwiftUI components are wrapped in `<Host>`
- Check that `@expo/ui` is properly installed

**Layout issues:**
- Remember flexbox only works on Host container, not inside it
- Use `HStack`/`VStack` for SwiftUI layouts
- Check `matchContents` prop if Host isn't sizing correctly

**Modifier not working:**
- Verify iOS version requirements (e.g., `glassEffect` needs iOS 18+)
- Check modifier import path is correct
- Ensure modifier is in `modifiers` array, not as direct prop

**Performance issues:**
- Minimize nested `<Host>` components
- Reduce React Native ↔ SwiftUI transitions
- Use `React.memo()` for frequently re-rendering components
</troubleshooting>

<success_criteria>
You've successfully implemented Expo UI when:

- ✅ SwiftUI components render correctly within Host
- ✅ Layouts use HStack/VStack instead of flexbox inside Host
- ✅ iOS system UI patterns (Forms, Sections) match native appearance
- ✅ Modifiers apply correctly to components
- ✅ React Native and SwiftUI interop works smoothly
- ✅ Performance is smooth with minimal Host nesting
- ✅ SF Symbols icons display correctly via systemName
</success_criteria>

<reference_documentation>
**Detailed guides:**
- [API Reference](references/api_reference.md) - Complete component and modifier API
- [Common Patterns](references/patterns.md) - Implementation patterns and recipes

**Official documentation:**
- Expo UI: https://docs.expo.dev/ui/
- SwiftUI: https://developer.apple.com/documentation/swiftui
- SF Symbols: https://developer.apple.com/sf-symbols/
</reference_documentation>
