import React from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedScrollModal, AnimatedScrollModalRef } from '../';
import { Content } from '../components/Content';

interface Props {}

export const BasicModal = React.forwardRef<AnimatedScrollModalRef, Props>(
  ({}, ref) => {
    return (
      <AnimatedScrollModal
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
