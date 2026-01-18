'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from '@/app/page.module.css';

export default function CreateNotePage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/notes/filter/all');
  };

  const handleSuccess = () => {
    router.push('/notes/filter/all');
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>Create New Note</h1>
      <NoteForm onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  );
}
