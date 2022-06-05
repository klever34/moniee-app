/* eslint-disable react-native/no-inline-styles */
import React, {createRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {ScreenProps} from '../../../../../../App';
import StyleGuide from '../../../../../assets/style-guide';
import {scaledSize} from '../../../../../assets/style-guide/typography';
import Layout from '../../../../../components/Layout';
import MonieeButton from '../../../../../components/MonieeButton';
import Subheader from '../../../../../components/Subheader';

const BankStatement: React.FC<ScreenProps<'BankStatement'>> = ({
  navigation,
}) => {
  const [hasBankStatement] = useState<boolean>(false);
  const actionSheetRef = createRef<ActionSheet>();

  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Bank Statement" goBack={navigation.goBack} />
        <ScrollView style={styles.main}>
          {!hasBankStatement && (
            <View style={styles.noId}>
              <Image
                source={require('../../../../../assets/images/statement.png')}
                style={styles.badgeStyle}
              />
              <Text style={styles.headerText}>Add Bank Statement</Text>
              <Text style={styles.subText}>
                Adding your bank statement allows{'\n'}you access to more
                features
              </Text>
              <View style={[styles.expandBtn]}>
                <MonieeButton
                  title="Upload File"
                  mode={'secondary'}
                  customStyle={{
                    backgroundColor: StyleGuide.Colors.shades.blue[400],
                    marginTop: 40,
                  }}
                  textColor={StyleGuide.Colors.primary}
                  onPress={() => {
                    actionSheetRef?.current?.show();
                  }}
                />
              </View>
            </View>
          )}
          {hasBankStatement && (
            <View style={[styles.main]}>
              <Text style={styles.selectTextStyle} />
            </View>
          )}
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  badgeStyle: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  noId: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    fontSize: scaledSize(18),
    color: StyleGuide.Colors.black,
  },
  subText: {
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Light' : 'NexaLight',
    fontSize: scaledSize(12),
    color: StyleGuide.Colors.black,
    lineHeight: 15,
    textAlign: 'center',
    marginVertical: 10,
  },
  expandBtn: {
    flex: 1,
  },
  textInputStyle: {
    backgroundColor: StyleGuide.Colors.shades.grey[600],
    padding: 10,
    color: StyleGuide.Colors.shades.grey[800],
    marginVertical: 5,
    borderRadius: 5,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  uploadBox: {
    backgroundColor: StyleGuide.Colors.shades.grey[600],
    padding: 30,
    marginVertical: 30,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTextStyle: {
    color: StyleGuide.Colors.shades.grey[800],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    padding: 10,
  },
});

export default BankStatement;
