import React, {ReactNode} from 'react';
import {Text} from 'react-native';
import {scaledSize} from '../assets/style-guide/typography';
import {applyStyles} from '../assets/styles';

type TabBarLabelProps = {
  focused: boolean;
  children: ReactNode;
};

export const TabBarLabel = ({children, focused}: TabBarLabelProps) => {
  return (
    <Text
      style={applyStyles(
        focused ? 'text-gray-300 text-700' : 'text-gray-200',
        'uppercase',
        {
          fontSize: scaledSize(12),
        },
      )}>
      {children}
    </Text>
  );
};
