import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomModalScrollable,
  BottomModalScrollableRef,
} from 'react-native-bottom-modal-scrollable';
import { Content } from '../components/Content';

interface Props {}

const FOOTER_HEIGHT = 75;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const FooterModal = React.forwardRef<BottomModalScrollableRef, Props>(
  ({}, ref) => {
    const { bottom } = useSafeAreaInsets();

    return (
      <BottomModalScrollable
        ref={ref}
        containerStyle={styles.containerModalStyle}
        children={<Content title="Footer Modal" />}
        footer={{
          component: (
            <View
              style={{
                height: FOOTER_HEIGHT + bottom,
                ...styles.footer,
              }}>
              <Text style={styles.text} numberOfLines={2}>
                Lorem ipsum dolor sit amet, consectetur
              </Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          ),
          height: FOOTER_HEIGHT + bottom,
        }}
      />
    );
  },
);

const styles = StyleSheet.create({
  containerModalStyle: {
    paddingBottom: 20,
  },
  footer: {
    width: SCREEN_WIDTH,
    backgroundColor: '#f3f3f3',
    borderTopColor: '#e1e1e1',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    maxWidth: 200,
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3366ff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
