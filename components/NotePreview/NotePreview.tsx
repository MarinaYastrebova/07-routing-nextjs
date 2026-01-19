import { Note } from '@/types/note';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  note: Note;
  onClose?: () => void; // ← ДОДАЙ ЦЕ
}

export default function NotePreview({ note, onClose }: NotePreviewProps) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>Created: {new Date(note.createdAt).toLocaleDateString()}</p>

        <button onClick={onClose} className={css.backBtn} type="button">
          ← Back to notes
        </button>
      </div>
    </div>
  );
}
