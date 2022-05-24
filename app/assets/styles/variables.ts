import {Dimensions, Platform} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import normalize from 'react-native-normalize';
import Colors from '../style-guide/colors';

export const dimensions = {
  fullHeight: Platform.select({
    android:
      ExtraDimensions.getRealWindowHeight() -
      ExtraDimensions.getSoftMenuBarHeight() -
      ExtraDimensions.getStatusBarHeight(),
    ios: Dimensions.get('window').height,
  }) as number,
  fullWidth: Dimensions.get('window').width,
};

export const getColor = (code: string) => {
  const classNames = code.split('.');
  if (!classNames.length) {
    return null;
  } else if (classNames.length === 1) {
    return (Colors as {[key: string]: any})[classNames[0]];
  }
  return classNames.reduce((acc, curr) => {
    if (typeof acc === 'string') {
      return acc;
    }
    return acc[curr];
  }, Colors as {[key: string]: any} | string);
};

const sizes = [
  0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 60, 64,
  72, 80, 96, 104, 112, 120, 128,
];

export const spacing: {[key: string]: number} = {
  ...sizes.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: normalize(curr),
    };
  }, {}),
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(12),
  lg: normalize(16),
  xl: normalize(24),
};

export const applySpacing = (size: number | string): number => {
  if (!isNaN(Number(size))) {
    size = Number(size);
    if (size < 4) {
      return size;
    }
    return spacing[size] ?? normalize(size);
  }
  return spacing[size] ?? 0;
};

export const applyFontSize = (size: number | string): number => {
  if (!isNaN(Number(size))) {
    size = Number(size);
    if (size <= 10) {
      return size;
    }
    return spacing[size] ?? normalize(size);
  }
  return spacing[size] ?? 0;
};

export const navBarHeight = normalize(80);
