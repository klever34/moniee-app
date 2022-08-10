import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

export let API = axios.create({
  baseURL: 'https://moniee-prod.herokuapp.com/api/v1',
});

export const setAxiosToken = async () => {
  const userDetails = await EncryptedStorage.getItem('userDetails');

  if (userDetails) {
    const storedUserState = JSON.parse(userDetails);
    API = axios.create({
      baseURL: 'https://moniee-prod.herokuapp.com/api/v1',
      headers: {Authorization: `Bearer ${storedUserState.token}`},
      timeout: 60000,
    });
  }
};

// API.interceptors.response.use(
//   response => {
//     if (response.data.message) {
//       console.log('Success', response.data.message);
//     }
//     return response.data;
//   },
//   error => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         console.log('Info', 'Your session has timed out, please login again');
//       }

//       const {
//         response: {data},
//         config: {alertError},
//       } = error;
//       if (data) {
//         console.log(data.errors);

//         if (data.message && alertError) {
//           console.log('An error has occurred', data.message);
//         }
//         throw data;
//       }
//     }
//     throw error;
//   },
// );
