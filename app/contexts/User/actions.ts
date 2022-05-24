import {User} from './reducer';
import {API, setAxiosToken} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {keysToSnakeCase} from '../../utils';

export enum UserActions {
  CREATE_NEW_USER = 'CREATE_NEW_USER',
  SIGN_IN_USER = 'SIGN_IN_USER',
  SIGN_OUT_USER = 'SIGN_OUT_USER',
  UPDATE_BVN = 'UPDATE_BVN',
  REFRESH_USER = 'REFRESH_USER',
  VERIFY_USER = 'VERIFY_USER',
}

export interface ContactsData {
  displayName: string;
  familyName?: string;
  givenName?: string;
  phoneNumbers: any;
}

export type NewUser = {
  [key: string]: string | undefined;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  countryCode: string;
  authType: string;
};

export type GenericUserAction = {
  type: UserActions;
  payload?: any;
};

type CreateNewUserAction = {
  type: UserActions.CREATE_NEW_USER;
  payload: User;
};

// type SignInUserAction = {
//   type: UserActions.SIGN_IN_USER;
//   payload: User;
// };

export type RequestMoneyPayload = {
  purpose: string;
  phone_number: string;
};

export const signUp = async (payload: NewUser): Promise<void> => {
  await API.post('/customers/signup', keysToSnakeCase(payload));
};

type VerifyOtpPayload = {
  mobile: string;
  authType: string;
  password: string;
};

type SetPinPayload = {
  pin: string;
  confirmPin: string;
  belongs_to?: string;
};

type fcmTokenPayload = {
  token: string;
  platform?: string;
};

type VerifyBvnPayload = {
  idNumber: string;
  idType: string;
};

type PatchPayload = {
  user_id?: number;
  email?: string;
  firstname?: string;
  lastname?: string;
};

type PaystackPayload = {
  customer_id: number;
  amount: number;
  bnpl_id: any;
  paystackRes?: any;
};

type CardDetailsPayload = {
  user_id: number;
};

export type CardDetails = {
  bank: string;
  bin: string;
  brand: string;
  card_type: string;
  exp_month: string;
  exp_year: string;
  last4: string;
};

export type LoginPayload = Pick<User, 'mobile' | 'countryCode'>;

type UserCheckPayload = {
  mobiles: string[];
};

const forgeUserData = (apiResponse: any) => {
  const coreUserData = apiResponse.data.data;
  const userDetails: User = {
    id: coreUserData?.user?.id,
    firstname: coreUserData?.user?.firstname,
    lastname: coreUserData?.user?.lastname,
    mobile: coreUserData?.user?.mobile,
    email: coreUserData?.user?.email,
    countryCode: coreUserData?.user?.country_code,
    token: coreUserData?.credentials?.token,
    is_identity_verified: coreUserData.user.is_identity_verified,
    wallet: coreUserData?.wallet,
    score: coreUserData?.score,
    bills: coreUserData.bills,
    ux_cam_id: coreUserData?.ux_cam_id,
  };
  return userDetails;
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<CreateNewUserAction> => {
  const fetchResponse = await API.post(
    '/customers/login',
    keysToSnakeCase(payload),
  );
  const userDetails = forgeUserData(fetchResponse);

  await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
  setAxiosToken(userDetails.token);

  return {
    type: UserActions.CREATE_NEW_USER,
    payload: userDetails,
  };
};

export const sendOtp = async (
  payload: Pick<NewUser, 'countryCode' | 'mobile'>,
): Promise<void> => {
  await API.post('/auth/otp', keysToSnakeCase(payload));
};

export const saveContacts = async (payload: ContactsData[]): Promise<void> => {
  await API.post('/customers/phonebook', payload);
};

export const setUserPin = async (payload: SetPinPayload): Promise<void> => {
  await API.post('/pin', keysToSnakeCase(payload));
};

export const verifyUserBvn = async (
  payload: VerifyBvnPayload,
  userDetails: User,
): Promise<void> => {
  try {
    await API.put('/identity/verify', payload);
    userDetails.is_identity_verified = true;
    await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
  } catch (error) {
    throw error;
  }
};

export const getUserDashboardData = async (): Promise<User> => {
  const fetchResponse = await API.get('/customers/dashboard');
  const userDetails = forgeUserData(fetchResponse);
  return userDetails;
};

export const updateUserState = async (
  partialUser: Partial<User>,
): Promise<GenericUserAction> => {
  const userDetailsStr = await AsyncStorage.getItem('userDetails');
  let userDetails = JSON.parse(userDetailsStr as string);
  userDetails = {
    ...userDetails,
    ...partialUser,
    token: userDetails.token,
  };
  await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
  return {
    type: UserActions.REFRESH_USER,
    payload: {
      is_identity_verified: userDetails.is_identity_verified,
      id: userDetails.id,
    },
  };
};

export const saveUserCard = async (payload: PaystackPayload): Promise<any> => {
  const result = await API.post('/collections/paystack/initiate-dd', payload);
  return result.data;
};

export const payWithCard = async (
  payload: Partial<PaystackPayload>,
): Promise<any> => {
  const result = await API.post('/collections/paystack/pay-with-card', payload);
  return result.data;
};

export const getCardDetails = async (
  payload: CardDetailsPayload,
): Promise<any> => {
  const result = await API.post('/collections/paystack/card-lookup', payload);
  return result.data;
};

export const saveFcmToken = async (payload: fcmTokenPayload): Promise<void> => {
  await API.post('/fcm/token', payload);
};

export const patchUserData = async (payload: PatchPayload): Promise<any> => {
  const result = await API.patch('/users/me', payload);
  return result.data;
};

export const deleteDebitCard = async (
  payload: CardDetailsPayload,
): Promise<any> => {
  const result = await API.post('/collections/paystack/delete-card', payload);
  return result.data;
};

export const fileUpload = async (formData: FormData): Promise<any> => {
  const response = await API.post('/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const userCheck = async (payload: UserCheckPayload): Promise<any> => {
  const {data: users} = await API.post('/users/check', payload);
  return users.data;
};
