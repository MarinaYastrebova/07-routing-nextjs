'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';
import { useEffect, useState } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function NoteModalPage({ params }: Props) {
  const router = useRouter();
  const [noteId, setNoteId] = useState<string>('');

  useEffect(() => {
    params.then(p => setNoteId(p.id));
  }, [params]);

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
  });

  const handleClose = () => {
    router.back();
  };

  if (!noteId) return null;

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError || !note ? (
        <p>Note not found</p>
      ) : (
        <NotePreview note={note} onClose={handleClose} />
      )}
    </Modal>
  );
}
