import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cards',
  description: 'Get cards',
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
