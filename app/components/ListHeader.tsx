import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StyleGuide from '../assets/style-guide';

type ListHeaderProps = {
  title: string;
  description?: string;
};

const ListHeader: React.FC<ListHeaderProps> = ({title, description}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: StyleGuide.Colors.shades.grey[25],
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: StyleGuide.Typography[10],
    fontWeight: '500',
    color: StyleGuide.Colors.shades.grey[1150],
    marginBottom: 4,
  },
  description: {
    fontSize: StyleGuide.Typography[10],
    color: StyleGuide.Colors.shades.grey[1200],
  },
});

export default ListHeader;
