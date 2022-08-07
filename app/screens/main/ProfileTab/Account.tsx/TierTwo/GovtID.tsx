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
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {ScreenProps} from '../../../../../../App';
import {AuthContext} from '../../../../../../context';
import StyleGuide from '../../../../../assets/style-guide';
import {scaledSize} from '../../../../../assets/style-guide/typography';
import ActionSheetContainer from '../../../../../components/ActionSheetContainer';
import Icon from '../../../../../components/Icon';
import Layout from '../../../../../components/Layout';
import MonieeActionSheet from '../../../../../components/MonieeActionSheet';
import MonieeButton from '../../../../../components/MonieeButton';
import Subheader from '../../../../../components/Subheader';
import {
  getUserValidation,
  updateUserTierTwo,
} from '../../../../../contexts/User';
import {useIsFocused} from '@react-navigation/native';
import {useImageInput} from '../../../../../utils/camera';
import {useToast} from 'react-native-toast-notifications';
import {MonieeLogEvent} from '../../../../../services/apps-flyer';

const GovtID: React.FC<ScreenProps<'GovtID'>> = ({navigation}) => {
  const [hasId, setHasId] = useState<boolean>(false);
  const actionSheetRef = createRef<ActionSheet>();
  const [isChecked] = useState<boolean>(false);
  const [selectedOption, setOption] = useState<string>('Select ID');
  const [selectedOptionType, setOptionType] = useState<string>('');
  const [base64Str, setBase64Str] = useState<string>('');
  const [selfieStr, setSelfieStr] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [idNumber, setIDNumber] = useState<string>('');
  const [currentImg, setCurrentImg] = useState<string>('selfie');
  const [selfieUri, setSelfieUri] = useState<string>('');
  const toast = useToast();
  const availableIds = [
    {
      id: 'international-passport',
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
  const [showForm, setForm] = useState<boolean>(false);
  const {signOut} = useContext(AuthContext);
  const isFocused = useIsFocused();

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const [avatarUrl, setAvatarUrl] = useState('');

  const {imageUrl, handleCameraLauncher} = useImageInput({
    maxWidth: 256,
    maxHeight: 256,
    mediaType: 'photo',
  });

  useEffect(() => {
    const uri = imageUrl?.uri;
    const base64 = imageUrl?.base64;
    if (base64) {
      if (currentImg === 'id') {
        setAvatarUrl(uri!);
        setBase64Str(base64);
      } else {
        setSelfieStr(base64);
        setSelfieUri(uri!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  useEffect(() => {
    try {
      (async () => {
        setPageLoading(true);
        const userVal = await getUserValidation();
        if (userVal.status === 401) {
          Alert.alert('Info', 'Your session has timed out, please login again');
          await logOutUser();
          return;
        }
        setPageLoading(false);
        setHasId(userVal.data.data.tierTwo.status);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, [isFocused, logOutUser]);

  const onSelect = (event: boolean, item: {id: string; name: string}) => {
    if (event) {
      setOption(item.name);
      setOptionType(item.id);
      actionSheetRef?.current?.hide();
    } else {
      setOption('Select Type of ID');
      setOptionType('');
    }
  };

  const updateTier = async () => {
    setLoading(true);
    try {
      const response = await updateUserTierTwo({
        photoid_image: base64Str,
        photoid_type: selectedOptionType,
        photoid_number: idNumber,
        selfie_image: selfieStr,
      });
      MonieeLogEvent('Successful Tier Two upgrade', {
        photoid_number: idNumber,
        photoid_type: selectedOptionType,
      });
      toast.show(response.data.message, {
        type: 'custom_toast',
        animationDuration: 150,
        data: {
          title: 'Success',
        },
      });
      setLoading(false);
      navigation.push('Profile');
    } catch (error: any) {
      toast.show('Could not submit ID', {
        type: 'custom_toast',
        animationDuration: 150,
        data: {
          title: 'Error',
        },
      });
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
        <Subheader title="Govt. Issued ID" goBack={navigation.goBack} />
        <ScrollView style={styles.main}>
          {!hasId && !showForm && (
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
                    setForm(true);
                  }}
                />
              </View>
            </View>
          )}
          {hasId && (
            <View style={styles.noId}>
              <Image
                source={require('../../../../../assets/images/badge.png')}
                style={styles.badgeStyle}
              />
              <Text style={styles.headerText}>Government Issued ID Added</Text>
              <Text style={styles.subText}>
                You've already added a government ID
              </Text>
            </View>
          )}
          {showForm && (
            <View style={[styles.main]}>
              <View style={styles.main}>
                <TouchableOpacity
                  style={[styles.uploadBox, {padding: 0, marginBottom: 5}]}
                  onPress={() => actionSheetRef?.current?.show()}>
                  <Text style={styles.selectTextStyle}>{selectedOption}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder={'ID Number'}
                  placeholderTextColor={StyleGuide.Colors.shades.grey[50]}
                  onChangeText={text => setIDNumber(text)}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleCameraLauncher();
                    setCurrentImg('selfie');
                  }}
                  style={styles.uploadBox}>
                  {!selfieUri ? (
                    <>
                      <Icon
                        type="material-community-icons"
                        name="camera-front-variant"
                        size={24}
                        color={StyleGuide.Colors.shades.magenta[25]}
                        style={{alignSelf: 'center'}}
                      />
                      <Text style={styles.subText}>
                        Please take a{'\n'}
                        Selfie
                      </Text>
                    </>
                  ) : (
                    <Image
                      source={{uri: selfieUri ? selfieUri : undefined}}
                      style={styles.imageStyle}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCameraLauncher();
                    setCurrentImg('id');
                  }}
                  style={styles.uploadBox}>
                  {!avatarUrl ? (
                    <>
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
                    </>
                  ) : (
                    <Image
                      source={{uri: avatarUrl ? avatarUrl : undefined}}
                      style={styles.imageStyle}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <MonieeButton
                title="Submit"
                mode={'primary'}
                onPress={() => {
                  updateTier();
                }}
                isLoading={isLoading}
                disabled={
                  selectedOption === 'Select ID' ||
                  idNumber.length === 0 ||
                  base64Str.length === 0
                }
                customStyle={{marginTop: 20}}
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
                    textComponent={
                      <Text style={[styles.subText, {marginLeft: 10}]}>
                        {item.name}
                      </Text>
                    }
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
    marginTop: 20,
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
  imageStyle: {
    height: 200,
    width: '100%',
    resizeMode: 'contain',
  },
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GovtID;
