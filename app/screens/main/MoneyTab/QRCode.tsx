import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import Icon from '../../../components/Icon';
import Layout from '../../../components/Layout';

const QRCode: React.FC<ScreenProps<'QRCode'>> = ({}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Icon
          type="fontawesome5"
          name="times"
          size={30}
          color={StyleGuide.Colors.shades.grey[25]}
          style={styles.iconStyle}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  iconStyle: {
    alignSelf: 'flex-end',
  },
});

export default QRCode;
