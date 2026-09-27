import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import {
  fetchNotes,
  createNote,
  type CreateNotePayload,
} from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, searchQuery],
    queryFn: () => fetchNotes({ page, perPage, search: searchQuery }),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const handleCreateNote = (values: CreateNotePayload) => {
    createMutation.mutate(values);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {data?.totalPages && data.totalPages > 1 ? (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        ) : null}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes. Please try again.</p>}

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data?.notes && data.notes.length === 0 && !isLoading && (
        <p>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
