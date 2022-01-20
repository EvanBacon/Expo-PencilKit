import * as React from 'react';
import { View } from 'react-native';

import { SketchViewProps } from './Sketch.types';

// This is a shim view for platforms that aren't supported by Expo.
// The component and prop types should match all of the other platform variations.
export default function SketchView(props: SketchViewProps): React.ReactElement {
  const { allowsFingerDrawing, isRulerActive, ...viewProps } = props;
  console.warn('SketchView is not available on this platform');
  return <View {...(viewProps as any)} />;
}
