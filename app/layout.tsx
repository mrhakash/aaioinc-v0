import type { Metadata } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CommandPalette } from '@/components/command-palette'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Display font for headings (Bricolage Grotesque)
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Body font (Plus Jakarta Sans)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Mono font for labels/badges (Fira Code)
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'AAIOINC — Agentic AI Optimization Platform',
  description: 'One platform for every AI tool. Free GEO optimizer, content humanizer, niche research, LLM cost comparison, and managed agentic AI services.',
  generator: 'v0.app',
  keywords: [
    'agentic AI',
    'GEO optimization',
    'AI SEO',
    'content humanizer',
    'MCP agents',
    'AI tools',
    'prompt library',
    'niche research',
  ],
  authors: [{ name: 'AAIOINC', url: 'https://aaioinc.com' }],
  creator: 'AAIOINC',
  publisher: 'AAIOINC',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aaioinc.com',
    siteName: 'AAIOINC',
    title: 'AAIOINC — Agentic AI Optimization Platform',
    description: 'One platform for every AI tool. Free GEO optimizer, content humanizer, niche research, LLM cost comparison, and managed agentic AI services.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AAIOINC - Agentic AI Optimization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AAIOINC — Agentic AI Optimization Platform',
    description: 'One platform for every AI tool. 14 free tools, 6 managed services.',
    images: ['/og-image.png'],
    creator: '@aaioinc',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://aaioinc.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${jakarta.variable} ${firaCode.variable} bg-background`}>
      <head>
        {/*
          Inline script: reads localStorage before first paint to avoid
          the dark→light flash on page load. Must be render-blocking.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('aaio-theme');
                  if (t === 'light') {
                    document.documentElement.classList.add('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground theme-transition">
        {/* Accessibility: Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          {children}
          <CommandPalette />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
