import Image from 'next/image';
import Link from 'next/link';

export function Footer({ settings }) {
  return (
    <footer className="relative overflow-hidden bg-[#100c09]">
      <div className="h-px bg-gradient-to-r from-transparent via-[#d98445]/70 to-transparent" />
      <div className="container-page flex justify-center py-10 md:py-12">
        <Link
          href="/"
          className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d98445]/70"
          aria-label={settings?.siteName || 'Shambhala Home'}
        >
          <Image
            src="/logoo-removebg.png"
            alt={settings?.siteName || 'Shambhala Home'}
            width={884}
            height={244}
            className="h-auto w-48 object-contain opacity-90 md:w-60"
          />
        </Link>
      </div>
    </footer>
  );
}
