import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Note } from "../types";

export default function NoteItem({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      activeOpacity={0.8}
      onPress={() => router.push(`/note/${note.id}`)}
    >
      {/* LEFT: Thumbnail */}
      {note.imageUri ? (
        <Image source={{ uri: note.imageUri }} style={styles.thumb} />
      ) : (
        <View
          style={[styles.placeholder, { backgroundColor: colors.border }]}
        />
      )}

      {/* MIDDLE: Title + Preview */}
      <View style={styles.content}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {note.title}
        </Text>
        <Text numberOfLines={1} style={[styles.body, { color: colors.muted }]}>
          {note.body || "No description"}
        </Text>
      </View>

      {/* RIGHT: Edit + Delete */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push(`/note/${note.id}`)}
          hitSlop={10}
        >
          <MaterialIcons name="edit" size={22} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onDelete}
          hitSlop={10}
        >
          <MaterialIcons name="delete" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: {
    width: 58,
    height: 58,
    borderRadius: 12,
  },
  placeholder: {
    width: 58,
    height: 58,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    opacity: 0.8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  iconBtn: {
    padding: 6,
    marginLeft: 4,
  },
});
