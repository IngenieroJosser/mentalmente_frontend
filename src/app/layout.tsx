import type { Metadata } from "next";
import { Sora } from 'next/font/google';
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "@/context/AuthContext";

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: {
    default: "SanaTú Quingar – Promoviendo la Salud Mental",
    template: "%s | SanaTú Quingar"
  },
  description: "SanaTú Quingar es una plataforma dedicada a la salud mental. Información, soporte y recursos en español.",
  metadataBase: new URL("https://www.sanatuquingar.com.co/"),
  
  // Favicon e íconos para diferentes dispositivos
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
  
  // Open Graph (para Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    title: "SanaTú Quingar – Salud Mental en Español",
    description: "Información, soporte y recursos en salud mental para la comunidad hispanohablante.",
    url: "https://www.sanatuquingar.com.co/",
    siteName: "SanaTú Quingar",
    images: [
      {
        url: "https://www.sanatuquingar.com.co/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SanaTú Quingar – Salud Mental",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  
  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "SanaTú Quingar – Salud Mental",
    description: "Desestigmatización y recursos en salud mental",
    images: ["https://www.sanatuquingar.com.co/og-image.jpg"],
    site: "@sanatuquingar", // Opcional: tu cuenta de Twitter
  },
  
  // Configuración adicional
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: "SanaTú Quingar", url: "https://www.sanatuquingar.com.co" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${sora.className} antialiased`}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}