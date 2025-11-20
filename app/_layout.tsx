// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { NotesProvider } from "../context/NotesContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
