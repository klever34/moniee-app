/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Layout from '../../../components/Layout';
import MonieeButton from '../../../components/MonieeButton';
import {scaleHeight, scaleWidth} from '../../../utils';

const PaymentStatus: React.FC<ScreenProps<'PaymentStatus'>> = ({
  route,
  navigation,
}) => {
  const {paymentSuccessStatus} = route.params;
  const bgColor =
    paymentSuccessStatus === 'request'
      ? StyleGuide.Colors.shades.green[800]
      : paymentSuccessStatus === 'send'
      ? StyleGuide.Colors.white
      : StyleGuide.Colors.shades.red[100];

  const iconRenderer = () => {
    if (paymentSuccessStatus === 'request') {
      return (
        <Image
          style={styles.image}
          source={require('../../../assets/images/icon_1.png')}
        />
      );
    } else if (paymentSuccessStatus === 'send') {
      return (
        <Image
          style={styles.image}
          source={require('../../../assets/images/icon_2.png')}
        />
      );
    } else {
    }
  };

  const titleColor =
    paymentSuccessStatus === 'request'
      ? styles.pageTitle
      : styles.pageTitleBlack;

  const subtitleColor =
    paymentSuccessStatus === 'request'
      ? styles.pageSubtitle
      : styles.pageSubtitleBlack;

  const buttonText =
    paymentSuccessStatus === 'request' ? 'Go Home' : 'Kari me go house';

  return (
    <Layout style={{backgroundColor: bgColor}}>
      <View style={styles.screenContainer}>
        <View style={styles.descriptionContainer}>
          {iconRenderer()}
          <Text style={titleColor}>
            {paymentSuccessStatus === 'request' ? 'Request Sent' : 'Money Sent'}
          </Text>
          <Text style={subtitleColor}>
            Your request for ₦2,000 has been sent
          </Text>
        </View>
        <MonieeButton
          title={buttonText}
          mode={paymentSuccessStatus === 'request' ? 'primary' : 'neutral'}
          onPress={() => navigation.goBack()}
          customStyle={{
            backgroundColor:
              paymentSuccessStatus === 'request' ? '#6FCF97' : '#E5F9FF',
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

export default PaymentStatus;
