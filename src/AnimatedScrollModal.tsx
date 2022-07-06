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
  ContainerScrollIndicator,
  ScrollIndicator,
  ContainerFooter,
  ContainerModal,
  SCROLLABLE_INDICATOR_HEIGHT,
} from './styled/AnimatedScrollModal.styled';
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
  FOOTER_MAX_OPACITY_POS,
  FOOTER_MIN_OPACITY_POS,
  MAX_MODAL_HEIGHT,
  WINDOW_HEIGHT,
} from './constants';
import { AbsoluteFooter, AnimatedScrollModalRef } from './types';

//TODO: ADD README
//TODO: ADD GITIGNORE
//TODO: ADD INDICATOR CUSTOM STYLE
//TODO: ADD SNAP TO MID OFFSET?
// TODO: SHAKE ON DRAG ?

interface Props {
  children: ReactNode;
  footer?: AbsoluteFooter;
  backgroundColor?: string;
  defaultModalHeight?: number;
  maxModalHeight?: number;
  contentStaticHeight?: number;
  onClose?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  scrollIndicator?: boolean;
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

export const AnimatedScrollModal = forwardRef<AnimatedScrollModalRef, Props>(
  (
    {
      children,
      backgroundColor = '#fff',
      footer,
      scrollIndicator = true,
      screenHeight = WINDOW_HEIGHT,
      maxModalHeight = screenHeight ? screenHeight * 0.9 : MAX_MODAL_HEIGHT,
      defaultModalHeight = maxModalHeight < DEFAULT_MODAL_HEIGHT
        ? maxModalHeight
        : screenHeight / 2,
      contentStaticHeight = undefined,
      onClose,
      containerStyle,
      disableBackgroundOpacity = false,
      disableCloseOnBackgroundPress = false,
      disableSnapToBottom = false,
      backgroundClickable = false,
      onEndReached,
      onEndReachedThreshold = 100,
    }: Props,
    ref: React.Ref<AnimatedScrollModalRef>,
  ) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [contentHeight, setContentHeight] = useState<number>(0);

    /**
     * RN reanimated animation values :
     * - translateYModal > Translation Y axis of the modal from bottom to MAX_MODAL_HEIGHT
     * - translateYContent > Translation Y axis of the content of the modal once the modal translation reached MAX_MODAL_HEIGHT
     * - translateYLevelIndicator > Translation Y axis of translateYModal & translateYContent, starts from the bottom of the screen
     * to the end of the content, used to save current level to set the context on gesture start
     */
    const translateYModal = useSharedValue(screenHeight);
    const translateYContent = useSharedValue(0);
    const translateYLevelIndicator = useSharedValue(screenHeight);

    // Forward functions
    useImperativeHandle<AnimatedScrollModalRef, AnimatedScrollModalRef>(
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
        (footer?.height ?? 0) +
        (scrollIndicator ? SCROLLABLE_INDICATOR_HEIGHT : 0);

      if (contentStaticHeight) {
        setContentHeight(
          -Math.abs(contentStaticHeight - maxModalHeight + additionalHeight),
        );
        return;
      }
      const { height } = event.nativeEvent.layout;
      // Use content of children view to define scroll limit
      if (height + additionalHeight < maxModalHeight) {
        setContentHeight(0);
        return;
      }
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
                {scrollIndicator && (
                  <ContainerScrollIndicator {...{ backgroundColor }}>
                    <ScrollIndicator />
                  </ContainerScrollIndicator>
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
