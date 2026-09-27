import axios from "axios";
import type { Note, FetchNotesResponse } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, any> = { page, perPage };

  if (search && search.trim() !== "") {
    params.search = search.trim();
  }

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
