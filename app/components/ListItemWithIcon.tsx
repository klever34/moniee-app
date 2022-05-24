import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scaleHeight, scaleWidth} from '../utils';
import StyleGuide from '../assets/style-guide';

type ListItemWithIconProps = {
  leftHandContent: React.ReactNode;
  icon?: React.ReactNode;
  iconBgColor?: string;
  rightHandContent?: React.ReactNode;
  deactivated?: boolean;
};

const ListItemWithIcon: React.FC<ListItemWithIconProps> = ({
  leftHandContent,
  icon,
  iconBgColor,
  rightHandContent,
  deactivated,
}) => {
  const extraStyles = StyleSheet.create({
    iconBgColorStyle: {
      backgroundColor: iconBgColor || StyleGuide.Colors.black,
    },
    boldStyle: {
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.option}>
      {icon && (
        <View
          style={[
            styles.iconContainer,
            extraStyles.iconBgColorStyle,
            deactivated && styles.deactivatedIconBg,
          ]}>
          {icon}
        </View>
      )}
      <View style={styles.listContentContainer}>
        <View style={[styles.listContent && deactivated && styles.deactivated]}>
          {leftHandContent !== undefined && leftHandContent}
        </View>
        <View style={[styles.listContent && deactivated && styles.deactivated]}>
          {rightHandContent !== undefined && rightHandContent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    color: 'white',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleWidth(24),
    height: scaleHeight(24),
    backgroundColor: StyleGuide.Colors.shades.green[100],
    borderRadius: StyleGuide.Typography[12],
  },
  listContentContainer: {
    flex: 1,
    marginLeft: scaleWidth(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomColor: StyleGuide.Colors.shades.grey[50],
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  listContent: {},
  deactivated: {
    opacity: 0.25,
  },
  deactivatedIconBg: {
    backgroundColor: StyleGuide.Colors.shades.grey[1050],
  },
});

export default ListItemWithIcon;
