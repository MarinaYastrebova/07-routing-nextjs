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

  const { data: note, isLoading } = useQuery({
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
      ) : note ? (
        <NotePreview note={note} onClose={handleClose} />
      ) : (
        <p>Note not found</p>
      )}
    </Modal>
  );
}
// import { fetchNoteById } from '@/lib/api';
// import NotePreview from '@/components/NotePreview/NotePreview';
// import Modal from '@/components/Modal/Modal';

// interface Props {
//   params: Promise<{ id: string }>;
// }

// export default async function InterceptedNotePage({ params }: Props) {
//   const { id } = await params;

//   let note = null;
//   let isError = false;

//   try {
//     note = await fetchNoteById(id);
//   } catch (error) {
//     console.error('Error fetching note inside modal:', error);
//     isError = true;
//   }

//   if (isError || !note) {
//     return (
//       <Modal>
//         <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
//           <h2>Note not found</h2>
//           <p>Could not load note with ID: {id}</p>
//         </div>
//       </Modal>
//     );
//   }

//   return (
//     <Modal>
//       <NotePreview note={note} />
//     </Modal>
//   );
