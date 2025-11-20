import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types";

const USERS_KEY = "USERS_v2";
const CURRENT_USER_KEY = "CURRENT_USER_v2";

export async function getUsers(): Promise<{ [k: string]: string }> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveUsers(users: { [k: string]: string }) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function setCurrentUser(username: string | null) {
  if (!username) await AsyncStorage.removeItem(CURRENT_USER_KEY);
  else await AsyncStorage.setItem(CURRENT_USER_KEY, username);
}

export async function getCurrentUser(): Promise<string | null> {
  return await AsyncStorage.getItem(CURRENT_USER_KEY);
}

export async function getNotesForUser(username: string): Promise<Note[]> {
  const k = `NOTES_${username}_v2`;
  const raw = await AsyncStorage.getItem(k);
  return raw ? JSON.parse(raw) : [];
}

export async function saveNotesForUser(username: string, notes: Note[]) {
  const k = `NOTES_${username}_v2`;
  await AsyncStorage.setItem(k, JSON.stringify(notes));
}
