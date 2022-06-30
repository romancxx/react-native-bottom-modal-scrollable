import {
  AnimatedScrollModal,
  AnimatedScrollModalRef,
} from './AnimatedScrollModal';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  LayoutChangeEvent,
  TextLayoutEventData,
  NativeSyntheticEvent,
} from 'react-native';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
// TODO: IN DOC BACKGROUND CLICKABLE DOESNT WORK WITH ABSOLUTE BOTTOM CHILDREN
const App = () => {
  const modalRef = useRef<AnimatedScrollModalRef>(null);
  const openModal = () => {
    modalRef?.current?.open();
  };

  const [text, settext] = useState('hefjdhjdhjfhs');
  useEffect(() => {
    openModal();
    setTimeout(() => {
      settext(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauri interdum mauris eget nunc ultrices lacinia. Pellentesque egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdhegetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh Mauri interdum mauris eget nunc ultrices lacinia. Pellentesque egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh  Mauri interdum mauris eget nunc ultrices lacinia. Pellentesque egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh  Mauri interdum mauris eget nunc ultrices lacinia. Pellentesque egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh  Mauri interdum mauris eget nunc ultrices lacinia. Pellentesque egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh  Mauri interdum mauris eget nunc ultrices lacinia. Pellentesque egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh  Mauri interdum mauris eget nunc ultrices lacinia. Pellentesque egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh egetdehjedhjedhjdhjehdjehjehjhjedhejdhejdh',
      );
    }, 5000);
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
        backgroundClickable
        ref={modalRef}
        backgroundColor={'blue'}
        disableBackgroundOpacity
        disableCloseOnBackgroundPress
        disableSnapToBottom
        containerStyle={{paddingBottom: 100}}
        children={
          <View style={{backgroundColor: 'red'}}>
            <Text>{VERY_LONG_TEXT}</Text>
            <Text>{text}</Text>
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
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'blue', fontSize: 99}}>Hello</Text>
            <Text style={{color: 'yellow', fontSize: 99}}>END</Text>
          </View>
        }
        // absoluteBottomChildren={{
        //   children: (
        //     <View
        //       style={{
        //         height: 100,
        //         width: Dimensions.get('window').width,
        //         backgroundColor: 'yellow',
        //       }}
        //     />
        //   ),
        //   height: 100,
        //   position: 0,
        // }}
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

const VERY_LONG_TEXT =
  'torted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests throughout the following years.s For many Parisians, thearrival of this pyramid in the middle of the courtyard of theLouvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between1985 and 1989 was part of the Grand Louvre project aimed atreintegrating the museuminto its surrounding spaces. The projectorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests ramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project causeting the museum into its surrounding spaces. The project caused a stir and aroused manyprotests ramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre project aimed at reintegrating the museum into its surrounding spaces. The project caused a stir and aroused manyprotests orted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre the middle of the courtyard of the Louvre was very controversial; the pyramid distorted the initial architecture of the surrounding area. Its construction between 1985 and 1989 was part of the Grand Louvre d a stir and aro END END END END EEEEEEEENNNNNND';
