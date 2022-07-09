/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Alert, Platform} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Header from '../../components/Header';
import {ScreenProps} from '../../../App';
import Layout from '../../components/Layout';
import StyleGuide from '../../assets/style-guide';
import {scaleHeight} from '../../utils';
import {scaledSize} from '../../assets/style-guide/typography';
import Icon from '../../components/Icon';
import MonieeButton from '../../components/MonieeButton';
import {sendOtp, verifyOtp} from '../../contexts/User';
// import {verifyOtp} from '../../contexts/User';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AuthContext} from '../../../context';

const START_MINUTES = 2;
const START_SECONDS = 0;

const OTP: React.FC<ScreenProps<'OTP'>> = ({navigation, route}) => {
  //   const context = useContext(UserContext);
  const {userObj, resetPassword} = route.params;
  const {signIn} = useContext(AuthContext);
  const [defaultOtp, setOTP] = useState<string>('');
  const [minutes, setMinutes] = useState(START_MINUTES);
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [isTimerExpired, setTimerStatus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasErrors] = useState<boolean>(false);

  useEffect(() => {
    let timerInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timerInterval);
          setTimerStatus(true);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(timerInterval);
    };
  });

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await verifyOtp({
        mobile: userObj.mobile,
        otp: defaultOtp,
        countryCode: userObj.country_code,
      });

      if (resetPassword && resetPassword === true) {
        setLoading(false);
        navigation.push('SecurePassword');
        return;
      }
      if (response.is_new) {
        setLoading(false);
        navigation.push('BankDetails');
        return;
      }
      await EncryptedStorage.setItem('@user_token', response.token);
      signIn();
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (err?.response?.data) {
        Alert.alert('Error', err.response.data.message);
      }
    }
  };

  const resendOTPCode = async () => {
    setMinutes(START_MINUTES);
    setTimerStatus(false);
    setOTP('');

    try {
      await sendOtp({mobile: userObj.mobile});
      Alert.alert('OTP Resent');
    } catch (err: any) {
      if (err?.response?.data) {
        Alert.alert('Error', err.response.data.message);
      }
    }
  };

  return (
    <Layout>
      <View style={styles.main}>
        <Header title="Verification 🛡" goBack={navigation.goBack}>
          <Text style={styles.subHeader}>
            Please input the four digit code that was sent{'\n'}to your phone
            number below
          </Text>
        </Header>
        <View style={styles.body}>
          <OTPInputView
            style={styles.otpView}
            code={defaultOtp}
            pinCount={4}
            keyboardType={'number-pad'}
            // autoFocusOnLoad
            codeInputFieldStyle={
              hasErrors ? styles.errorBox : styles.underlineStyleBase
            }
            codeInputHighlightStyle={
              hasErrors ? styles.errorBox : styles.underlineStyleHighLighted
            }
            //   onCodeFilled={handleVerifyOtp}
            onCodeChanged={code => {
              setOTP(code);
            }}
            placeholderCharacter={'ᐧ'}
          />
        </View>
        <View style={styles.otpInstructions}>
          {!isTimerExpired && (
            <Text onPress={resendOTPCode} style={styles.resendText}>
              Verification code can be resent in
            </Text>
          )}
          {hasErrors && (
            <View style={styles.warningBox}>
              <Icon
                type="material-icons"
                name="warning"
                size={14}
                color={StyleGuide.Colors.shades.red[25]}
              />
              <Text
                onPress={resendOTPCode}
                style={[styles.resendText, {marginLeft: 10}]}>
                Wrong Code Entered
              </Text>
            </View>
          )}
          {!isTimerExpired && (
            <Text
              style={[
                styles.resendText,
                {
                  fontSize: scaledSize(14),
                  marginVertical: scaleHeight(10),
                  color: StyleGuide.Colors.shades.magenta[25],
                  fontFamily:
                    Platform.OS === 'ios' ? 'NexaRegular' : 'NexaExtraBold',
                },
              ]}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          )}
          {isTimerExpired && (
            <Text
              onPress={() => (isTimerExpired ? resendOTPCode() : null)}
              style={styles.activeResendButton}>
              Resend OTP
            </Text>
          )}
        </View>
      </View>
      <View style={styles.subtext}>
        <MonieeButton
          title="Submit"
          disabled={defaultOtp.length < 4}
          onPress={() => {
            handleVerifyOtp();
          }}
          isLoading={isLoading}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: StyleGuide.Colors.white},
  subtext: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  main: {
    flex: 1,
    backgroundColor: StyleGuide.Colors.white,
  },
  iconStyle: {
    color: StyleGuide.Colors.shades.grey[900],
  },
  grayBarStyle: {
    height: 3,
    backgroundColor: StyleGuide.Colors.shades.grey[50],
    marginTop: 15,
  },
  greenBarStyle: {
    height: 3,
    backgroundColor: StyleGuide.Colors.shades.green[200],
  },
  header: {
    fontSize: 20,
    color: StyleGuide.Colors.black,
    fontWeight: '500',
    marginTop: 30,
  },
  subHeader: {
    fontSize: scaledSize(12),
    color: StyleGuide.Colors.shades.grey[1450],
    marginTop: 10,
    lineHeight: scaleHeight(15),
    fontFamily: 'NexaRegular',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: StyleGuide.Colors.shades.grey[100],
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  bigInputBox: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBox: {
    width: '30%',
    padding: 14.5,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bigBox: {width: '67%'},
  countryText: {
    fontSize: 16,
    color: StyleGuide.Colors.shades.grey[800],
  },
  actionBtns: {
    backgroundColor: StyleGuide.Colors.shades.green[200],
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 40,
  },
  actionBtnText: {
    color: StyleGuide.Colors.white,
    fontWeight: '700',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: StyleGuide.Colors.shades.grey[400],
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 0,
    // borderBottomWidth: 1,
    color: StyleGuide.Colors.black,
    backgroundColor: 'rgba(159, 86, 212, 0.05)',
  },
  underlineStyleHighLighted: {
    borderColor: StyleGuide.Colors.shades.green[200],
    color: StyleGuide.Colors.shades.green[300],
  },
  otpView: {width: '70%', height: 80, marginTop: 30},
  otpInstructions: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 15,
    marginBottom: 15,
  },
  codeExpires: {
    fontSize: scaleHeight(9),
    color: StyleGuide.Colors.black,
  },
  resendText: {
    fontSize: scaledSize(9),
    color: StyleGuide.Colors.shades.grey[25],
    fontFamily: 'NexaRegular',
  },
  isLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mobileStyle: {
    fontWeight: '700',
  },
  activeResendButton: {
    textDecorationLine: 'underline',
    color: StyleGuide.Colors.shades.magenta[25],
    marginVertical: scaleHeight(10),

    fontFamily: 'NexaRegular',
  },
  inActiveResendButton: {
    textDecorationLine: 'underline',
    color: 'rgba(0,0,0,0.7)',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scaleHeight(10),
  },
  errorBox: {
    borderWidth: 1,
    borderColor: StyleGuide.Colors.shades.red[25],
    width: 45,
    height: 45,
    backgroundColor: 'rgba(159, 86, 212, 0.05)',
    color: StyleGuide.Colors.shades.red[25],
  },
});

export default OTP;
