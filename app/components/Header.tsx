import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {scaleWidth, scaleHeight} from '../utils';
import StyleGuide from '../assets/style-guide';
import {TouchableOpacity} from 'react-native-gesture-handler';

type HeaderProps = {
  title?: string;
  centerTitle?: boolean;
  goBack?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  centerTitle,
  goBack,
  children,
}) => {
  return (
    <View style={centerTitle ? styles.headerParentContainer : {}}>
      <View style={styles.headerContainer}>
        {goBack && (
          <TouchableOpacity onPress={goBack}>
            <MaterialIcons
              name="keyboard-backspace"
              size={scaleWidth(20)}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        )}
        {title && <Text style={styles.header}>{title}</Text>}
        {children !== undefined && (
          <View style={styles.subHeader}>{children}</View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerParentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: scaleHeight(5),
  },
  iconStyle: {
    color: StyleGuide.Colors.shades.grey[100],
  },
  header: {
    fontSize: StyleGuide.Typography[18],
    color: StyleGuide.Colors.primary,
    fontWeight: '500',
    marginTop: scaleHeight(15),
    fontFamily: Platform.OS === 'ios' ? 'NexaRegular' : 'NexaBold',
  },
  subHeader: {
    fontSize: StyleGuide.Typography[14],
    color: StyleGuide.Colors.shades.grey[200],
    marginTop: scaleHeight(5),
  },
});

export default Header;
