import React from 'react';
import {View, StyleSheet} from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
// import FeedbackScreen from '../../../components/FeedbackScreen';
import Layout from '../../../components/Layout';
import {scaleHeight, scaleWidth} from '../../../utils';

const PaymentStatus: React.FC<ScreenProps<'PaymentStatus'>> = ({
  route,
  //   navigation,
}) => {
  const {paymentSuccessStatus} = route.params;
  const bgColor =
    paymentSuccessStatus === 'success'
      ? StyleGuide.Colors.shades.green[100]
      : paymentSuccessStatus === 'info'
      ? StyleGuide.Colors.white
      : StyleGuide.Colors.shades.red[100];

  return (
    <Layout style={{backgroundColor: bgColor}}>
      <View style={styles.screenContainer}>{/* <FeedbackScreen /> */}</View>
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
    fontSize: StyleGuide.Typography[18],
    fontWeight: '500',
    marginBottom: scaleHeight(2),
  },
  pageSubtitle: {
    color: StyleGuide.Colors.white,
    fontSize: StyleGuide.Typography[14],
    marginBottom: scaleHeight(2),
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  viewReceipt: {
    marginTop: scaleHeight(124),
    marginBottom: scaleHeight(80),
  },
});

export default PaymentStatus;
