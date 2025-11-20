// components/IconButton.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function IconButton({
  name,
  size = 20,
  onPress,
  color = "#111827",
  style,
}: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  onPress?: () => void;
  color?: string;
  style?: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style]}
      activeOpacity={0.7}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
