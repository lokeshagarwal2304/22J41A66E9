import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "URL Shortener - Shorten URLs with Analytics",
  description: "A comprehensive URL shortening service with real-time analytics and tracking",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


import './globals.css'