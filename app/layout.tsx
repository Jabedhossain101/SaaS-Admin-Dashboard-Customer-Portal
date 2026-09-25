import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SaaS Admin Dashboard & Customer Portal',
  description: 'Production-ready SaaS architecture built with Next.js App Router, Supabase SSR, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-blue-500 selection:text-white`}>
        <div className="relative min-h-screen flex flex-col bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
          {children}
        </div>
      </body>
    </html>
  );
}
