/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, Image, Text} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Layout from '../../../components/Layout';
import Subheader from '../../../components/Subheader';
import {
  fetchBankWithdrawals,
  fetchUserBankAccount,
} from '../../../contexts/User';

type DisbursementProps = {
  accountName: string;
  bankId: string;
  bankName: string;
  bankSortCode: string;
  nuban: string;
};

const BankAccount: React.FC<ScreenProps<'BankAccount'>> = ({navigation}) => {
  const [bankObj, setBankObj] = useState<DisbursementProps>();
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    try {
      (async () => {
        const response = await fetchUserBankAccount();
        setBankObj(response.disbursement);
        const withdrawalResponse = await fetchBankWithdrawals();
        setWithdrawals(withdrawalResponse);
      })();
    } catch (error: any) {}
  }, []);

  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Bank Account" goBack={navigation.goBack} />
        <View style={styles.accountContainer}>
          <Image
            source={require('../../../assets/images/fcmb.png')}
            style={styles.image}
          />
          <View>
            <Text style={styles.headerText}>{bankObj?.bankName}</Text>
            <Text style={styles.subText}>{bankObj?.accountName}</Text>
            <Text style={styles.subText}>{bankObj?.nuban}</Text>
          </View>
        </View>
        <Text style={[styles.headerText, styles.extraStyle]}>
          Recent Withdrawals
        </Text>
        {withdrawals.map((item, index) => (
          <View key={index} style={styles.tranxBox}>
            <Text style={styles.subText}>22-March, 2022</Text>
            <Text style={styles.headerText}>₦2,000</Text>
          </View>
        ))}
        {withdrawals.length === 0 && (
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
              No recent Withdrawals
            </Text>
            <Text
              style={[
                styles.instructionsText,
                {
                  textAlign: 'center',
                  paddingBottom: 20,
                  fontSize: scaledSize(10),
                  lineHeight: 15,
                },
              ]}>
              You have not performed any withdrawals{'\n'}on your account
            </Text>
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  headerText: {
    fontSize: scaledSize(14),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.blue[300],
    // marginVertical: 5,
  },
  subText: {
    fontSize: scaledSize(14),
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
    marginVertical: 3,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 60,
    marginRight: 10,
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  extraStyle: {marginTop: 50, fontSize: scaledSize(20), marginBottom: 30},
  tranxBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    // marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  emptyTranxBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    height: 40,
    width: 40,
    marginRight: 5,
  },
  instructionsText: {
    color: StyleGuide.Colors.shades.grey[100],
    fontFamily: 'NexaRegular',
    margin: 5,
  },
});

export default BankAccount;
