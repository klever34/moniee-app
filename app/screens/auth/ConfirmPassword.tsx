import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Alert,
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
import {AuthContext} from '../../../context';
import EncryptedStorage from 'react-native-encrypted-storage';
import {setUserPin} from '../../contexts/User';
import Icon from '../../components/Icon';
import {setAxiosToken} from '../../services/api';

const ConfirmPassword: React.FC<ScreenProps<'ConfirmPassword'>> = ({
  navigation,
  route,
}) => {
  const [defaultOtp, setOTP] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const {signIn} = useContext(AuthContext);
  const {pin} = route.params;
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const handleVerifyOtp = useCallback(async () => {
    try {
      setLoading(true);
      const userObj = JSON.parse(
        //@ts-ignore
        await EncryptedStorage.getItem('userDetails'),
      );
      const id = await EncryptedStorage.getItem('user-id');
      const userDetails = await EncryptedStorage.getItem('userDetails');
      const storedUserState = JSON.parse(userDetails!);
      setAxiosToken(storedUserState.token);
      await setUserPin({pin: defaultOtp}, Number(id));
      await EncryptedStorage.setItem('@user_token', userObj.token);
      signIn();
      setLoading(false);
    } catch (error: any) {
      console.log(error.response.data);
      if (error?.response?.data) {
        Alert.alert('Error', error.response.data.message);
      }
      setLoading(false);
    }
  }, [defaultOtp, signIn]);

  useEffect(() => {
    try {
      (async () => {
        Keyboard.dismiss();
        if (defaultOtp.length === 4 && defaultOtp === pin) {
          handleVerifyOtp();
        } else if (defaultOtp !== pin && defaultOtp.length === 4) {
          setHasErrors(true);
        }
      })();
    } catch (error: any) {}
  }, [defaultOtp, handleVerifyOtp, navigation, pin, signIn]);

  const getKeyString = (numericKey: any) => {
    setHasErrors(false);
    if (numericKey === 'c') {
      setOTP('');
    }
    if (numericKey === '<' && defaultOtp.length !== 0) {
      const newString = defaultOtp.slice(0, defaultOtp.length - 1);
      setOTP(newString);
    } else if (!isNaN(numericKey) && defaultOtp.length < 4) {
      setOTP(`${defaultOtp}${numericKey}`);
    } else {
      return;
    }
  };

  return (
    <Layout>
      {/* <ScrollView style={styles.page}> */}
      <View style={styles.main}>
        <Header goBack={navigation.goBack} title="Confirm PIN 🙈">
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
              // onCodeFilled={handleVerifyOtp}
              onCodeChanged={code => {
                Keyboard.dismiss();
                setOTP(code);
              }}
              editable={false}
              placeholderCharacter={'ᐧ'}
              secureTextEntry={true}
            />
          </View>
          {hasErrors && (
            <View style={styles.warningBox}>
              <Icon
                type="material-icons"
                name="warning"
                size={14}
                color={StyleGuide.Colors.shades.red[25]}
              />
              <Text style={[styles.resendText, {marginLeft: 10}]}>
                PINs do not match
              </Text>
            </View>
          )}
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
    borderRadius: 5,
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
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scaleHeight(10),
  },
});

export default ConfirmPassword;
