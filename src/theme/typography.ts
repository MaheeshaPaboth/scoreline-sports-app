import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  heading: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  subheading: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodyBold: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  captionBold: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
};

export type Typography = typeof typography;
