# Configuration Reference

Essential configuration files for React Native Expo projects with NativeWind, Reanimated, and Convex.

## babel.config.js

Babel configuration is critical for NativeWind and Reanimated to work correctly.

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // MUST be last
    ],
  };
};
```

**Critical Rules:**
1. `react-native-reanimated/plugin` **MUST be the last plugin** in the array
2. Both `nativewind/babel` and `react-native-reanimated/plugin` are required
3. If you add other plugins, ensure Reanimated stays last

**When to rebuild:**
- After changing babel.config.js, run: `pnpm expo start -c` to clear cache
- If animations don't work, rebuild: `pnpm expo prebuild --clean`

## metro.config.js

Metro bundler configuration for proper module resolution.

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add CJS support for Convex
config.resolver.sourceExts.push('cjs');

module.exports = config;
```

**Purpose:**
- `sourceExts.push('cjs')` - Required for Convex to work properly
- Uses Expo's default config as base to maintain compatibility

**Advanced customization:**

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom file extensions
config.resolver.sourceExts.push('cjs', 'mjs');

// Add custom asset extensions
config.resolver.assetExts.push('db', 'sqlite');

// Customize transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
```

## tailwind.config.js

Tailwind/NativeWind configuration for styling.

### Basic Configuration

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Key sections:**
- `content` - Array of file patterns where Tailwind scans for classes
- `presets` - **MUST include** `nativewind/preset` for React Native compatibility
- `theme.extend` - Custom colors, spacing, fonts, etc.
- `plugins` - Additional Tailwind plugins

### Custom Theme

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: '#de4c4a',
        background: {
          light: '#ffffff',
          dark: '#1f1f1f',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'xxs': '0.625rem',
        '3.5xl': '2rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

**Usage in components:**

```tsx
<View className="bg-primary-500 p-128">
  <Text className="text-xxs font-mono">Custom themed content</Text>
</View>
```

### Dark Mode Configuration

```javascript
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // or 'media' for system preference
  theme: {
    extend: {},
  },
}
```

## app.json

Expo configuration file.

### Basic Structure

```json
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mycompany.myapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.mycompany.myapp"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

### With Reanimated Plugin

```json
{
  "expo": {
    "name": "MyApp",
    "plugins": [
      "expo-router",
      [
        "react-native-reanimated",
        {
          "relativeSourceLocation": true
        }
      ]
    ]
  }
}
```

### Environment Variables

```json
{
  "expo": {
    "extra": {
      "convexUrl": process.env.EXPO_PUBLIC_CONVEX_URL
    }
  }
}
```

## package.json Scripts

Recommended scripts for Expo projects with pnpm:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clean": "expo start -c",
    "prebuild": "expo prebuild",
    "prebuild:clean": "expo prebuild --clean",
    "convex:dev": "convex dev",
    "convex:deploy": "convex deploy",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## Environment Setup

### .env File Structure

```bash
# Convex
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# API Keys (use EXPO_PUBLIC_ prefix for client-side access)
EXPO_PUBLIC_API_KEY=your-api-key

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

### Accessing Environment Variables

```tsx
// Client-side (React Native)
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

// In app.config.js (for dynamic config)
export default {
  expo: {
    extra: {
      convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL,
    },
  },
};

// Accessing in app
import Constants from 'expo-constants';
const convexUrl = Constants.expoConfig?.extra?.convexUrl;
```

## Git Ignore

Recommended `.gitignore` for Expo projects:

```
node_modules/
.expo/
.expo-shared/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# Local env files
.env*.local
.env

# IDE
.vscode/
.idea/

# macOS
.DS_Store

# Convex
.convex/
```

## Common Configuration Issues

### Issue: Reanimated not working
**Solution:**
1. Ensure `react-native-reanimated/plugin` is LAST in babel.config.js
2. Clear cache: `pnpm expo start -c`
3. Rebuild: `pnpm expo prebuild --clean`

### Issue: NativeWind styles not applying
**Solution:**
1. Check `tailwind.config.js` content paths include your files
2. Ensure `nativewind/babel` is in babel.config.js
3. Restart Metro: `pnpm expo start -c`

### Issue: Convex not connecting
**Solution:**
1. Verify `EXPO_PUBLIC_CONVEX_URL` in .env
2. Ensure `sourceExts.push('cjs')` in metro.config.js
3. Check ConvexProvider wraps your app

### Issue: TypeScript errors
**Solution:**
1. Run `pnpm expo customize tsconfig.json` to regenerate
2. Ensure `expo/tsconfig.base` is extended
3. Check paths are correctly configured
