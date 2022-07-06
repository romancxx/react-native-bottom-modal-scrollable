/*
 * Project: mobileapplanslot
 * -----
 * Created: Wednesday, 5th January 2022 11:09:44 am
 * -----
 * Copyright (c) 2020 - Lanslot SAS - All rights reserved
 * -----
 */

import { Keyboard } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  withDecay,
} from 'react-native-reanimated';
import { HIGH_VELOCITY } from '../constants';
import { SnapPoint } from '../types';
import { snapToPoint } from '../utils';

export const useScrollHandler = (
  contentHeight: number,
  maxModalHeight: number,
  translateYLevelIndicator: Animated.SharedValue<number>,
  translateYContent: Animated.SharedValue<number>,
  translateYModal: Animated.SharedValue<number>,
  closeModal: (isGestureClose?: boolean) => void,
  onEndReached: (() => void) | undefined,
  onEndReachedThreshold: number,
  screenHeight: number,
  disableSnapToBottom: boolean,
  defaultModalHeight: number,
) => {
  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      // On start needs to set context offsetY from last gesture (otherwise gesture will reset)
      if (translateYLevelIndicator.value <= screenHeight - maxModalHeight) {
        // Set content translation offset
        ctx.offsetY = translateYContent.value + (screenHeight - maxModalHeight);
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
        runOnJS(closeKeyboard)();
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
                closeModal,
                maxModalHeight,
                screenHeight,
                disableSnapToBottom,
                defaultModalHeight,
              )
            : snapToPoint(
                SnapPoint.Top,
                velocityY,
                translateYModal,
                closeModal,
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
            closeModal,
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
            closeModal,
            maxModalHeight,
            screenHeight,
            disableSnapToBottom,
            defaultModalHeight,
          );
        }
      }
    },
  });
  return { onGestureEvent };
};
