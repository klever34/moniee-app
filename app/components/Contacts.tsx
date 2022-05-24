import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import StyleGuide from '../assets/style-guide';
import {scaleWidth} from '../utils';
import {GenericStylesProp} from './StackedText';

type ContactProps = {
  style?: GenericStylesProp;
  name?: string;
  phone?: string;
};

const Contacts: React.FC<ContactProps> = ({name, phone}) => {
  let displayLetter: string;
  if (name && name[0].match(/[A-Za-z]/)) {
    const splitText = name.split(' ');
    if (splitText.length > 1) {
      displayLetter = `${splitText[0][0]}${splitText[1][0] ?? ''}`;
    } else {
      displayLetter = name[0];
    }
  } else {
    displayLetter = '#';
  }
  return (
    <View style={styles.default}>
      <View style={styles.nameConcat}>
        <Text style={styles.nameConcatText}>{displayLetter}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.headerText}>{name}</Text>
        <Text style={styles.subHeaderText}>{phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  default: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleWidth(12),
    borderBottomColor: StyleGuide.Colors.shades.grey[700],
    borderBottomWidth: 1,
  },
  nameConcat: {
    backgroundColor: StyleGuide.Colors.shades.orange[200],
    padding: scaleWidth(8),
    borderRadius: scaleWidth(8),
  },
  rightSection: {
    marginLeft: scaleWidth(12),
  },
  headerText: {
    fontSize: StyleGuide.Typography[14],
    fontWeight: '700',
    color: StyleGuide.Colors.black,
  },
  subHeaderText: {
    fontSize: StyleGuide.Typography[12],
  },
  nameConcatText: {
    fontSize: StyleGuide.Typography[14],
    fontWeight: '700',
  },
});

export default Contacts;
