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

export type RequestMoneyPayload = {
  purpose: string;
  phone_number: string;
  amount: number;
};

type VerifyOtpPayload = {
  mobile: string;
  countryCode: string;
  otp: string;
};

type SetPinPayload = {
  pin: string;
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

type RecipientPayload = {
  mobile: string;
  amount: number;
  reason?: string;
};

type MoneyRequestPayload = {
  recipients: RecipientPayload[];
  pin?: string;
};

type WithdrawalPayload = {
  amount: number;
  pin: string;
};

type fcmTokenPayload = {
  token: string;
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

export const savedUser = async () => {
  const user_id = await EncryptedStorage.getItem('user-id');
  return user_id;
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<any> => {
  const fetchResponse = await API.post('/auth/signup', payload);
  const userDetails = forgeUserData(fetchResponse);
  await EncryptedStorage.setItem('userDetails', JSON.stringify(userDetails));
  await EncryptedStorage.setItem('user-id', JSON.stringify(userDetails.id));
  setAxiosToken();
  return userDetails;
};

export const sendOtp = async (
  payload: Pick<NewUser, 'mobile'>,
): Promise<void> => {
  await API.post('/auth/signup/otp', payload);
};

export const setUserPin = async (
  payload: SetPinPayload,
  user_id: number,
): Promise<any> => {
  const res = await API.patch(`/user/${user_id}/pin`, keysToSnakeCase(payload));
  return res.data;
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
  setAxiosToken();
  try {
    const user_id = await EncryptedStorage.getItem('user-id');
    const result = await API.get(`user/${user_id}/balance`);
    return result;
  } catch (error: any) {
    return error.response.status;
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

export const fetchUserInfo = async (): Promise<any> => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.get(`user/${user_id}`);
  return result.data.data;
};

export const fetchUserBankAccount = async (): Promise<any> => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.get(`user/${user_id}/bank-account`);
  return result.data.data;
};

export const fetchBankWithdrawals = async (): Promise<any> => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.get(`user/${user_id}/withdrawals`);
  return result.data.data;
};

export const fetchBadges = async (): Promise<any> => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.get(`user/${user_id}/badges`);
  return result.data.data;
};

export const fetchRecentTransactions = async (): Promise<any> => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.get(`user/${user_id}/transactions`);
  return result.data.data;
};

export const fetchNotifications = async (): Promise<any> => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.get(`user/${user_id}/notifications`);
  return result.data.data;
};

export const withdrawFunds = async (
  payload: WithdrawalPayload,
): Promise<any> => {
  setAxiosToken();
  const result = await API.post('user/withdraw', payload);
  return result;
};

export const updateUserEmail = async (payload: Pick<NewUser, 'email'>) => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.patch(`user/${user_id}`, payload);
  return result;
};

export const changeUserPasscode = async (payload: {
  old_pin: string;
  new_pin: string;
}) => {
  const user_id = await EncryptedStorage.getItem('user-id');
  const result = await API.patch(`user/${user_id}/change-pin`, payload);
  return result;
};

export const getUserValidation = async () => {
  const user_id = await savedUser();
  const result = await API.get(`user/${user_id}/validation`);
  return result;
};

export const updateUserTierTwo = async (payload: {
  photoid_type: string;
  photoid_number: string;
  selfie_image: string;
  photoid_image: string;
}) => {
  setAxiosToken();
  const user_id = await savedUser();
  const result = await API.post(`user/${user_id}/validation/tier-two`, payload);
  return result;
};

export const updateUserAddress = async (payload: {
  street: string;
  city: string;
  state: string;
}) => {
  const user_id = await savedUser();
  const result = await API.post(
    `user/${user_id}/validation/tier-three/address`,
    payload,
  );
  return result;
};

export const updateUserBankStatement = async (statement: FormData) => {
  const user_id = await savedUser();
  setAxiosToken();
  const result = await API.post(
    `user/${user_id}/validation/tier-three/statement`,
    statement,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return result;
};

export const saveFcmToken = async (payload: fcmTokenPayload): Promise<void> => {
  await API.post('user/pn-token', payload);
};

export const acceptRequest = async (payload: {
  id: number;
  pin: string;
}): Promise<any> => {
  const res = await API.post(`request/${payload.id}/accept`, {
    pin: payload.pin,
  });
  return res.data;
};

export const declineRequest = async (id: number): Promise<any> => {
  const res = await API.post(`request/${id}/decline`);
  return res.data;
};

export const apiLogOut = async () => {
  setAxiosToken();
  await API.post('auth/logout');
};
