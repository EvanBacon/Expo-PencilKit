import { EventEmitter, Subscription } from 'expo-modules-core';
import { useEffect, useState } from 'react';

import ExpoSketch from './ExpoSketch';
import { DrawingEvent, PickerToolChangeEvent } from './Sketch.types';


let _emitter: EventEmitter;

// Lazily initialize the event emitter because it isn't available on iOS,
// this enables us to use the same code for all platforms.
function getEmitter() {
  if (!_emitter) {
    _emitter = new EventEmitter(ExpoSketch);
  }
  return _emitter;
}


export function addDrawingChangeListener(
  listener: () => void
): Subscription {
  return getEmitter().addListener('onDrawingChange', listener);
}

export function addPickerToolChangeListener(
  listener: ((event: PickerToolChangeEvent) => void)
): Subscription {
  return getEmitter().addListener('onPickerToolChange', listener);
}

export function addRulerActiveListener(
  listener: (event: { isActive: boolean }) => void
): Subscription {
  return getEmitter().addListener('onPickerRulerActiveChange', listener);
}

export function addPickerVisibilityListener(
  listener: (event: { isVisible: boolean }) => void
): Subscription {
  return getEmitter().addListener('onPickerVisibilityChange', listener);
}

export function addDrawingListener(
  listener: (event: DrawingEvent) => void
): Subscription {
  return getEmitter().addListener('onDrawing', listener);
}

export function usePickerTool() {
  const [tool, setTool] = useState<PickerToolChangeEvent | null>(null);
  useEffect(() => {
    const event = addPickerToolChangeListener((event) => {
      setTool(event);
    })
    return () => {
      event.remove();
    };
  }, []);

  return tool;
}

export function useDrawingState() {
  const [state, setState] = useState<DrawingEvent | null>(null);
  useEffect(() => {
    const event = addDrawingListener((event) => {
      setState(event);
    })
    return () => {
      event.remove();
    };
  }, []);

  return state;
}

export * from './SketchMethods'
export * from './Sketch.types'

export { default as SketchView } from './SketchView'