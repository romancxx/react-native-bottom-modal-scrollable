import { Dimensions } from 'react-native';

export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const WINDOW_WIDTH = Dimensions.get('window').width;

export const HIGH_VELOCITY = 1500;

export const MAX_MODAL_HEIGHT = WINDOW_HEIGHT * 0.9;
export const DEFAULT_MODAL_HEIGHT = WINDOW_HEIGHT / 2;

export const FOOTER_MAX_OPACITY_POS = DEFAULT_MODAL_HEIGHT / 2;
export const FOOTER_MIN_OPACITY_POS = DEFAULT_MODAL_HEIGHT / 4;

// export const CLOSING_DURATION = 200;
// export const OPENING_DURATION = 300;
// export const SHAKE_DURATION = 350;

// export const PADDING_BOTTOM = 15;
// export const DRAGGABLE_CONTAINER_HEIGHT = 30;
