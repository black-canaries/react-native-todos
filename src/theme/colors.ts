export const colors = {
  // Dark theme colors (default)
  dark: {
    // Background colors
    background: '#1f1f1f',
    backgroundSecondary: '#282828',
    backgroundTertiary: '#333333',

    // Text colors
    text: '#ffffff',
    textSecondary: '#b8b8b8',
    textTertiary: '#808080',

    // Border colors
    border: '#3d3d3d',
    borderLight: '#2d2d2d',

    // Primary colors
    primary: '#de4c4a',
    primaryLight: '#e85d5b',
    primaryDark: '#c43d3b',

    // Status colors
    success: '#25b84c',
    warning: '#ffa900',
    error: '#de4c4a',
    info: '#4073ff',

    // Priority colors
    priority1: '#de4c4a', // Urgent (red)
    priority2: '#ffa900', // High (orange)
    priority3: '#4073ff', // Medium (blue)
    priority4: '#b8b8b8', // Low (gray)

    // Task states
    completed: '#25b84c',
    overdue: '#de4c4a',

    // Card/Surface colors
    card: '#282828',
    cardHover: '#2f2f2f',

    // Input colors
    input: '#333333',
    inputBorder: '#3d3d3d',
    inputFocus: '#de4c4a',

    // Icon colors
    icon: '#b8b8b8',
    iconActive: '#ffffff',

    // Project colors (for user customization)
    projectColors: [
      '#de4c4a', // Red
      '#ffa900', // Orange
      '#ff8d00', // Dark orange
      '#25b84c', // Green
      '#4073ff', // Blue
      '#884dff', // Purple
      '#ff40a6', // Pink
      '#9e9e9e', // Gray
      '#7e6346', // Brown
      '#00a8a0', // Teal
    ],
  },

  // Light theme colors (for future implementation)
  light: {
    background: '#ffffff',
    backgroundSecondary: '#fafafa',
    backgroundTertiary: '#f5f5f5',
    text: '#202020',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    primary: '#de4c4a',
    primaryLight: '#e85d5b',
    primaryDark: '#c43d3b',
    success: '#25b84c',
    warning: '#ffa900',
    error: '#de4c4a',
    info: '#4073ff',
    priority1: '#de4c4a',
    priority2: '#ffa900',
    priority3: '#4073ff',
    priority4: '#666666',
    completed: '#25b84c',
    overdue: '#de4c4a',
    card: '#ffffff',
    cardHover: '#f9f9f9',
    input: '#ffffff',
    inputBorder: '#e0e0e0',
    inputFocus: '#de4c4a',
    icon: '#666666',
    iconActive: '#202020',
    projectColors: [
      '#de4c4a',
      '#ffa900',
      '#ff8d00',
      '#25b84c',
      '#4073ff',
      '#884dff',
      '#ff40a6',
      '#757575',
      '#7e6346',
      '#00a8a0',
    ],
  },
};

export type ColorTheme = typeof colors.dark;
