import { Geist_Mono, Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

const poppins = Poppins({ variable: '--font-sans', subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = {
  title: 'Shambhala Home',
  description: 'Modular kitchens, wardrobes, beds and furniture for modern Indian homes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable + ' ' + geistMono.variable + ' antialiased'}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
