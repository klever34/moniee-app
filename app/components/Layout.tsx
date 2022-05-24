import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';

import StyleGuide from '../assets/style-guide';
import {scaleWidth, scaleHeight} from '../utils';
import {GenericStylesProp} from './StackedText';

type LayoutProps = {
  style?: GenericStylesProp;
};

const Layout: React.FC<LayoutProps> = ({children, style}) => {
  return (
    <SafeAreaView style={[styles.safeView]}>
      <View style={[styles.default, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },

  default: {
    flex: 1,
    backgroundColor: StyleGuide.Colors.white,
    paddingVertical: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
  },
});

export default Layout;
