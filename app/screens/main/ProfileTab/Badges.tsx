/* eslint-disable react-native/no-inline-styles */
import React, {createRef} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {ScreenProps} from '../../../../App';
import StyleGuide from '../../../assets/style-guide';
import {scaledSize} from '../../../assets/style-guide/typography';
import ActionSheetContainer from '../../../components/ActionSheetContainer';
import Layout from '../../../components/Layout';
import MonieeActionSheet from '../../../components/MonieeActionSheet';
import MonieeButton from '../../../components/MonieeButton';
import Subheader from '../../../components/Subheader';
import {BadgeTypes} from './Profile';

const Badges: React.FC<ScreenProps<'Badges'>> = ({navigation, route}) => {
  const {achievements, medals} = route.params;
  const actionSheetRef = createRef<ActionSheet>();

  return (
    <Layout>
      <View style={styles.main}>
        <ScrollView style={styles.main}>
          <Subheader title="Badges" goBack={navigation.goBack} />
          <Text style={styles.headerText}>My Achievements</Text>
          <View style={styles.listWrapper}>
            {achievements.map((item: BadgeTypes, index: number) => (
              <TouchableOpacity
                onPress={() => actionSheetRef?.current?.show()}
                style={styles.listItem}
                key={index}>
                <Image
                  source={{uri: item.image_url}}
                  style={styles.avatarImage}
                />
                <Text style={styles.subText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {achievements.length === 0 && (
            <Text style={styles.noData}>
              You have no Achievements at the moment
            </Text>
          )}
          <Text style={styles.headerText}>Medals of Honor</Text>
          <View style={styles.listWrapper}>
            {medals.map((item: BadgeTypes, index: number) => (
              <TouchableOpacity
                onPress={() => actionSheetRef?.current?.show()}
                style={styles.listItem}
                key={index}>
                <Image
                  source={{uri: item.image_url}}
                  style={styles.avatarImage}
                />
                <Text style={styles.subText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {medals.length === 0 && (
            <Text style={styles.noData}>You have no Medals at the moment</Text>
          )}
        </ScrollView>
        <MonieeActionSheet
          onClose={() => {}}
          onOpen={() => {}}
          refObj={actionSheetRef}>
          <ActionSheetContainer>
            <View>
              <View style={styles.fakeCircle} />
              <Text style={[styles.subText, {textAlign: 'center'}]}>
                Tincidunt amet quam suspen in eget amet commodo nibh aliquet.
                Sit at eget sit sed. Sapien quisque arcu, donec congue
                habitasse.
              </Text>
            </View>
            <MonieeButton
              title="Close"
              mode={'secondary'}
              customStyle={{
                backgroundColor: StyleGuide.Colors.shades.blue[400],
                marginTop: 40,
              }}
              textColor={StyleGuide.Colors.primary}
              onPress={() => {
                actionSheetRef?.current?.hide();
              }}
            />
          </ActionSheetContainer>
        </MonieeActionSheet>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {flex: 1},
  headerText: {
    fontSize: scaledSize(14),
    fontFamily: Platform.OS === 'ios' ? 'Nexa-Bold' : 'NexaBold',
    color: StyleGuide.Colors.shades.blue[300],
    marginTop: 30,
  },
  fakeCircle: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: StyleGuide.Colors.shades.grey[30],
    alignSelf: 'center',
  },
  listWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItem: {
    alignItems: 'center',
    marginRight: 30,
    marginBottom: 30,
    marginTop: 10,
  },
  subText: {
    fontSize: scaledSize(12),
    fontFamily: 'NexaRegular',
    color: StyleGuide.Colors.black,
    marginTop: 10,
    lineHeight: 20,
  },
  avatarImage: {
    height: 50,
    width: 50,
    marginRight: 5,
    borderRadius: 50,
  },
  noData: {
    flex: 1,
    alignSelf: 'center',
    marginVertical: 20,
    fontFamily: 'NexaRegular',
  },
});

export default Badges;
