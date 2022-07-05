import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  ReactNode,
} from 'react';
import {
  Dimensions,
  Keyboard,
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
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  withDecay,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';

//TODO: ADD README
//TODO: ADD GITIGNORE
//TODO: ADD INDICATOR CUSTOM STYLE
//TODO: ADD SNAP TO MID OFFSET?
// TODO: SHAKE ON DRAG ?
// TODO: ON END REACH
export type AnimatedScrollModalRef = {
  open: () => void;
  close: () => void;
};

enum SnapPoint {
  Top = 'Top',
  Bottom = 'Bottom',
}

interface AbsoluteFooter {
  component: ReactNode;
  position?: number;
  // Use this variable if the footer is covering the end of the content of your modal scroll view
  // Providing a height will make the scroll view of the content bigger
  height?: number;
}

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
}

export const HIGH_VELOCITY = 1500; // Instant snap to point velocity
const SCREEN_HEIGHT: number = Dimensions.get('window').height;
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.9;
const DEFAULT_MODAL_HEIGHT = SCREEN_HEIGHT / 2;
const ACTION_BUTTONS_MAX_OPACITY = DEFAULT_MODAL_HEIGHT / 2;
const ACTION_BUTTONS_MIN_OPACITY = DEFAULT_MODAL_HEIGHT / 4;

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
      screenHeight = SCREEN_HEIGHT,
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
        open,
        close,
      }),
    );

    const open = () => {
      setModalVisible(true);
      translateYModal.value = withTiming(screenHeight - defaultModalHeight, {
        duration: 500,
      });
      translateYLevelIndicator.value = screenHeight - defaultModalHeight;
      translateYContent.value = 0;
    };

    const close = () => {
      if (onClose) onClose();
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

    const disableKeyboard = () => {
      Keyboard.dismiss();
    };

    const onGestureEvent = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        // On start needs to set context offsetY from last gesture (otherwise gesture will reset)
        if (translateYLevelIndicator.value <= screenHeight - maxModalHeight) {
          // Set content translation offset
          ctx.offsetY =
            translateYContent.value + (screenHeight - maxModalHeight);
        } else {
          // Set modal translation offset
          ctx.offsetY = translateYModal.value;
        }
      },
      onActive: (event, ctx) => {
        const pos = event.translationY + ctx.offsetY;
        // Save current value into global translation variable
        translateYLevelIndicator.value = pos;

        // Check if content translation OR else modal translation
        if (pos <= screenHeight - maxModalHeight) {
          runOnJS(disableKeyboard)();
          // Fix modal translation if gesture moved too quickly and values were skipped
          if (translateYModal.value !== screenHeight - maxModalHeight) {
            translateYModal.value = screenHeight - maxModalHeight;
          }

          // Check if pos is not out of content scroll
          if (
            pos - (screenHeight - maxModalHeight) > contentHeight &&
            contentHeight !== 0
          ) {
            translateYContent.value = pos - (screenHeight - maxModalHeight);
          }
        } else {
          // Fix content translation if gesture moved too quickly and values were skipped
          if (translateYContent.value !== 0) {
            translateYContent.value = 0;
          }
          translateYModal.value = pos;
        }
      },
      onEnd: (evt, ctx) => {
        const { velocityY, translationY } = evt;
        if (translationY + ctx.offsetY <= screenHeight - maxModalHeight) {
          // Currently scrolling content, using Decay to do scroll animation
          translateYContent.value = withDecay({
            velocity: evt.velocityY,
            clamp: [contentHeight, 0],
          });
        } else {
          // Currently scrolling modal height : will snap to offset..
          // If velocity is high, snaping in the velocity direction
          if (Math.abs(velocityY) > HIGH_VELOCITY) {
            velocityY > 0
              ? snapToPoint(
                  // TODO: CLEAN
                  SnapPoint.Bottom,
                  velocityY,
                  translateYModal,
                  close,
                  maxModalHeight,
                  screenHeight,
                  disableSnapToBottom,
                  defaultModalHeight,
                )
              : snapToPoint(
                  SnapPoint.Top,
                  velocityY,
                  translateYModal,
                  close,
                  maxModalHeight,
                  screenHeight,
                  disableSnapToBottom,
                  defaultModalHeight,
                );
          }
          // Snapping to the closest point
          if (
            Math.abs(
              maxModalHeight - (screenHeight - (translationY + ctx.offsetY)),
            ) > // Top snap point
            Math.abs(screenHeight - (translationY + ctx.offsetY)) // Bottom snap point
          ) {
            snapToPoint(
              SnapPoint.Bottom,
              velocityY,
              translateYModal,
              close,
              maxModalHeight,
              screenHeight,
              disableSnapToBottom,
              defaultModalHeight,
            );
          } else {
            snapToPoint(
              SnapPoint.Top,
              velocityY,
              translateYModal,
              close,
              maxModalHeight,
              screenHeight,
              disableSnapToBottom,
              defaultModalHeight,
            );
          }
        }
      },
    });

    const onLayout = (event: LayoutChangeEvent) => {
      // Represents the height of the fotter hiding the scroll view
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

    const actionButtonsStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateYModal.value,
        [
          screenHeight - ACTION_BUTTONS_MIN_OPACITY,
          screenHeight - ACTION_BUTTONS_MAX_OPACITY,
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
              onPress={() => close()}>
              <AnimatedBackgroundOpacity style={backgroundOpacityStyle} />
            </TouchableWithoutFeedback>
            <PanGestureHandler onGestureEvent={onGestureEvent}>
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
                    onLayout={onLayout}
                    {...{ backgroundColor }}>
                    {children}
                  </Animated.View>
                </ScrollView>
              </AnimatedContainerModal>
            </PanGestureHandler>
            {footer && (
              <AnimatedContainerFooter
                bottom={footer?.position ?? 0}
                style={actionButtonsStyle}>
                {footer.component}
              </AnimatedContainerFooter>
            )}
          </Container>
        )}
      </>
    );
  },
);

// Worklet cannot be declared in the body of the component
const snapToPoint = (
  point: SnapPoint,
  velocityY: number,
  translateYModal: Animated.SharedValue<number>,
  close: () => void,
  maxModalHeight: number,
  screenHeight: number,
  disableSnapToBottom: boolean,
  defaultModalHeight: number,
) => {
  'worklet';
  switch (point) {
    case SnapPoint.Top:
      // Snap up to open fully the modal
      translateYModal.value = withSpring(screenHeight - maxModalHeight, {
        velocity: velocityY,
        overshootClamping: true,
        damping: 20,
      });
      break;
    case SnapPoint.Bottom:
      // Snap down to close modal
      translateYModal.value = withSpring(
        disableSnapToBottom ? screenHeight - defaultModalHeight : screenHeight,
        {
          velocity: velocityY,
          overshootClamping: true,
          damping: 20,
          stiffness: 150,
        },
        () => {
          if (disableSnapToBottom) {
            return;
          }
          runOnJS(close)();
        },
      );
      break;
    default:
      break;
  }
};
