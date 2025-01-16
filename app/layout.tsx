import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'

const { jsx, jsxs } = React

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Presenters Timetable',
  description: 'Timetable for TV presenters across 12 stations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

