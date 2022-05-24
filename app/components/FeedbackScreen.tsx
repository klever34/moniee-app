import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {scaleHeight, scaleWidth} from '../utils';
import StyleGuide from '../assets/style-guide';
import {GenericStylesProp} from './StackedText';
import Layout from './Layout';
import MonieeButton from './MonieeButton';

type FeedbackScreenProps = {
  onPress: () => void;
  title: string;
  description: Element;
  screenMode: 'success' | 'failed' | 'info';
  buttonMode: 'primary' | 'secondary' | 'tertiary';
  buttonText: string;
};

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  title,
  onPress,
  description,
  screenMode,
  buttonMode,
  buttonText,
}) => {
  const bgColor =
    screenMode === 'success'
      ? StyleGuide.Colors.primary
      : StyleGuide.Colors.white;

  const iconBgColor =
    screenMode === 'success'
      ? StyleGuide.Colors.white
      : StyleGuide.Colors.shades.red[300];

  const iconColor =
    screenMode === 'success'
      ? StyleGuide.Colors.primary
      : StyleGuide.Colors.white;

  const buttonBgColor =
    screenMode === 'success'
      ? StyleGuide.Colors.white
      : StyleGuide.Colors.shades.red[300];

  return (
    <Layout style={{backgroundColor: bgColor}}>
      <View style={styles.screenContainer}>
        <View style={styles.topTextcontainer}>
          <View style={[styles.bgIcon, {backgroundColor: iconBgColor}]}>
            <MaterialIcons name="done-all" color={iconColor} size={28} />
          </View>
          <Text
            style={[
              styles.pageTitle,
              {
                color:
                  screenMode === 'success'
                    ? StyleGuide.Colors.white
                    : StyleGuide.Colors.black,
              },
            ]}>
            {title}
          </Text>
          <Text style={styles.pageSubtitle}>{description}</Text>
        </View>
        <MonieeButton
          title={buttonText}
          mode={buttonMode}
          onPress={onPress}
          customStyle={{backgroundColor: buttonBgColor}}
        />
      </View>
    </Layout>
  );
};

const styles: GenericStylesProp = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  topTextcontainer: {
    marginTop: scaleHeight(100),
    marginBottom: scaleHeight(24),
    alignItems: 'center',
    flex: 1,
  },
  bgIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scaleWidth(40),
    height: scaleHeight(40),
    marginBottom: scaleHeight(16),
    borderRadius: 20,
  },
  pageTitle: {
    fontSize: StyleGuide.Typography[18],
    fontWeight: '500',
    marginBottom: scaleHeight(2),
  },
  pageSubtitle: {
    color: StyleGuide.Colors.white,
    fontSize: StyleGuide.Typography[14],
    marginBottom: scaleHeight(2),
    textAlign: 'center',
    lineHeight: scaleHeight(14),
  },
  bold: {
    fontWeight: 'bold',
  },
  viewReceipt: {
    marginTop: scaleHeight(124),
    marginBottom: scaleHeight(80),
  },
});

export default FeedbackScreen;
