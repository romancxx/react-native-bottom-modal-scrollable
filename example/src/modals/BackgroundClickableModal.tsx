import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  BottomModalScrollable,
  BottomModalScrollableRef,
} from 'react-native-bottom-modal-scrollable';

interface Props {}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const BackgroundClickableModal = React.forwardRef<
  BottomModalScrollableRef,
  Props
>(({}, ref) => {
  return (
    <BottomModalScrollable
      backgroundClickable
      ref={ref}
      defaultModalHeight={SCREEN_HEIGHT / 4}
      backgroundColor="#e1e1e1"
      disableBackgroundOpacity
      disableCloseOnBackgroundPress
      disableSnapToBottom
      containerStyle={{ paddingBottom: 100 }}
      children={
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Background Clickable</Text>
          <TouchableOpacity onPress={() => ref?.current?.close()}>
            <Text style={styles.text}>Close me</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    marginVertical: 20,
  },
});
