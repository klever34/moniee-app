/* eslint-disable react-native/no-inline-styles */
import React, {createRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Decoder} from 'elm-decoders';
import {ScreenProps} from '../../../App';
import StyleGuide from '../../assets/style-guide';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import MonieeButton from '../../components/MonieeButton';
import {
  BankDetailsPayload,
  getBanks,
  submitBankDetails,
} from '../../contexts/User';
import {getFieldValidationError, scaleHeight, scaleWidth} from '../../utils';
import {scaledSize} from '../../assets/style-guide/typography';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from '../../components/Icon';
import ActionSheet from 'react-native-actions-sheet';
import EncryptedStorage from 'react-native-encrypted-storage';

// type BankPayload = {
//   id: string;
//   name: string;
//   sortcode: string;
// };

// type BankArrayType = {
//   [key: string]: BankPayload;
// };

const BankDetails: React.FC<ScreenProps<'BankDetails'>> = ({navigation}) => {
  const [hasFormFieldBeenTouched, setHasFormFieldBeenTouched] = useState<{
    [key: string]: boolean;
  }>({
    mobile: false,
  });
  const bankDetailsDecoder: Decoder<BankDetailsPayload> = Decoder.object({
    bank: Decoder.string,
    account_number: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length === 10,
      failureMessage: 'BVN must be 11 digits long',
    }),
    bvn: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length === 11,
      failureMessage: 'BVN must be 11 digits long',
    }),
  });
  const bankSheetRef = createRef<ActionSheet>();
  const baseBankDetails: BankDetailsPayload = {
    bank: '',
    account_number: '',
    bvn: '',
  };
  const [searchInput, setSearchInput] = useState('');
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const [bankObject, setBankObj] =
    useState<BankDetailsPayload>(baseBankDetails);
  const [bankArray, setBankArray] = useState([]);
  const [subBankArray, setSubBankArray] = useState([]);
  const [bankNameHolder, setBankNameHolder] = useState<string>('Select Bank');
  const [chosenBank, setChosenBank] = useState<any>();

  const handleBankRegistration = async () => {
    setLoading(true);
    const id = await EncryptedStorage.getItem('user-id');
    try {
      await submitBankDetails(
        {
          bankId: chosenBank?.id,
          bankSortCode: chosenBank?.sortcode,
          nuban: bankObject.account_number,
          bvn: bankObject.bvn,
          bankName: chosenBank?.name,
        },
        Number(id),
      );
      navigation.push('SecurePassword');
      return;
    } catch (err: any) {
      console.log(err.response);

      setLoading(false);
      if (err?.response?.data) {
        Alert.alert('Error', err.response.data.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchInput === '') {
      setSubBankArray(bankArray);
    }
  }, [bankArray, searchInput]);

  const filterItems = () => {
    if (searchInput === '') {
      setSubBankArray(bankArray);
    }
    try {
      const newData = subBankArray.filter(function (item) {
        //@ts-ignore
        const itemData = item.name ? item.name.toLowerCase() : ''.toLowerCase();
        const textData = searchInput.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setSubBankArray(newData);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      (async () => {
        const banks = await getBanks();
        setBankArray(banks);
        setSubBankArray(banks);
      })();
    } catch (error) {}
  }, []);

  const hasFormErrors = (errors: any) => {
    const errorFields = Object.keys(errors);
    return errorFields.length > 0;
  };

  const hasFormBeenTouched = (monitoredFieldsStatus: {
    [key: string]: boolean;
  }) => {
    const values = Object.values(monitoredFieldsStatus);
    return values.some(value => value === true);
  };

  const onChange = (
    e: NativeSyntheticEvent<TextInputChangeEventData>,
    type: string,
  ): void => {
    const updatedObj = {...bankObject, [type]: e.nativeEvent.text};
    const updatedTouchedFields = {...hasFormFieldBeenTouched, [type]: true};

    setFormErrors({});
    setBankObj(updatedObj);
    setHasFormFieldBeenTouched(updatedTouchedFields);

    const isValid = bankDetailsDecoder.run(updatedObj);
    if (isValid.type === 'FAIL') {
      const errors: any = isValid.error;
      setFormErrors({[type]: errors[type]});
    }
  };

  return (
    <Layout>
      <ActionSheet
        initialOffsetFromBottom={1}
        ref={bankSheetRef}
        statusBarTranslucent
        bounceOnOpen={true}
        drawUnderStatusBar={true}
        bounciness={4}
        gestureEnabled={true}
        defaultOverlayOpacity={0.3}>
        <View
          style={{
            paddingHorizontal: 12,
          }}>
          <ScrollView
            nestedScrollEnabled
            onMomentumScrollEnd={() => {
              bankSheetRef.current?.handleChildScrollEnd();
            }}
            style={styles.scrollview}>
            <TextInput
              onChangeText={text => {
                setSearchInput(text);
                filterItems();
              }}
              style={styles.input}
              placeholder="Search bank"
            />
            <View>
              {subBankArray.map((item: any, index: number) => (
                <Text
                  key={index}
                  onPress={() => {
                    setBankNameHolder(item.name);
                    setChosenBank(item);
                    bankSheetRef?.current?.hide();
                  }}
                  style={[styles.colorBlack, {padding: 10, width: '100%'}]}>
                  {item.name}
                </Text>
              ))}
            </View>
            <View style={styles.footer} />
          </ScrollView>
        </View>
      </ActionSheet>
      <ScrollView style={styles.main}>
        <Header title="Add your bank details 😎" goBack={navigation.goBack}>
          <Text style={styles.subHeader}>
            Kindly ensure the details you enter belong{'\n'}to you.
          </Text>
        </Header>
        <TouchableOpacity
          onPress={() => bankSheetRef?.current?.show()}
          style={styles.bigInputBox}>
          <View
            // eslint-disable-next-line no-sparse-arrays
            style={[
              styles.bigBox,
              styles.inputBox,
              hasFormFieldBeenTouched.bank &&
                !!getFieldValidationError('bank', formErrors) &&
                styles.errorInput,
              hasFormFieldBeenTouched.bank &&
                !getFieldValidationError('bank', formErrors) &&
                styles.successInput,
              ,
            ]}>
            <Text
              style={[
                styles.colorBlack,
                {marginTop: 5, padding: Platform.OS === 'android' ? 15 : 0},
              ]}>
              {bankNameHolder}
            </Text>
            <Icon
              type="material-icons"
              name="keyboard-arrow-down"
              size={20}
              color={StyleGuide.Colors.shades.grey[1450]}
              style={{padding: Platform.OS === 'android' ? 15 : 0}}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.bigInputBox}>
          <View
            // eslint-disable-next-line no-sparse-arrays
            style={[
              styles.bigBox,
              styles.inputBox,
              hasFormFieldBeenTouched.account_number &&
                !!getFieldValidationError('account_number', formErrors) &&
                styles.errorInput,
              hasFormFieldBeenTouched.account_number &&
                !getFieldValidationError('account_number', formErrors) &&
                styles.successInput,
              ,
            ]}>
            <TextInput
              placeholder={'Account Number'}
              placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
              onChange={e => onChange(e, 'account_number')}
              keyboardType={'number-pad'}
              style={styles.colorBlack}
            />
          </View>
        </View>
        <View style={styles.bigInputBox}>
          <View
            // eslint-disable-next-line no-sparse-arrays
            style={[
              styles.bigBox,
              styles.inputBox,
              hasFormFieldBeenTouched.bvn &&
                !!getFieldValidationError('bvn', formErrors) &&
                styles.errorInput,
              hasFormFieldBeenTouched.bvn &&
                !getFieldValidationError('bvn', formErrors) &&
                styles.successInput,
              ,
            ]}>
            <TextInput
              placeholder={'BVN'}
              placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
              onChange={e => onChange(e, 'bvn')}
              keyboardType={'number-pad'}
              style={styles.colorBlack}
            />
          </View>
        </View>

        {!!getFieldValidationError('bvn', formErrors) && (
          <Text style={styles.errorMsgText}>{formErrors?.bvn.error!}</Text>
        )}
      </ScrollView>
      <View style={styles.subtext}>
        <MonieeButton
          title="Save and Continue"
          mode={
            hasFormBeenTouched(hasFormFieldBeenTouched) &&
            !hasFormErrors(formErrors)
              ? 'primary'
              : 'neutral'
          }
          disabled={
            !(
              hasFormBeenTouched(hasFormFieldBeenTouched) &&
              !hasFormErrors(formErrors)
            )
          }
          onPress={handleBankRegistration}
          isLoading={isLoading}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
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
    // flex: 1,
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
  main: {
    flex: 1,
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
  },
  scrollview: {
    width: '100%',
    padding: 12,
  },
  safeareview: {
    justifyContent: 'center',
    flex: 1,
  },
});

export default BankDetails;
