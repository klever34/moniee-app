import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import StyleGuide from '../assets/style-guide';

type DoubleStackedTextProps = {
  mode:
    | 'largeOverSmall'
    | 'largeOverSmallGreenBold'
    | 'largeOverMedium'
    | 'boldLargeOverMedium'
    | 'boldLargeOverLightText'
    | 'largeOverBoldLarge'
    | 'lightOverDarkDetails'
    | 'normalOverLarge';
  topText?: string | React.ReactNode;
  bottomText?: string | React.ReactNode;
  align?: 'left' | 'right' | 'center';
  color?: string;
};

/**
 * Needed to create this to allow interpolating the Styles with values from the props
 */
export type GenericStylesProp = {[key: string]: {}};

const DoubleStackedText: React.FC<DoubleStackedTextProps> = ({
  mode,
  topText,
  bottomText,
  align,
  color,
}) => {
  const topStyleKey = `${mode}Top`;
  const bottomStyleKey = `${mode}Bottom`;

  let alignValue: 'flex-start' | 'flex-end' | 'center' = 'flex-end';
  if (align) {
    switch (align) {
      case 'left':
        alignValue = 'flex-start';
        break;
      case 'right':
        alignValue = 'flex-end';
        break;
      case 'center':
        alignValue = 'center';
        break;
    }
  }

  const alignStyles = StyleSheet.create({
    default: {
      alignItems: align && alignValue,
    },
  });

  return (
    <View style={[styles.container, alignStyles.default]}>
      {!!topText &&
        (typeof topText === 'string' ? (
          <Text style={[styles[topStyleKey], {color}]}>{topText}</Text>
        ) : (
          topText
        ))}

      {!!bottomText &&
        (typeof bottomText === 'string' ? (
          <Text style={[{color}, styles[bottomStyleKey]]}>{bottomText}</Text>
        ) : (
          bottomText
        ))}
    </View>
  );
};

const styles: GenericStylesProp = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  largeOverSmallTop: {
    color: StyleGuide.Colors.shades.grey[200],
    fontSize: StyleGuide.Typography[14],
    alignItems: 'flex-end',
  },
  largeOverSmallBottom: {
    color: StyleGuide.Colors.shades.grey[200],
    fontSize: StyleGuide.Typography[10],
  },
  largeOverSmallGreenBoldTop: {
    color: StyleGuide.Colors.shades.grey[200],
    fontSize: StyleGuide.Typography[14],
    alignItems: 'flex-end',
  },
  largeOverSmallGreenBoldBottom: {
    color: StyleGuide.Colors.shades.green[200],
    fontSize: StyleGuide.Typography[10],
    fontWeight: '500',
  },
  largeOverBoldLargeTop: {
    color: StyleGuide.Colors.shades.grey[200],
    fontSize: StyleGuide.Typography[14],
  },
  largeOverBoldLargeBottom: {
    color: StyleGuide.Colors.black,
    fontSize: StyleGuide.Typography[14],
    fontWeight: '500',
  },
  boldLargeOverMediumTop: {
    color: StyleGuide.Colors.shades.grey[200],
    fontSize: StyleGuide.Typography[14],
    fontWeight: '500',
  },
  boldLargeOverMediumBottom: {
    color: StyleGuide.Colors.shades.grey[200],
    fontSize: StyleGuide.Typography[12],
  },
  lightOverDarkDetailsTop: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: StyleGuide.Typography[12],
  },
  lightOverDarkDetailsBottom: {
    color: StyleGuide.Colors.shades.grey[1150],
    fontSize: StyleGuide.Typography[12],
  },
  normalOverLargeTop: {
    color: StyleGuide.Colors.shades.grey[1200],
    fontSize: StyleGuide.Typography[12],
  },
  normalOverLargeBottom: {
    color: StyleGuide.Colors.shades.grey[1150],
    fontSize: StyleGuide.Typography[14],
    fontWeight: '500',
  },
  boldLargeOverLightTextTop: {
    color: StyleGuide.Colors.black,
    fontSize: StyleGuide.Typography[14],
    fontWeight: 'bold',
  },
  boldLargeOverLightTextBottom: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: StyleGuide.Typography[12],
  },
});

export default DoubleStackedText;
