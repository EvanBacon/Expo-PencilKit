// Copyright 2021-present 650 Industries. All rights reserved.

import ExpoModulesCore
import PencilKit
import React

let onChanged = "onDrawingChanged"

@available(iOS 13.0, *)
public class ExpoSketchModule: Module {
  public func definition() -> ModuleDefinition {
    name("ExpoSketch")

    events("onDrawingChange", "onDrawing", "onPickerToolChange", "onPickerRulerActiveChange","onPickerVisibilityChange")

    function("getDrawingAsync", getDrawingData)

    function("getPickerInfoAsync", getPickerInfoAsync)

    function("setPickerVisibleAsync", setPickerVisibleAsync)

    function("clearDrawingAsync", clearDrawingAsync)


    viewManager {
      view {
        SketchView(sendEvent: self.sendEvent)
      }

      prop("allowsFingerDrawing") { (view: SketchView, allows: Bool) in
        view.allowsFingerDrawing = allows
      }

      prop("isRulerActive") { (view: SketchView, allows: Bool) in
        view.isRulerActive = allows;
      }
    }
  }

  private func getView(viewTag: Int) -> SketchView? {
    guard let manager = self.appContext?.reactBridge?.module(for: RCTUIManager.self) as? RCTUIManager else {
      return nil
    }

    guard let view = manager.view(forReactTag: viewTag as NSNumber) as? SketchView else {
      return nil
    }

    return view
  }

  private func getPickerInfoAsync(viewTag: Int) -> [String: Any?] {

    var info: [String: Any?] = [:]
    EXUtilities.performSynchronously {
      guard let view = self.getView(viewTag: viewTag) else {
        return
      }

      info = [
        "isVisible": view.toolPickerVisible,
      ]
    }
    return info
  }

  private func getDrawingData(viewTag: Int) -> String {
    var drawingData: String = ""
    EXUtilities.performSynchronously {
      guard let view = self.getView(viewTag: viewTag) else {
        return
      }

      guard let data = view.drawing.image(from: view.frame, scale: 1.0).jpegData(compressionQuality: 1.0) else {
        return
      }

      drawingData = "data:image/jpg;base64," + data.base64EncodedString(options: .endLineWithLineFeed)
    }
    return drawingData
  }

  private func clearDrawingAsync(viewTag: Int) {
    EXUtilities.performSynchronously {
      guard let view = self.getView(viewTag: viewTag) else {
        return
      }
      view.drawing = PKDrawing()
    }
  }

  private func setPickerVisibleAsync(viewTag: Int, visible: Bool) {
    EXUtilities.performSynchronously {
      guard let view = self.getView(viewTag: viewTag) else {
        return
      }
      view.toolPickerVisible = visible;
    }
  }
}
