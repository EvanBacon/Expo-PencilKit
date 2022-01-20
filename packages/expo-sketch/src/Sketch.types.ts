import { ViewProps } from "react-native";

export type SketchViewProps = ViewProps & {
  allowsFingerDrawing: boolean;
  isRulerActive: boolean;
};

export type PickerToolChangeEvent =
  | {
      type: "ink";
      color: string;
      width: number;
      mode: "pencil" | "marker" | "pen";
    }
  | { type: "eraser"; mode: "bitmap" | "vector" }
  | { type: "lasso" };

export type DrawingEvent = { state: "begin" | "end" };
