import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DrawerMenu } from '@/components/DrawerMenu/DrawerMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Time Plus',
  description: 'Gerenciamento de hora extra',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <header className="fixed left-0 top-0 z-50 flex w-full items-center bg-slate-600 px-4 py-2">
          <DrawerMenu />
        </header>
        <main className="pt-14">{children}</main>
      </body>
    </html>
  )
}
