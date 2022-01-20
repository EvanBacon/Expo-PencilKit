// Copyright 2021-present 650 Industries. All rights reserved.

import UIKit
import PencilKit
import React
import ExpoModulesCore

@available(iOS 13.0, *)
final class SketchView: UIView {

  var canvasView: PKCanvasView!

  var drawing: PKDrawing {
    get {
      return canvasView.drawing
    }
    set {
      canvasView.drawing = newValue
    }
  }
  var isRulerActive: Bool {
    get {
      return canvasView.isRulerActive
    }
    set {
      canvasView.isRulerActive = newValue
    }
  }

  var sendEvent: (_ eventName: String, _ body: [String: Any?] ) -> Void;

  var allowsFingerDrawing: Bool {
    get {
      if #available(iOS 14.0, *) {
        return canvasView.drawingPolicy == .anyInput
      } else {
        return canvasView.allowsFingerDrawing;
      }
    }
    set {
      if #available(iOS 14.0, *) {
        canvasView.drawingPolicy = newValue ? .anyInput : .pencilOnly
      } else {
        canvasView.allowsFingerDrawing = newValue;
      }
    }
  }

  lazy var toolPicker: PKToolPicker = {
    var toolPicker: PKToolPicker
    if #available(iOS 14.0, *) {
       toolPicker = PKToolPicker()
    } else {
      let window = UIApplication.shared.windows.last!
      toolPicker = PKToolPicker.shared(for: window)!
    }
    toolPicker.addObserver(canvasView)
    toolPicker.addObserver(self)
    return toolPicker
  }()

  var toolPickerVisible: Bool {
    get {
      return toolPicker.isVisible
    }
    set {
      canvasView.becomeFirstResponder()
      toolPicker.setVisible(newValue, forFirstResponder: canvasView)

    }
  }

  //MARK: - iOS Life Cycle

  convenience init(sendEvent: @escaping (_ eventName: String, _ body: [String: Any?] ) -> Void) {
    self.init(frame: CGRect())
    self.sendEvent = sendEvent;
  }

  override init(frame: CGRect) {
    self.sendEvent = { (message: String, input: [String: Any?]) in

    }
      super.init(frame: frame)

      setupPencilKitCanvas()
  }

  required init?(coder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
  }

  func updateCanvasOrientation(with frame: CGRect) {
      self.canvasView.frame = frame
      self.frame = frame
  }

  private func setupPencilKitCanvas() {
    canvasView = PKCanvasView(frame:self.bounds)
    canvasView.translatesAutoresizingMaskIntoConstraints = false
    canvasView.delegate = self
    canvasView.alwaysBounceVertical = false
    addSubview(canvasView)

    NSLayoutConstraint.activate([
      canvasView.topAnchor.constraint(equalTo: self.topAnchor),
      canvasView.bottomAnchor.constraint(equalTo: self.bottomAnchor),
      canvasView.leadingAnchor.constraint(equalTo: self.leadingAnchor),
      canvasView.trailingAnchor.constraint(equalTo: self.trailingAnchor)
    ])
    toolPickerVisible = true
  }
}


@available(iOS 13.0, *)
extension SketchView: PKCanvasViewDelegate {

    /// Delegate method: Note that the drawing has changed.
    func canvasViewDrawingDidChange(_ canvasView: PKCanvasView) {
        print("canvasViewDrawingDidChange")
      sendEvent("onDrawingChange", [:])
    }

  func canvasViewDidBeginUsingTool(_ canvasView: PKCanvasView) {
    sendEvent("onDrawing", [ "state": "begin" ])
  }
  func canvasViewDidEndUsingTool(_ canvasView: PKCanvasView) {
      sendEvent("onDrawing", [ "state": "end"])
  }
}

@available(iOS 13.0, *)
extension SketchView: PKToolPickerObserver {

    func toolPickerSelectedToolDidChange(_ toolPicker: PKToolPicker) {
        print("toolPickerSelectedToolDidChange")

      var data: [String: Any?] = [:]
      if let tool = toolPicker.selectedTool as? PKInkingTool {
        data = [
          "type": "ink",
          "color": EXUtilities.hexString(with: tool.color.cgColor),
          "width": NSNumber(floatLiteral: tool.width),
          "mode": tool.inkType == .pencil ? "pencil" : tool.inkType == .marker ? "marker" : tool.inkType == .pen ? "pen" : tool.inkType.rawValue
        ]
      } else if let tool = toolPicker.selectedTool as? PKLassoTool {
        data = [
          "type": "lasso"
        ]
      } else if let tool = toolPicker.selectedTool as? PKEraserTool {
        data = [
          "type": "eraser",
          "mode": tool.eraserType == .bitmap ? "bitmap" : "vector"
        ]
      }

      sendEvent("onPickerToolChange", data)
    }

    func toolPickerIsRulerActiveDidChange(_ toolPicker: PKToolPicker) {
        print("toolPickerIsRulerActiveDidChange")
      sendEvent("onPickerRulerActiveChange", [ "isActive": toolPicker.isRulerActive ])
    }

    func toolPickerVisibilityDidChange(_ toolPicker: PKToolPicker) {
        print("toolPickerVisibilityDidChange")
      sendEvent("onPickerVisibilityChange", [ "isVisible": toolPicker.isVisible ])
    }

    func toolPickerFramesObscuredDidChange(_ toolPicker: PKToolPicker) {
        print("toolPickerFramesObscuredDidChange")
//      sendEvent("onPickerVisibilityChange", [:])
    }
}


