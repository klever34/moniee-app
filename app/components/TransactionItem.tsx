/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Platform, Image} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaledSize} from '../assets/style-guide/typography';
// import {format} from 'date-fns';
import {dateConverter} from './NotificationItem';

export type TransactionItemsProps = {
  amount?: string;
  created_at?: string;
  description?: string;
  from?: any;
  id?: number;
  meta?: any;
  status?: string;
  to?: any;
  type?: string;
  updated_at?: string;
  user_id?: number;
};

const TransactionItem = ({
  amount,
  created_at,
  description,
  type,
}: TransactionItemsProps) => {
  return (
    <View style={styles.main}>
      <View
        style={[
          styles.topContainer,
          {paddingHorizontal: 15, backgroundColor: 'white'},
        ]}>
        <View style={styles.avatarBox}>
          <Image
            source={require('../assets/images/moniee.png')}
            style={[styles.avatarImage, {marginBottom: 5}]}
          />
          <View style={styles.greetingsBox}>
            <Text
              style={[
                styles.headerText,
                {
                  fontSize: scaledSize(12),
                  padding: 3,
                  width: 250,
                },
              ]}>
              {description}
            </Text>
            <Text style={[styles.dateText, {opacity: 0.5}]}>
              {/* {format(new Date(created_at!), 'MMM dd, yyyy')} */}
              {dateConverter(created_at!)}
            </Text>
          </View>
        </View>
        <View style={styles.iconsBox}>
          <Text
            style={[
              styles.headerText,
              {
                fontSize: scaledSize(16),
                color:
                  type === 'debit'
                    ? StyleGuide.Colors.shades.red[25]
                    : StyleGuide.Colors.shades.green[300],
              },
            ]}>
            ₦{amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 10,
    marginTop: 10,
    width: '90%',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  avatarImage: {
    height: 35,
    width: 35,
    marginRight: 5,
    borderRadius: 30,
  },
  iconsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  greetingsBox: {},
  greetingsText: {
    color: StyleGuide.Colors.shades.grey[100],
    fontFamily: 'NexaRegular',
    margin: 5,
  },
  dateText: {
    color: StyleGuide.Colors.shades.magenta[50],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    margin: 5,
    fontSize: scaledSize(12),
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
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
    fontSize: scaledSize(20),
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
});

export default TransactionItem;
