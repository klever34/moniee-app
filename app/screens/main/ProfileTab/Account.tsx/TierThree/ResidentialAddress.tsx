/* eslint-disable react-native/no-inline-styles */
import React, {createRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Platform,
  TextInput,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {ScreenProps} from '../../../../../../App';
import StyleGuide from '../../../../../assets/style-guide';
import {scaledSize} from '../../../../../assets/style-guide/typography';
import ActionSheetContainer from '../../../../../components/ActionSheetContainer';
import Layout from '../../../../../components/Layout';
import MonieeActionSheet from '../../../../../components/MonieeActionSheet';
import MonieeButton from '../../../../../components/MonieeButton';
import Subheader from '../../../../../components/Subheader';

const ResidentialAddress: React.FC<ScreenProps<'ResidentialAddress'>> = ({
  navigation,
}) => {
  const [hasAddress, setAddress] = useState<boolean>(false);
  const actionSheetRef = createRef<ActionSheet>();

  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Residential Address" goBack={navigation.goBack} />
        <ScrollView style={styles.main}>
          {!hasAddress && (
            <View style={styles.noId}>
              <Image
                source={require('../../../../../assets/images/address.png')}
                style={styles.badgeStyle}
              />
              <Text style={styles.headerText}>
                Add your Residential Address
              </Text>
              <Text style={styles.subText}>
                Add your place of permanent{'\n'}residence
              </Text>
              <View style={[styles.expandBtn]}>
                <MonieeButton
                  title="Add Home Address"
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
          {hasAddress && (
            <View style={[styles.main]}>
              <Text style={styles.selectTextStyle}>
                12, First Street, Second City, Third State, Nigeria
              </Text>
            </View>
          )}
        </ScrollView>
        <MonieeActionSheet
          onClose={() => {}}
          onOpen={() => {}}
          refObj={actionSheetRef}>
          <ActionSheetContainer title="Add Home Address">
            <View>
              <TextInput
                style={styles.textInputStyle}
                placeholder={'Street'}
                placeholderTextColor={StyleGuide.Colors.shades.grey[50]}
              />
              <TextInput
                style={styles.textInputStyle}
                placeholder={'City'}
                placeholderTextColor={StyleGuide.Colors.shades.grey[50]}
              />
              <TextInput
                style={styles.textInputStyle}
                placeholder={'State'}
                placeholderTextColor={StyleGuide.Colors.shades.grey[50]}
              />
              <MonieeButton
                title="Save Address"
                mode={'primary'}
                onPress={() => {
                  setAddress(true);
                  actionSheetRef?.current?.hide();
                }}
                customStyle={{
                  marginTop: 20,
                }}
              />
            </View>
          </ActionSheetContainer>
        </MonieeActionSheet>
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

export default ResidentialAddress;
