import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ConvexClientProvider from '@/components/context/ConvexClientProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Codenames in Convex HACKATHON',
  description: 'Application for WebDev Cody\'s hackathon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
            <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
