import { Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function NotesLayout() {
  const { currentUser, loadingAuth } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && !currentUser) {
      router.replace("/login");
    }
  }, [currentUser, loadingAuth]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
