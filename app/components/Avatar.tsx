import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import StyleGuide from '../assets/style-guide';

type AvatarProps = {
  name: string;
  mode?: 'dark' | 'colored';
  size?: 'regular' | 'large';
  onPress?: () => void;
};

const bgColors = ['#171C1A', '#0391FC', '#73C567', '#7B71E8', '#F5AC3D'];

const Avatar: React.FC<AvatarProps> = ({
  name,
  mode,
  size = 'regular',
  onPress,
}) => {
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    if (mode === 'colored') {
      const randomNum = Math.trunc(Math.random() * bgColors.length);
      setBgColor(bgColors[randomNum]);
    }
  }, [mode]);

  let customerInitials: any = name.split(' ');
  customerInitials = `${customerInitials[0][0]}${
    customerInitials[1] ? customerInitials[1][0] : ''
  }`;
  customerInitials = customerInitials.toUpperCase();

  let profileInitialsStyle =
    mode === 'dark' || mode === 'colored'
      ? [styles.profileInitials, styles.profileInitialsDark]
      : [styles.profileInitials];

  let profileInitialsContainerStyle =
    size === 'large'
      ? [styles.profileInitialsContainer, styles.profileInitialsContainerLarge]
      : [styles.profileInitialsContainer];

  const profileImageContainerStyle =
    size === 'large'
      ? [styles.profileImageContainer, styles.profileImageContainerLarge]
      : styles.profileImageContainer;

  let profileImageStyle: any =
    mode === 'dark'
      ? [styles.profileImage, styles.profileImageDark]
      : mode === 'colored'
      ? [styles.profileImage, {backgroundColor: bgColor}]
      : [styles.profileImage];

  profileImageStyle =
    size === 'large'
      ? [...profileImageStyle, styles.profileImageLarge]
      : profileImageStyle;

  return (
    <TouchableOpacity style={profileImageContainerStyle} onPress={onPress}>
      <View style={profileInitialsContainerStyle}>
        <Text style={profileInitialsStyle}>{customerInitials}</Text>
      </View>
      <Image style={profileImageStyle} source={{uri: './'}} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileImageContainer: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  profileImageContainerLarge: {
    width: 60,
    height: 60,
  },
  profileInitialsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    zIndex: 5,
  },
  profileInitialsContainerLarge: {
    width: 60,
    height: 60,
  },
  profileInitials: {
    fontSize: StyleGuide.Typography[14],
    fontWeight: 'bold',
    color: StyleGuide.Colors.shades.grey[1150],
  },
  profileInitialsDark: {
    color: StyleGuide.Colors.white,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: StyleGuide.Colors.shades.grey[1100],
    borderRadius: 20,
  },
  profileImageDark: {
    backgroundColor: StyleGuide.Colors.black,
  },
  profileImageLarge: {
    borderRadius: 25,
  },
});

export default Avatar;
