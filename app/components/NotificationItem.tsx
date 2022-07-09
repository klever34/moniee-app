/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaledSize} from '../assets/style-guide/typography';
import MonieeButton from './MonieeButton';
import moment from 'moment';

type NotificationProps = {
  amount: number;
  destination: string;
  reason: string;
  type: string;
  created_at: string;
};

const NotificationItem: React.FC<NotificationProps> = ({
  amount,
  destination,
  reason,
  type,
  created_at,
}) => {
  const dateConverter = (myDate: string) => {
    var fromNow = moment(myDate).fromNow();
    return moment(myDate).calendar(null, {
      lastWeek: '[Last] dddd',
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      sameElse: function () {
        return '[' + fromNow + ']';
      },
    });
  };
  const getNotificationType = () => {
    switch (type) {
      case 'request-sent':
        return 'Request Sent';
      case 'withdrawal':
        return 'Withdrawal';
      case 'request':
        return 'Request';
      case 'request-declined':
        return 'Request Declined';
      case 'deposit':
        return 'Deposit';
      default:
        break;
    }
  };

  const descriptionBody = () => {
    switch (type) {
      case 'request-sent':
        return (
          <Text style={styles.body}>
            Your request:<Text style={styles.boldText}> ₦{amount}</Text> for
            <Text style={styles.boldText}> {reason}</Text> has been delivered to
            <Text style={styles.boldText}> {destination}</Text>
          </Text>
        );
      case 'deposit':
        return (
          <Text style={styles.body}>
            <Text style={styles.boldText}>{destination}</Text>
            sent<Text style={styles.boldText}> ₦{amount}</Text> for
            <Text style={styles.boldText}> {reason}</Text>
          </Text>
        );
      case 'withdrawal':
        return (
          <Text style={styles.body}>
            <Text style={styles.boldText}>₦{amount}</Text> successfully sent to
            your bank accout
          </Text>
        );
      case 'request':
        return (
          <Text style={styles.body}>
            <Text style={styles.boldText}>{destination}</Text> has requested
            <Text style={styles.boldText}> ₦{amount}</Text> for
            <Text style={styles.boldText}> {reason}</Text>
          </Text>
        );
      case 'request-declined':
        return (
          <Text style={styles.body}>
            Your request:<Text style={styles.boldText}> ₦{amount}</Text> for
            <Text style={styles.boldText}> {reason}</Text> has been declined by
            <Text style={styles.boldText}> {destination}</Text>
          </Text>
        );
      default:
        return (
          <Text style={styles.body}>
            <Text style={styles.boldText}>Default block</Text>
          </Text>
        );
    }
  };

  return (
    <View style={styles.cardItem}>
      <Image
        source={require('../assets/images/avatar.png')}
        style={styles.avatarImage}
      />
      <View style={styles.rightItem}>
        <View style={styles.topText}>
          <Text style={styles.notyType}>{getNotificationType()}</Text>
          <Text style={styles.notyDate}>· {dateConverter(created_at)} </Text>
        </View>
        <View>{descriptionBody()}</View>
        {type === 'request' && (
          <View style={styles.btn}>
            <MonieeButton
              customStyle={{
                marginRight: 10,
                width: '40%',
                backgroundColor: StyleGuide.Colors.shades.grey[600],
              }}
              onPress={() => {}}
              title="Getat!"
              textColor={StyleGuide.Colors.shades.magenta[25]}
            />
            <MonieeButton
              customStyle={{width: '40%'}}
              onPress={() => {}}
              title="Accept"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    height: 60,
    width: 60,
    marginRight: 5,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 5,
    marginVertical: 5,
  },
  rightItem: {
    marginLeft: 5,
    flex: 1,
  },
  topText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
    paddingVertical: 5,
    lineHeight: 20,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  notyDate: {
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[100],
    fontSize: scaledSize(10),
  },
  notyType: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.primary,
    fontSize: scaledSize(10),
  },
  boldText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
});

export default NotificationItem;
