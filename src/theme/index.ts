import { lightColors, darkColors, ThemeColors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
  spacing: Spacing;
  typography: Typography;
}

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
  spacing,
  typography,
};

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
  spacing,
  typography,
};

export * from './colors';
export * from './spacing';
export * from './typography';
