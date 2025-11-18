#!/usr/bin/env python3
"""
Expo UI Component Template Generator

Generates boilerplate code for common Expo UI patterns.
Usage: python generate_template.py <template_type>

Available templates:
- settings: iOS Settings-style form
- loading: Loading screen with progress indicators  
- glass: Glass effect with mesh gradient
- form: Basic form with inputs
- navigation: Navigation list with rows
"""

import sys

def generate_settings_template():
    """Generate iOS Settings-style form template"""
    return """import React, { useState } from 'react';
import {
  Host,
  Form,
  Section,
  HStack,
  Text,
  Image,
  Spacer,
  Switch,
  Button,
} from '@expo/ui/swift-ui';
import { background, clipShape, frame } from '@expo/ui/swift-ui/modifiers';
import { Link } from 'expo-router';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section header="General">
          <Link href="/profile" asChild>
            <Button>
              <HStack spacing={12}>
                <Image 
                  systemName="person.circle" 
                  color="white" 
                  size={18}
                  modifiers={[
                    frame({ width: 28, height: 28 }),
                    background('#007aff'),
                    clipShape('roundedRectangle'),
                  ]}
                />
                <Text color="primary">Profile</Text>
                <Spacer />
                <Image systemName="chevron.right" size={14} color="secondary" />
              </HStack>
            </Button>
          </Link>
        </Section>

        <Section header="Preferences">
          <HStack spacing={12}>
            <Image 
              systemName="bell" 
              color="white" 
              size={18}
              modifiers={[
                frame({ width: 28, height: 28 }),
                background('#ff3b30'),
                clipShape('roundedRectangle'),
              ]}
            />
            <Text>Notifications</Text>
            <Spacer />
            <Switch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled} 
            />
          </HStack>
          
          <HStack spacing={12}>
            <Image 
              systemName="moon.fill" 
              color="white" 
              size={18}
              modifiers={[
                frame({ width: 28, height: 28 }),
                background('#8e8e93'),
                clipShape('roundedRectangle'),
              ]}
            />
            <Text>Dark Mode</Text>
            <Spacer />
            <Switch 
              value={darkModeEnabled} 
              onValueChange={setDarkModeEnabled} 
            />
          </HStack>
        </Section>
      </Form>
    </Host>
  );
}"""

def generate_loading_template():
    """Generate loading screen template"""
    return """import React from 'react';
import {
  Host,
  VStack,
  HStack,
  Text,
  CircularProgress,
  LinearProgress,
} from '@expo/ui/swift-ui';

export default function LoadingScreen({ progress = undefined }) {
  return (
    <Host style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <VStack spacing={24}>
        <CircularProgress value={progress} color="#007aff" />
        {progress !== undefined ? (
          <>
            <LinearProgress progress={progress} color="#007aff" />
            <Text size={14} color="secondary">
              {Math.round(progress * 100)}% Complete
            </Text>
          </>
        ) : (
          <Text size={14} color="secondary">Loading...</Text>
        )}
      </VStack>
    </Host>
  );
}"""

def generate_glass_template():
    """Generate glass effect template"""
    return """import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Host, Text, VStack, HStack } from '@expo/ui/swift-ui';
import { padding, glassEffect, frame } from '@expo/ui/swift-ui/modifiers';
import { MeshGradientView } from 'expo-mesh-gradient';

export default function GlassEffectScreen() {
  return (
    <View style={styles.container}>
      <MeshGradientView 
        style={StyleSheet.absoluteFillObject}
        columns={3}
        rows={3}
        colors={[
          'red', 'purple', 'indigo',
          'orange', 'white', 'blue',
          'yellow', 'green', 'cyan'
        ]}
        points={[
          [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
          [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
          [0.0, 1.0], [0.5, 1.0], [1.0, 1.0],
        ]}
      />
      
      <Host style={styles.glassContainer}>
        <VStack spacing={16} modifiers={[
          padding({ all: 24 }),
          glassEffect({ glass: { variant: 'clear' } }),
          frame({ maxWidth: 300 })
        ]}>
          <Text size={28} weight="bold">Glass Card</Text>
          <Text size={16} color="secondary">
            This content appears on a glass background
          </Text>
        </VStack>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glassContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});"""

def generate_form_template():
    """Generate basic form template"""
    return """import React, { useState } from 'react';
import {
  Host,
  VStack,
  HStack,
  Text,
  Button,
  Slider,
  Picker,
  PickerItem,
  Switch,
  Divider,
} from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function FormScreen() {
  const [sliderValue, setSliderValue] = useState(0.5);
  const [selectedOption, setSelectedOption] = useState('option1');
  const [isEnabled, setIsEnabled] = useState(false);

  const handleSubmit = () => {
    console.log({
      slider: sliderValue,
      picker: selectedOption,
      switch: isEnabled,
    });
  };

  return (
    <Host style={{ flex: 1, padding: 20 }}>
      <VStack spacing={20} modifiers={[padding({ vertical: 20 })]}>
        <Text size={24} weight="semibold">Form Example</Text>
        
        <Divider />
        
        <VStack spacing={8}>
          <Text size={14} color="secondary">Volume</Text>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            minimumValue={0}
            maximumValue={1}
          />
          <Text size={12} color="secondary">
            {Math.round(sliderValue * 100)}%
          </Text>
        </VStack>
        
        <VStack spacing={8}>
          <Text size={14} color="secondary">Select Option</Text>
          <Picker
            selection={selectedOption}
            onSelectionChange={setSelectedOption}
          >
            <PickerItem label="Option 1" value="option1" />
            <PickerItem label="Option 2" value="option2" />
            <PickerItem label="Option 3" value="option3" />
          </Picker>
        </VStack>
        
        <HStack>
          <Text>Enable Feature</Text>
          <Spacer />
          <Switch value={isEnabled} onValueChange={setIsEnabled} />
        </HStack>
        
        <Button onPress={handleSubmit}>
          <Text color="white">Submit</Text>
        </Button>
      </VStack>
    </Host>
  );
}"""

def generate_navigation_template():
    """Generate navigation list template"""
    return """import React from 'react';
import {
  Host,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Spacer,
  Divider,
} from '@expo/ui/swift-ui';
import { background, clipShape, frame } from '@expo/ui/swift-ui/modifiers';

const NavigationRow = ({ icon, iconColor, title, subtitle, onPress }) => (
  <Button onPress={onPress}>
    <HStack spacing={12}>
      <Image
        systemName={icon}
        color="white"
        size={18}
        modifiers={[
          frame({ width: 28, height: 28 }),
          background(iconColor),
          clipShape('roundedRectangle'),
        ]}
      />
      <VStack alignment="leading" spacing={2}>
        <Text>{title}</Text>
        {subtitle && (
          <Text size={12} color="secondary">{subtitle}</Text>
        )}
      </VStack>
      <Spacer />
      <Image systemName="chevron.right" size={14} color="secondary" />
    </HStack>
  </Button>
);

export default function NavigationScreen() {
  return (
    <Host style={{ flex: 1, padding: 20 }}>
      <VStack spacing={0}>
        <NavigationRow
          icon="house.fill"
          iconColor="#007aff"
          title="Home"
          subtitle="Main dashboard"
          onPress={() => console.log('Home')}
        />
        <Divider />
        <NavigationRow
          icon="person.fill"
          iconColor="#34c759"
          title="Profile"
          subtitle="Your account"
          onPress={() => console.log('Profile')}
        />
        <Divider />
        <NavigationRow
          icon="gear"
          iconColor="#8e8e93"
          title="Settings"
          onPress={() => console.log('Settings')}
        />
        <Divider />
        <NavigationRow
          icon="questionmark.circle.fill"
          iconColor="#ff9500"
          title="Help & Support"
          onPress={() => console.log('Help')}
        />
      </VStack>
    </Host>
  );
}"""

def main():
    templates = {
        'settings': generate_settings_template,
        'loading': generate_loading_template,
        'glass': generate_glass_template,
        'form': generate_form_template,
        'navigation': generate_navigation_template,
    }
    
    if len(sys.argv) < 2:
        print(__doc__)
        print("\nAvailable templates:")
        for name in templates:
            print(f"  - {name}")
        sys.exit(1)
    
    template_type = sys.argv[1].lower()
    
    if template_type not in templates:
        print(f"Error: Unknown template type '{template_type}'")
        print("\nAvailable templates:")
        for name in templates:
            print(f"  - {name}")
        sys.exit(1)
    
    # Generate the template
    code = templates[template_type]()
    
    # Output filename
    output_file = f"ExpoUI{template_type.title()}Screen.jsx"
    
    with open(output_file, 'w') as f:
        f.write(code)
    
    print(f"✅ Generated {output_file}")
    print(f"📝 Template type: {template_type}")

if __name__ == "__main__":
    main()
