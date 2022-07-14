import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Platform} from 'react-native';
// import 'react-native-get-random-values';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
var RNFS = require('react-native-fs');
export type ImagePickerResult = {
  uri?: string;
  type?: string;
  name?: string;
  base64?: string;
};

const maxFileUploadSize = 120000000;

export const useImageInput = (
  options: (CameraOptions | ImageLibraryOptions) & {
    initialUrl?: ImagePickerResult;
  } = {mediaType: 'photo'},
) => {
  const [imageUrl, setImageUrl] = useState(options.initialUrl);

  useEffect(() => {
    (async () => {
      const result = await Platform.select({
        android: check(PERMISSIONS.ANDROID.CAMERA),
        ios: check(PERMISSIONS.IOS.CAMERA),
      });
      if (result !== RESULTS.GRANTED) {
        await Platform.select({
          android: request(PERMISSIONS.ANDROID.CAMERA),
          ios: request(PERMISSIONS.IOS.CAMERA),
        });
      }
    })();
  }, []);

  const handleCameraLauncher = useCallback((): Promise<ImagePickerResult> => {
    return new Promise((resolve, reject) => {
      const onResponse = async (response: ImagePickerResponse) => {
        console.log('res assets');

        console.log(response.assets);

        const {assets} = response;
        if (response.didCancel || !assets?.length) {
          return;
        } else if (response.errorMessage) {
          reject(response.errorMessage);
          Alert.alert('Error', response.errorMessage);
        } else {
          const [asset] = assets;
          const {uri, type, fileName, fileSize} = asset;
          if (!fileName || !fileSize) {
            return;
          }
          const extensionIndex = fileName.lastIndexOf('.');
          const extension = fileName.slice(extensionIndex + 1);
          const allowedExtensions = ['jpg', 'jpeg', 'png'];
          if (!allowedExtensions.includes(extension)) {
            return Alert.alert('Error', 'File upload not allowed');
          }
          if (maxFileUploadSize && fileSize > maxFileUploadSize) {
            return Alert.alert('Error', 'Maximum file size uploaded');
          }
          const base64uri = await RNFS.readFile(uri, 'base64');

          const image = {
            uri,
            type,
            name: fileName ?? '',
            base64: base64uri,
          };
          setImageUrl(image);
          resolve(image);
        }
      };
      launchCamera(options).then(onResponse);
    });
  }, [options]);

  const handleImageGalleryLauncher =
    useCallback((): Promise<ImagePickerResult> => {
      return new Promise((resolve, reject) => {
        const onResponse = (response: ImagePickerResponse) => {
          const {assets} = response;
          if (response.didCancel || !assets?.length) {
            return;
          } else if (response.errorMessage) {
            reject(response.errorMessage);
            Alert.alert('Error', response.errorMessage);
          } else {
            const [asset] = assets;
            const {uri, type, fileName, fileSize} = asset;
            if (!fileName || !fileSize) {
              return;
            }
            const extensionIndex = fileName.lastIndexOf('.');
            const extension = fileName.slice(extensionIndex + 1);
            const allowedExtensions = ['jpg', 'jpeg', 'png'];
            if (!allowedExtensions.includes(extension)) {
              return Alert.alert('Error', 'File upload not allowed');
            }
            if (maxFileUploadSize && fileSize > maxFileUploadSize) {
              return Alert.alert('Error', 'Maximum file size uploaded');
            }
            const image = {
              uri,
              type,
              name: fileName ?? '',
            };
            setImageUrl(image);
            resolve(image);
          }
        };
        launchImageLibrary(options).then(onResponse);
      });
    }, [options]);

  return useMemo(
    () => ({
      imageUrl,
      setImageUrl,
      handleCameraLauncher,
      handleImageGalleryLauncher,
    }),
    [handleCameraLauncher, imageUrl, handleImageGalleryLauncher],
  );
};
