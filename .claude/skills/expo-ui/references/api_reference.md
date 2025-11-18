# Expo UI API Reference

Complete API documentation for Expo UI SwiftUI components.

## Core Container

### Host
The bridge component between React Native and SwiftUI.
```javascript
<Host 
  style={ViewStyle}        // React Native styles (flexbox works here)
  matchContents={boolean}  // Size to fit SwiftUI content
>
  {children}
</Host>
```

## Layout Components

### HStack
Horizontal stack for arranging views side by side.
```javascript
<HStack 
  spacing={number}         // Space between children (default: 8)
  alignment="top|center|bottom|firstTextBaseline|lastTextBaseline"
>
  {children}
</HStack>
```

### VStack
Vertical stack for arranging views top to bottom.
```javascript
<VStack 
  spacing={number}         // Space between children (default: 8)
  alignment="leading|center|trailing"
>
  {children}
</VStack>
```

### ZStack
Depth stack for overlaying views.
```javascript
<ZStack alignment="center|leading|trailing|top|bottom|topLeading|topTrailing|bottomLeading|bottomTrailing">
  {children}
</ZStack>
```

### Spacer
Flexible space that expands to push other views apart.
```javascript
<Spacer />
```

### Divider
Visual separator line.
```javascript
<Divider />
```

## Text & Typography

### Text
Display text with SwiftUI styling.
```javascript
<Text 
  size={number}            // Font size (default: system)
  color={string}           // "primary", "secondary", or hex color
  weight="ultraLight|thin|light|regular|medium|semibold|bold|heavy|black"
  italic={boolean}
  monospaced={boolean}
  modifiers={Array}        // Array of modifier functions
>
  {string}
</Text>
```

## Images & Icons

### Image
Display system icons or images.
```javascript
<Image 
  systemName={string}      // SF Symbol name (e.g., "wifi", "chevron.right")
  size={number}            // Icon size
  color={string}           // Tint color
  modifiers={Array}
/>
```

## Form Components

### Form
Container for form sections (iOS Settings style).
```javascript
<Form>
  {children}  // Should contain Section components
</Form>
```

### Section
Group related form items.
```javascript
<Section 
  header={string}          // Section header text
  footer={string}          // Section footer text
>
  {children}
</Section>
```

## Interactive Controls

### Button
Tappable button control.
```javascript
<Button 
  onPress={() => void}
  disabled={boolean}
>
  {children}  // Button content (usually Text or HStack)
</Button>
```

### Switch
Toggle switch control.
```javascript
<Switch 
  value={boolean}
  onValueChange={(value: boolean) => void}
  disabled={boolean}
/>
```

### Slider
Value slider control.
```javascript
<Slider 
  value={number}           // Current value (0-1)
  onValueChange={(value: number) => void}
  minimumValue={number}    // Default: 0
  maximumValue={number}    // Default: 1
  step={number}            // Increment size
/>
```

### Picker
Selection picker control.
```javascript
<Picker 
  selection={string|number}  // Currently selected value
  onSelectionChange={(value) => void}
>
  <PickerItem label="Label 1" value="value1" />
  <PickerItem label="Label 2" value="value2" />
</Picker>
```

## Progress Indicators

### CircularProgress
Circular loading indicator.
```javascript
<CircularProgress 
  value={number}           // Progress (0-1), undefined for indeterminate
  color={string}           // Tint color
/>
```

### LinearProgress
Linear progress bar.
```javascript
<LinearProgress 
  progress={number}        // Progress value (0-1)
  color={string}           // Bar color
/>
```

## Modifiers

Import from `@expo/ui/swift-ui/modifiers`:

### padding
```javascript
padding({ 
  all?: number,
  horizontal?: number,
  vertical?: number,
  top?: number,
  bottom?: number,
  leading?: number,
  trailing?: number
})
```

### frame
```javascript
frame({ 
  width?: number,
  height?: number,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number
})
```

### background
```javascript
background(color: string)  // Hex color or system color
```

### clipShape
```javascript
clipShape('circle' | 'roundedRectangle' | 'capsule')
```

### foregroundColor
```javascript
foregroundColor(color: string)
```

### opacity
```javascript
opacity(value: number)  // 0-1
```

### scaleEffect
```javascript
scaleEffect(scale: number | { x: number, y: number })
```

### rotationEffect
```javascript
rotationEffect(degrees: number)
```

### shadow
```javascript
shadow({ 
  color?: string,
  radius?: number,
  x?: number,
  y?: number
})
```

### glassEffect (iOS 18+)
```javascript
glassEffect({ 
  glass: { 
    variant: 'clear' | 'light' | 'dark' | 'extraLight' | 'extraDark'
  }
})
```

## Common Patterns

### Combining Multiple Modifiers
```javascript
<Text modifiers={[
  padding({ all: 12 }),
  background('#007aff'),
  clipShape('roundedRectangle'),
  shadow({ radius: 4, y: 2 })
]}>
  Styled Text
</Text>
```

### Navigation Row
```javascript
<HStack spacing={12}>
  <Image systemName="gear" size={20} color="#007aff" />
  <Text>Settings</Text>
  <Spacer />
  <Image systemName="chevron.right" size={14} color="secondary" />
</HStack>
```

### Toggle Row
```javascript
<HStack>
  <Text>Enable Feature</Text>
  <Spacer />
  <Switch value={enabled} onValueChange={setEnabled} />
</HStack>
```
