'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (!id) return null;

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading ? (
        <p>Loading...</p>
      ) : note ? (
        <NotePreview note={note} onClose={handleClose} />
      ) : (
        <p>Note not found</p>
      )}
    </Modal>
  );
}
