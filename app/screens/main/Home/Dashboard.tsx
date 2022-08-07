/* eslint-disable react-native/no-inline-styles */
import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Icon from '../../../components/Icon';
import MonieeButton from '../../../components/MonieeButton';
// import TransactionItem from '../../../components/TransactionItem';
import {useToast} from 'react-native-toast-notifications';
import {
  fetchRecentTransactions,
  fetchUserBankAccount,
  fetchUserInfo,
  fetchWalletBalance,
} from '../../../contexts/User';
import {AuthContext} from '../../../../context';
import {useIsFocused} from '@react-navigation/native';
import {APIUserOBJ} from '../ProfileTab/Profile';
import Avatar from '../../../components/Avatar';
import Clipboard from '@react-native-community/clipboard';
import formatNumber from 'format-number';
import {MonieeLogEvent} from '../../../services/apps-flyer';

type CollectionProps = {
  account_name: string;
  account_number: string;
};

const Dashboard: React.FC<ScreenProps<'Dashboard'>> = ({navigation}) => {
  const accountDetailsSheetRef = createRef<ActionSheet>();
  const toast = useToast();
  const [balance, setBalance] = useState<number>();
  const {signOut} = useContext(AuthContext);
  const [userObj, setUserObj] = useState<APIUserOBJ>();
  const isFocused = useIsFocused();
  const [bankObj, setBankObj] = useState<CollectionProps>();
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const formatAsNumber = (arg: number): string => formatNumber()(arg);

  useEffect(() => {
    try {
      (async () => {
        const response = await fetchUserBankAccount();
        setBankObj(response.collection);
      })();
    } catch (error: any) {}
  }, []);

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  useEffect(() => {
    try {
      (async () => {
        const userInfo = await fetchUserInfo();
        await fetchRecentTransactions();
        setUserObj(userInfo);
      })();
    } catch (error: any) {}
  }, [isFocused]);

  useEffect(() => {
    try {
      (async () => {
        const response = await fetchWalletBalance();
        if (response === 401) {
          Alert.alert('Info', 'Your session has timed out, please login again');
          await logOutUser();
          setPageLoading(false);
          return;
        }
        setBalance(response.data.balance);
        setPageLoading(false);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, [logOutUser, isFocused]);

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
      <ScrollView style={[styles.main]}>
        <View style={styles.topContainer}>
          <View style={styles.avatarBox}>
            {/* <Image
              source={require('../../../assets/images/avatar.png')}
              style={styles.avatarImage}
            /> */}
            {userObj?.avatarUrl ? (
              <Image
                source={{uri: userObj?.avatarUrl}}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarBox}>
                <Avatar
                  size="large"
                  name={`${userObj?.firstName} ${userObj?.lastName}`}
                />
              </View>
            )}
            <View style={styles.greetingsBox}>
              <Text style={styles.greetingsText}>Hello,</Text>
              <Text style={styles.accountName}>
                {userObj?.firstName} {userObj?.lastName}
              </Text>
            </View>
          </View>
          <View style={styles.iconsBox}>
            <TouchableOpacity style={styles.iconBg}>
              <Icon
                type="material-icons"
                name="qr-code-scanner"
                size={24}
                color={StyleGuide.Colors.black}
                onPress={() => {}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBg}>
              <Icon
                type="material-icons"
                name="notifications-none"
                size={24}
                color={StyleGuide.Colors.black}
                onPress={() => navigation.push('Notifications')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.middleContainer}>
          <Text style={styles.balanceText}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>
            ₦{formatAsNumber(Number(balance))}
          </Text>
          <View style={styles.btnBox}>
            <MonieeButton
              title="Fund Wallet"
              onPress={() => {
                accountDetailsSheetRef?.current?.show();
                MonieeLogEvent('Fund Wallet Modal', {
                  user: userObj?.mobile,
                });
              }}
            />
            <MonieeButton
              title="Withdraw"
              customStyle={{
                backgroundColor: StyleGuide.Colors.shades.blue[100],
                marginHorizontal: 10,
              }}
              textColor={StyleGuide.Colors.shades.magenta[50]}
              onPress={() => {
                navigation.push('Withdraw');
              }}
              disabled={!balance}
            />
          </View>
        </View>

        {/* Quick Send Section */}
        {/* <View style={styles.quickSend}>
          <Text style={styles.headerText}>Quick Send</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[0, 0, 0, 0, 0, 0, 0, 0].map((item, index) => (
              <View key={index} style={styles.sendItems}>
                <Image
                  source={require('../../../assets/images/avatar.png')}
                  style={styles.avatarImage}
                />
                <Text style={styles.accountName}>David</Text>
              </View>
            ))}
          </ScrollView>
        </View> */}

        <View style={[styles.transactionsBox, {padding: 0}]}>
          <Text style={[styles.headerText, {padding: 20}]}>
            Recent Transactions
          </Text>
          <View style={styles.emptyTranxBox}>
            <Image
              source={require('../../../assets/images/note.png')}
              style={styles.avatarImage}
            />
            <Text
              style={[
                styles.headerText,
                {color: StyleGuide.Colors.shades.grey[25]},
              ]}>
              No recent Transaction
            </Text>
            <Text
              style={[
                styles.greetingsText,
                {
                  textAlign: 'center',
                  paddingBottom: 20,
                  fontSize: scaledSize(10),
                  lineHeight: 15,
                },
              ]}>
              You have not performed any{'\n'}transaction, you can send/request
              money
              {'\n'}from your contacts{' '}
            </Text>
          </View>
          {/* going to be a flatlist */}
          {/* <TransactionItem />
          <TransactionItem /> */}
        </View>
        <ActionSheet
          initialOffsetFromBottom={1}
          ref={accountDetailsSheetRef}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          containerStyle={{height: 400}}
          defaultOverlayOpacity={0.3}>
          <View
            style={{
              paddingHorizontal: 12,
            }}>
            <View style={{}}>
              <Text style={styles.modalTitle}>Fund Wallet</Text>
              <Text style={styles.modalSubTitle}>
                Pay the desired funding amount to the account below
              </Text>
              <View style={styles.modalBody}>
                <View style={styles.textBox}>
                  <Text style={styles.smallText}>Bank</Text>
                  <Text style={styles.bigText}>Providus Bank</Text>
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.smallText}>Account Name</Text>
                  <Text style={styles.bigText}>{bankObj?.account_name}</Text>
                </View>
                <View style={[styles.topContainer, {padding: 0}]}>
                  <View style={styles.textBox}>
                    <Text style={styles.smallText}>Account Number</Text>
                    <Text style={styles.bigText}>
                      {bankObj?.account_number}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(`${bankObj?.account_number}`);
                      accountDetailsSheetRef?.current?.hide();
                      toast.show('Account number has been copied!', {
                        type: 'custom_toast',
                        animationDuration: 100,
                        data: {
                          title: 'Copied to clipboard',
                        },
                      });
                    }}
                    style={[styles.avatarBox, styles.copyBox]}>
                    <Icon
                      type="material-icons"
                      name="content-copy"
                      size={14}
                      color={StyleGuide.Colors.shades.magenta[80]}
                    />
                    <Text style={styles.copyText}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ActionSheet>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    backgroundColor: StyleGuide.Colors.shades.grey[30],
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  avatarImage: {
    height: 40,
    width: 40,
    marginRight: 5,
  },
  iconsBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingsBox: {},
  greetingsText: {
    color: StyleGuide.Colors.shades.grey[100],
    fontFamily: 'NexaRegular',
    margin: 5,
  },
  accountName: {
    color: StyleGuide.Colors.shades.magenta[50],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    margin: 5,
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    backgroundColor: StyleGuide.Colors.white,
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },
  middleContainer: {
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    color: StyleGuide.Colors.shades.blue[300],
    opacity: 0.4,
    fontFamily: 'NexaRegular',
    marginBottom: 15,
  },
  balanceAmount: {
    color: StyleGuide.Colors.shades.blue[300],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    marginBottom: 50,
    fontSize: scaledSize(40),
  },
  headerText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.magenta[50],
    fontSize: scaledSize(16),
  },
  quickSend: {
    backgroundColor: 'white',
    padding: 20,
  },
  sendItems: {
    alignItems: 'center',
    margin: 20,
    marginLeft: 0,
  },
  transactionsBox: {
    padding: 20,
  },
  modalTitle: {
    textAlign: 'center',
    color: StyleGuide.Colors.primary,
    fontSize: StyleGuide.Typography[16],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    marginTop: 10,
  },
  modalSubTitle: {
    textAlign: 'center',
    color: StyleGuide.Colors.shades.grey[1400],
    fontSize: scaledSize(13),
    fontFamily: 'NexaRegular',
    marginVertical: 15,
  },
  modalBody: {
    backgroundColor: StyleGuide.Colors.shades.grey[30],
  },
  smallText: {
    color: StyleGuide.Colors.shades.grey[50],
    fontSize: scaledSize(12),
    fontFamily: 'NexaRegular',
    marginBottom: 10,
  },
  bigText: {
    color: StyleGuide.Colors.shades.grey[500],
    fontSize: scaledSize(16),
    fontFamily: 'NexaRegular',
  },
  textBox: {
    margin: 20,
  },
  copyText: {
    color: StyleGuide.Colors.shades.magenta[80],
    marginLeft: 10,
    fontFamily: 'NexaRegular',
    marginTop: 3,
  },
  copyBox: {
    backgroundColor: 'rgba(159, 86, 212, 0.2)',
    borderRadius: scaledSize(15),
    padding: 10,
  },
  emptyTranxBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Dashboard;
