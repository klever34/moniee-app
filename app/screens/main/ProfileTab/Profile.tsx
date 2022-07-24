import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import Icon from '../../../components/Icon';
import MenuIcon from '../../../components/MenuIcon';
import {
  fetchBadges,
  fetchUserInfo,
  getUserValidation,
} from '../../../contexts/User';
import {useIsFocused} from '@react-navigation/native';
import Avatar from '../../../components/Avatar';
import {AuthContext} from '../../../../context';

export type APIUserOBJ = {
  avatarUrl: null;
  dob: string;
  email: null;
  firstName: string;
  lastName: string;
  middleName: string;
  mobile: string;
  tier: number;
};

export type BadgeTypes = {
  name: string;
  description: string;
  image_url: string;
  slug: string;
  type: string;
};

const Profile: React.FC<ScreenProps<'Profile'>> = ({navigation}) => {
  const [userObj, setUserObj] = useState<APIUserOBJ>();
  const isFocused = useIsFocused();
  const [achievements, setAchievements] = useState<BadgeTypes[]>();
  const [medals, setMedals] = useState<BadgeTypes[]>();
  const {signOut} = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const logOutUser = useCallback(async () => {
    await signOut();
  }, [signOut]);

  useEffect(() => {
    try {
      (async () => {
        const userVal = await getUserValidation();
        if (userVal.status === 401) {
          Alert.alert('Info', 'Your session has timed out, please login again');
          await logOutUser();
          return;
        }
      })();
    } catch (error: any) {}
  }, [isFocused, logOutUser]);

  useEffect(() => {
    try {
      (async () => {
        const userInfo = await fetchUserInfo();

        setUserObj(userInfo);
      })();
    } catch (error: any) {}
  }, [isFocused]);

  useEffect(() => {
    try {
      (async () => {
        const userData = await fetchBadges();

        const userAchievements = userData.filter(
          (item: BadgeTypes) => item.type === 'achievement',
        );
        setAchievements(userAchievements);

        const userMedals = userData.filter(
          (item: BadgeTypes) => item.type === 'medal',
        );

        setMedals(userMedals);
        setPageLoading(false);
      })();
    } catch (error: any) {
      setPageLoading(false);
    }
  }, [isFocused]);

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
    <View style={[styles.main]}>
      <ScrollView style={[styles.main]}>
        {userObj?.tier === 1 && (
          <View style={styles.redBanner}>
            <Text style={styles.redBannerTitle}>Attention Required!</Text>
            <Text style={styles.redBannerSubTitle}>
              Complete your profile to remove transaction{'\n'}limits and
              upgrade your account
            </Text>
          </View>
        )}
        <View style={styles.profileContainer}>
          <View style={styles.smallProfileContainer}>
            {/* <Image
              source={require('../../../assets/images/avatar.png')}
              style={styles.image}
            /> */}
            {userObj?.avatarUrl ? (
              <Image
                source={{uri: userObj?.avatarUrl}}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarBox}>
                <Avatar
                  size="large"
                  name={`${userObj?.firstName} ${userObj?.lastName}`}
                />
              </View>
            )}
            <View style={styles.midContent}>
              <Text style={styles.nameStyle}>
                {userObj?.firstName} {userObj?.lastName}
              </Text>
              <Text style={[styles.numberStyle, styles.extraStyle]}>
                +{userObj?.mobile}
              </Text>
              <View style={styles.starBox}>
                <Image
                  source={require('../../../assets/images/ranking.png')}
                  style={styles.starImage}
                />
                <Text style={styles.numberStyle}>Tier {userObj?.tier}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.push('EditProfile', {
                userObj,
              })
            }
            style={styles.editIconBox}>
            <Icon
              type="antdesigns"
              name="edit"
              size={24}
              color={StyleGuide.Colors.shades.magenta[25]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.achieveContainer}>
          {achievements && achievements.length > 0 && (
            <View>
              <Text style={styles.headerText}>Achievements</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {achievements?.map((item: BadgeTypes, index: number) => (
                  <View key={index} style={styles.sendItems}>
                    <Image
                      source={{uri: item.image_url}}
                      style={styles.avatarImage}
                    />
                    <Text style={styles.accountName}>{item.name}</Text>
                  </View>
                ))}
              </ScrollView>
              {achievements.length > 0 && (
                <Text style={styles.accountName}>
                  You have no Achievements at the moment
                </Text>
              )}
            </View>
          )}
          <MenuIcon
            title="Bank Account"
            image={require('../../../assets/images/bank.png')}
            onPress={() => navigation.push('BankAccount')}
          />
          <MenuIcon
            title="Account Upgrade"
            image={require('../../../assets/images/folder.png')}
            onPress={() => navigation.push('AccountUpgrade')}
          />
          <MenuIcon
            title="Badges"
            image={require('../../../assets/images/heart.png')}
            onPress={() =>
              navigation.push('Badges', {
                achievements,
                medals,
              })
            }
          />
          <MenuIcon
            title="Security"
            image={require('../../../assets/images/security.png')}
            onPress={() => navigation.push('SecurityScreen')}
          />
          <MenuIcon
            title="Help & Support"
            image={require('../../../assets/images/support.png')}
            onPress={() => navigation.push('HelpAndSupport')}
          />
          <TouchableOpacity
            onPress={() => logOutUser()}
            style={styles.logoutStyle}>
            <Icon
              type="material-icons"
              name="logout"
              size={18}
              color={'#9F56D4'}
            />
            <Text style={[styles.headerText, styles.extra]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    backgroundColor: StyleGuide.Colors.white,
  },
  redBanner: {
    backgroundColor: StyleGuide.Colors.shades.red[25],
    padding: 20,
  },
  redBannerTitle: {
    color: StyleGuide.Colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
  },
  redBannerSubTitle: {
    color: StyleGuide.Colors.white,
    fontFamily: 'NexaRegular',
    fontSize: scaledSize(10),
    marginTop: 10,
    lineHeight: 15,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  starImage: {
    height: 15,
    width: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  smallProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nameStyle: {
    fontSize: scaledSize(16),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.blue[300],
  },
  numberStyle: {
    fontSize: scaledSize(12),
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
  },
  midContent: {
    paddingLeft: 10,
  },
  extraStyle: {
    marginTop: 5,
    marginBottom: 10,
  },
  editIconBox: {
    backgroundColor: StyleGuide.Colors.shades.grey[600],
    padding: 10,
    borderRadius: 10,
  },
  sendItems: {
    alignItems: 'center',
    margin: 20,
    marginLeft: 0,
  },
  accountName: {
    color: StyleGuide.Colors.shades.magenta[50],
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    margin: 5,
  },
  avatarImage: {
    height: 50,
    width: 50,
    marginRight: 5,
    borderRadius: 50,
  },
  headerText: {
    fontSize: scaledSize(14),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.blue[300],
  },
  achieveContainer: {
    padding: 20,
  },
  menuIcon: {
    height: 25,
    width: 25,
  },
  menuBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  isLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  extra: {
    marginTop: Platform.OS === 'ios' ? 5 : 0,
    paddingHorizontal: 10,
  },
});

export default Profile;
