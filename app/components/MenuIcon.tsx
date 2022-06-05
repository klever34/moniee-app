/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaledSize} from '../assets/style-guide/typography';
import Icon from './Icon';

type MenuIconProps = {
  title: string;
  description?: string;
  image?: any;
  onPress?: () => void;
  customIcon?: any;
};

const MenuIcon: React.FC<MenuIconProps> = ({
  title,
  image,
  onPress,
  description,
  customIcon,
}) => (
  <TouchableOpacity style={styles.menuBox} onPress={onPress}>
    <View style={[styles.starBox]}>
      <Image source={image} style={styles.menuIcon} />
      <View>
        <Text
          style={[
            styles.headerText,
            {marginTop: Platform.OS === 'ios' ? 5 : 0, paddingHorizontal: 10},
          ]}>
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.subText,
              {marginTop: Platform.OS === 'ios' ? 5 : 0, paddingHorizontal: 10},
            ]}>
            {description}
          </Text>
        )}
      </View>
    </View>
    {customIcon ? (
      customIcon
    ) : (
      <Icon
        type="antdesigns"
        name="right"
        size={18}
        color={StyleGuide.Colors.shades.grey[50]}
      />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuIcon: {
    height: 20,
    width: 20,
  },
  menuBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  headerText: {
    fontSize: scaledSize(14),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.blue[300],
  },
  starBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subText: {
    fontSize: scaledSize(10),
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
  },
});

export default MenuIcon;
