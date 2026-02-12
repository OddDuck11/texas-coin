import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Texas Coin (TEXAS) - Official Website',
  description: 'Texas Coin - A cryptocurrency built for Texans. Track deployment, connect your wallet, and manage your TEXAS tokens.',
  keywords: ['Texas Coin', 'TEXAS', 'cryptocurrency', 'ERC-20', 'Ethereum', 'blockchain'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
