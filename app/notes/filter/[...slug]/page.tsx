import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes, FetchNotesParams } from '@/lib/api';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesByTag({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0];
  const tagFilter = tag === 'all' ? undefined : tag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tagFilter, 1],
    queryFn: () => {
      const queryParams: FetchNotesParams = { page: 1, perPage: 12 };
      if (tagFilter) queryParams.tag = tagFilter;
      return fetchNotes(queryParams);
    },
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
