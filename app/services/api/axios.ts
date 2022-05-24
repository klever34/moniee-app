import axios from 'axios';
// import Config from 'react-native-config';

export let API = axios.create({
  baseURL: 'https://api.test.shara.co/v1',
});

export const setAxiosToken = (token: string) => {
  API = axios.create({
    baseURL: 'https://api.test.shara.co/v1',
    headers: {Authorization: `Bearer ${token}`},
  });
};
