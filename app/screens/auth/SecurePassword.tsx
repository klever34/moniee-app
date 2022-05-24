import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Header from '../../components/Header';
import {ScreenProps} from '../../../App';
import Layout from '../../components/Layout';
import StyleGuide from '../../assets/style-guide';
// import {sendOtp} from '../../contexts/User';
import {scaleHeight} from '../../utils';
import {scaledSize} from '../../assets/style-guide/typography';
import Keypad from '../../components/Keypad';

const SecurePassword: React.FC<ScreenProps<'SecurePassword'>> = ({
  navigation,
}) => {
  const [defaultOtp, setOTP] = useState<string>('');
  const [isLoading] = useState<boolean>(false);

  useEffect(() => {
    Keyboard.dismiss();
    console.log({defaultOtp});
    if (defaultOtp.length === 4) {
      navigation.push('ConfirmPassword');
    }
  }, [defaultOtp, navigation]);

  const handleVerifyOtp = async (code: string) => {
    console.log({code});
    return;
  };

  const getKeyString = (numericKey: any) => {
    // console.log({numericKey});
    if (numericKey === 'c') {
      setOTP('');
    }
    if (numericKey === '<' && defaultOtp.length !== 0) {
      const newString = defaultOtp.slice(0, defaultOtp.length - 1);
      console.log({newString});
      setOTP(newString);
    } else if (!isNaN(numericKey) && defaultOtp.length < 4) {
      setOTP(`${defaultOtp}${numericKey}`);
    } else {
      return;
    }
    // console.log({defaultOtp});
  };

  return (
    <Layout>
      {/* <ScrollView style={styles.page}> */}
      <View style={styles.main}>
        <Header goBack={navigation.goBack} title="Set PIN 🙈">
          <Text style={styles.subHeader}>
            Facilisis mauris, potenti vitae cras risus.
          </Text>
        </Header>
        <View style={styles.body}>
          <View style={styles.otpBody}>
            <OTPInputView
              style={styles.otpView}
              code={defaultOtp}
              pinCount={4}
              keyboardType={'number-pad'}
              // autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={handleVerifyOtp}
              onCodeChanged={code => {
                Keyboard.dismiss();
                console.log({code});
                setOTP(code);
              }}
              editable={false}
              placeholderCharacter={'ᐧ'}
              secureTextEntry={true}
            />
          </View>
          {isLoading && (
            <View style={styles.isLoading}>
              <ActivityIndicator
                size={'large'}
                color={StyleGuide.Colors.primary}
              />
            </View>
          )}
        </View>
        <Keypad onPress={num => getKeyString(num)} />
      </View>
      {/* </ScrollView> */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: StyleGuide.Colors.white},
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
    // textAlign: 'center',
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
    // borderColor: StyleGuide.Colors.shades.grey[400],
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: StyleGuide.Colors.black,
    backgroundColor: 'rgba(159, 86, 212, 0.05)',
  },
  underlineStyleHighLighted: {
    // borderColor: StyleGuide.Colors.shades.green[200],
    color: StyleGuide.Colors.shades.green[300],
  },
  otpView: {width: '50%', height: 80, marginTop: 30},
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
    fontSize: scaleHeight(9),
    color: StyleGuide.Colors.shades.grey[1250],
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
    // fontWeight: 'bold',
    fontFamily: 'NexaRegular',
  },
  inActiveResendButton: {
    textDecorationLine: 'underline',
    color: 'rgba(0,0,0,0.7)',
  },
  otpBody: {},
});

export default SecurePassword;
