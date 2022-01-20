import ExpoSketch from "./ExpoSketch";

export const getPickerInfoAsync: (
  reactTag: number
) => Promise<{ isVisible: boolean }> = ExpoSketch.getPickerInfoAsync;
export const setPickerVisibleAsync: (
  reactTag: number,
  isVisible: boolean
) => Promise<void> = ExpoSketch.setPickerVisibleAsync;
export const getDrawingAsync: (reactTag: number) => Promise<string | null> =
  ExpoSketch.getDrawingAsync;
export const clearDrawingAsync: (reactTag: number) => Promise<void> =
  ExpoSketch.clearDrawingAsync;
