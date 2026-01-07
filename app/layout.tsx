import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Letterboxd Stats - Interactive Film Analytics",
  description: "Transform your Letterboxd viewing history into beautiful, interactive analytics. Discover patterns, trends, and insights from your cinema journey with 18+ charts and visualizations.",
  keywords: ["letterboxd", "analytics", "film", "movies", "statistics", "data visualization"],
  authors: [{ name: "Maria" }],
  creator: "Maria",
  icons: {
    icon: "/icon",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://letterboxd-stats.vercel.app",
    siteName: "Letterboxd Stats",
    title: "Letterboxd Stats - Interactive Film Analytics",
    description: "Unlock insights from your Letterboxd data. Visualize your viewing patterns, rating trends, and cinematic preferences.",
    images: [
      {
        url: "https://letterboxd-stats.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Letterboxd Stats - Interactive Film Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Letterboxd Stats - Interactive Film Analytics",
    description: "Unlock insights from your Letterboxd data with beautiful, interactive analytics.",
    images: ["https://letterboxd-stats.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
        bg-white dark:bg-slate-950 flex flex-col min-h-screen overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="flex-1 min-w-0">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
