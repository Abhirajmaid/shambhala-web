import { Footer } from '@/components/sections/Footer';
import { Navbar } from '@/components/sections/Navbar';
import { getPublicList, getSingleton } from '@/lib/firebase/server-data';

export default async function SiteLayout({ children }) {
  const [settings, showrooms] = await Promise.all([getSingleton('settings'), getPublicList('showrooms')]);
  return <div className="min-h-screen"><Navbar settings={settings} />{children}<Footer settings={settings} showrooms={showrooms} /></div>;
}
