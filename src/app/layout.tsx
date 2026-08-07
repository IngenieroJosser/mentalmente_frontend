import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Manrope } from "next/font/google"
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { AuthProvider } from '@/context/AuthContext';

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SanaTú Quingar — Bienestar psicológico',
    template: '%s | SanaTú Quingar',
  },
  description: 'Orientación psicológica humana, ética y cercana en Quibdó, Chocó. Atención virtual y domiciliaria.',
  metadataBase: new URL('https://www.sanatuquingar.com.co/'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'SanaTú Quingar — Bienestar psicológico',
    description: 'Un espacio humano y responsable para comprender tus emociones y fortalecer tus recursos.',
    url: 'https://www.sanatuquingar.com.co/',
    siteName: 'SanaTú Quingar',
    images: [{ url: '/logo-sana-tu-brand.png', width: 689, height: 572, alt: 'SanaTú Quingar' }],
    locale: 'es_CO',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  authors: [{ name: 'SanaTú Quingar' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#414719',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
