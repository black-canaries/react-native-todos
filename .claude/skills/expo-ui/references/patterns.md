# Expo UI Common Patterns

Reusable patterns and solutions for common Expo UI implementation challenges.

## State Management with SwiftUI Components

### Two-way Data Binding
SwiftUI components use controlled component patterns:
```javascript
const [value, setValue] = useState(initialValue);

<Switch 
  value={value}                    // Current state
  onValueChange={setValue}         // Update handler
/>
```

### Form State Management
```javascript
const [formData, setFormData] = useState({
  notifications: true,
  darkMode: false,
  volume: 0.5,
});

const updateField = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

<Switch 
  value={formData.notifications}
  onValueChange={(val) => updateField('notifications', val)}
/>
```

## Navigation Integration

### With Expo Router
```javascript
import { Link } from 'expo-router';

<Link href="/settings" asChild>
  <Button>
    <HStack>
      <Text>Settings</Text>
      <Spacer />
      <Image systemName="chevron.right" size={14} />
    </HStack>
  </Button>
</Link>
```

### With React Navigation
```javascript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

<Button onPress={() => navigation.navigate('Settings')}>
  <HStack>
    <Text>Settings</Text>
    <Spacer />
    <Image systemName="chevron.right" size={14} />
  </HStack>
</Button>
```

## Dynamic Lists

### Rendering Lists in SwiftUI
```javascript
const items = ['Item 1', 'Item 2', 'Item 3'];

<Host style={{ flex: 1 }}>
  <VStack spacing={0}>
    {items.map((item, index) => (
      <React.Fragment key={item}>
        <Button onPress={() => handleSelect(item)}>
          <HStack>
            <Text>{item}</Text>
            <Spacer />
            <Image systemName="chevron.right" size={14} />
          </HStack>
        </Button>
        {index < items.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </VStack>
</Host>
```

## Conditional Rendering

### Within SwiftUI Context
```javascript
<Host>
  <VStack>
    {isLoading ? (
      <CircularProgress />
    ) : (
      <Text>Content Loaded</Text>
    )}
    
    {showDetails && (
      <Text size={12} color="secondary">
        Additional details here
      </Text>
    )}
  </VStack>
</Host>
```

## Animation Patterns

### Animated Values
Use React Native's Animated API on the Host container:
```javascript
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{ opacity: fadeAnim }}>
  <Host matchContents>
    <Text>Fading In</Text>
  </Host>
</Animated.View>
```

## Theming

### Color Schemes
```javascript
const colors = {
  primary: '#007aff',
  success: '#34c759',
  warning: '#ff9500',
  danger: '#ff3b30',
  secondary: '#8e8e93',
};

<Image 
  systemName="bell"
  color="white"
  modifiers={[
    background(colors.danger),
    clipShape('roundedRectangle')
  ]}
/>
```

### Dark Mode Support
```javascript
import { useColorScheme } from 'react-native';

const scheme = useColorScheme();
const textColor = scheme === 'dark' ? '#ffffff' : '#000000';

<Host>
  <Text color={textColor}>Adaptive Text</Text>
</Host>
```

## Accessibility

### Adding Labels
```javascript
<Button 
  onPress={handlePress}
  accessibilityLabel="Open settings"
  accessibilityHint="Double tap to open the settings screen"
>
  <Image systemName="gear" />
</Button>
```

## Performance Optimization

### Minimize Host Nesting
```javascript
// ❌ Avoid unnecessary nesting
<Host>
  <VStack>
    <Host>
      <Text>Text 1</Text>
    </Host>
    <Host>
      <Text>Text 2</Text>
    </Host>
  </VStack>
</Host>

// ✅ Better - single Host
<Host>
  <VStack>
    <Text>Text 1</Text>
    <Text>Text 2</Text>
  </VStack>
</Host>
```

### Memoization for Complex Components
```javascript
const ExpensiveComponent = React.memo(({ data }) => (
  <Host>
    <VStack>
      {data.map(item => (
        <Text key={item.id}>{item.label}</Text>
      ))}
    </VStack>
  </Host>
));
```

## Error Boundaries

### Handling SwiftUI Component Errors
```javascript
class SwiftUIErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Failed to render SwiftUI component</Text>
        </View>
      );
    }
    
    return this.props.children;
  }
}

// Usage
<SwiftUIErrorBoundary>
  <Host>
    <YourSwiftUIComponents />
  </Host>
</SwiftUIErrorBoundary>
```

## Testing Patterns

### Component Testing
```javascript
import { render } from '@testing-library/react-native';

test('renders settings button', () => {
  const { getByText } = render(
    <Host>
      <Button>
        <Text>Settings</Text>
      </Button>
    </Host>
  );
  
  expect(getByText('Settings')).toBeTruthy();
});
```

## Migration Patterns

### From React Native to Expo UI
```javascript
// React Native version
<View style={styles.row}>
  <Text>Label</Text>
  <Switch value={isOn} onValueChange={setIsOn} />
</View>

// Expo UI version
<Host matchContents>
  <HStack>
    <Text>Label</Text>
    <Spacer />
    <Switch value={isOn} onValueChange={setIsOn} />
  </HStack>
</Host>
```
