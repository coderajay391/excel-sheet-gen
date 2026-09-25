import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Offline Excel Guider - Cross-Platform Spreadsheet Architect',
  description: 'Generate, structure, and edit production-grade Excel sheets offline for any project on Windows, macOS, and Linux without internet.',
  openGraph: {
    title: 'Offline Excel Guider - Cross-Platform Spreadsheet Architect',
    description: 'Generate, structure, and edit production-grade Excel sheets offline for any project on Windows, macOS, and Linux without internet.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Offline Excel Guider - Cross-Platform Spreadsheet Architect',
    description: 'Generate, structure, and edit production-grade Excel sheets offline for any project on Windows, macOS, and Linux without internet.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
