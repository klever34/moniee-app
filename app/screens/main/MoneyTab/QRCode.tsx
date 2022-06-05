import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import Icon from '../../../components/Icon';
import Layout from '../../../components/Layout';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import QRCode from 'react-native-qrcode-svg';

const QRCodeScreen: React.FC<ScreenProps<'QRCodeScreen'>> = ({navigation}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <Layout>
      <View style={styles.main}>
        <Icon
          type="fontawesome5"
          name="times"
          size={30}
          color={StyleGuide.Colors.shades.grey[25]}
          style={styles.iconStyle}
          onPress={() => navigation.goBack()}
        />
        {selectedIndex === 0 && (
          <QRCodeScanner
            onRead={() => {}}
            flashMode={RNCamera.Constants.FlashMode.auto}
            containerStyle={styles.qrCodeStyle}
            cameraStyle={styles.qrcameraStyle}
          />
        )}
        {selectedIndex === 1 && (
          <View style={[styles.main, styles.extraStyle]}>
            <QRCode value="http://awesome.link.qr" size={300} />
          </View>
        )}
        <View style={styles.bottomContainer}>
          <Text
            onPress={() => {
              setSelectedIndex(0);
            }}
            style={
              selectedIndex === 0 ? styles.activeText : styles.inactiveText
            }>
            Scan Code
          </Text>
          <Text
            onPress={() => {
              setSelectedIndex(1);
            }}
            style={
              selectedIndex === 1 ? styles.activeText : styles.inactiveText
            }>
            My Code
          </Text>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  iconStyle: {
    alignSelf: 'flex-end',
    marginRight: 10,
    elevation: 3,
  },
  qrCodeStyle: {
    flex: 1,
    // position: 'absolute',
    // top: 50,
    left: -24,
    width: Dimensions.get('window').width,
    height: 300,
  },
  qrcameraStyle: {height: 300},
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 50,
  },
  inactiveText: {
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.grey[25],
    margin: 20,
  },
  activeText: {
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.shades.magenta[25],
    textDecorationLine: 'underline',
    margin: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  extraStyle: {alignItems: 'center', justifyContent: 'center'},
});

export default QRCodeScreen;
