import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenProps} from '../../../../../App';
import StyleGuide from '../../../../assets/style-guide';
import Icon from '../../../../components/Icon';
import Layout from '../../../../components/Layout';
import MenuIcon from '../../../../components/MenuIcon';
import Subheader from '../../../../components/Subheader';

const SecurityScreen: React.FC<ScreenProps<'SecurityScreen'>> = ({
  navigation,
}) => {
  return (
    <Layout>
      <View style={styles.main}>
        <Subheader title="Security" goBack={navigation.goBack} />
        <MenuIcon
          title="Change PIN"
          image={require('../../../../assets/images/lock.png')}
          onPress={() => navigation.push('ChangePin')}
        />
        <MenuIcon
          title="Enable Biometrics"
          image={require('../../../../assets/images/biometrics.png')}
          customIcon={
            <Icon
              type="material-community-icons"
              name="toggle-switch-outline"
              size={18}
              color={StyleGuide.Colors.shades.grey[50]}
            />
          }
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
});

export default SecurityScreen;
