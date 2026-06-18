import { AdminCollectionPage } from '@/components/admin/AdminCollectionPage';
import { collectionConfigs } from '@/lib/admin-collections';

export default function Page() {
  return <AdminCollectionPage {...collectionConfigs.team} />;
}
