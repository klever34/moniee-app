import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {scaleHeight, scaleWidth} from '../utils';
import StyleGuide from '../assets/style-guide';
import {GenericStylesProp} from './StackedText';

type MonieeButtonProps = {
  onPress: () => void;
  title?: string;
  mode?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'disabled'
    | 'neutral'
    | 'ghost'
    | 'error'
    | 'grey'
    | 'transparent';
  customStyle?: any;
  textColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
  bold?: boolean;
  expand?: boolean;
  size?: 'normal' | 'small';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const MonieeButton: React.FC<MonieeButtonProps> = ({
  title,
  mode = 'primary',
  onPress,
  customStyle,
  isLoading,
  disabled,
  iconLeft,
  iconRight,
  bold,
  size = 'normal',
  expand,
  textColor,
}) => {
  let containerSize = styles.coreContainer;
  let coreText = styles.coreText;

  if (isLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={'large'} color={StyleGuide.Colors.primary} />
      </View>
    );
  }

  if (disabled) {
    mode = 'disabled';
  }

  if (expand) {
    customStyle = {...customStyle, width: '100%'};
  }

  if (size === 'small') {
    containerSize = styles.smallCoreContainer;
    coreText = styles.smallCoreText;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[containerSize, styles[`${mode}Container`], customStyle]}>
      {
        <View style={styles.contentContainer}>
          {iconLeft && <View style={styles.iconLeftMargin}>{iconLeft}</View>}
          <Text
            style={[
              coreText,
              styles[`${mode}Text`],
              bold && styles.bold,
              textColor && {color: textColor},
            ]}>
            {title}
          </Text>
          {iconRight && <View style={styles.iconRightMargin}>{iconRight}</View>}
        </View>
      }
    </TouchableOpacity>
  );
};

const styles: GenericStylesProp = StyleSheet.create({
  coreContainer: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    minHeight: 52,
  },
  smallCoreContainer: {
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
    minHeight: 32,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreText: {
    fontSize: StyleGuide.Typography[14],
    fontWeight: '500',
    fontFamily: 'NexaRegular',
  },
  smallCoreText: {
    fontSize: StyleGuide.Typography[12],
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
  iconLeftMargin: {
    marginRight: 7,
  },
  iconRightMargin: {
    marginLeft: 7,
  },
  primaryContainer: {
    backgroundColor: StyleGuide.Colors.primary,
  },
  primaryText: {
    color: StyleGuide.Colors.white,
  },
  secondaryContainer: {
    backgroundColor: StyleGuide.Colors.shades.magenta[75],
  },
  secondaryText: {
    color: StyleGuide.Colors.white,
  },
  errorContainer: {
    backgroundColor: StyleGuide.Colors.white,
  },
  errorText: {
    color: StyleGuide.Colors.shades.red[100],
  },
  tertiaryContainer: {
    backgroundColor: 'transparent',
  },
  tertiaryText: {
    color: StyleGuide.Colors.white,
  },
  disabledContainer: {
    backgroundColor: StyleGuide.Colors.shades.grey[1000],
  },
  disabledText: {
    color: StyleGuide.Colors.white,
  },
  neutralContainer: {
    backgroundColor: StyleGuide.Colors.shades.grey[30],
  },
  neutralText: {
    color: StyleGuide.Colors.black,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    borderColor: StyleGuide.Colors.shades.grey[1100],
    borderWidth: 1,
  },
  ghostText: {
    color: StyleGuide.Colors.black,
  },
  transparentContainer: {
    backgroundColor: StyleGuide.Colors.white,
    borderColor: StyleGuide.Colors.shades.grey[350],
    borderWidth: 1,
    borderRadius: scaleWidth(20),
  },
  transparentText: {
    color: StyleGuide.Colors.black,
  },
  indicator: {
    alignSelf: 'center',
    marginVertical: scaleHeight(10),
  },
});

export default MonieeButton;
