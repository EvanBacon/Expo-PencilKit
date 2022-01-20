import _CanvasView from 'expo-linear-gradient/build/NativeLinearGradient';
import { EventEmitter, NativeModulesProxy, Subscription } from 'expo-modules-core';
import React, { useEffect, useRef, useState } from 'react';
import { ViewProps } from 'react-native';

// import NativeLinearGradient from './NativeLinearGradient';

const emitter = new EventEmitter(NativeModulesProxy.ExpoLinearGradient);


export function addDrawingChangeListener(
    listener: () => void
): Subscription {
    return emitter.addListener('onDrawingChange', listener);
}

export function addPickerToolChangeListener(
    listener: ((event: { type: 'ink', color: string, width: number, mode: 'pencil' | 'marker' | 'pen' } | { type: 'eraser', mode: 'bitmap' | 'vector' } | { type: 'lasso' }) => void)
): Subscription {
    return emitter.addListener('onPickerToolChange', listener);
}

export function addRulerActiveListener(
    listener: (event: { isActive: boolean }) => void
): Subscription {
    return emitter.addListener('onPickerRulerActiveChange', listener);
}

export function addPickerVisibilityListener(
    listener: (event: { isVisible: boolean }) => void
): Subscription {
    return emitter.addListener('onPickerVisibilityChange', listener);
}

export function addDrawingListener(
    listener: (event: { state: 'begin' | 'end' }) => void
): Subscription {
    return emitter.addListener('onDrawing', listener);
}

export function usePickerTool() {
    const [tool, setTool] = useState(null);
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
    const [state, setState] = useState(null);
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

export const getPickerInfoAsync: ((reactTag: number) => Promise<{ isVisible: boolean }>) = NativeModulesProxy.ExpoLinearGradient.getPickerInfoAsync;
export const setPickerVisibleAsync: ((reactTag: number, isVisible: boolean) => Promise<void>) = NativeModulesProxy.ExpoLinearGradient.setPickerVisibleAsync;
export const getDrawingAsync: ((reactTag: number) => Promise<string | null>) = NativeModulesProxy.ExpoLinearGradient.getDrawingAsync;
export const clearDrawingAsync: ((reactTag: number) => Promise<void>) = NativeModulesProxy.ExpoLinearGradient.clearDrawingAsync;

const CanvasView = _CanvasView as React.FC<ViewProps & { allowsFingerDrawing: boolean; isRulerActive: boolean }>
export { CanvasView }