import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomModalScrollable,
  BottomModalScrollableRef,
} from 'react-native-bottom-modal-scrollable';

interface Props {}

export const ListsModal = React.forwardRef<BottomModalScrollableRef, Props>(
  ({}, ref) => {
    const { bottom } = useSafeAreaInsets();
    return (
      <BottomModalScrollable
        ref={ref}
        containerStyle={{ paddingBottom: bottom }}
        onEndReached={() => console.log('On end reached!')}
        children={
          <View>
            <Text style={styles.title}>Lists Modal</Text>
            <View style={styles.containerList}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(_item => {
                return <View style={styles.listItemVertical} />;
              })}
            </View>

            <FlatList
              data={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
              horizontal
              renderItem={() => {
                return <View style={styles.listItemHorizontal} />;
              }}
            />
            <Text>{VERY_LONG_TEXT}</Text>
            <Text style={styles.text}>End of content</Text>
          </View>
        }
      />
    );
  },
);

const styles = StyleSheet.create({
  listItemVertical: {
    backgroundColor: '#c4c4c4',
    height: 100,
    width: 250,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  listItemHorizontal: {
    backgroundColor: '#b0b0b0',
    height: 100,
    width: 100,
    marginLeft: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
  containerList: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginVertical: 20,
  },
});

const VERY_LONG_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac mauris vitae sapien efficitur ultricies et at est. Maecenas vitae lectus sed tortor laoreet faucibus vel quis mauris. Nullam pellentesque posuere interdum. Donec id purus vitae odio mollis ultrices. Phasellus aliquam velit id sem suscipit aliquet. Fusce eu orci laoreet, mattis erat non, semper odio. Vivamus dictum fringilla turpis nec ornare. In interdum, turpis non bibendum finibus, quam purus vestibulum mauris, vel blandit elit mi condimentum nisi. Pellentesque molestie, diam a venenatis vehicula, elit mi tempus dui, et eleifend risus enim vitae augue. Sed a lorem eu justo rhoncus consequat tempor vel eros. Aenean commodo mauris quis euismod ornare. Duis quam metus, scelerisque sit amet tempor sit amet, tincidunt ac lectus. Duis et lacus blandit, feugiat quam eu, consectetur lacus. Pellentesque faucibus, mauris vitae dictum porttitor, felis metus convallis ipsum, eget egestas felis quam quis tellus. Pellentesque non neque maximus, faucibus mi eget, tincidunt purus. Nulla fermentum quis nunc vel interdum. Ut suscipit cursus tortor, at ultrices quam dapibus nec. Donec blandit lacus tempor nisl iaculis, et cursus odio scelerisque. Donec nulla ante, pulvinar nec augue non, ultrices varius justo. Etiam id velit in ante suscipit hendrerit. Quisque vulputate pretium metus eu faucibus. Donec in dui non arcu commodo ultrices ut et sem. Pellentesque ipsum enim, vestibulum a augue quis, accumsan volutpat odio. Duis sodales sit amet velit nec fringilla. Duis ac facilisis lacus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas consequat odio diam, sed ultrices nisi vehicula id. Curabitur vitae tristique elit, in imperdiet tortor. Curabitur vitae faucibus lorem. Etiam placerat dui sed mollis tincidunt. Sed ut gravida diam. Donec sit amet est dictum, aliquam orci ac, consequat turpis. Suspendisse quis placerat purus. Vestibulum urna libero, mattis at lobortis mattis, maximus in tellus. Phasellus aliquam aliquet arcu non imperdiet. Phasellus porttitor maximus mauris, ut porttitor magna volutpat ac. Suspendisse vestibulum sit amet augue vitae ullamcorper. Cras dapibus sem magna, et ultricies urna fringilla quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla facilisi. Vivamus rutrum imperdiet purus, at vehicula risus facilisis a. Cras placerat, eros in commodo ullamcorper, lorem diam ultrices elit, sit amet commodo lorem nunc sit amet enim. Praesent odio magna, faucibus quis pharetra tempor, fringilla a tellus. Fusce vitae orci lorem. Donec finibus, felis a cursus luctus, neque diam aliquam metus, et lacinia lorem orci vel nibh. Suspendisse imperdiet dignissim molestie. Fusce semper accumsan tellus nec vestibulum. Suspendisse quis placerat purus. Vestibulum urna libero, mattis at lobortis mattis, maximus in tellus. Phasellus aliquam aliquet arcu non imperdiet. Phasellus porttitor maximus mauris, ut porttitor magna volutpat ac. Suspendisse vestibulum sit amet augue vitae ullamcorper. Cras dapibus sem magna, et ultricies urna fringilla quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla facilisi. Vivamus rutrum imperdiet purus, at vehicula risus facilisis a. Cras placerat, eros in commodo ullamcorper, lorem diam ultrices elit, sit amet commodo lorem nunc sit amet enim. Praesent odio magna, faucibus quis pharetra tempor, fringilla a tellus. Fusce vitae orci lorem. Donec finibus, felis a cursus luctus, neque diam aliquam metus, et lacinia lorem orci vel nibh. Suspendisse imperdiet dignissim molestie. Fusce semper accumsan tellus nec vestibulum. Suspendisse quis placerat purus. Vestibulum urna libero, mattis at lobortis mattis, maximus in tellus. Phasellus aliquam aliquet arcu non imperdiet. Phasellus porttitor maximus mauris, ut porttitor magna volutpat ac. Suspendisse vestibulum sit amet augue vitae ullamcorper. Cras dapibus sem magna, et ultricies urna fringilla quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla facilisi. Vivamus rutrum imperdiet purus, at vehicula risus facilisis a. Cras placerat, eros in commodo ullamcorper, lorem diam ultrices elit, sit amet commodo lorem nunc sit amet enim. Praesent odio magna, faucibus quis pharetra tempor, fringilla a tellus. Fusce vitae orci lorem. Donec finibus, felis a cursus luctus, neque diam aliquam metus, et lacinia lorem orci vel nibh. Suspendisse imperdiet dignissim molestie. Fusce semper accumsan tellus nec vestibulum.';
