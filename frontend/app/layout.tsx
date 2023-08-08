import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from './(components)/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sideroca - Card Queries',
  description: 'Streamlined Interactions and Dynamic Enhancements for Really Obtuse Cards Applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
        <Script async src="https://nakiri.vercel.app/script.js" data-website-id="9ec15190-e6d0-43fe-a366-b99ffba27425" />
      </head>
      <body className={`${inter.className} flex items-center flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
