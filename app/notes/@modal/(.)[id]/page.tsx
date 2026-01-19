import { fetchNoteById } from '@/lib/api';
import NotePreview from '@/components/NotePreview/NotePreview';
import Modal from '@/components/Modal/Modal';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterceptedNotePage({ params }: Props) {
  const { id } = await params;

  let note = null;
  let isError = false;

  try {
    note = await fetchNoteById(id);
  } catch (error) {
    console.error('Error fetching note inside modal:', error);
    isError = true;
  }

  if (isError || !note) {
    return (
      <Modal>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          <h2>Note not found</h2>
          <p>Could not load note with ID: {id}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <NotePreview note={note} />
    </Modal>
  );
}
