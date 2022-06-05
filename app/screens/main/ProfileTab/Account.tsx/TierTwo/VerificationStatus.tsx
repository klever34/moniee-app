/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';
import {ScreenProps} from '../../../../../../App';

import StyleGuide from '../../../../../assets/style-guide';
import {scaledSize} from '../../../../../assets/style-guide/typography';
import Layout from '../../../../../components/Layout';
import MonieeButton from '../../../../../components/MonieeButton';
import Subheader from '../../../../../components/Subheader';
import {scaleHeight, scaleWidth} from '../../../../../utils';

const VerificationStatus: React.FC<ScreenProps<'VerificationStatus'>> = ({
  route,
  navigation,
}) => {
  const {idStatus} = route.params;
  const bgColor = StyleGuide.Colors.white;

  const iconRenderer = () => {
    if (idStatus === 'success') {
      return (
        <Image
          style={styles.image}
          source={require('../../../../../assets/images/verify-progress.png')}
        />
      );
    } else if (idStatus === 'failed') {
      return (
        <Image
          style={styles.image}
          source={require('../../../../../assets/images/verify-failed.png')}
        />
      );
    } else {
    }
  };

  const titleColor = styles.pageTitleBlack;

  const subtitleColor = styles.pageSubtitleBlack;

  const buttonText = 'Try again';

  return (
    <Layout style={{backgroundColor: bgColor}}>
      <View style={styles.screenContainer}>
        <Subheader title="Govt. Issued ID" goBack={navigation.goBack} />

        <View style={styles.descriptionContainer}>
          {iconRenderer()}
          <Text style={titleColor}>
            {idStatus === 'success'
              ? 'Verification in progress'
              : 'Verification failed'}
          </Text>
          <Text style={subtitleColor}>
            {idStatus === 'success'
              ? 'Your Identification document has been\nsubmitted. Verification status will be\nupdated within 48 hours'
              : 'Try again in....'}
          </Text>
        </View>
        {idStatus === 'failed' && (
          <MonieeButton
            title={buttonText}
            mode={'neutral'}
            onPress={() => navigation.goBack()}
            customStyle={{
              backgroundColor: '#E5F9FF',
            }}
          />
        )}
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
    lineHeight: 20,
  },
});

export default VerificationStatus;
