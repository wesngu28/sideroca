import Script from 'next/script'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cards Queries',
  description: 'Queries for the NationStates trading card game',
  openGraph: {
    title: 'Cards Queries',
    description: 'Queries for the NationStates trading card game',
    url: process.env.NEXT_PUBLIC_SITE,
    siteName: 'Card Queries',
    locale: 'en_US',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head><Script async src="https://nakiri.vercel.app/script.js" data-website-id="9ec15190-e6d0-43fe-a366-b99ffba27425" /></head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
