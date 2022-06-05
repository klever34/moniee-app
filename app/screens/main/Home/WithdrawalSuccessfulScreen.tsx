/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Layout from '../../../components/Layout';
import MonieeButton from '../../../components/MonieeButton';
import {scaleHeight, scaleWidth} from '../../../utils';

const WithdrawalSuccessfulScreen: React.FC<
  ScreenProps<'WithdrawSuccessful'>
> = ({
  //   route,
  navigation,
}) => {
  const bgColor = StyleGuide.Colors.white;

  const iconRenderer = () => {
    return (
      <Image
        style={styles.image}
        source={require('../../../assets/images/icon_5.png')}
      />
    );
  };

  const titleColor = styles.pageTitleBlack;

  const subtitleColor = styles.pageSubtitleBlack;

  const buttonText = 'Kari me go house';

  return (
    <Layout style={{backgroundColor: bgColor}}>
      <View style={styles.screenContainer}>
        <View style={styles.descriptionContainer}>
          {iconRenderer()}
          <Text style={titleColor}>Transaction Successful</Text>
          <Text style={subtitleColor}>
            The withdrawal to your bank{'\n'}account has been completed
          </Text>
        </View>
        <MonieeButton
          title={buttonText}
          mode={'neutral'}
          onPress={() => navigation.goBack()}
          customStyle={{
            backgroundColor: '#E5F9FF',
          }}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: StyleGuide.Colors.white,
    borderRadius: 4,
  },
  pageTitle: {
    color: StyleGuide.Colors.white,
    fontSize: scaledSize(18),
    marginBottom: scaleHeight(2),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  pageSubtitle: {
    color: StyleGuide.Colors.white,
    fontSize: scaledSize(12),
    marginTop: scaleHeight(10),
    textAlign: 'center',
    fontFamily: 'NexaRegular',
  },
  bold: {
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '50%',
    height: '30%',
    resizeMode: 'contain',
  },
  pageTitleBlack: {
    color: StyleGuide.Colors.shades.blue[300],
    fontSize: scaledSize(18),
    marginBottom: scaleHeight(2),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  pageSubtitleBlack: {
    color: StyleGuide.Colors.shades.grey[25],
    fontSize: scaledSize(12),
    marginTop: scaleHeight(10),
    textAlign: 'center',
    fontFamily: 'NexaRegular',
  },
});

export default WithdrawalSuccessfulScreen;
