import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomModalScrollable, BottomModalScrollableRef } from '../';
import { Content } from '../components/Content';

interface Props {}

export const BasicModal = React.forwardRef<BottomModalScrollableRef, Props>(
  ({}, ref) => {
    return (
      <BottomModalScrollable
        ref={ref}
        containerStyle={styles.containerModalStyle}
        children={<Content title="Basic Modal" />}
      />
    );
  },
);

const styles = StyleSheet.create({
  containerModalStyle: {
    paddingBottom: 100,
  },
});
