import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  BottomModalScrollable,
  BottomModalScrollableRef,
} from 'react-native-bottom-modal-scrollable';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {}

export const SmallModal = React.forwardRef<BottomModalScrollableRef, Props>(
  ({}, ref) => {
    return (
      <BottomModalScrollable
        ref={ref}
        maxModalHeight={SCREEN_HEIGHT * 0.2}
        disableCloseOnBackgroundPress
        dragIndicator={false}
        disableSnapToBottom
        children={
          <View style={styles.container}>
            <View style={styles.containerTitle}>
              <Text style={styles.title}>Small modal</Text>
              <Text style={styles.text}>
                The only way to close the modal is by clicking the button below
              </Text>
            </View>
            <TouchableOpacity
              style={styles.containerButton}
              onPress={() => ref?.current?.close()}>
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  containerTitle: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 30,
  },
  text: {
    fontSize: 15,
  },
  textButton: {
    fontSize: 20,
    marginTop: 5,
  },
  containerButton: {
    alignItems: 'center',
  },
});
