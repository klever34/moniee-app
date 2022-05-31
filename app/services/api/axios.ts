import axios from 'axios';
// import Config from 'react-native-config';

export let API = axios.create({
  baseURL: 'https://moniee-stag.herokuapp.com/api/v1',
});

export const setAxiosToken = (token: string) => {
  API = axios.create({
    baseURL: 'https://moniee-stag.herokuapp.com/api/v1',
    headers: {Authorization: `Bearer ${token}`},
  });
};
