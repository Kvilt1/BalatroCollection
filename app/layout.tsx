import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { FavoritesProvider } from "@/contexts/favorites-context"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = 'force-static'
export const revalidate = false

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  )
}

