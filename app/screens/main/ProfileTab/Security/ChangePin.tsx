import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {ScreenProps} from '../../../../../App';
import StyleGuide from '../../../../assets/style-guide';
import Keypad from '../../../../components/Keypad';

const ChangePin: React.FC<ScreenProps<'ChangePin'>> = ({navigation}) => {
  const [isLoading] = useState<boolean>(false);
  const [defaultPin, setPIN] = useState<string>('');

  useEffect(() => {
    if (defaultPin.length === 4) {
      navigation.replace('SetNewPin', {
        old_pin: defaultPin,
      });
    }
  }, [defaultPin, navigation]);

  const getKeyString = (numericKey: any) => {
    if (numericKey === 'c') {
      setPIN('');
    }
    if (numericKey === '<' && defaultPin.length !== 0) {
      const newString = defaultPin.slice(0, defaultPin.length - 1);
      setPIN(newString);
    } else if (!isNaN(numericKey) && defaultPin.length < 4) {
      setPIN(`${defaultPin}${numericKey}`);
    } else {
      return;
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.body}>
        <View style={styles.otpBody}>
          <OTPInputView
            style={styles.otpView}
            code={defaultPin}
            pinCount={4}
            keyboardType={'number-pad'}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            // onCodeFilled={handleVerifyOtp}
            onCodeChanged={code => {
              console.log({code});
            }}
            editable={false}
            placeholderCharacter={'ᐧ'}
            secureTextEntry={true}
          />
        </View>
        <Text style={styles.subText}>Enter your current PIN</Text>
        {isLoading && (
          <View style={styles.isLoading}>
            <ActivityIndicator
              size={'small'}
              color={StyleGuide.Colors.primary}
            />
          </View>
        )}
        <View style={styles.extraModalStyle}>
          <Keypad
            screenType="modal"
            onPress={(num: any) => getKeyString(num)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 40,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  otpBody: {},
  otpView: {width: '50%', height: 80, marginTop: 30},
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: StyleGuide.Colors.black,
    backgroundColor: 'rgba(159, 86, 212, 0.05)',
  },
  underlineStyleHighLighted: {
    color: StyleGuide.Colors.shades.green[300],
  },
  isLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  extraModalStyle: {height: '65%', width: '100%', marginTop: 30},
  subText: {
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
    margin: 20,
  },
});

export default ChangePin;
