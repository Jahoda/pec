import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pec Monitor",
  description: "Monitorování pece v reálném čase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
