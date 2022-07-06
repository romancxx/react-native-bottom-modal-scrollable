import Animated, { runOnJS, withSpring } from 'react-native-reanimated';
import { SnapPoint } from './types';

export const snapToPoint = (
  point: SnapPoint,
  velocityY: number,
  translateYModal: Animated.SharedValue<number>,
  closeModal: () => void,
  maxModalHeight: number,
  screenHeight: number,
  disableSnapToBottom: boolean,
  defaultModalHeight: number,
) => {
  'worklet';
  switch (point) {
    case SnapPoint.Top:
      // Snap up to fully open the modal
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
          if (!disableSnapToBottom) {
            runOnJS(closeModal)();
          }
        },
      );
      break;
    default:
      break;
  }
};
