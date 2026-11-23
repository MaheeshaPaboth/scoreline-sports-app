export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  minTouchTarget: 48, // Meets >= 44pt / 48dp accessibility requirement
  borderRadiusSm: 8,
  borderRadiusMd: 12,
  borderRadiusLg: 16,
  borderRadiusFull: 9999,
} as const;

export type Spacing = typeof spacing;
