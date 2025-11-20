import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NotesContext } from "../../../context/NotesContext";
import { useTheme } from "../../../context/ThemeContext";

export default function NoteEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { notes, createNote, updateNote } = useContext(NotesContext);
  const { colors } = useTheme();

  const existing =
    id && id !== "new" ? notes.find((n) => n.id === id) : undefined;

  const [title, setTitle] = useState(existing?.title || "");
  const [body, setBody] = useState(existing?.body || "");
  const [imageUri, setImageUri] = useState<string | undefined>(
    existing?.imageUri
  );

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!res.canceled && res.assets?.length) setImageUri(res.assets[0].uri);
  }

  async function takePhoto() {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!res.canceled && res.assets?.length) setImageUri(res.assets[0].uri);
  }

  async function save() {
    if (!title.trim() && !body.trim()) {
      Alert.alert("Empty", "Please add a title or body to save the note.");
      return;
    }
    if (existing) {
      await updateNote(existing.id, {
        title: title.trim(),
        body: body.trim(),
        imageUri,
      });
    } else {
      await createNote({
        title: title.trim() || "Untitled",
        body: body.trim(),
        imageUri,
      });
    }
    router.back();
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <TextInput
        placeholder="Title"
        placeholderTextColor={colors.muted}
        value={title}
        onChangeText={setTitle}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
      />

      <TextInput
        placeholder="Body"
        placeholderTextColor={colors.muted}
        value={body}
        onChangeText={setBody}
        multiline
        style={[
          styles.bodyInput,
          {
            borderColor: colors.border,
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
      />

      {imageUri ? (
        <View>
          <Image source={{ uri: imageUri }} style={styles.image} />

          {/* Remove button only when image exists */}
          <TouchableOpacity
            onPress={() => setImageUri(undefined)}
            style={[styles.removeBtn, { backgroundColor: colors.danger }]}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Remove Image
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.row}>
        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.smallBtn,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Text style={{ color: colors.text }}>Pick</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={takePhoto}
          style={[
            styles.smallBtn,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Text style={{ color: colors.text }}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={save}
        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
          Save
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 40 : 100,
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  input: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 18,
    marginBottom: 14,
  },
  bodyInput: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    height: 200,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 18,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  removeBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  smallBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  saveBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
});
