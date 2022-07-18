/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ScreenProps} from '../../../../../../App';
import StyleGuide from '../../../../../assets/style-guide';
import {scaledSize} from '../../../../../assets/style-guide/typography';
import Layout from '../../../../../components/Layout';
import MonieeButton from '../../../../../components/MonieeButton';
import Subheader from '../../../../../components/Subheader';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';
import {
  getUserValidation,
  updateUserBankStatement,
} from '../../../../../contexts/User';
import {useToast} from 'react-native-toast-notifications';

const BankStatement: React.FC<ScreenProps<'BankStatement'>> = ({
  navigation,
}) => {
  const [hasBankStatement, setHasBankStatement] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >();
  const toast = useToast();
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const getUserBankStatement = useCallback(async () => {
    const userVal = await getUserValidation();
    setHasBankStatement(userVal.data.data.tierThree.bankStatement.submitted);
  }, []);

  useEffect(() => {
    try {
      (async () => {
        setPageLoading(true);
        await getUserBankStatement();
        setPageLoading(false);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, [getUserBankStatement]);

  const updateStatement = useCallback(async () => {
    setLoading(true);
    try {
      const newFile = new FormData();
      newFile.append('statement', {
        //@ts-ignore
        uri: result[0]?.uri!,
        //@ts-ignore
        type: result[0]?.type!,
        //@ts-ignore
        name: result[0]?.name!,
      });
      const response = await updateUserBankStatement(newFile);
      setLoading(false);
      // navigation.replace('VerificationStatus', {
      //   idStatus: 'failed',
      // });
      toast.show(response.data.message, {
        type: 'custom_toast',
        animationDuration: 150,
        data: {
          title: 'Success',
        },
      });
    } catch (error: any) {
      if (error?.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      }
      setLoading(false);
      navigation.replace('VerificationStatus', {
        idStatus: 'failed',
      });
    }
  }, [navigation, result, toast]);

  useEffect(() => {
    if (result) {
      updateStatement();
    }
  }, [result, updateStatement]);

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
    } else {
      throw err;
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
                    DocumentPicker.pick({
                      type: types.pdf,
                    })
                      .then(setResult)
                      .catch(handleError);
                  }}
                  isLoading={isLoading}
                />
              </View>
            </View>
          )}
          {hasBankStatement && (
            <View style={[styles.main]}>
              <Text style={styles.selectTextStyle}>
                User has bank statement
              </Text>
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
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BankStatement;
