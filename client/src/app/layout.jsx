import { Geist_Mono, Sora } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

const sora = Sora({ variable: '--font-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = {
  title: 'Shambhala Home',
  description: 'Modular kitchens, wardrobes, beds and furniture for modern Indian homes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sora.variable + ' ' + geistMono.variable + ' antialiased'}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
