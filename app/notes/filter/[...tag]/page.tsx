'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './page.module.css';

type Props = {
  params: Promise<{ tag: string[] }>;
};

export default function NotesByTag({ params }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tag, setTag] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    params.then(p => setTag(p.tag));
  }, [params]);

  const tagFilter = tag[0] === 'all' ? undefined : tag[0];

  const { data: response, isLoading } = useQuery({
    queryKey: ['notes', tagFilter, page],
    queryFn: () =>
      fetchNotes({
        tag: tagFilter,
        page,
        perPage,
      }),
    enabled: tag.length > 0,
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNoteCreated = () => {
    setIsModalOpen(false);
    setPage(1); // Повертаємо на першу сторінку після створення
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  if (tag.length === 0) return <p>Loading...</p>;

  const totalPages = response?.totalPages || 0;

  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <h1 className={css.title}>{tag[0] === 'all' ? 'All Notes' : `${tag[0]} Notes`}</h1>
        <button onClick={() => setIsModalOpen(true)} className={css.createButton} type="button">
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

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <NoteForm onCancel={handleModalClose} onSuccess={handleNoteCreated} />
      </Modal>
    </div>
  );
}
