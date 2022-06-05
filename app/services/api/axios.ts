import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

export let API = axios.create({
  baseURL: 'https://moniee-stag.herokuapp.com/api/v1',
});

export const setAxiosToken = async () => {
  const userDetails = await EncryptedStorage.getItem('userDetails');

  if (userDetails) {
    const storedUserState = JSON.parse(userDetails);
    API = axios.create({
      baseURL: 'https://moniee-stag.herokuapp.com/api/v1',
      headers: {Authorization: `Bearer ${storedUserState.token}`},
    });
  }
};
