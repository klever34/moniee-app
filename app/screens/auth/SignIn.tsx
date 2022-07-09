/* eslint-disable no-sparse-arrays */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CountryPicker from 'react-native-country-picker-modal';
import {Country, CountryCode} from '../../types';
import {Decoder} from 'elm-decoders';
import {ScreenProps} from '../../../App';
import StyleGuide from '../../assets/style-guide';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import MonieeButton from '../../components/MonieeButton';
import {LoginPayload, User} from '../../contexts/User';
import {getFieldValidationError, scaleHeight, scaleWidth} from '../../utils';
import {scaledSize} from '../../assets/style-guide/typography';

const SignIn: React.FC<ScreenProps<'SignIn'>> = ({navigation}) => {
  const [hasFormFieldBeenTouched, setHasFormFieldBeenTouched] = useState<{
    [key: string]: boolean;
  }>({
    mobile: false,
  });
  const userDecoder: Decoder<Partial<User>> = Decoder.object({
    country_code: Decoder.string,
    mobile: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length >= 10,
      failureMessage: 'The mobile must be at least 9 digits long',
    }),
  });
  const baseUser: LoginPayload = {
    mobile: '',
    country_code: '234',
  };
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [user, setUser] = useState<LoginPayload>(baseUser);
  //@ts-ignore
  const [countryCode, setCountryCode] = useState<CountryCode>('NG');

  const handleSignIn = async () => {
    navigation.push('SignInVerification', {
      mobile: `${user.country_code}${user.mobile}`,
    });
  };

  const hasFormErrors = (errors: any) => {
    const errorFields = Object.keys(errors);
    return errorFields.length > 0;
  };

  const hasFormBeenTouched = (monitoredFieldsStatus: {
    [key: string]: boolean;
  }) => {
    const values = Object.values(monitoredFieldsStatus);
    return values.some(value => value === true);
  };

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    user.country_code = country.callingCode.toString();
    setShowPicker(false);
  };

  const onChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
    type: string,
  ): void => {
    const updatedUser = {...user, [type]: e.nativeEvent.text};
    const updatedTouchedFields = {...hasFormFieldBeenTouched, [type]: true};

    setFormErrors({});
    setUser(updatedUser);
    setHasFormFieldBeenTouched(updatedTouchedFields);

    const isValid = userDecoder.run(updatedUser);
    if (isValid.type === 'FAIL') {
      const errors: any = isValid.error;
      setFormErrors({[type]: errors[type]});
    }
  };

  const onClose = () => setShowPicker(false);

  return (
    <Layout>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <Header title="Welcome Back 🤗">
            <Text style={styles.subHeader}>Login to your Account</Text>
          </Header>

          <Text style={[styles.subHeader, {marginTop: scaleHeight(50)}]}>
            Enter your phone number
          </Text>
          <View style={styles.bigInputBox}>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={[
                styles.smallBox,
                styles.inputBox,
                hasFormFieldBeenTouched.mobile &&
                  !!getFieldValidationError('mobile', formErrors) &&
                  styles.errorInput,
                hasFormFieldBeenTouched.mobile &&
                  !getFieldValidationError('mobile', formErrors) &&
                  styles.successInput,
                ,
              ]}>
              <CountryPicker
                {...{
                  countryCode,
                  withFilter: true,
                  withFlag: true,
                  withAlphaFilter: false,
                  withCallingCode: true,
                  withEmoji: true,
                  onSelect,
                  preferredCountries: ['NG'],
                  onClose,
                }}
                visible={showPicker}
              />
              <Text style={styles.countryText}>
                {user.country_code !== '' ? user.country_code : ''}
              </Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={16}
                color={StyleGuide.Colors.black}
              />
            </TouchableOpacity>
            <View
              style={[
                styles.bigBox,
                styles.inputBox,
                hasFormFieldBeenTouched.mobile &&
                  !!getFieldValidationError('mobile', formErrors) &&
                  styles.errorInput,
                hasFormFieldBeenTouched.mobile &&
                  !getFieldValidationError('mobile', formErrors) &&
                  styles.successInput,
                ,
              ]}>
              <TextInput
                placeholder={'Phone Number'}
                placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
                onChange={e => onChange(e, 'mobile')}
                editable={user.country_code === '' ? false : true}
                keyboardType={'number-pad'}
                style={styles.colorBlack}
              />
            </View>
          </View>
          {!!getFieldValidationError('mobile', formErrors) && (
            <Text style={styles.errorMsgText}>{formErrors?.mobile.error!}</Text>
          )}

          <View style={styles.subtext}>
            <MonieeButton
              title="Continue"
              mode={
                hasFormBeenTouched(hasFormFieldBeenTouched) &&
                !hasFormErrors(formErrors)
                  ? 'primary'
                  : 'neutral'
              }
              disabled={
                !(
                  hasFormBeenTouched(hasFormFieldBeenTouched) &&
                  !hasFormErrors(formErrors)
                )
              }
              onPress={handleSignIn}
              isLoading={isLoading}
            />
          </View>
          <View>
            <Text
              onPress={() => navigation.push('Register')}
              style={[styles.subHeader, styles.extraStyle]}>
              New here, <Text style={styles.createText}>Create an account</Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    fontSize: scaledSize(14),
    color: StyleGuide.Colors.shades.grey[200],
    marginTop: 10,
    fontFamily: 'NexaRegular',
  },
  iconStyle: {
    color: StyleGuide.Colors.shades.grey[900],
  },
  inputBox: {
    // borderWidth: 1,
    // borderColor: StyleGuide.Colors.shades.grey[100],
    backgroundColor: StyleGuide.Colors.shades.grey[30],
    borderRadius: scaleWidth(10),
    paddingHorizontal: scaleWidth(10),
    marginVertical: scaleHeight(5),
  },
  bigInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBox: {
    width: '30%',
    padding: scaleWidth(7),
    marginRight: scaleWidth(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bigBox: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? scaledSize(20) : 0,
  },
  countryText: {
    fontSize: StyleGuide.Typography[12],
    color: StyleGuide.Colors.shades.grey[800],
  },
  subtext: {
    flex: 1,
    justifyContent: 'center',
  },
  errorInput: {
    borderColor: StyleGuide.Colors.shades.red[100],
  },
  successInput: {
    borderColor: StyleGuide.Colors.primary,
  },
  errorMsgText: {
    color: StyleGuide.Colors.shades.red[100],
    fontSize: StyleGuide.Typography[10],
    marginVertical: scaleHeight(6),
    fontFamily: 'NexaRegular',
  },
  colorBlack: {
    color: StyleGuide.Colors.black,
    fontFamily: 'NexaRegular',
    width: '80%',
  },
  extraStyle: {
    textAlign: 'center',
    color: StyleGuide.Colors.shades.grey[1400],
    fontSize: StyleGuide.Typography[10],
  },
  createText: {
    color: StyleGuide.Colors.shades.magenta[25],
  },
});

export default SignIn;
