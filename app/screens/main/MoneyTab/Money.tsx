/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  Alert,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Icon from '../../../components/Icon';
import Keypad from '../../../components/Keypad';
import MonieeButton from '../../../components/MonieeButton';
import {fetchWalletBalance} from '../../../contexts/User';
import {scaleHeight} from '../../../utils';
import formatNumber from 'format-number';
import {AuthContext} from '../../../../context';
import {useIsFocused} from '@react-navigation/native';
import BackgroundFetch from 'react-native-background-fetch';

const Money: React.FC<ScreenProps<'Money'>> = ({navigation}) => {
  const [moneyValue, setMoneyValue] = useState<string>('');
  const [balance, setBalance] = useState<number>();
  const {signOut} = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const formatAsNumber = (arg: number): string => formatNumber()(arg);

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    BackgroundFetch.configure(
      {
        stopOnTerminate: false,
        minimumFetchInterval: 15,
      },
      async taskId => {
        await getUserBalance();
        BackgroundFetch.finish(taskId);
      },
      () => {
        console.log('RNBackgroundFetch failed to start.');
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getUserBalance = async () => {
    const response = await fetchWalletBalance();
    if (response === 401) {
      Alert.alert('Info', 'Your session has timed out, please login again');
      await logOutUser();
      return;
    }
    setBalance(response?.data?.balance);
  };

  useEffect(() => {
    try {
      (async () => {
        await getUserBalance();
        setPageLoading(false);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logOutUser, isFocused, appStateVisible]);

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

  if (pageLoading) {
    return (
      <View style={styles.isLoading}>
        <ActivityIndicator
          size={'large'}
          color={StyleGuide.Colors.primary}
          style={{marginBottom: StyleGuide.Typography[18]}}
        />
      </View>
    );
  }

  return (
    <View style={[styles.main]}>
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
          onPress={() => navigation.push('TransactionHistory')}
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
          placeholderTextColor={StyleGuide.Colors.white}
          keyboardType={'number-pad'}
          placeholder={'0 '}
          // onChange={e => console.log(Number(e.nativeEvent.text))}
          editable={false}
          style={[styles.currency, {alignSelf: 'center'}]}>
          {moneyValue}
        </TextInput>
      </View>
      <Keypad screenType="Home" onPress={num => getKeyString(num)} />
      <View style={[styles.ctaButtons, {marginTop: 10}]}>
        <View style={[styles.expandBtn, styles.buttonSpacer]}>
          <MonieeButton
            title="Request"
            mode={'secondary'}
            onPress={() => {
              if (moneyValue.length === 0) {
                return;
              }
              navigation.push('RequestMoney', {
                funds_type: 'request',
                amount: moneyValue,
              });
            }}
          />
        </View>
        <View style={styles.expandBtn}>
          <MonieeButton
            title="Send"
            mode={'secondary'}
            onPress={() => {
              if (moneyValue.length === 0) {
                return;
              }
              navigation.push('RequestMoney', {
                funds_type: 'send',
                amount: moneyValue,
              });
            }}
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
    backgroundColor: StyleGuide.Colors.shades.magenta[50],
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
    color: StyleGuide.Colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    fontSize: scaledSize(20),
  },
  subText: {
    color: StyleGuide.Colors.white,
    fontFamily: 'NexaRegular',
    opacity: 0.7,
    fontSize: scaledSize(12),
  },
  currency: {
    fontSize: scaledSize(46),
    color: StyleGuide.Colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  walletBalance: {
    backgroundColor: 'rgba(159, 86, 212, 0.1)',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },
  moneyBox: {
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Money;
