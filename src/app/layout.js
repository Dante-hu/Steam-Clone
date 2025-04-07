import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './lib/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Steam Clone',
  description: 'A Steam store clone built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
