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
  title: "SanaTú Quingar – Promoviendo la Salud Mental",
  description: "SanaTú Quingar es una plataforma dedicada a la salud mental.",
  metadataBase: new URL("https://www.sanatuquingar.com.co/"),
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
  twitter: {
    card: "summary_large_image",
    title: "SanaTú Quingar – Salud Mental",
    description: "Desestigmatización y recursos en salud mental",
    images: ["https://www.sanatuquingar.com.co/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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