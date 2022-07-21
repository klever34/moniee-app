/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/core';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MenuProvider} from 'react-native-popup-menu';

// Screens
import SignIn from './app/screens/auth/SignIn';
import SignInVerification from './app/screens/auth/SignInVerification';
import SecurePassword from './app/screens/auth/SecurePassword';
import ConfirmPassword from './app/screens/auth/ConfirmPassword';
import Splash from './app/screens/auth/Splash';
import {ToastProvider} from 'react-native-toast-notifications';
import StyleGuide from './app/assets/style-guide';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TabBarLabel} from './app/components/TabBarLabel';
import {AuthContext} from './context';
import {scaledSize} from './app/assets/style-guide/typography';
import ForgotPin from './app/screens/auth/ForgotPin';
import Register from './app/screens/auth/Register';
import OTP from './app/screens/auth/OTP';
import BankDetails from './app/screens/auth/BankDetails';
import Money from './app/screens/main/MoneyTab/Money';
import Profile from './app/screens/main/ProfileTab/Profile';
import Dashboard from './app/screens/main/Home/Dashboard';
import RequestMoney from './app/screens/main/MoneyTab/RequestMoney';
import EncryptedStorage from 'react-native-encrypted-storage';
import {setAxiosToken} from './app/services/api';
import PaymentStatus from './app/screens/main/Payments/PaymentStatus';
import QRCodeScreen from './app/screens/main/MoneyTab/QRCode';
import Withdraw from './app/screens/main/Home/Withdraw';
import WithdrawalSuccessfulScreen from './app/screens/main/Home/WithdrawalSuccessfulScreen';
import Notifications from './app/screens/main/Home/Notifications';
import Icon from './app/components/Icon';
import HelpAndSupport from './app/screens/main/ProfileTab/Support/HelpAndSupport';
import CustomerCare from './app/screens/main/ProfileTab/Support/CustomerCare';
import Legal from './app/screens/main/ProfileTab/Support/Legal';
import ChangeLog from './app/screens/main/ProfileTab/Support/ChangeLog';
import BankAccount from './app/screens/main/ProfileTab/BankAccount';
import EditProfile from './app/screens/main/ProfileTab/EditProfile';
import AccountUpgrade from './app/screens/main/ProfileTab/Account.tsx/AccountUpgrade';
import SecurityScreen from './app/screens/main/ProfileTab/Security/SecurityScreen';
import ChangePin from './app/screens/main/ProfileTab/Security/ChangePin';
import SetNewPin from './app/screens/main/ProfileTab/Security/SetNewPin';
import ConfirmNewPin from './app/screens/main/ProfileTab/Security/ConfirmNewPin';
import GovtID from './app/screens/main/ProfileTab/Account.tsx/TierTwo/GovtID';
import VerificationStatus from './app/screens/main/ProfileTab/Account.tsx/TierTwo/VerificationStatus';
import ResidentialAddress from './app/screens/main/ProfileTab/Account.tsx/TierThree/ResidentialAddress';
import TierList from './app/screens/main/ProfileTab/Account.tsx/TierThree/TierList';
import BankStatement from './app/screens/main/ProfileTab/Account.tsx/TierThree/BankStatement';
import Badges from './app/screens/main/ProfileTab/Badges';
import {initializeFB} from './app/services/notifications';

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  SignIn: undefined;
  SignInVerification: {mobile: string};
  OTP: {
    userObj: {mobile: string; country_code: string};
    resetPassword?: boolean;
  };
  ForgotPin: undefined;
  BankDetails: undefined;
  Money: undefined;
  Profile: undefined;
  SecurePassword: undefined;
  ConfirmPassword: {pin: string};
  Dashboard: undefined;
  RequestMoney: {funds_type: 'request' | 'send'; amount: string};
  TabScreens: undefined;
  PaymentStatus: {paymentSuccessStatus: string; amount: number};
  QRCodeScreen: undefined;
  Withdraw: undefined;
  WithdrawSuccessful: undefined;
  Notifications: undefined;
  HelpAndSupport: undefined;
  CustomerCare: undefined;
  Legal: undefined;
  ChangeLog: undefined;
  BankAccount: undefined;
  EditProfile: {userObj?: any};
  AccountUpgrade: undefined;
  SecurityScreen: undefined;
  ChangePin: undefined;
  SetNewPin: {old_pin: string};
  ConfirmNewPin: {old_pin: string; new_pin: string};
  GovtID: undefined;
  ResidentialAddress: undefined;
  VerificationStatus: {idStatus: 'success' | 'failed'};
  TierList: undefined;
  BankStatement: undefined;
  Badges: {achievements: any; medals: any};
};

export type MainNavParamList = {
  Home: undefined;
  MoneyTab: undefined;
  Profile: undefined;
};

const MainNav = createBottomTabNavigator<MainNavParamList>();

type ScreenNavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export type DrawerFunctions = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

export type ScreenProps<T extends keyof RootStackParamList> = {
  route: ScreenRouteProp<T>;
  navigation: ScreenNavigationProp<T> & DrawerFunctions;
};

const App: React.FC<RootStackParamList> = () => {
  const [splash, setSplash] = React.useState(true);
  const [userToken, setUserToken] = useState<null | string>(null);
  const [chosenTheme, setChosenTheme] = useState(0);

  useEffect(() => {
    (async () => {
      initializeFB();
    })();
  });

  const AppStack = createStackNavigator<RootStackParamList>();
  const NoAuthScreensNavigator = () => (
    <AppStack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}>
      <AppStack.Screen name="SignIn" component={SignIn} />
      <AppStack.Screen
        name="SignInVerification"
        component={SignInVerification}
      />
      <AppStack.Screen name="ForgotPin" component={ForgotPin} />
      <AppStack.Screen name="SecurePassword" component={SecurePassword} />
      <AppStack.Screen name="ConfirmPassword" component={ConfirmPassword} />
      <AppStack.Screen name="Register" component={Register} />
      <AppStack.Screen name="OTP" component={OTP} />
      <AppStack.Screen name="BankDetails" component={BankDetails} />
    </AppStack.Navigator>
  );
  const MoneyStack = createStackNavigator<RootStackParamList>();
  const MoneyTabScreensNavigator = () => (
    <MoneyStack.Navigator
      initialRouteName="Money"
      screenOptions={{
        headerShown: false,
      }}>
      <MoneyStack.Screen name="Money" component={Money} />
    </MoneyStack.Navigator>
  );

  const ProfileStack = createStackNavigator<RootStackParamList>();
  const ProfileTabScreensNavigator = () => (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  );

  const DashboardStack = createStackNavigator<RootStackParamList>();
  const DashboardTabScreensNavigator = () => (
    <DashboardStack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}>
      <DashboardStack.Screen name="Dashboard" component={Dashboard} />
    </DashboardStack.Navigator>
  );

  const AuthScreensNavigator = () => {
    return (
      <MainNav.Navigator
        initialRouteName="MoneyTab"
        screenOptions={({route}) => {
          return {
            tabBarActiveTintColor: StyleGuide.Colors.primary,
            tabBarInactiveTintColor: StyleGuide.Colors.shades.grey['50'],
            tabBarStyle: {
              paddingVertical: Platform.OS === 'ios' ? 20 : 0,
              height: 78,
              backgroundColor:
                route.name === 'MoneyTab'
                  ? StyleGuide.Colors.shades.magenta[50]
                  : StyleGuide.Colors.white,
              borderTopWidth: 0,
            },
            tabBarShowLabel: false,
            headerShown: false,
          };
        }}>
        <MainNav.Screen
          name="Home"
          component={DashboardTabScreensNavigator}
          options={{
            tabBarLabel: labelProps => (
              <TabBarLabel {...labelProps}>Home</TabBarLabel>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./app/assets/images/home_dark.png')
                    : require('./app/assets/images/home_grey.png')
                }
                style={[
                  styles.imageStyle,
                  focused ? {height: 30, width: 30} : {opacity: 0.5},
                ]}
              />
            ),
          }}
        />
        <MainNav.Screen
          name="MoneyTab"
          component={MoneyTabScreensNavigator}
          options={{
            tabBarLabel: labelProps => (
              <TabBarLabel {...labelProps}>Money</TabBarLabel>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./app/assets/images/keypad_white.png')
                    : require('./app/assets/images/keypad_grey.png')
                }
                style={[
                  styles.imageStyle,
                  focused ? {height: 30, width: 30} : {opacity: 0.5},
                ]}
              />
            ),
          }}
        />

        <MainNav.Screen
          name="Profile"
          component={ProfileTabScreensNavigator}
          options={{
            tabBarLabel: labelProps => (
              <TabBarLabel {...labelProps}>Profile</TabBarLabel>
            ),
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./app/assets/images/user_dark.png')
                    : require('./app/assets/images/user_grey.png')
                }
                style={[
                  styles.imageStyle,
                  focused ? {height: 30, width: 30} : {opacity: 0.5},
                ]}
              />
            ),
          }}
        />
      </MainNav.Navigator>
    );
  };

  const ParentStack = createStackNavigator<RootStackParamList>();
  const ParentScreensNavigator = () => (
    <ParentStack.Navigator
      initialRouteName="TabScreens"
      screenOptions={{
        headerShown: false,
      }}>
      <ParentStack.Screen name="TabScreens" component={AuthScreensNavigator} />
      <ParentStack.Screen name="RequestMoney" component={RequestMoney} />
      <ParentStack.Screen name="PaymentStatus" component={PaymentStatus} />
      <ParentStack.Screen name="QRCodeScreen" component={QRCodeScreen} />
      <ParentStack.Screen name="Withdraw" component={Withdraw} />
      <ParentStack.Screen name="Notifications" component={Notifications} />
      <ParentStack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <ParentStack.Screen name="CustomerCare" component={CustomerCare} />
      <ParentStack.Screen name="Legal" component={Legal} />
      <ParentStack.Screen name="ChangeLog" component={ChangeLog} />
      <ParentStack.Screen name="BankAccount" component={BankAccount} />
      <ParentStack.Screen name="EditProfile" component={EditProfile} />
      <ParentStack.Screen name="AccountUpgrade" component={AccountUpgrade} />
      <ParentStack.Screen name="GovtID" component={GovtID} />
      <ParentStack.Screen name="SecurityScreen" component={SecurityScreen} />
      <ParentStack.Screen name="ChangePin" component={ChangePin} />
      <ParentStack.Screen name="SetNewPin" component={SetNewPin} />
      <ParentStack.Screen name="ConfirmNewPin" component={ConfirmNewPin} />
      <ParentStack.Screen name="TierList" component={TierList} />
      <ParentStack.Screen name="BankStatement" component={BankStatement} />
      <ParentStack.Screen name="Badges" component={Badges} />
      <ParentStack.Screen
        name="ResidentialAddress"
        component={ResidentialAddress}
      />
      <ParentStack.Screen
        name="VerificationStatus"
        component={VerificationStatus}
      />
      <ParentStack.Screen
        name="WithdrawSuccessful"
        component={WithdrawalSuccessfulScreen}
      />
    </ParentStack.Navigator>
  );

  const RootStack = createStackNavigator();
  const RootStackNavigtor = () => {
    return (
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {userToken && userToken.length > 0 ? (
          <RootStack.Screen
            name="App"
            component={() => ParentScreensNavigator()}
            options={{
              animationEnabled: false,
            }}
          />
        ) : (
          <RootStack.Screen
            name="Auth"
            component={NoAuthScreensNavigator}
            options={{
              animationEnabled: false,
            }}
          />
        )}
      </RootStack.Navigator>
    );
  };

  const authContext = useMemo(() => {
    return {
      signIn: async () => {
        try {
          const value = await EncryptedStorage.getItem('@user_token');
          if (value !== undefined) {
            setUserToken(value);
          } else {
            setUserToken(null);
          }
        } catch (e) {}
      },
      signUp: async () => {
        try {
          const value = await EncryptedStorage.getItem('@user_token');

          if (value !== undefined) {
            setUserToken(value);
          } else {
            setUserToken(null);
          }
        } catch (e) {}
      },
      signOut: async () => {
        try {
          await EncryptedStorage.clear();
          setUserToken(null);
        } catch (e) {}
      },
      // onboarded: async () => {
      //   try {
      //     const value = await EncryptedStorage.getItem('@user_onboarded');
      //     if (value) {
      //       setUserStatus(value);
      //     } else {
      //       setUserStatus(null);
      //     }
      //   } catch (e) {}
      // },
      colourTheme: async (value: string) => {
        try {
          if (value === 'landing-page') {
            setChosenTheme(0);
          } else {
            setChosenTheme(1);
          }
        } catch (e) {}
      },
    };
  }, []);

  React.useEffect(() => {
    async function getToken() {
      // setIsLoading(true);
      try {
        const value = await EncryptedStorage.getItem('@user_token');
        if (value !== undefined) {
          // setIsLoading(false);
          setUserToken(value);
        } else {
          // setIsLoading(false);
          setUserToken(null);
        }
      } catch (e) {}
    }
    getToken();
  }, []);

  useEffect(() => {
    (async () => {
      const userDetails = await EncryptedStorage.getItem('userDetails');
      if (userDetails) {
        setAxiosToken();
      }
    })();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 3000);
  }, []);

  const appTheme = [
    {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(255, 45, 85)',
        secondary: '#0984E3',
        iconNotActive: StyleGuide.Colors.shades.grey[1450],
        iconActive: '#ffffff',
        backgroundColor: StyleGuide.Colors.shades.magenta[50],
      },
    },
    {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: 'rgb(255, 45, 85)',
        secondary: '#0984E3',
        iconNotActive: '#979797',
        iconActive: '#979797',
        backgroundColor: StyleGuide.Colors.white,
      },
    },
  ];

  if (splash) {
    return <Splash />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <MenuProvider>
        <NavigationContainer theme={appTheme[chosenTheme]}>
          <ToastProvider
            placement="top"
            duration={5000}
            animationType="slide-in"
            animationDuration={250}
            successColor={StyleGuide.Colors.shades.green[200]}
            dangerColor={StyleGuide.Colors.shades.red[300]}
            warningColor={StyleGuide.Colors.shades.orange[200]}
            normalColor={StyleGuide.Colors.shades.grey[300]}
            textStyle={styles.toastFontSize}
            style={{elevation: 10}}
            renderType={{
              custom_toast: toast => (
                <View style={styles.toastBox}>
                  <View>
                    <Text
                      style={{
                        fontSize: scaledSize(14),
                        color: StyleGuide.Colors.white,
                        fontFamily:
                          Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
                      }}>
                      {toast.data.title}
                    </Text>
                    <Text
                      style={{
                        color: StyleGuide.Colors.white,
                        marginTop: 2,
                        fontFamily: 'NexaRegular',
                        fontSize: scaledSize(10),
                      }}>
                      {toast.message}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.iconBox}>
                    <Icon
                      type="fontawesome5"
                      name="times"
                      size={14}
                      color={StyleGuide.Colors.white}
                      style={styles.iconStyle}
                      onPress={() => toast.onHide()}
                    />
                  </TouchableOpacity>
                </View>
              ),
            }}
            swipeEnabled={true}>
            <RootStackNavigtor />
          </ToastProvider>
        </NavigationContainer>
      </MenuProvider>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastFontSize: {
    fontSize: scaledSize(12),
    fontFamily: 'NexaRegular',
  },
  imageStyle: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  toastBox: {
    // maxWidth: '90%',
    width: '95%',
    backgroundColor: StyleGuide.Colors.shades.magenta[90],
    marginTop: 30,
    borderRadius: 8,
    justifyContent: 'space-between',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    alignSelf: 'flex-end',
    elevation: 3,
  },
  iconBox: {
    padding: 10,
    backgroundColor: 'rgba(12, 12, 38, 0.5)',
    borderRadius: 10,
    marginLeft: 20,
  },
});

export default App;
