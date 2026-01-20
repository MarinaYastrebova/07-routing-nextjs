'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchNotes, fetchNoteById } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NotePreview from '@/components/NotePreview/NotePreview';
import css from './page.module.css';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default function NotesByTag({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get('noteId'); // Отримуємо ID з URL

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [slug, setSlug] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  const tagFilter = slug[0] === 'all' ? undefined : slug[0];

  const { data: response, isLoading } = useQuery({
    queryKey: ['notes', tagFilter, page],
    queryFn: () =>
      fetchNotes({
        tag: tagFilter,
        page,
        perPage,
      }),
    enabled: slug.length > 0,
  });

  // Запит для окремої нотатки (якщо є noteId в URL)
  const { data: selectedNote, isLoading: isNoteLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId!),
    enabled: !!noteId,
  });

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

  const handleNoteModalClose = () => {
    router.back();
  };

  if (slug.length === 0) return <p>Loading...</p>;

  const totalPages = response?.totalPages || 0;

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.header}>
          <h1 className={css.title}>{slug[0] === 'all' ? 'All Notes' : `${slug[0]} Notes`}</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={css.createButton}
            type="button"
          >
            Create Note +
          </button>
        </div>

        {!isLoading && totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={handlePageChange} />
        )}

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

      {noteId && (
        <Modal isOpen={true} onClose={handleNoteModalClose}>
          {isNoteLoading ? (
            <p>Loading...</p>
          ) : selectedNote ? (
            <NotePreview note={selectedNote} onClose={handleNoteModalClose} />
          ) : (
            <p>Note not found</p>
          )}
        </Modal>
      )}
    </>
  );
}
