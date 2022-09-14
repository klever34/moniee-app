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
  TouchableOpacity,
} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Icon from '../../../components/Icon';
import Keypad from '../../../components/Keypad';
import MonieeButton from '../../../components/MonieeButton';
import {fetchUserInfo, fetchWalletBalance} from '../../../contexts/User';
import {scaleHeight} from '../../../utils';
import formatNumber from 'format-number';
import {AuthContext} from '../../../../context';
import {useIsFocused} from '@react-navigation/native';
import BackgroundFetch from 'react-native-background-fetch';
import {APIUserOBJ} from '../ProfileTab/Profile';

const START_MINUTES = 5;
const START_SECONDS = 0;

const Money: React.FC<ScreenProps<'Money'>> = ({navigation}) => {
  const [moneyValue, setMoneyValue] = useState<string>('');
  const [balance, setBalance] = useState<number>();
  const {signOut} = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [userObj, setUserObj] = useState<APIUserOBJ>();
  const [minutes, setMinutes] = useState(START_MINUTES);
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [isTimerExpired, setTimerStatus] = useState<boolean>(false);

  const formatAsNumber = (arg: number): string => formatNumber()(arg);

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

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

  useEffect(() => {
    try {
      (async () => {
        if (isTimerExpired) {
          await logOutUser();
        }
      })();
    } catch (error: any) {}
  }, [isTimerExpired, logOutUser, minutes, seconds]);

  useEffect(() => {
    BackgroundFetch.configure(
      {
        stopOnTerminate: false,
        minimumFetchInterval: 15,
      },
      async taskId => {
        console.log('checking background exec');
        // await getUserBalance();
        if (isTimerExpired) {
          await logOutUser();
        }
        BackgroundFetch.finish(taskId);
      },
      () => {
        console.log('RNBackgroundFetch failed to start.');
      },
    );

    BackgroundFetch.scheduleTask({
      taskId: 'com.app.moniee',
      forceAlarmManager: true,
      delay: 2000, // <-- milliseconds
    });
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
      console.log('background');

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    try {
      (async () => {
        const userInfo = await fetchUserInfo();

        setUserObj(userInfo);
      })();
    } catch (error: any) {}
  }, [isFocused]);

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
        <ActivityIndicator size={'large'} color={StyleGuide.Colors.white} />
      </View>
    );
  }

  return (
    <View style={[styles.main]}>
      {userObj?.tier! < 2 && (
        <TouchableOpacity
          onPress={() =>
            navigation.push('AccountUpgrade', {
              tier: userObj?.tier!,
            })
          }
          style={styles.redBanner}>
          <Text style={styles.redBannerTitle}>Attention Required!</Text>
          <Text style={styles.redBannerSubTitle}>
            Complete your profile to remove transaction{'\n'}limits and upgrade
            your account
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.topBar}>
        <Icon
          type="material-icons"
          name="qr-code-scanner"
          size={24}
          color={StyleGuide.Colors.white}
          onPress={() => {}}
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
    paddingBottom: 5,
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
    backgroundColor: StyleGuide.Colors.primary,
  },
  redBanner: {
    backgroundColor: StyleGuide.Colors.shades.red[25],
    padding: 10,
    marginVertical: 5,
  },
  redBannerTitle: {
    color: StyleGuide.Colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  redBannerSubTitle: {
    color: StyleGuide.Colors.white,
    fontFamily: 'NexaRegular',
    fontSize: scaledSize(10),
    marginTop: 10,
    lineHeight: 15,
  },
});

export default Money;
