/* eslint-disable react-native/no-inline-styles */
import React, {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Platform,
  TextInput,
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ActivityIndicator,
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
import {useIsFocused} from '@react-navigation/native';
import {AuthContext} from '../../../../../../context';
import {
  getUserValidation,
  updateUserAddress,
} from '../../../../../contexts/User';
import {Decoder} from 'elm-decoders';
import {getFieldValidationError, scaleHeight} from '../../../../../utils';
import {useToast} from 'react-native-toast-notifications';
import {MonieeLogEvent} from '../../../../../services/apps-flyer';

const ResidentialAddress: React.FC<ScreenProps<'ResidentialAddress'>> = ({
  navigation,
}) => {
  const actionSheetRef = createRef<ActionSheet>();
  const isFocused = useIsFocused();
  const {signOut} = useContext(AuthContext);
  const [hasAddress, setHasAddress] = useState<boolean>(false);
  // const [showForm, setForm] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  type AddressType = {
    street: string;
    city: string;
    state: string;
  };

  const [hasFormFieldBeenTouched, setHasFormFieldBeenTouched] = useState<{
    [key: string]: boolean;
  }>({
    // mobile: false,
  });
  const userDecoder: Decoder<AddressType> = Decoder.object({
    street: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length > 2,
      failureMessage: 'Street must be at least 3 digits long',
    }),
    city: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length > 2,
      failureMessage: 'City must be at least 3 digits long',
    }),
    state: Decoder.string.satisfy({
      predicate: (arg: string) => arg.length > 2,
      failureMessage: 'State must be at least 3 digits long',
    }),
  });
  const baseData: AddressType = {
    street: '',
    city: '',
    state: '',
  };

  const [addressObj, setAddressObj] = useState<AddressType>(baseData);
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const toast = useToast();

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
    const updatedData = {...addressObj, [type]: e.nativeEvent.text};
    const updatedTouchedFields = {...hasFormFieldBeenTouched, [type]: true};

    setFormErrors({});
    setAddressObj(updatedData);
    setHasFormFieldBeenTouched(updatedTouchedFields);

    const isValid = userDecoder.run(updatedData);
    if (isValid.type === 'FAIL') {
      const errors: any = isValid.error;
      setFormErrors({[type]: errors[type]});
    }
  };

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const getUserAddress = useCallback(async () => {
    setPageLoading(true);
    const userVal = await getUserValidation();
    setPageLoading(false);
    if (userVal.status === 401) {
      Alert.alert('Info', 'Your session has timed out, please login again');
      await logOutUser();
      return;
    }
    setHasAddress(userVal.data.data.tierThree.address.submitted);
  }, [logOutUser]);

  useEffect(() => {
    try {
      (async () => {
        await getUserAddress();
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, [getUserAddress, isFocused]);

  const updateAddress = async () => {
    setLoading(true);
    try {
      const response = await updateUserAddress({
        street: addressObj.street,
        city: addressObj.city,
        state: addressObj.state,
      });
      setLoading(false);
      await getUserAddress();
      actionSheetRef?.current?.hide();
      MonieeLogEvent('Residential Address updated', {});
      toast.show(response.data.message, {
        type: 'custom_toast',
        animationDuration: 150,
        data: {
          title: 'Success',
        },
      });
    } catch (error: any) {
      if (error?.response?.data?.message) {
        // Alert.alert('Error', error.response.data.message);
        toast.show(error.response.data.message, {
          type: 'custom_toast',
          animationDuration: 100,
          data: {
            title: 'Could not submit form',
          },
        });
      }
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={styles.isLoading}>
        <ActivityIndicator
          size={'large'}
          color={StyleGuide.Colors.primary}
          style={{marginBottom: StyleGuide.Typography[18]}}
        />
      </View>
    );
  }

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
              <View style={styles.noId}>
                <Image
                  source={require('../../../../../assets/images/address.png')}
                  style={styles.badgeStyle}
                />
                <Text style={styles.headerText}>
                  Residential Address Address
                </Text>
                <Text style={styles.subText}>
                  You've already added your place of{'\n'}permanent residence
                </Text>
              </View>
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
                onChange={e => onChange(e, 'street')}
              />
              {!!getFieldValidationError('street', formErrors) && (
                <Text style={styles.errorMsgText}>
                  {formErrors?.street.error!}
                </Text>
              )}
              <TextInput
                style={styles.textInputStyle}
                placeholder={'City'}
                placeholderTextColor={StyleGuide.Colors.shades.grey[50]}
                onChange={e => onChange(e, 'city')}
              />
              {!!getFieldValidationError('city', formErrors) && (
                <Text style={styles.errorMsgText}>
                  {formErrors?.city.error!}
                </Text>
              )}
              <TextInput
                style={styles.textInputStyle}
                placeholder={'State'}
                placeholderTextColor={StyleGuide.Colors.shades.grey[50]}
                onChange={e => onChange(e, 'state')}
              />
              {!!getFieldValidationError('state', formErrors) && (
                <Text style={styles.errorMsgText}>
                  {formErrors?.state.error!}
                </Text>
              )}
              <MonieeButton
                title="Save Address"
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
                onPress={() => {
                  // setAddress(true);
                  // actionSheetRef?.current?.hide();
                  updateAddress();
                }}
                customStyle={{
                  marginTop: 20,
                }}
                isLoading={isLoading}
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
  errorMsgText: {
    color: StyleGuide.Colors.shades.red[100],
    fontSize: StyleGuide.Typography[10],
    marginVertical: scaleHeight(6),
    fontFamily: 'NexaRegular',
  },
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ResidentialAddress;
