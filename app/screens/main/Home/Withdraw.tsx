/* eslint-disable react-native/no-inline-styles */
import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {View, Text, StyleSheet, Platform, TextInput, Alert} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Icon from '../../../components/Icon';
import Keypad from '../../../components/Keypad';
import MonieeButton from '../../../components/MonieeButton';
import {fetchWalletBalance, withdrawFunds} from '../../../contexts/User';
import {scaleHeight} from '../../../utils';
import formatNumber from 'format-number';
import {AuthContext} from '../../../../context';
import TransactionPin from '../../../components/TransactionPin';
import ActionSheet from 'react-native-actions-sheet';

const Withdraw: React.FC<ScreenProps<'Withdraw'>> = ({navigation}) => {
  const [moneyValue, setMoneyValue] = useState<string>('');
  const [balance, setBalance] = useState<number>();
  const {signOut} = useContext(AuthContext);
  const transactionPinSheetRef = createRef<ActionSheet>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const formatAsNumber = (arg: number): string => formatNumber()(arg);

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  useEffect(() => {
    try {
      (async () => {
        const response = await fetchWalletBalance();
        if (response === 401) {
          Alert.alert('Info', 'Your session has timed out, please login again');
          await logOutUser();
          return;
        }
        setBalance(response.data.balance);
      })();
    } catch (error: any) {}
  }, [logOutUser]);

  const getKeyString = (numericKey: any) => {
    if (numericKey === 0 && moneyValue.length === 0) {
      return;
    }
    if (numericKey === '<' && moneyValue.length !== 0) {
      const newString = moneyValue.slice(0, moneyValue.length - 1);
      setMoneyValue(newString);
    } else if (!isNaN(numericKey) || numericKey === '.') {
      setMoneyValue(`${moneyValue}${numericKey}`);
    } else {
      return;
    }
  };

  const handleWithdrawal = async (pin: string) => {
    transactionPinSheetRef?.current?.hide();
    setLoading(true);
    try {
      const response = await withdrawFunds({amount: Number(moneyValue), pin});
      setLoading(false);
      if (response === 401) {
        Alert.alert('Info', 'Your session has timed out, please login again');
        await logOutUser();
        return;
      } else if (!response.data.status) {
        Alert.alert('Info', `${response.data.message}`);
      } else {
        navigation.replace('WithdrawSuccessful');
      }
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.data) {
        Alert.alert('Error', error.response.data.message);
        return;
      }
    }
  };

  return (
    //@ts-ignore
    <View style={[styles.main]}>
      <TransactionPin
        actionSheetRef={transactionPinSheetRef}
        onDone={(pin: string) => handleWithdrawal(pin)}
      />
      <View style={styles.topBar}>
        <Icon
          type="material-icons"
          name="qr-code-scanner"
          size={24}
          color={StyleGuide.Colors.white}
          onPress={() => navigation.push('QRCodeScreen')}
        />
        <View style={styles.walletBalance}>
          <Text style={styles.subText}>Wallet Balance</Text>
          <Text style={styles.moneyText}>
            ₦ {balance !== undefined ? formatAsNumber(balance) : '-'}
          </Text>
        </View>
        <Icon
          type="material-icons"
          name="access-time"
          size={24}
          color={StyleGuide.Colors.white}
        />
      </View>
      <View style={[styles.ctaButtons, styles.moneyBox]}>
        <Text
          style={[
            styles.currency,
            {
              fontSize: scaledSize(30),
              marginBottom: Platform.OS === 'ios' ? 10 : 0,
              marginRight: 10,
            },
          ]}>
          ₦
        </Text>
        <TextInput
          autoFocus
          placeholderTextColor={StyleGuide.Colors.primary}
          keyboardType={'number-pad'}
          placeholder={'0 '}
          // onChange={e => console.log(Number(e.nativeEvent.text))}
          editable={false}
          style={[styles.currency, {alignSelf: 'center'}]}>
          {moneyValue}
        </TextInput>
      </View>
      <Keypad onPress={num => getKeyString(num)} />
      <View style={[styles.ctaButtons, {marginTop: 10}]}>
        <View style={[styles.expandBtn]}>
          <MonieeButton
            title="Withdraw to Bank"
            mode={'secondary'}
            disabled={moneyValue === ''}
            customStyle={{backgroundColor: StyleGuide.Colors.shades.blue[400]}}
            textColor={StyleGuide.Colors.primary}
            onPress={() => {
              transactionPinSheetRef?.current?.show();
            }}
            isLoading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    backgroundColor: StyleGuide.Colors.white,
  },
  subHeader: {
    fontSize: scaledSize(12),
    color: StyleGuide.Colors.shades.grey[1450],
    marginTop: 10,
    lineHeight: scaleHeight(15),
    fontFamily: 'NexaRegular',
    textAlign: 'center',
  },
  ctaButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandBtn: {
    flex: 1,
  },
  buttonSpacer: {
    marginRight: scaledSize(30),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moneyText: {
    color: StyleGuide.Colors.black,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    fontSize: scaledSize(20),
  },
  subText: {
    color: StyleGuide.Colors.shades.grey[25],
    fontFamily: 'NexaRegular',
    opacity: 0.7,
    fontSize: scaledSize(12),
  },
  currency: {
    fontSize: scaledSize(46),
    color: StyleGuide.Colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  walletBalance: {
    backgroundColor: 'rgba(0, 198, 251, 0.1)',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },
  moneyBox: {
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
});

export default Withdraw;
