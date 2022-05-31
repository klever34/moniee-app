import {User} from './reducer';
import {API, setAxiosToken} from '../../services/api';
import {keysToSnakeCase} from '../../utils';
import EncryptedStorage from 'react-native-encrypted-storage';

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

export type BankDetailsPayload = {
  bank: string;
  account_number: string;
  bvn: string;
};

export type GenericUserAction = {
  type: UserActions;
  payload?: any;
};

// type CreateNewUserAction = {
//   type: UserActions.CREATE_NEW_USER;
//   payload: User;
// };

// type SignInUserAction = {
//   type: UserActions.SIGN_IN_USER;
//   payload: User;
// };

export type RequestMoneyPayload = {
  purpose: string;
  phone_number: string;
  amount: number;
};

export const signUp = async (payload: NewUser): Promise<void> => {
  await API.post('/customers/signup', keysToSnakeCase(payload));
};

type VerifyOtpPayload = {
  mobile: string;
  countryCode: string;
  otp: string;
};

type SetPinPayload = {
  pin: string;
};

type fcmTokenPayload = {
  token: string;
  platform?: string;
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

export type LoginPayload = Pick<User, 'mobile' | 'country_code'>;

export type SignInPayload = {
  mobile: string;
  pin: string;
};

type UserCheckPayload = {
  mobiles: string[];
};

type RecipientPayload = {
  mobile: string;
  amount: number;
  reason?: string;
};

type MoneyRequestPayload = {
  recipients: RecipientPayload[];
  pin?: string;
};

const forgeUserData = (apiResponse: any) => {
  const coreUserData = apiResponse.data;
  const userDetails: User = {
    id: coreUserData?.user?.id,
    first_name: coreUserData?.user?.first_name,
    last_name: coreUserData?.user?.last_name,
    mobile: coreUserData?.user?.mobile,
    email: coreUserData?.user?.email,
    country_code: coreUserData?.user?.country_code,
    token: coreUserData?.token,
    is_active: coreUserData.user.is_active,
    wallet: coreUserData?.wallet,
    score: coreUserData?.score,
    middle_name: coreUserData?.user?.middle_name,
    is_new: coreUserData?.user?.is_new,
    avatar_url: coreUserData?.user?.avatar_url,
    dob: coreUserData?.user?.dob,
  };
  return userDetails;
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<any> => {
  const fetchResponse = await API.post('/auth/signup', payload);
  const userDetails = forgeUserData(fetchResponse);
  await EncryptedStorage.setItem('userDetails', JSON.stringify(userDetails));
  await EncryptedStorage.setItem('user-id', JSON.stringify(userDetails.id));
  setAxiosToken(userDetails.token);
  return userDetails;
};

export const sendOtp = async (
  payload: Pick<NewUser, 'mobile'>,
): Promise<void> => {
  const res = await API.post('/auth/signup/otp', payload);
  console.log(res.data);
};

export const saveContacts = async (payload: ContactsData[]): Promise<void> => {
  await API.post('/customers/phonebook', payload);
};

export const setUserPin = async (
  payload: SetPinPayload,
  user_id: number,
): Promise<any> => {
  const res = await API.patch(`/user/${user_id}/pin`, keysToSnakeCase(payload));
  return res.data;
};

export const getUserDashboardData = async (): Promise<User> => {
  const fetchResponse = await API.get('/customers/dashboard');
  const userDetails = forgeUserData(fetchResponse);
  return userDetails;
};

export const updateUserState = async (
  partialUser: Partial<User>,
): Promise<GenericUserAction> => {
  const userDetailsStr = await EncryptedStorage.getItem('userDetails');
  let userDetails = JSON.parse(userDetailsStr as string);
  userDetails = {
    ...userDetails,
    ...partialUser,
    token: userDetails.token,
  };
  await EncryptedStorage.setItem('userDetails', JSON.stringify(userDetails));
  return {
    type: UserActions.REFRESH_USER,
    payload: {
      is_identity_verified: userDetails.is_identity_verified,
      id: userDetails.id,
    },
  };
};

export const saveUserCard = async (payload: PaystackPayload): Promise<any> => {
  const result = await API.post('', payload);
  return result.data;
};

export const payWithCard = async (
  payload: Partial<PaystackPayload>,
): Promise<any> => {
  const result = await API.post('', payload);
  return result.data;
};

export const getCardDetails = async (
  payload: CardDetailsPayload,
): Promise<any> => {
  const result = await API.post('', payload);
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
  const result = await API.post('', payload);
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

export const getBanks = async (): Promise<any> => {
  const banksData = await API.get('/banks');
  return banksData.data.banks;
};

export const submitBankDetails = async (
  payload: any,
  user_id: number,
): Promise<any> => {
  const result = await API.post(`user/${user_id}/validation/tier-one`, payload);
  return result.data;
};

export const signInUser = async (payload: SignInPayload): Promise<any> => {
  const result = await API.post('/auth/login', payload);
  const userDetails = forgeUserData(result);
  await EncryptedStorage.setItem('userDetails', JSON.stringify(userDetails));
  await EncryptedStorage.setItem('user-id', JSON.stringify(userDetails.id));
  return userDetails;
};

export const fetchWalletBalance = async (): Promise<any> => {
  console.log('feth');

  try {
    const user_id = await EncryptedStorage.getItem('user-id');
    const result = await API.get(`user/${user_id}/balance`);
    console.log(result);

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const sendMoney = async (payload: MoneyRequestPayload): Promise<any> => {
  const result = await API.post('/transfer', payload);
  return result.data;
};

export const requestMoney = async (
  payload: MoneyRequestPayload,
): Promise<any> => {
  const result = await API.post('/request', payload);
  return result.data;
};
