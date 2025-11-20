import React, { createContext, ReactNode, useEffect, useState } from "react";
import * as storage from "../utils/storage";

type AuthContextType = {
  currentUser: string | null;
  loadingAuth: boolean;
  signup: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  login: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await storage.getCurrentUser();
      setCurrentUser(user);
      setLoadingAuth(false);
    })();
  }, []);

  async function signup(username: string, password: string) {
    if (!username || !password)
      return { ok: false, error: "Provide username and password" };
    const users = await storage.getUsers();
    if (users[username]) return { ok: false, error: "Username already exists" };
    users[username] = password; // NOTE: plaintext for offline demo
    await storage.saveUsers(users);
    await storage.setCurrentUser(username);
    setCurrentUser(username);
    return { ok: true };
  }

  async function login(username: string, password: string) {
    const users = await storage.getUsers();
    console.log(users);
    if (!users[username]) return { ok: false, error: "User not found" };
    if (users[username] !== password)
      return { ok: false, error: "Incorrect password" };
    await storage.setCurrentUser(username);
    setCurrentUser(username);
    return { ok: true };
  }

  async function logout() {
    await storage.setCurrentUser(null);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, loadingAuth, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
