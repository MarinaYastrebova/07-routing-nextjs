'use client';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './NotesPage.module.css';

const App = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, searchTerm],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: searchTerm || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 500);

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNoteCreated = () => {
    setIsModalOpen(false);
    setPage(1);
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={handlePageChange} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)} type="button">
          Create note +
        </button>
      </header>
      {isLoading && <p className={css.loading}>Loading notes...</p>}
      {isError && (
        <p className={css.error}>Error loading notes: {error?.message || 'Unknown error'}</p>
      )}
      {!isLoading && !isError && (
        <>
          {notes.length > 0 && <NoteList notes={notes} />}
          {notes.length === 0 && (
            <p className={css.empty}>No notes found. Create your first note!</p>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <NoteForm onCancel={handleModalClose} onSuccess={handleNoteCreated} />
      </Modal>
    </div>
  );
};

export default App;
