/* eslint-disable react-native/no-inline-styles */
import React, {createRef, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Subheader from '../../../components/Subheader';
import {
  ContactsData,
  requestMoney,
  RequestMoneyPayload,
  sendMoney,
} from '../../../contexts/User';
import {ScreenProps} from '../../../../App';
import Layout from '../../../components/Layout';
import {scaleHeight, scaleWidth} from '../../../utils';
import StyleGuide from '../../../assets/style-guide';
import MonieeButton from '../../../components/MonieeButton';
import {scaledSize} from '../../../assets/style-guide/typography';
import TransactionPin from '../../../components/TransactionPin';
import ActionSheet from 'react-native-actions-sheet';
import MonieeActionSheet from '../../../components/MonieeActionSheet';
import ActionSheetContainer from '../../../components/ActionSheetContainer';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request as permReq,
} from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import Avatar from '../../../components/Avatar';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {MonieeLogEvent} from '../../../services/apps-flyer';

const RequestMoney: React.FC<ScreenProps<'RequestMoney'>> = ({
  navigation,
  route,
}) => {
  const {funds_type, amount} = route.params;
  const transactionPinSheetRef = createRef<ActionSheet>();
  const contactActionSheetRef = createRef<ActionSheet>();
  const contactListSheetRef = createRef<ActionSheet>();

  const baseRequest: RequestMoneyPayload = {
    purpose: '',
    phone_number: '',
    amount: Number(amount),
  };
  const [isLoading, setLoading] = useState<boolean>(false);
  const [request, setRequest] = useState<RequestMoneyPayload>(baseRequest);
  const [contactList, setContactList] = useState<ContactsData[]>();
  const [subContactList, setSubContactList] = useState<ContactsData[]>();
  const [searchInput, setSearchInput] = useState('');
  const [isChecked] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<any>([]);
  const [stopLoader, setStopLoader] = useState<boolean>(false);
  const [loadContacts, setLoadingContacts] = useState<boolean>(false);

  const onChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
    type: string,
  ): void => {
    const updatedReqPayload = {...request, [type]: e.nativeEvent.text};
    setRequest(updatedReqPayload);
  };

  const handleContacts = useCallback(async () => {
    setLoadingContacts(true);
    if (contactList?.length! > 0) {
      setSubContactList(contactList);
      setLoadingContacts(false);
      return;
    }
    try {
      const contacts = await Contacts.getAll();
      const enrichedContacts = contacts.map(item => ({
        displayName: `${item.givenName} ${item.familyName}`,
        familyName: item.familyName,
        givenName: item.givenName,
        phoneNumbers: item.phoneNumbers,
      }));

      const filteredEnrichedContact = enrichedContacts.filter(
        item => item.phoneNumbers.length > 0,
      );

      setContactList(filteredEnrichedContact);
      setSubContactList(filteredEnrichedContact);
      setLoadingContacts(false);
    } catch (err: any) {
      setLoadingContacts(false);
    }
    setLoading(false);
  }, [contactList]);

  const checkIfAccessGranted = useCallback(() => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS,
    )
      .then(async result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            // contactActionSheetRef?.current?.show();
            grantAccess();
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            // contactActionSheetRef?.current?.show();
            await handleContacts();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkIfAccessGranted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHandlePinDone = async (pin: string) => {
    transactionPinSheetRef?.current?.hide();
    setLoading(true);
    setStopLoader(false);
    let recipients = [];
    if (request.phone_number.length > 0) {
      recipients.push({
        mobile: request.phone_number,
        amount: request.amount,
        reason: request.purpose,
      });
    }
    if (selectedContacts.length > 0) {
      selectedContacts.map(function (item: ContactsData) {
        recipients.push({
          mobile: item.phoneNumbers[0].number,
          amount: request.amount,
          reason: request.purpose,
        });
      });
    }
    try {
      await sendMoney({recipients, pin});
      MonieeLogEvent('Send Money Successful', {recipients});
      setLoading(false);
      navigation.replace('PaymentStatus', {
        paymentSuccessStatus: 'send',
        amount: request.amount,
      });
    } catch (error: any) {
      console.log(error.response.data);
      setStopLoader(true);
      if (error?.response?.data) {
        Alert.alert('Error', error.response.data.message);
        // setLoading(false);
        return;
      }
      // return;
    }
  };

  useEffect(() => {
    if (stopLoader) {
      setLoading(false);
    }
  }, [stopLoader]);

  const sendRequestMoneyPayload = async () => {
    let recipients = [];
    if (request.phone_number.length > 0) {
      let cleanMobile = request.phone_number;
      if (request.phone_number.startsWith('0')) {
        cleanMobile = '234' + request.phone_number.substring(1);
      }
      recipients.push({
        mobile: cleanMobile,
        amount: request.amount,
        reason: request.purpose,
      });
    }
    if (selectedContacts.length > 0) {
      selectedContacts.map(function (item: ContactsData) {
        let cleanMobile = item?.phoneNumbers[0]?.number;
        if (item?.phoneNumbers[0]?.number.startsWith('0')) {
          cleanMobile = '234' + item?.phoneNumbers[0]?.number.substring(1);
        }
        recipients.push({
          mobile: cleanMobile,
          amount: request.amount,
          reason: request.purpose,
        });
      });
    }
    setLoading(true);
    setStopLoader(false);
    try {
      await requestMoney({recipients});
      MonieeLogEvent('Request Money Successful', {recipients});
      setLoading(false);
      navigation.replace('PaymentStatus', {
        paymentSuccessStatus: 'request',
        amount: request.amount,
      });
    } catch (error: any) {
      setStopLoader(true);
      if (error?.response?.data) {
        Alert.alert('Error', error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (searchInput === '') {
      setSubContactList(contactList);
    }
  }, [contactList, searchInput]);

  const grantAccess = async () => {
    permReq(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS,
    )
      .then(async result => {
        contactActionSheetRef?.current?.hide();
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            // contactListSheetRef?.current?.show();
            await handleContacts();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const filterItems = () => {
    if (searchInput === '') {
      setSubContactList(contactList);
    }
    try {
      const newData = subContactList?.filter(function (item) {
        //@ts-ignore
        const itemData = item.displayName
          ? item?.displayName!.toLowerCase()
          : ''.toLowerCase();
        const textData = searchInput.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setSubContactList(newData);
    } catch (error) {}
  };

  const onSelect = (event: boolean, item: ContactsData) => {
    let updatedSelectedContacts: any[] = [];
    if (event) {
      updatedSelectedContacts.push({
        ...item,
      });
      const newStateData: any[] = [
        ...selectedContacts,
        ...updatedSelectedContacts,
      ];
      setSelectedContacts(newStateData);
    } else {
      updatedSelectedContacts = selectedContacts.filter(
        (contact: any) =>
          contact.phoneNumbers.length > 0 &&
          contact.phoneNumbers[0].number !== item.phoneNumbers[0].number,
      );
      setSelectedContacts(updatedSelectedContacts);
    }
  };

  const renderItem = ({item}: {item: ContactsData}) => (
    <View style={[styles.contactStyle, {justifyContent: 'space-between'}]}>
      <TouchableOpacity style={styles.contactStyle}>
        <Avatar name={`${item?.givenName ?? ''} ${item?.familyName ?? ''}`} />
        <TouchableOpacity
          onPress={() => {
            // contactListSheetRef?.current?.hide();
            console.log(item?.displayName);
          }}>
          <Text style={styles.contactName}>{item?.displayName ?? ''}</Text>
          <Text style={styles.contactMobile}>
            {(item?.phoneNumbers.length > 0 && item?.phoneNumbers[0].number) ??
              'N/A'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      {/* <View style={styles.customCheckBox} /> */}
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
          onSelect(event, item);
        }}
      />
    </View>
  );

  return (
    <Layout>
      <MonieeActionSheet refObj={contactActionSheetRef}>
        <ActionSheetContainer>
          <View style={{}}>
            <Image
              source={require('../../../assets/images/icon_4.png')}
              style={styles.image}
            />
            <Text style={styles.modalTitle}>
              Allow Moniee to read Contacts?
            </Text>
            <Text style={styles.modalSubTitle}>
              To request or send funds, Moniee requires your{'\n'}permission to
              read read your contacts.
            </Text>
            <MonieeButton
              title={'Grant Access'}
              mode={'primary'}
              onPress={() => grantAccess()}
            />
          </View>
        </ActionSheetContainer>
      </MonieeActionSheet>
      <ActionSheet
        initialOffsetFromBottom={1}
        ref={contactListSheetRef}
        statusBarTranslucent
        bounceOnOpen={true}
        drawUnderStatusBar={true}
        bounciness={4}
        gestureEnabled={true}
        onClose={() => contactListSheetRef?.current?.hide()}
        defaultOverlayOpacity={0.3}>
        <View
          style={{
            paddingHorizontal: 12,
          }}>
          <View style={[styles.bigInputBox, {justifyContent: 'space-between'}]}>
            <View style={{width: '70%'}}>
              <TextInput
                onChangeText={text => {
                  setSearchInput(text);
                  filterItems();
                }}
                style={styles.input}
                placeholder="Search Name"
              />
            </View>
            <MonieeButton
              title={selectedContacts.length > 0 ? 'Done' : 'Close'}
              mode={'primary'}
              onPress={() => {
                contactListSheetRef?.current?.hide();
                console.log(selectedContacts);
              }}
              customStyle={{flex: 1, marginBottom: 15, marginLeft: 15}}
            />
          </View>
          <ScrollView
            nestedScrollEnabled
            onMomentumScrollEnd={() => {
              contactListSheetRef.current?.handleChildScrollEnd();
            }}
            style={styles.scrollview}>
            {loadContacts && (
              <ActivityIndicator size={'small'} style={styles.indicator} />
            )}
            <View style={{flex: 1}}>
              <FlatList
                data={subContactList}
                initialNumToRender={12}
                renderItem={renderItem}
                keyboardShouldPersistTaps="always"
                keyExtractor={(item, index) => `${item?.toString()}-${index}`}
                ListEmptyComponent={
                  <View>
                    <Text>Loading contacts...</Text>
                  </View>
                }
                contentContainerStyle={{paddingBottom: scaleHeight(10)}}
              />
            </View>
            {/* <ScrollView style={{flex: 1, marginBottom: 20, height: '70%'}}>
              {subContactList?.map((item: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.contactStyle,
                    {justifyContent: 'space-between'},
                  ]}>
                  <View style={styles.contactStyle}>
                    <Avatar
                      name={`${item?.givenName ?? ''} ${item.familyName ?? ''}`}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        contactListSheetRef?.current?.hide();
                      }}>
                      <Text style={styles.contactName}>
                        {item?.displayName ?? ''}
                      </Text>
                      <Text style={styles.contactMobile}>
                        {(item.phoneNumbers.length > 0 &&
                          item?.phoneNumbers[0].number) ??
                          'N/A'}
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                      onSelect(event, item);
                    }}
                  />
                </View>
              ))}
            </ScrollView> */}
            <View style={styles.footer} />
          </ScrollView>
        </View>
      </ActionSheet>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <TransactionPin
            actionSheetRef={transactionPinSheetRef}
            onDone={(pin: string) => onHandlePinDone(pin)}
          />
          <View style={styles.main}>
            <Subheader
              goBack={navigation.goBack}
              title={`${
                funds_type === 'request' ? 'Request' : 'Send'
              } ???${amount}`}
            />
            <View style={styles.bigInputBox}>
              <View style={[styles.bigBox, styles.inputBox]}>
                <TextInput
                  placeholder={`Purpose ${
                    funds_type === 'request' ? 'of request' : 'for sending'
                  }`}
                  placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
                  onChange={e => onChange(e, 'purpose')}
                  style={styles.colorBlack}
                />
              </View>
            </View>
            <View style={styles.bigInputBox}>
              <View style={[styles.bigBox, styles.inputBox]}>
                <TextInput
                  placeholder={'Phone Number'}
                  placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
                  onChange={e => onChange(e, 'phone_number')}
                  keyboardType={'number-pad'}
                  style={styles.colorBlack}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleContacts();
                    contactListSheetRef?.current?.show();
                  }}>
                  <Image
                    source={require('../../../assets/images/book.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {selectedContacts && selectedContacts?.length! > 0 && (
              <>
                {/* <Text style={styles.errorMsgText}>
                  You have selected {selectedContacts[0]?.displayName}{' '}
                  {selectedContacts?.length! > 1
                    ? `and ${selectedContacts?.length! - 1} other(s)`
                    : ''}
                </Text> */}
                <Text style={styles.errorMsgText}>You have selected:</Text>
                <Text>
                  {selectedContacts.map((item: ContactsData, index: number) => (
                    <View key={index}>
                      <Text style={[styles.contactMobile]}>
                        {item?.displayName ?? ''}
                        {': '}
                        {(item.phoneNumbers.length > 0 &&
                          item?.phoneNumbers[0].number + '\n') ??
                          'N/A'}
                      </Text>
                    </View>
                  ))}
                </Text>
              </>
            )}
            <View style={styles.subtext}>
              <MonieeButton
                title={`Send ${funds_type === 'request' ? 'Request' : 'Money'}`}
                mode={'primary'}
                disabled={
                  selectedContacts.length === 0 &&
                  request.phone_number.length === 0
                }
                onPress={() => {
                  if (funds_type === 'request') {
                    sendRequestMoneyPayload();
                  } else {
                    transactionPinSheetRef?.current?.show();
                  }
                }}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  subHeader: {
    fontSize: scaledSize(14),
    color: StyleGuide.Colors.shades.grey[200],
    marginTop: 10,
    fontFamily: 'NexaRegular',
  },
  iconStyle: {
    color: StyleGuide.Colors.shades.grey[900],
  },
  inputBox: {
    // borderWidth: 1,
    // borderColor: StyleGuide.Colors.shades.grey[100],
    backgroundColor: StyleGuide.Colors.shades.grey[30],
    borderRadius: scaleWidth(10),
    paddingHorizontal: scaleWidth(10),
    marginVertical: scaleHeight(5),
  },
  bigInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBox: {
    width: '30%',
    padding: scaleWidth(7),
    marginRight: scaleWidth(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bigBox: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? scaledSize(20) : 0,
  },
  countryText: {
    fontSize: StyleGuide.Typography[12],
    color: StyleGuide.Colors.shades.grey[800],
  },
  subtext: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  errorInput: {
    borderColor: StyleGuide.Colors.shades.red[100],
  },
  successInput: {
    borderColor: StyleGuide.Colors.primary,
  },
  errorMsgText: {
    color: StyleGuide.Colors.shades.red[100],
    fontSize: StyleGuide.Typography[10],
    marginVertical: scaleHeight(6),
    fontFamily: 'NexaRegular',
  },
  colorBlack: {
    color: StyleGuide.Colors.black,
    fontFamily: 'NexaRegular',
    width: '90%',
  },
  extraStyle: {
    textAlign: 'center',
    color: StyleGuide.Colors.shades.grey[1400],
    fontSize: StyleGuide.Typography[12],
  },
  createText: {
    color: StyleGuide.Colors.shades.magenta[25],
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginTop: Platform.OS === 'ios' ? 0 : 10,
  },
  image: {
    width: '50%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -60,
  },
  modalTitle: {
    textAlign: 'center',
    color: StyleGuide.Colors.primary,
    fontSize: StyleGuide.Typography[16],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    marginTop: -60,
  },
  modalSubTitle: {
    textAlign: 'center',
    color: StyleGuide.Colors.shades.grey[1400],
    fontSize: scaledSize(13),
    fontFamily: 'NexaRegular',
    marginVertical: 15,
  },
  scrollview: {
    width: '100%',
    padding: 12,
  },
  footer: {
    height: 100,
  },
  input: {
    width: '100%',
    minHeight: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 15,
    paddingHorizontal: 10,
    fontFamily: 'NexaRegular',
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
  },
  contactStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  contactName: {
    color: StyleGuide.Colors.shades.grey[100],
    fontSize: scaledSize(11),
    fontFamily: 'NexaRegular',
  },
  contactMobile: {
    color: StyleGuide.Colors.black,
    fontSize: scaledSize(13),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    marginTop: 7,
  },
  isLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  customCheckBox: {
    height: 20,
    width: 20,
    borderWidth: 0.5,
    borderColor: StyleGuide.Colors.primary,
  },
});

export default RequestMoney;
