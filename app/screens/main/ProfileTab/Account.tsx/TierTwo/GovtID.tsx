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
  TouchableOpacity,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {ScreenProps} from '../../../../../../App';
import StyleGuide from '../../../../../assets/style-guide';
import {scaledSize} from '../../../../../assets/style-guide/typography';
import ActionSheetContainer from '../../../../../components/ActionSheetContainer';
import Icon from '../../../../../components/Icon';
import Layout from '../../../../../components/Layout';
import MonieeActionSheet from '../../../../../components/MonieeActionSheet';
import MonieeButton from '../../../../../components/MonieeButton';
import Subheader from '../../../../../components/Subheader';

const GovtID: React.FC<ScreenProps<'GovtID'>> = ({navigation}) => {
  const [hasId, setHasId] = useState<boolean>(false);
  const actionSheetRef = createRef<ActionSheet>();
  const [isChecked] = useState<boolean>(false);
  const [selectedOption, setOption] = useState<string>('Select Type of ID');
  const availableIds = [
    {
      id: 'intl-pass',
      name: 'International passport',
    },
    {
      id: 'national-id',
      name: 'National ID card',
    },
    {
      id: 'voters-card',
      name: 'Voter’s card',
    },
    {
      id: 'drivers-license',
      name: 'Drivers’ licence',
    },
  ];

  const onSelect = (event: boolean, item: {id: string; name: string}) => {
    if (event) {
      setOption(item.name);
      actionSheetRef?.current?.hide();
    } else {
      setOption('Select Type of ID');
    }
  };

  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Govt. Issued ID" goBack={navigation.goBack} />
        <ScrollView style={styles.main}>
          {!hasId && (
            <View style={styles.noId}>
              <Image
                source={require('../../../../../assets/images/badge.png')}
                style={styles.badgeStyle}
              />
              <Text style={styles.headerText}>
                Upload a Government Issued ID
              </Text>
              <Text style={styles.subText}>
                Adding your bank account details allows you{'\n'}withdraw from
                Monnie to your bank{' '}
              </Text>
              <View style={[styles.expandBtn]}>
                <MonieeButton
                  title="Upload ID"
                  mode={'secondary'}
                  customStyle={{
                    backgroundColor: StyleGuide.Colors.shades.blue[400],
                  }}
                  textColor={StyleGuide.Colors.primary}
                  onPress={() => {
                    setHasId(true);
                  }}
                />
              </View>
            </View>
          )}
          {hasId && (
            <View style={[styles.main]}>
              <View style={styles.main}>
                <TouchableOpacity
                  style={[styles.uploadBox, {padding: 0}]}
                  onPress={() => actionSheetRef?.current?.show()}>
                  <Text style={styles.selectTextStyle}>{selectedOption}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder={'ID Number'}
                  placeholderTextColor={StyleGuide.Colors.shades.grey[50]}
                />
                <TouchableOpacity style={styles.uploadBox}>
                  <Icon
                    type="material-community-icons"
                    name="camera-outline"
                    size={24}
                    color={StyleGuide.Colors.shades.magenta[25]}
                    style={{alignSelf: 'center'}}
                  />
                  <Text style={styles.subText}>
                    Tap to take{'\n'}
                    snapshot of ID
                  </Text>
                </TouchableOpacity>
              </View>
              <MonieeButton
                title="Submit"
                mode={'primary'}
                onPress={() => {
                  navigation.replace('VerificationStatus', {
                    idStatus: 'failed',
                  });
                }}
              />
            </View>
          )}
        </ScrollView>
        <MonieeActionSheet
          onClose={() => {}}
          onOpen={() => {}}
          refObj={actionSheetRef}>
          <ActionSheetContainer title="Select ID type">
            <View>
              {availableIds.map((item, index) => (
                <View style={styles.actionItem} key={index}>
                  <Text style={styles.subText}>{item.name}</Text>
                  <BouncyCheckbox
                    size={18}
                    isChecked={isChecked}
                    fillColor={StyleGuide.Colors.shades.green[600]}
                    unfillColor={'transparent'}
                    iconStyle={{
                      borderRadius: 20,
                      padding: 10,
                      borderColor: isChecked
                        ? StyleGuide.Colors.shades.green[600]
                        : StyleGuide.Colors.shades.grey[1100],
                    }}
                    onPress={event => {
                      console.log(event);
                      onSelect(event, item);
                    }}
                  />
                </View>
              ))}
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

export default GovtID;
