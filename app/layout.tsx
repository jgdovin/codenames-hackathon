import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ConvexClientProvider from '@/components/context/ConvexClientProvider';
import { GlobalStateProvider } from '@/components/context/GlobalState'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalStateProvider>
          <ClerkProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ClerkProvider>
        </GlobalStateProvider>
      </body>
    </html>
  )
}
