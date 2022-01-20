import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { findNodeHandle } from 'react-native';

import { SketchViewProps } from './Sketch.types';
import { clearDrawingAsync, getDrawingAsync, getPickerInfoAsync, setPickerVisibleAsync } from './SketchMethods';

const NativeSketchView = requireNativeViewManager(
  'ExpoSketch'
) as React.FC<SketchViewProps>;

// @refresh reset
const SketchView: React.FC<SketchViewProps> = React.forwardRef((props, ref) => {
  const _ref = React.useRef(null);

  const getNodeHandle = () => {
    if (_ref.current) {
      return findNodeHandle(_ref.current);
    }
    throw new Error("sketch view ref not attached yet");
  };

  React.useImperativeHandle(
    ref,
    () => ({
      clearAsync() {
        return clearDrawingAsync(getNodeHandle());
      },
      captureAsync() {
        return getDrawingAsync(getNodeHandle());
      },
      setPickerVisibleAsync(isVisible) {
        return setPickerVisibleAsync(getNodeHandle(), isVisible);
      },
      getInfoAsync() {
        return getPickerInfoAsync(getNodeHandle());
      },
    }),
    []
  );

  return <NativeSketchView ref={_ref} {...props} />;
});


export default SketchView