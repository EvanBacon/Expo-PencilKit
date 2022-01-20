import { SketchView, usePickerTool } from "expo-sketch";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Image, Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [uri, setUri] = useState(null);
  const ref = useRef(null);
  const tool = usePickerTool();
  // const state = useDrawingState();

  useEffect(() => {
    console.log("tool", tool);
  }, [tool]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <SketchView
        ref={ref}
        allowsFingerDrawing
        style={{ flex: 1 }}
        colors={[]}
      />

      <View
        style={{
          position: "absolute",

          top: 48,
          left: 8,
        }}
      >
        <View
          style={{
            alignItems: "stretch",
            flexDirection: "row",
          }}
        >
          <Button
            title="Toggle Tools"
            style={{
              textAlign: "center",
              fontSize: 16,
            }}
            onPress={async () => {
              const { isVisible } = await ref.current.getInfoAsync();
              await ref.current.setPickerVisibleAsync(!isVisible);
            }}
          />

          <Button
            title="Clear"
            style={{
              textAlign: "center",
              fontSize: 16,
            }}
            onPress={() => {
              ref.current.clearAsync();
            }}
          />

          <Button
            title="Capture"
            style={{
              textAlign: "center",
              fontSize: 16,
            }}
            onPress={async () => {
              const img = await ref.current.captureAsync();
              console.log(img);
              setUri(img);
            }}
          />
        </View>
        {tool && (
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginRight: 8 }}>Tool: {tool.type}</Text>
            {tool.color && <Text>Color: {tool.color}</Text>}
          </View>
        )}
      </View>

      {uri && (
        <Image
          style={{
            aspectRatio: 1,
            position: "absolute",
            top: 48,
            right: 8,
            width: 64,
            height: 64,
            opacity: 0.8,
            borderWidth: 1,
          }}
          source={{ uri }}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
});
