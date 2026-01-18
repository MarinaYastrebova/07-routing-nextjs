import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import css from '@/app/page.module.css';

type Props = {
  params: Promise<{ tag: string[] }>;
};

export default async function NotesByTag({ params }: Props) {
  const { tag } = await params;

  const tagFilter = tag[0] === 'all' ? undefined : tag[0];

  const response = await fetchNotes(tagFilter ? { tag: tagFilter } : {});

  return (
    <div className={css.container}>
      <h1 className={css.title}>{tag[0] === 'all' ? 'All Notes' : `${tag[0]} Notes`}</h1>
      {response?.notes?.length > 0 ? (
        <NoteList notes={response.notes} />
      ) : (
        <p className={css.empty}>No notes found</p>
      )}
    </div>
  );
}
