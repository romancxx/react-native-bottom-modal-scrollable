# Bottom Scrollable Modal

A Bottom Modal component for React Native that can be dragged to the maximum height and without releasing the finger off the screen scroll its content without to provide a smooth user experience. Fully customizable and compatible with Android & iOS. Built using react-native-reanimated 2

## Overview

<p align="center">
<img src="https://i.imgur.com/K6o4qIH.gifv" height="500" />
</p>

## Installation

This package requires react-native-reanimated 2 and react-native-gesture-handler to work.

- [Reanimated Installation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [Gesture handler Installation](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)
  <em>Don't forget to wrap your app with `<GestureHandlerRootView>` as described in the doc</em>

Then :

```
yarn add react-native-bottom-scrollable-modal
```

or using npm

```
npm install react-native-bottom-scrollable-modal
```

## Quick start

```js
...
import { AnimatedScrollModal, AnimatedScrollModalRef } from  'react-native-bottom-modal';

...

const modalRef = useRef<AnimatedScrollModalRef>(null);
...
useEffect(()  => {
	modalRef.current?.open();
}, [])

return (
	<AnimatedScrollModal
		ref={ref}
		children={
				<View>
					<Text>Hello</Text>
				</View>
			}
		/>
	);
```

## Props

| Prop                          | Default                  | Type           | Description                                                                                                                                                          |
| ----------------------------- | ------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children                      |                          | ReactNode      | Content to render inside the modal                                                                                                                                   |
| footer                        |                          | AbsoluteFooter | Element to render in absolute position over the modal at the bottom of the screen                                                                                    |
| backgroundColor               | #fff                     | string         | Background color of the modal                                                                                                                                        |
| defaultModalHeight            | 50% of the window height | number         | Default height of the modal when opened                                                                                                                              |
| maxModalHeight                | 90% of the window height | number         | Maximum height the modal can reach                                                                                                                                   |
| contentStaticHeight           |                          | number         | Only use this prop to set a static height for the content of the modal, if not provided the height will be calculated according to the children height (dynamically) |
| onClose                       |                          | () => void     | Callback called when the modal has been closed                                                                                                                       |
| containerStyle                |                          | ViewStyle      | Style of the container                                                                                                                                               |
| dragIndicator                 | true                     | boolean        | Show or not the dragging indicator at the top of the modal content                                                                                                   |
| screenHeight                  | Dimension window height  | number         | Use this props to overide the size in which the modal should work, useful if the modal should start after some elements which are at the bottom of the screen        |
| disableBackgroundOpacity      | false                    | boolean        | Disable the opacity applied on the background                                                                                                                        |
| disableCloseOnBackgroundPress | false                    | boolean        | If true then it will not close the modal when background is pressed                                                                                                  |
| disableSnapToBottom           | false                    | boolean        | If true the modal will not close when the user drag it down, instead it will snap to the `defaultModalHeight`                                                        |
| backgroundClickable           | false                    | boolean        | If true the background will be pressable, usually this prop should be used with `disableCloseOnBackgroundPress` & `disableBackgroundOpacity`                         |
| onEndReached                  |                          | () => void     | Function called when the end of the content is reached                                                                                                               |
| onEndReachedThreshold         | 100                      | number         | How far from the end in pixel the bottom edge of the content must be from the end of the content to trigger the `onEndReached` callback.                             |

## Example

Running the example app:

```
cd example && yarn
```

Starting the server:

```
yarn start
```

Running the app on iOS:

```
yarn ios
```

Running the app on Android:

```
yarn android
```

## Known issues

As the content is displayed inside a custom scroll view it is not possible to use flex, which shouldn't be necessary as demonstrate in the example app.

## LICENSE

MIT

---

Pull requests, feedbacks and suggestions are welcome!
