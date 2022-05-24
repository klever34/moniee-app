import React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaledSize} from '../assets/style-guide/typography';

type ActionSheetContainerProps = {
  children: React.ReactNode;
  title?: string;
};

const ActionSheetContainer: React.FC<ActionSheetContainerProps> = ({
  children,
  title,
}) => (
  <View style={title ? styles.actionSheetContainer : styles.bottomMargin}>
    <Text style={styles.actionSheetPrompt}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  actionSheetContainer: {
    marginHorizontal: 24,
    marginTop: 15,
    marginBottom: 32,
  },
  actionSheetPrompt: {
    fontSize: Platform.OS === 'ios' ? scaledSize(20) : scaledSize(16),
    color: StyleGuide.Colors.black,
    textAlign: 'center',
    // marginBottom: 32,
    fontFamily: Platform.OS === 'ios' ? 'NexaRegular' : 'NexaBold',
  },
  bottomMargin: {
    marginBottom: 32,
    marginHorizontal: 24,
  },
});

export default ActionSheetContainer;
