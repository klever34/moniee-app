import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {scaleWidth, scaleHeight} from '../utils';
import StyleGuide from '../assets/style-guide';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {scaledSize} from '../assets/style-guide/typography';

type HeaderProps = {
  title?: string;
  centerTitle?: boolean;
  goBack?: () => void;
};

const Subheader: React.FC<HeaderProps> = ({title, centerTitle, goBack}) => {
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconStyle: {
    color: StyleGuide.Colors.primary,
    marginTop: scaleHeight(15),
    marginRight: 15,
  },
  header: {
    fontSize: scaledSize(16),
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

export default Subheader;
