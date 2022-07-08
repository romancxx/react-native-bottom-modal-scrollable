import { AnimatedScrollModalRef } from './src';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasicModal } from './src/modals/BasicModal';
import { SmallModal } from './src/modals/SmallModal';
import { FooterModal } from './src/modals/FooterModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BackgroundClickableModal } from './src/modals/BackgroundClickableModal';
import { ListsModal } from './src/modals/ListsModal';

// TODO: IN DOC BACKGROUND CLICKABLE DOESNT WORK WITH ABSOLUTE BOTTOM CHILDREN

const App = () => {
  const basicModalRef = useRef<AnimatedScrollModalRef>(null);
  const smallModalRef = useRef<AnimatedScrollModalRef>(null);
  const footerModalRef = useRef<AnimatedScrollModalRef>(null);
  const backgroundClickableModalRef = useRef<AnimatedScrollModalRef>(null);
  const listsModalRef = useRef<AnimatedScrollModalRef>(null);

  const openBasicModal = () => {
    basicModalRef?.current?.open();
  };

  const openSmallModal = () => {
    smallModalRef?.current?.open();
  };

  const openFooterModal = () => {
    footerModalRef?.current?.open();
  };

  const openBackgroundClickableModal = () => {
    backgroundClickableModalRef?.current?.open();
  };

  const openListsModal = () => {
    listsModalRef?.current?.open();
  };

  useEffect(() => {
    basicModalRef.current?.open();
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <TouchableOpacity onPress={openBasicModal} style={styles.button}>
            <Text style={styles.buttonText}>Open Basic Modal</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openSmallModal} style={styles.button}>
            <Text style={styles.buttonText}>Open Small Modal not closable</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openFooterModal} style={styles.button}>
            <Text style={styles.buttonText}>Open Footer Modal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openBackgroundClickableModal}
            style={styles.button}>
            <Text style={styles.buttonText}>
              Open Background Clickable Modal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openListsModal} style={styles.button}>
            <Text style={styles.buttonText}>Open Lists Modal</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('hello')}>
            <Text>Alert me</Text>
          </TouchableOpacity>
        </View>
        <BackgroundClickableModal ref={backgroundClickableModalRef} />
        <BasicModal ref={basicModalRef} />
        <SmallModal ref={smallModalRef} />
        <FooterModal ref={footerModalRef} />
        <ListsModal ref={listsModalRef} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 20,
  },
  button: {
    marginVertical: 20,
  },
});

export default App;
