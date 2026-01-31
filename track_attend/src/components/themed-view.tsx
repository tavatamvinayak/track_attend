import { View as ThemedView, type ViewProps } from 'react-native';

import { useThemeColor } from '@/src/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function View({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <ThemedView style={[{ backgroundColor }, style]} {...otherProps} />;
}
