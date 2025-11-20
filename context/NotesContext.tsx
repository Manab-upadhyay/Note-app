import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Note } from "../types";
import * as storage from "../utils/storage";
import { AuthContext } from "./AuthContext";

type NotesContextType = {
  notes: Note[];
  loadNotes: () => Promise<void>;
  createNote: (n: Partial<Note>) => Promise<void>;
  updateNote: (id: string, patch: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
};

export const NotesContext = createContext<NotesContextType>({} as any);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useContext(AuthContext);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (currentUser) loadNotes();
    else setNotes([]);
  }, [currentUser]);

  async function loadNotes() {
    if (!currentUser) return;
    const data = await storage.getNotesForUser(currentUser);
    setNotes(data);
  }

  async function persist(list: Note[]) {
    if (!currentUser) return;
    await storage.saveNotesForUser(currentUser, list);
    setNotes(list);
  }

  async function createNote(n: Partial<Note>) {
    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 10),
      title: n.title ?? "Untitled",
      body: n.body ?? "",
      imageUri: n.imageUri,
      updatedAt: Date.now(),
    };
    const list = [newNote, ...notes];
    await persist(list);
  }

  async function updateNote(id: string, patch: Partial<Note>) {
    const list = notes.map((no) =>
      no.id === id ? { ...no, ...patch, updatedAt: Date.now() } : no
    );
    await persist(list);
  }

  async function deleteNote(id: string) {
    const list = notes.filter((n) => n.id !== id);
    await persist(list);
  }

  return (
    <NotesContext.Provider
      value={{ notes, loadNotes, createNote, updateNote, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};
