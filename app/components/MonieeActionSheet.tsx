import React from 'react';
import {StyleSheet} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

type Props = {
  children: React.ReactNode;
  refObj: React.RefObject<ActionSheet>;
  onClose?: () => void;
  onOpen?: () => void;
};

const MonieeActionSheet = ({children, refObj, onClose, onOpen}: Props) => (
  <ActionSheet
    onClose={onClose}
    onOpen={onOpen}
    gestureEnabled
    containerStyle={styles.containerStyle}
    ref={refObj}>
    {children}
  </ActionSheet>
);

const styles = StyleSheet.create({
  containerStyle: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});

export default MonieeActionSheet;
