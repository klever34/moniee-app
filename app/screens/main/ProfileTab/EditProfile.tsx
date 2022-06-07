import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Avatar from '../../../components/Avatar';
import Layout from '../../../components/Layout';
import MonieeButton from '../../../components/MonieeButton';
import Subheader from '../../../components/Subheader';

const EditProfile: React.FC<ScreenProps<'EditProfile'>> = ({
  navigation,
  route,
}) => {
  const {userObj} = route.params;
  return (
    <Layout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.main}>
        <View style={styles.main}>
          <ScrollView style={styles.main}>
            <Subheader title="Update Profile" goBack={navigation.goBack} />
            {userObj?.avatarUrl ? (
              <Image source={{uri: userObj?.avatarUrl}} style={styles.image} />
            ) : (
              <View style={styles.avatarBox}>
                <Avatar
                  size="large"
                  name={`${userObj?.firstName} ${userObj?.lastName}`}
                />
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.section}>
                <Text style={styles.headerText}>Legal Name</Text>
                <TextInput
                  value={userObj?.firstName}
                  style={styles.textInputStyle}
                  editable={false}
                />
                <TextInput
                  value={userObj?.lastName}
                  style={styles.textInputStyle}
                  editable={false}
                />
              </View>
              <View style={styles.section}>
                <Text style={styles.headerText}>Date of Birth</Text>
                <TextInput
                  editable={false}
                  value={userObj?.dob}
                  style={styles.textInputStyle}
                />
              </View>
              <View style={styles.section}>
                <Text style={styles.headerText}>Contact Info</Text>
                <TextInput
                  editable={false}
                  value={userObj?.mobile}
                  style={styles.textInputStyle}
                />
                <TextInput
                  placeholder="Add an email address"
                  style={styles.textInputStyle}
                  placeholderTextColor={StyleGuide.Colors.shades.grey[800]}
                />
              </View>
            </View>
            <MonieeButton
              title="Save Changes"
              onPress={() => {}}
              customStyle={styles.btnStyle}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  headerText: {
    fontSize: scaledSize(10),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.grey[25],
    // marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 60,
    marginRight: 10,
    alignSelf: 'center',
  },
  body: {
    marginTop: 30,
  },
  textInputStyle: {
    backgroundColor: StyleGuide.Colors.shades.grey[600],
    padding: 10,
    color: StyleGuide.Colors.shades.grey[800],
    marginVertical: 5,
    borderRadius: 5,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  section: {
    marginTop: 30,
  },
  btnStyle: {
    marginVertical: 20,
  },
  avatarBox: {
    alignSelf: 'center',
  },
});

export default EditProfile;