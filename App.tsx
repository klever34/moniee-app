import React, {useEffect, useMemo, useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/core';
import // UserContext,
// initialUserState,
// reducer,
// NewUser,
// LoginPayload,
// UserActions,
'./app/contexts/User';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Screens
import SignIn from './app/screens/auth/SignIn';
import SignInVerification from './app/screens/auth/SignInVerification';
import SecurePassword from './app/screens/auth/SecurePassword';
import ConfirmPassword from './app/screens/auth/ConfirmPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {setAxiosToken} from './app/services/api';
import Splash from './app/screens/auth/Splash';
import {ToastProvider} from 'react-native-toast-notifications';
import StyleGuide from './app/assets/style-guide';
import {Platform, StyleSheet} from 'react-native';
import {TabBarLabel} from './app/components/TabBarLabel';
// import {applyStyles, navBarHeight} from './app/assets/styles';
import Icon from './app/components/Icon';
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

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  SignIn: undefined;
  SignInVerification: undefined;
  OTP: undefined;
  ForgotPin: undefined;
  BankDetails: undefined;
  Money: undefined;
  Profile: undefined;
  SecurePassword: undefined;
  ConfirmPassword: undefined;
  Dashboard: undefined;
  RequestMoney: {funds_type: 'request' | 'send'};
  TabScreens: undefined;
  PaymentStatus: {paymentSuccessStatus: string};
  //
  VerifyIdentity: {typeOfVerification?: string};
  ShareContact: {payload: any};
  Home: undefined;
  WithdrawalSettings: undefined;
  DepositMoney: undefined;
  DepositSuccess: undefined;
  DepositFailed: undefined;
  ShareDetails: undefined;
  WithdrawScreen: undefined;
  WithdrawSuccessScreen: undefined;
  ConfirmPasscode: undefined;
  AddWithdrawalMethod: undefined;
  UserSettings: undefined;
  PaymentSettings: undefined;
  TransactionsHistory: undefined;
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
  // const [state, dispatch] = useReducer(reducer, initialUserState);
  // const context = {userState: state, userDispatch: dispatch};
  // let userToken = state.token;
  // const [splash, setSplash] = React.useState(true);
  const [userToken, setUserToken] = useState<null | string>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [userStatus, setUserStatus] = useState(null);
  const [splash, setSplash] = useState(true);
  const [chosenTheme, setChosenTheme] = useState(0);

  // type StackProps = {
  //   currentColorTheme: string;
  // };

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
              <Icon
                type="material-icons"
                name="home-filled"
                size={24}
                color={
                  focused
                    ? StyleGuide.Colors.white
                    : StyleGuide.Colors.shades.grey[1450]
                }
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
              <Icon
                type="ionicons"
                name="keypad"
                size={24}
                color={
                  focused
                    ? StyleGuide.Colors.white
                    : StyleGuide.Colors.shades.grey[1450]
                }
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
              <Icon
                type="fontawesome5"
                name="user"
                size={24}
                color={
                  focused
                    ? StyleGuide.Colors.white
                    : StyleGuide.Colors.shades.grey[1450]
                }
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
          const value = await AsyncStorage.getItem('@user_token');
          if (value !== null) {
            setUserToken(value);
          } else {
            setUserToken(null);
          }
        } catch (e) {}
      },
      signUp: async () => {
        try {
          const value = await AsyncStorage.getItem('@user_token');
          if (value !== null) {
            setUserToken(value);
          } else {
            setUserToken(null);
          }
        } catch (e) {}
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('@user_token');
          setUserToken(null);
        } catch (e) {}
      },
      // onboarded: async () => {
      //   try {
      //     const value = await AsyncStorage.getItem('@user_onboarded');
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
        const value = await AsyncStorage.getItem('@user_token');
        if (value !== null) {
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

  // useEffect(() => {
  //   (async () => {
  //     const userDetails = await AsyncStorage.getItem('userDetails');
  //     if (userDetails) {
  //       const storedUserState = JSON.parse(userDetails);
  //       setAxiosToken(storedUserState.token);

  //       dispatch({
  //         type: UserActions.SIGN_IN_USER,
  //         payload: storedUserState,
  //       });
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
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
          swipeEnabled={true}>
          <RootStackNavigtor />
        </ToastProvider>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastFontSize: {
    fontSize: scaledSize(12),
  },
});

export default App;