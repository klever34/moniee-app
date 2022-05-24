import React from 'react';
import {StyleSheet, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scaleHeight} from '../utils';
import StyleGuide from '../assets/style-guide';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GenericStylesProp} from './StackedText';

type IconButtonProps = {
  onPress: () => void;
  title?: string;
  iconName?: string;
  iconStyle?: string;
};

const IconButton: React.FC<IconButtonProps> = ({
  title,
  onPress,
  iconName,
  iconStyle,
}) => {
  return (
    <TouchableOpacity style={styles.coreContainer} onPress={onPress}>
      <MaterialCommunityIcons
        name={iconName ?? ''}
        color={iconStyle}
        size={22}
      />
      <Text style={styles.coreText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles: GenericStylesProp = StyleSheet.create({
  coreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: scaleHeight(3),
    marginRight: scaleHeight(10),
    borderWidth: 0.3,
    borderColor: StyleGuide.Colors.shades.grey[100],
  },
  coreText: {
    fontSize: StyleGuide.Typography[14],
    marginHorizontal: 3,
    textTransform: 'capitalize',
    color: StyleGuide.Colors.black,
  },
});

export default IconButton;
