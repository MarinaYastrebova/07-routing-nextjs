'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, FetchNotesParams } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './page.module.css';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const perPage = 12;

  const tagFilter = tag === 'all' ? undefined : tag;

  const { data: response, isLoading } = useQuery({
    queryKey: ['notes', tagFilter, page, searchTerm],
    queryFn: () => {
      const queryParams: FetchNotesParams = { page, perPage };
      if (tagFilter) queryParams.tag = tagFilter;
      if (searchTerm) queryParams.search = searchTerm;
      return fetchNotes(queryParams);
    },
  });

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 500);

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleNoteCreated = () => {
    setIsCreateModalOpen(false);
    setPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const totalPages = response?.totalPages || 0;

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.toolbar}>
          <SearchBox value={searchTerm} onChange={handleSearchChange} />
          {!isLoading && totalPages > 1 && (
            <Pagination pageCount={totalPages} currentPage={page} onPageChange={handlePageChange} />
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={css.createButton}
            type="button"
          >
            Create Note +
          </button>
        </div>

        {isLoading ? (
          <p>Loading notes...</p>
        ) : !response ? (
          <p className={css.empty}>No data available</p>
        ) : response.notes.length > 0 ? (
          <NoteList notes={response.notes} />
        ) : (
          <p className={css.empty}>No notes found</p>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={handleCreateModalClose}>
        <NoteForm onCancel={handleCreateModalClose} onSuccess={handleNoteCreated} />
      </Modal>
    </>
  );
}
