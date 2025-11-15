import { colors, ColorTheme } from './colors';
import { spacing, borderRadius, iconSizes } from './spacing';
import { typography } from './typography';

export type Theme = {
  colors: ColorTheme;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSizes: typeof iconSizes;
  typography: typeof typography;
  isDark: boolean;
};

export const darkTheme: Theme = {
  colors: colors.dark,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  isDark: true,
};

export const lightTheme: Theme = {
  colors: colors.light,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  isDark: false,
};

// Default to dark theme
export const theme = darkTheme;

export { colors, spacing, borderRadius, iconSizes, typography };
