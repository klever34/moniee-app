import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {ScreenProps} from '../../../../../App';
import StyleGuide from '../../../../assets/style-guide';
import Keypad from '../../../../components/Keypad';
import {changeUserPasscode} from '../../../../contexts/User';
import {useToast} from 'react-native-toast-notifications';

const ConfirmNewPin: React.FC<ScreenProps<'ConfirmNewPin'>> = ({
  navigation,
  route,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [defaultPin, setPIN] = useState<string>('');
  const {old_pin, new_pin} = route.params;
  const toast = useToast();

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

  const changeUserPin = useCallback(async () => {
    if (defaultPin !== new_pin) {
      Alert.alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await changeUserPasscode({
        old_pin,
        new_pin,
      });
      toast.show(response.data.message, {
        type: 'custom_toast',
        animationDuration: 100,
        data: {
          title: 'Info',
        },
      });
      setLoading(false);
      navigation.goBack();
    } catch (err: any) {
      console.log(err.response);
      setLoading(false);
      if (err?.response?.data) {
        Alert.alert('Error', err.response.data.message);
      }
    }
  }, [defaultPin, navigation, new_pin, old_pin, toast]);

  useEffect(() => {
    if (defaultPin.length === 4) {
      changeUserPin();
    }
  }, [changeUserPin, defaultPin]);

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
            onCodeChanged={code => {
              console.log({code});
            }}
            editable={false}
            placeholderCharacter={'ᐧ'}
            secureTextEntry={true}
          />
        </View>
        <Text style={styles.subText}>Confirm PIN</Text>
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

export default ConfirmNewPin;
