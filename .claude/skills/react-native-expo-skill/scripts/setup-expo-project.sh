#!/usr/bin/env bash
# setup-expo-project.sh
# Initialize a new React Native Expo project with NativeWind, Reanimated, and Convex

set -e

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: ./setup-expo-project.sh <project-name>"
  exit 1
fi

echo "🚀 Creating Expo project: $PROJECT_NAME"
echo ""

# Create Expo project
pnpm create expo-app "$PROJECT_NAME" --template blank-typescript
cd "$PROJECT_NAME"

echo ""
echo "📦 Installing core dependencies..."

# Install NativeWind and Tailwind
pnpm add nativewind
pnpm add -D tailwindcss

# Install Reanimated and Gesture Handler
pnpm add react-native-reanimated react-native-gesture-handler

# Install Convex
pnpm add convex

echo ""
echo "⚙️  Configuring NativeWind..."

# Create tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

echo ""
echo "⚙️  Configuring Babel..."

# Update babel.config.js
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // Must be last!
    ],
  };
};
EOF

echo ""
echo "⚙️  Configuring Metro bundler..."

# Create metro.config.js
cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

module.exports = config;
EOF

echo ""
echo "⚙️  Creating environment file..."

# Create .env template
cat > .env.example << 'EOF'
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
EOF

echo ""
echo "📝 Creating global CSS file..."

# Create global.css for NativeWind
mkdir -p assets
cat > assets/global.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. Initialize Convex: pnpm convex dev"
echo "3. Copy EXPO_PUBLIC_CONVEX_URL from Convex dashboard to .env"
echo "4. Start development: pnpm expo start"
echo ""
echo "📚 For more info, see the react-native-expo skill documentation"
