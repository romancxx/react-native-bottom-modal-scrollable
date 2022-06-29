import {
  AnimatedScrollModal,
  AnimatedScrollModalRef,
} from './AnimatedScrollModal';
import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
// TODO: IN DOC BACKGROUND CLICKABLE DOESNT WORK WITH ABSOLUTE BOTTOM CHILDREN
const App = () => {
  const modalRef = useRef<AnimatedScrollModalRef>(null);
  const openModal = () => {
    modalRef?.current?.open();
  };
  useEffect(() => {
    openModal();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'green',
        }}>
        <TouchableOpacity onPress={openModal}>
          <Text>Press me</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('hello')}>
          <Text>Alert me</Text>
        </TouchableOpacity>
        <Text style={{color: 'yellow', fontSize: 99}}>Hello</Text>
      </View>
      <AnimatedScrollModal
        // screenHeight={SCREEN_HEIGHT - 200}
        // backgroundClickable
        ref={modalRef}
        backgroundColor={'blue'}
        // disableBackgroundOpacity
        // disableCloseOnBackgroundPress
        // disableSnapToBottom
        // containerStyle={{paddingBottom: 100}}
        children={
          <View style={{backgroundColor: 'red'}}>
            {/* <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              interdum mauris eget nunc ultrices lacinia. Pellentesque eget
              tortor in quam consequat luctus. Nam laoreet ultricies suscipit.
              Ut imperdiet commodo dui, et lobortis eros lacinia a. In tincidunt
              efficitur nunc nec ultricies. In hac habitasse platea dictumst.
              Mauris eu erat tellus. Pellentesque hendrerit mollis condimentum.
              Nam euismod augue ac urna pharetra, nec dictum lacus tempus.
              Interdum et malesuada fames ac ante ipsum primis in faucibus.
              Donec lorem nulla, posuere id bibendum in, interdum eu nisi. Donec
              finibus egestas odio, ac euismod diam aliquet at. Sed ultricies
              tincidunt nisl, ac vulputate dui rhoncus eget. Sed justo tortor,
              tempor nec nisi vel, tincidunt aliquam libero. Suspendisse id
              mauris tempor, volutpat purus vitae, sollicitudin ex. Proin enim
              nunc, fermentum ut quam nec, rhoncus facilisis nibh. Sed at
              facilisis lectus, eget posuere nulla. In pellentesque libero nec
              nisl feugiat, eu elementum ipsum tempus. Morbi elementum nibh
              quam, ac tincidunt leo rutrum ac. Donec tristique est a augue
              ullamcorper, ac faucibus ex varius. Donec eu neque fringilla,
              finibus ex eget, egestas dui. Etiam vehicula, risus non congue
              interdum, leo nulla ultrices purus, a finibus neque nibh et leo.
              Curabitur ullamcorper dui efficitur, ultrices lacus eu, sagittis
              eros. Cras ornare aliquet congue. Sed consequat malesuada nunc, eu
              lobortis nisi pharetra vel. Sed nec tincidunt dolor, et pretium
              mauris. Aenean ultricies pretium turpis vel tempus. Sed nisi eros,
              blandit at varius a, consectetur vel ante.
            </Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text>Hello</Text>
            <Text style={{color: 'blue', fontSize: 50}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 50}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 50}}>Hello</Text>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(_item => {
              return (
                <View
                  style={{
                    backgroundColor: 'orange',
                    height: 100,
                    width: 100,
                    marginLeft: 10,
                  }}
                />
              );
            })}
            <FlatList
              data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
              horizontal
              renderItem={() => {
                return (
                  <View
                    style={{
                      backgroundColor: 'green',
                      height: 100,
                      width: 100,
                      marginLeft: 10,
                    }}
                  />
                );
              }}
            />
            <Text style={{color: 'blue', fontSize: 50}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 50}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 50}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 50}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text> */}
            {/* <Text style={{color: 'blue', fontSize: 99}}>Hello</Text> */}
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'yellow', fontSize: 99}}>END</Text>
          </View>
        }
        absoluteBottomChildren={{
          children: (
            <View
              style={{
                height: 100,
                width: Dimensions.get('window').width,
                backgroundColor: 'yellow',
              }}
            />
          ),
          height: 100,
          position: 0,
        }}
      />
      {/* <AnimatedScrollModal
        ref={modalRef}
        backgroundColor={'white'}
        maxModalHeight={200}
        children={
          <View style={{backgroundColor: 'red'}}>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
          </View>
        }
      /> */}

      {/* <View
        style={{
          height: 200,
          width: '100%',
          position: 'absolute',
          // zIndex: 9999999,
          backgroundColor: 'purple',
          bottom: 0,
        }}>
        <Text style={{color: 'yellow', fontSize: 99}}>Hello</Text>
      </View> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({});

export default App;
