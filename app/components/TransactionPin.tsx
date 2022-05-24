import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import StyleGuide from '../assets/style-guide';
import ActionSheetContainer from './ActionSheetContainer';
import Keypad from './Keypad';
import MonieeActionSheet from './MonieeActionSheet';

type TransactionPinProps = {
  screen?: 'default' | 'done';
  //   onConfirm: () => void;
  onDone: () => void;
  actionSheetRef: any;
};

const TransactionPin = ({
  screen = 'default',
  //   onConfirm,
  onDone,
  actionSheetRef,
}: TransactionPinProps) => {
  const [isLoading] = useState<boolean>(false);
  const [defaultPin, setPIN] = useState<string>('');

  useEffect(() => {
    console.log({defaultPin});
    if (defaultPin.length === 4) {
      console.log('it is done ', defaultPin);
      onDone();
    }
  }, [defaultPin, onDone]);

  const getKeyString = (numericKey: any) => {
    if (numericKey === 'c') {
      setPIN('');
    }
    if (numericKey === '<' && defaultPin.length !== 0) {
      const newString = defaultPin.slice(0, defaultPin.length - 1);
      console.log({newString});
      setPIN(newString);
    } else if (!isNaN(numericKey) && defaultPin.length < 4) {
      setPIN(`${defaultPin}${numericKey}`);
    } else {
      return;
    }
    // console.log({defaultPin});
  };

  return (
    <MonieeActionSheet
      onClose={() => {}}
      onOpen={() => {}}
      refObj={actionSheetRef}>
      {screen === 'default' && (
        <ActionSheetContainer title="Enter PIN">
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
            {isLoading && (
              <View style={styles.isLoading}>
                <ActivityIndicator
                  size={'small'}
                  color={StyleGuide.Colors.primary}
                />
              </View>
            )}
            <View style={styles.extraModalStyle}>
              <Keypad screenType="modal" onPress={num => getKeyString(num)} />
            </View>
          </View>
        </ActionSheetContainer>
      )}
    </MonieeActionSheet>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // height: 400,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
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
  extraModalStyle: {height: 200, width: '100%'},
});

export default TransactionPin;
