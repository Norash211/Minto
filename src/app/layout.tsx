import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minto",
  description: "Un sistema financiero personal para entender tu dinero disponible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
