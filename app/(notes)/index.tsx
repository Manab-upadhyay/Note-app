// app/(notes)/index.tsx
import { Link, useRouter } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ConfirmModal from "../../components/Confirmation";
import IconButton from "../../components/iconButton";
import NoteItem from "../../components/Noteitem";
import { AuthContext } from "../../context/AuthContext";
import { NotesContext } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";

export default function NotesList() {
  const { notes, deleteNote } = useContext(NotesContext);
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { colors, toggleTheme, theme } = useTheme();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const onConfirmLogout = async () => {
    setLogoutOpen(false);
    await logout();
    // optional: router.replace("/login"); protected layout will handle redirect
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - moved down with spacing */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>My Notes</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {currentUser ? `Signed in as ${currentUser}` : ""}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <IconButton
            name={theme === "light" ? "dark-mode" : "light-mode"}
            size={22}
            color={colors.primary}
            onPress={toggleTheme}
            style={{ marginRight: 6 }}
          />
          <IconButton
            name="logout"
            size={22}
            color={colors.danger}
            onPress={() => setLogoutOpen(true)}
          />
        </View>
      </View>

      <View style={{ padding: 12 }}>
        <View
          style={[
            styles.search,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TextInput
            placeholder="Search title or body"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: colors.text }]}
            clearButtonMode="while-editing"
          />
          {!!query && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearBtn}
            >
              <Text style={{ color: colors.primary }}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => (
          <NoteItem note={item} onDelete={() => deleteNote(item.id)} />
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ color: colors.blueFallback, fontWeight: "600" }}>
              {query
                ? "No results found."
                : "No notes yet — tap + to create one."}
            </Text>
          </View>
        )}
      />

      <Link href="/note/new" asChild>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: "#fff", fontSize: 26 }}>+</Text>
        </TouchableOpacity>
      </Link>

      <ConfirmModal
        visible={logoutOpen}
        title="Log out"
        message="Are you sure you want to log out?"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={onConfirmLogout}
        confirmText="Log out"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "ios" ? 44 : 100,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 12, marginTop: 4 },
  search: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 16 },
  clearBtn: { paddingHorizontal: 8 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
