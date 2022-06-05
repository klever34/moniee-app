/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';
import StyleGuide from '../assets/style-guide';
import MonieeButton from './MonieeButton';

type NotificationProps = {};

const NotificationItem: React.FC<NotificationProps> = ({}) => {
  return (
    <View style={styles.cardItem}>
      <Image
        source={require('../assets/images/avatar.png')}
        style={styles.avatarImage}
      />
      <View style={styles.rightItem}>
        <View style={styles.topText}>
          <Text style={styles.notyType}>Request </Text>
          <Text style={styles.notyDate}>· Today </Text>
        </View>
        <Text style={styles.body}>
          <Text style={styles.boldText}>+2348123456789</Text> has requested
          <Text style={styles.boldText}> ₦3,000</Text> for the money for{' '}
          <Text style={styles.boldText}>battery</Text>
        </Text>
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
    padding: 20,
  },
  rightItem: {
    marginLeft: 5,
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
  },
  notyType: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.primary,
  },
  boldText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
});

export default NotificationItem;
