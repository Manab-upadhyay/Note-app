// components/ConfirmModal.tsx
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmModal({
  visible,
  title = "Confirm",
  message,
  onCancel,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
}: {
  visible: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.msg}>{message}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.btn, { borderColor: "#E5E7EB" }]}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.btn, { backgroundColor: "#2563EB" }]}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "86%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    elevation: 8,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  msg: { color: "#374151", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    marginLeft: 8,
  },
});
