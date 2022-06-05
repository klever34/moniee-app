/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Platform, Image} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaledSize} from '../assets/style-guide/typography';

type TransactionItemsProps = {
  amount?: number;
};

const TransactionItem = ({amount = 2000}: TransactionItemsProps) => {
  return (
    <View style={[styles.main]}>
      <View
        style={[
          styles.topContainer,
          {paddingHorizontal: 15, backgroundColor: 'white'},
        ]}>
        <View style={styles.avatarBox}>
          <Image
            source={require('../assets/images/avatar.png')}
            style={[styles.avatarImage, {marginBottom: 5}]}
          />
          <View style={styles.greetingsBox}>
            <Text
              style={[
                styles.headerText,
                {fontSize: scaledSize(14), padding: 3},
              ]}>
              Withdrawal
            </Text>
            <Text style={[styles.accountName, {opacity: 0.5}]}>
              23 Mar, 2022
            </Text>
          </View>
        </View>
        <View style={styles.iconsBox}>
          <Text
            style={[
              styles.headerText,
              {
                fontSize: scaledSize(16),
                color: StyleGuide.Colors.shades.red[25],
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
  main: {},
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
