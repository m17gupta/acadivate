
import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/src/components/layout/AppShell';
import { Toaster } from 'sonner';
import { AnnoatationpluginHome } from '../components/annotationPlugin/AnnoatationpluginHome';



export const metadata: Metadata = {
  title: 'Acadivate',
  description: 'Acadivate Research & Innovation Foundation website',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="en">
      
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,700&family=Epilogue:wght@300;400;500;600;700;800&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
         
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
