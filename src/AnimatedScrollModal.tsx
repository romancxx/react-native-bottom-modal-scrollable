import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  ReactNode
} from "react";
import {
  Dimensions,
  Keyboard,
  LayoutChangeEvent,
  TouchableWithoutFeedback
} from "react-native";
import {
  BackgroundOpacity,
  Container,
  ContainerScrollIndicator,
  ScrollIndicator,
  ContainerActionButtons,
  ContainerModal
} from "./styled/AnimatedScrollModal.styled";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  withDecay,
  withSpring,
  interpolate,
  runOnJS
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

//TODO: ADD README
//TODO: ADD GITIGNORE

export type AnimatedScrollModalRef = {
  open: () => void;
  close: () => void;
};

enum SnapPoint {
  Top = "Top",
  Bottom = "Bottom"
}

interface AbsouluteBottomChildren {
  children: ReactNode;
  position: number;
  // Use this variable only if the bottom children is covering the bottom of scrollview
  // Providing a height will make the scrollview height bigger so that it's possible to scroll it and see the content hidden by the
  // absolute bottom children
  height?: number;
}

interface Props {
  children: ReactNode;
  absoluteBottomChildren?: AbsouluteBottomChildren;
  contentBackgroundColor: string;
  defaultModalHeight?: number;
  maxModalHeight?: number;
  contentStaticHeight?: number;
  onClose?: () => void;
}

export const HIGH_VELOCITY = 1500; // Instant snap to point velocity
const SCREEN_HEIGHT: number = Dimensions.get("window").height;
const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.9;
const DEFAULT_MODAL_HEIGHT = SCREEN_HEIGHT / 2;
const ACTION_BUTTONS_MAX_OPACITY = DEFAULT_MODAL_HEIGHT / 2;
const ACTION_BUTTONS_MIN_OPACITY = DEFAULT_MODAL_HEIGHT / 4;

const AnimatedBackgroundOpacity =
  Animated.createAnimatedComponent(BackgroundOpacity);
const AnimatedContainerActionButtons = Animated.createAnimatedComponent(
  ContainerActionButtons
);
const AnimatedContainerModal = Animated.createAnimatedComponent(ContainerModal);

export const AnimatedScrollModal = forwardRef<AnimatedScrollModalRef, Props>(
  (
    {
      children,
      contentBackgroundColor,
      absoluteBottomChildren,
      defaultModalHeight = DEFAULT_MODAL_HEIGHT,
      maxModalHeight = MAX_MODAL_HEIGHT,
      contentStaticHeight = undefined,
      onClose
    }: Props,
    ref: React.Ref<AnimatedScrollModalRef>
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
    const translateYModal = useSharedValue(SCREEN_HEIGHT);
    const translateYContent = useSharedValue(0);
    const translateYLevelIndicator = useSharedValue(SCREEN_HEIGHT);

    // Forward functions
    useImperativeHandle<AnimatedScrollModalRef, AnimatedScrollModalRef>(
      ref,
      () => ({
        open,
        close
      })
    );

    const open = () => {
      setModalVisible(true);
      translateYModal.value = withTiming(SCREEN_HEIGHT - defaultModalHeight, {
        duration: 500
      });
      translateYLevelIndicator.value = SCREEN_HEIGHT - defaultModalHeight;
      translateYContent.value = 0;
    };

    const close = () => {
      if (onClose) onClose();
      if (translateYModal.value !== SCREEN_HEIGHT) {
        translateYModal.value = withTiming(SCREEN_HEIGHT, { duration: 500 });
        setTimeout(() => {
          setModalVisible(false);
        }, 500);
        return;
      }
      translateYLevelIndicator.value = SCREEN_HEIGHT;
      setModalVisible(false);
    };

    const disableKeyboard = () => {
      Keyboard.dismiss();
    };

    const onGestureEvent = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        // On start needs to set context offsetY from last gesture (otherwise gesture will reset)
        if (translateYLevelIndicator.value <= SCREEN_HEIGHT - maxModalHeight) {
          // Set content translation offset
          ctx.offsetY =
            translateYContent.value + (SCREEN_HEIGHT - maxModalHeight);
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
        if (pos <= SCREEN_HEIGHT - maxModalHeight) {
          runOnJS(disableKeyboard)();
          // Fix modal translation if gesture moved too quickly and values were skipped
          if (translateYModal.value !== SCREEN_HEIGHT - maxModalHeight) {
            translateYModal.value = SCREEN_HEIGHT - maxModalHeight;
          }

          // Check if pos is not out of content scroll
          if (
            pos - (SCREEN_HEIGHT - maxModalHeight) > contentHeight &&
            contentHeight !== 0
          ) {
            translateYContent.value = pos - (SCREEN_HEIGHT - maxModalHeight);
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
        if (translationY + ctx.offsetY <= SCREEN_HEIGHT - maxModalHeight) {
          // Currently scrolling content, using Decay to do scroll animation
          translateYContent.value = withDecay({
            velocity: evt.velocityY,
            clamp: [contentHeight, 0]
          });
        } else {
          // Currently scrolling modal height : will snap to offset..
          // If velocity is high, snaping in the velocity direction
          if (Math.abs(velocityY) > HIGH_VELOCITY) {
            velocityY > 0
              ? snapToPoint(
                  SnapPoint.Bottom,
                  velocityY,
                  translateYModal,
                  close,
                  maxModalHeight
                )
              : snapToPoint(
                  SnapPoint.Top,
                  velocityY,
                  translateYModal,
                  close,
                  maxModalHeight
                );
          }
          // Snaping to the closest point
          if (
            Math.abs(
              translationY + ctx.offsetY - (SCREEN_HEIGHT - maxModalHeight)
            ) > //Top snap point
            Math.abs(maxModalHeight - (translationY + ctx.offsetY)) // Bottom snap point
          ) {
            snapToPoint(
              SnapPoint.Bottom,
              velocityY,
              translateYModal,
              close,
              maxModalHeight
            );
          } else {
            snapToPoint(
              SnapPoint.Top,
              velocityY,
              translateYModal,
              close,
              maxModalHeight
            );
          }
        }
      }
    });

    const onLayout = (event: LayoutChangeEvent) => {
      // Represents the height of the absoluteBottomChildren hiding the scroll view
      const additionalHeight = absoluteBottomChildren?.height ?? 0;

      if (contentStaticHeight) {
        setContentHeight(
          -Math.abs(contentStaticHeight - maxModalHeight + additionalHeight)
        );
        return;
      }
      const { height } = event.nativeEvent.layout;
      // Use content of children view to define scroll limit
      if (height < maxModalHeight) {
        setContentHeight(0);
        return;
      }
      setContentHeight(-Math.abs(height - maxModalHeight + additionalHeight));
    };

    const actionButtonsStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateYModal.value,
        [
          SCREEN_HEIGHT - ACTION_BUTTONS_MIN_OPACITY,
          SCREEN_HEIGHT - ACTION_BUTTONS_MAX_OPACITY
        ],
        [0, 1]
      );

      return { opacity };
    });

    const backgroundOpacityStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateYModal.value,
        [SCREEN_HEIGHT, SCREEN_HEIGHT - maxModalHeight],
        [0, 0.8]
      );

      return { opacity };
    });

    const scrollModalTranslationStyle = useAnimatedStyle(() => {
      return { transform: [{ translateY: translateYModal.value }] };
    });

    const scrollContentTranslationStyle = useAnimatedStyle(() => {
      return { transform: [{ translateY: translateYContent.value }] };
    });

    return (
      <>
        {modalVisible && (
          <Container>
            <TouchableWithoutFeedback onPress={() => close()}>
              <AnimatedBackgroundOpacity style={backgroundOpacityStyle} />
            </TouchableWithoutFeedback>
            <PanGestureHandler onGestureEvent={onGestureEvent}>
              <AnimatedContainerModal
                height={maxModalHeight}
                backgroundColor={contentBackgroundColor}
                style={scrollModalTranslationStyle}
              >
                <ContainerScrollIndicator
                  {...{ backgroundColor: contentBackgroundColor }}
                >
                  <ScrollIndicator />
                </ContainerScrollIndicator>
                <Animated.View
                  style={scrollContentTranslationStyle}
                  onLayout={onLayout}
                  {...{ backgroundColor: contentBackgroundColor }}
                >
                  {children}
                </Animated.View>
              </AnimatedContainerModal>
            </PanGestureHandler>
            {absoluteBottomChildren && (
              <AnimatedContainerActionButtons
                top={SCREEN_HEIGHT - absoluteBottomChildren?.position}
                style={actionButtonsStyle}
              >
                {absoluteBottomChildren.children}
              </AnimatedContainerActionButtons>
            )}
          </Container>
        )}
      </>
    );
  }
);

// Worklet cannot be declared in the body of the component
const snapToPoint = (
  point: SnapPoint,
  velocityY: number,
  translateYModal: Animated.SharedValue<number>,
  close: () => void,
  maxModalHeight: number
) => {
  "worklet";
  switch (point) {
    case SnapPoint.Top:
      // Snap up to open fully the modal
      translateYModal.value = withSpring(SCREEN_HEIGHT - maxModalHeight, {
        velocity: velocityY,
        overshootClamping: true,
        damping: 20
      });
      break;
    case SnapPoint.Bottom:
      // Snap down to close modal
      translateYModal.value = withSpring(
        SCREEN_HEIGHT,
        {
          velocity: velocityY,
          overshootClamping: true,
          damping: 20,
          stiffness: 150
        },
        () => runOnJS(close)()
      );
      break;
    default:
      break;
  }
};
