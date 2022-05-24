import React, {createRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Platform,
} from 'react-native';
import {Decoder} from 'elm-decoders';
import Subheader from '../../../components/Subheader';
import {RequestMoneyPayload} from '../../../contexts/User';
import {ScreenProps} from '../../../../App';
import Layout from '../../../components/Layout';
import {getFieldValidationError, scaleHeight, scaleWidth} from '../../../utils';
import StyleGuide from '../../../assets/style-guide';
import MonieeButton from '../../../components/MonieeButton';
import {scaledSize} from '../../../assets/style-guide/typography';
import TransactionPin from '../../../components/TransactionPin';
import ActionSheet from 'react-native-actions-sheet';

const RequestMoney: React.FC<ScreenProps<'RequestMoney'>> = ({
  navigation,
  route,
}) => {
  const fundType = route.params.funds_type;
  const transactionPinSheetRef = createRef<ActionSheet>();

  const [hasFormFieldBeenTouched, setHasFormFieldBeenTouched] = useState<{
    [key: string]: boolean;
  }>({
    mobile: false,
  });
  const requestDecoder: Decoder<RequestMoneyPayload> = Decoder.object({
    purpose: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length >= 1,
      failureMessage: 'Please fill in a purpose',
    }),
    phone_number: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length >= 9,
      failureMessage: 'The mobile must be at least 9 digits long',
    }),
  });
  const baseRequest: RequestMoneyPayload = {
    purpose: '',
    phone_number: '234',
  };
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading] = useState<boolean>(false);
  const [request, setRequest] = useState<RequestMoneyPayload>(baseRequest);
  //@ts-ignore

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
    const updatedReqPayload = {...request, [type]: e.nativeEvent.text};
    const updatedTouchedFields = {...hasFormFieldBeenTouched, [type]: true};

    setFormErrors({});
    setRequest(updatedReqPayload);
    setHasFormFieldBeenTouched(updatedTouchedFields);

    const isValid = requestDecoder.run(updatedReqPayload);
    if (isValid.type === 'FAIL') {
      const errors: any = isValid.error;
      setFormErrors({[type]: errors[type]});
    }
  };

  const onDone = () => {
    navigation.push('PaymentStatus', {
      paymentSuccessStatus: 'success',
    });
  };

  return (
    <Layout>
      <View style={styles.main}>
        <Subheader
          goBack={navigation.goBack}
          title={`${fundType === 'request' ? 'Request' : 'Send'} ₦15,000`}
        />
        <TransactionPin
          actionSheetRef={transactionPinSheetRef}
          onDone={onDone}
        />
        <View style={styles.bigInputBox}>
          <View
            // eslint-disable-next-line no-sparse-arrays
            style={[
              styles.bigBox,
              styles.inputBox,
              hasFormFieldBeenTouched.purpose &&
                !!getFieldValidationError('purpose', formErrors) &&
                styles.errorInput,
              hasFormFieldBeenTouched.purpose &&
                !getFieldValidationError('purpose', formErrors) &&
                styles.successInput,
              ,
            ]}>
            <TextInput
              placeholder={`Purpose ${
                fundType === 'request' ? 'of request' : 'for sending'
              }`}
              placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
              onChange={e => onChange(e, 'purpose')}
              keyboardType={'number-pad'}
              style={styles.colorBlack}
            />
          </View>
        </View>
        {!!getFieldValidationError('purpose', formErrors) && (
          <Text style={styles.errorMsgText}>{formErrors?.purpose.error!}</Text>
        )}
        <View style={styles.bigInputBox}>
          <View
            // eslint-disable-next-line no-sparse-arrays
            style={[
              styles.bigBox,
              styles.inputBox,
              hasFormFieldBeenTouched.phone_number &&
                !!getFieldValidationError('phone_number', formErrors) &&
                styles.errorInput,
              hasFormFieldBeenTouched.phone_number &&
                !getFieldValidationError('phone_number', formErrors) &&
                styles.successInput,
              ,
            ]}>
            <TextInput
              placeholder={'Phone Number'}
              placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
              onChange={e => onChange(e, 'phone_number')}
              keyboardType={'number-pad'}
              style={styles.colorBlack}
            />
          </View>
        </View>
        {!!getFieldValidationError('phone_number', formErrors) && (
          <Text style={styles.errorMsgText}>
            {formErrors?.phone_number.error!}
          </Text>
        )}

        <View style={styles.subtext}>
          <MonieeButton
            title={`Send ${fundType === 'request' ? 'Request' : 'Money'}`}
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
            onPress={() => transactionPinSheetRef?.current?.show()}
            isLoading={isLoading}
          />
        </View>
      </View>
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
    width: '80%',
  },
  extraStyle: {
    textAlign: 'center',
    color: StyleGuide.Colors.shades.grey[1400],
    fontSize: StyleGuide.Typography[12],
  },
  createText: {
    color: StyleGuide.Colors.shades.magenta[25],
  },

  //to be removed
  container: {
    flex: 1,
  },
});

export default RequestMoney;
