import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  ReactNode,
} from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import {
  BackgroundOpacity,
  ContainerNonClickable,
  ContainerClickable,
  ContainerDragIndicator,
  ContainerFooter,
  ContainerModal,
  DragIndicator,
} from './styled/BottomModalScrollable.styled';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { useScrollHandler } from './hooks/useScrollHandler';
import {
  DEFAULT_MODAL_HEIGHT,
  DRAG_INDICATOR_HEIGHT,
  FOOTER_MAX_OPACITY_POS,
  FOOTER_MIN_OPACITY_POS,
  MAX_MODAL_HEIGHT,
  WINDOW_HEIGHT,
} from './constants';
import { AbsoluteFooter, BottomModalScrollableRef } from './types';

interface Props {
  children: ReactNode;
  footer?: AbsoluteFooter;
  backgroundColor?: string;
  defaultModalHeight?: number;
  maxModalHeight?: number;
  contentStaticHeight?: number;
  onClose?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  dragIndicator?: boolean;
  screenHeight?: number;
  disableBackgroundOpacity?: boolean;
  disableCloseOnBackgroundPress?: boolean;
  disableSnapToBottom?: boolean;
  backgroundClickable?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

const AnimatedBackgroundOpacity =
  Animated.createAnimatedComponent(BackgroundOpacity);
const AnimatedContainerFooter =
  Animated.createAnimatedComponent(ContainerFooter);
const AnimatedContainerModal = Animated.createAnimatedComponent(ContainerModal);

export const BottomModalScrollable = forwardRef<
  BottomModalScrollableRef,
  Props
>(
  (
    {
      children,
      backgroundColor = '#fff',
      footer,
      dragIndicator = true,
      screenHeight = WINDOW_HEIGHT,
      maxModalHeight = screenHeight ? screenHeight * 0.9 : MAX_MODAL_HEIGHT,
      defaultModalHeight = maxModalHeight < DEFAULT_MODAL_HEIGHT
        ? maxModalHeight
        : screenHeight / 2,
      contentStaticHeight,
      onClose,
      containerStyle,
      disableBackgroundOpacity = false,
      disableCloseOnBackgroundPress = false,
      disableSnapToBottom = false,
      backgroundClickable = false,
      onEndReached,
      onEndReachedThreshold = 100,
    }: Props,
    ref: React.Ref<BottomModalScrollableRef>,
  ) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [contentHeight, setContentHeight] = useState<number>(0);

    // Translation Y axis of the modal from bottom of the screen to MAX_MODAL_HEIGHT
    const translateYModal = useSharedValue(screenHeight);
    // Translation Y axis of the content of the modal starting once the modal reached MAX_MODAL_HEIGHT to contentHeight
    const translateYContent = useSharedValue(0);
    // Translation Y axis of translateYModal & translateYContent, starts from the bottom of the screen to the end of the content, used to save current level on gesture start
    const translateYLevelIndicator = useSharedValue(screenHeight);

    // Forward functions
    useImperativeHandle<BottomModalScrollableRef, BottomModalScrollableRef>(
      ref,
      () => ({
        open: openModal,
        close: closeModal,
      }),
    );

    const openModal = () => {
      setModalVisible(true);
      translateYModal.value = withTiming(screenHeight - defaultModalHeight, {
        duration: 500,
      });
      translateYLevelIndicator.value = screenHeight - defaultModalHeight;
      translateYContent.value = 0;
    };

    const closeModal = () => {
      if (onClose) {
        onClose();
      }
      if (translateYModal.value !== screenHeight) {
        translateYModal.value = withTiming(screenHeight, { duration: 500 });
        setTimeout(() => {
          setModalVisible(false);
        }, 500);
        return;
      }
      translateYLevelIndicator.value = screenHeight;
      setModalVisible(false);
    };

    const { onGestureEvent } = useScrollHandler(
      contentHeight,
      maxModalHeight,
      translateYLevelIndicator,
      translateYContent,
      translateYModal,
      closeModal,
      onEndReached,
      onEndReachedThreshold,
      screenHeight,
      disableSnapToBottom,
      defaultModalHeight,
    );

    const onLayout = (event: LayoutChangeEvent) => {
      // Represents the height of the footer hiding the scroll view
      const additionalHeight =
        (footer?.height ?? 0) + (dragIndicator ? DRAG_INDICATOR_HEIGHT : 0);

      if (contentStaticHeight) {
        setContentHeight(
          -Math.abs(contentStaticHeight - maxModalHeight + additionalHeight),
        );
        return;
      }
      const { height } = event.nativeEvent.layout;
      if (height + additionalHeight < maxModalHeight) {
        setContentHeight(0);
        return;
      }
      // Use height of children view to define scroll limit
      setContentHeight(-Math.abs(height - maxModalHeight + additionalHeight));
    };

    const footerStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateYModal.value,
        [
          screenHeight - FOOTER_MIN_OPACITY_POS,
          screenHeight - FOOTER_MAX_OPACITY_POS,
        ],
        [0, 1],
      );

      return { opacity };
    });

    const backgroundOpacityStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateYModal.value,
        [screenHeight, screenHeight - maxModalHeight],
        [0, !disableBackgroundOpacity ? 0.8 : 0],
      );

      return { opacity };
    }, [disableBackgroundOpacity]);

    const scrollModalTranslationStyle = useAnimatedStyle(() => {
      return { transform: [{ translateY: translateYModal.value }] };
    });

    const scrollContentTranslationStyle = useAnimatedStyle(() => {
      return { transform: [{ translateY: translateYContent.value }] };
    });

    const Container = backgroundClickable
      ? ContainerClickable
      : ContainerNonClickable;

    return (
      <>
        {modalVisible && (
          <Container>
            <TouchableWithoutFeedback
              disabled={disableCloseOnBackgroundPress}
              onPress={closeModal}>
              <AnimatedBackgroundOpacity style={backgroundOpacityStyle} />
            </TouchableWithoutFeedback>
            <PanGestureHandler {...{ onGestureEvent }}>
              <AnimatedContainerModal
                height={maxModalHeight}
                backgroundColor={backgroundColor}
                style={scrollModalTranslationStyle}>
                {dragIndicator && (
                  <ContainerDragIndicator {...{ backgroundColor }}>
                    <DragIndicator />
                  </ContainerDragIndicator>
                )}
                <ScrollView scrollEnabled={false}>
                  <Animated.View
                    style={[scrollContentTranslationStyle, containerStyle]}
                    {...{ backgroundColor, onLayout }}>
                    {children}
                  </Animated.View>
                </ScrollView>
              </AnimatedContainerModal>
            </PanGestureHandler>
            {footer && (
              <AnimatedContainerFooter
                bottom={footer?.position ?? 0}
                style={footerStyle}>
                {footer.component}
              </AnimatedContainerFooter>
            )}
          </Container>
        )}
      </>
    );
  },
);
