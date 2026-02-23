import type { Metadata } from 'next';
import { Inter, Montserrat, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-display',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'NEROZARB Agency OS',
  description: 'Intelligence is the new aesthetic.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${spaceMono.variable}`}>
      <body suppressHydrationWarning className="bg-[#0A0A0A] text-white antialiased selection:bg-[#3F6A24] selection:text-white">
        {children}
      </body>
    </html>
  );
}
