import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaledSize} from '../assets/style-guide/typography';

type Props = {
  onPress: (num: number | string) => void;
  screenType?: string;
};

const Keypad: React.FC<Props> = ({onPress, screenType}) => {
  let rows = [];
  let nums = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [screenType && screenType === 'Home' ? '.' : 'c', 0, '<'],
  ];
  for (let index = 0; index < 4; index++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      row.push(
        <TouchableOpacity
          key={nums[index][j]}
          onPress={() => onPress(nums[index][j])}
          style={styles.btn}>
          <Text
            style={[
              nums[index][j] !== 'c' && nums[index][j] !== '<'
                ? styles.btntext
                : styles.btntext2,
              screenType && screenType === 'Home'
                ? styles.textWhite
                : styles.textBlack,
            ]}>
            {nums[index][j]}
          </Text>
        </TouchableOpacity>,
      );
    }
    rows.push(
      <View style={styles.row} key={index}>
        {row}
      </View>,
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <View style={styles.numbers}>{rows}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btntext: {
    fontSize: Platform.OS === 'ios' ? scaledSize(30) : scaledSize(20),
    color: StyleGuide.Colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  btntext2: {
    fontSize: Platform.OS === 'ios' ? scaledSize(30) : scaledSize(20),
    color: StyleGuide.Colors.shades.grey[50],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttons: {
    flex: 7,
    flexDirection: 'row',
  },
  numbers: {
    flex: 3,
  },
  textWhite: {
    color: StyleGuide.Colors.white,
    fontSize: Platform.OS === 'ios' ? scaledSize(30) : scaledSize(20),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  textBlack: {
    color: StyleGuide.Colors.primary,
    fontSize: Platform.OS === 'ios' ? scaledSize(30) : scaledSize(20),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
});

export default Keypad;
