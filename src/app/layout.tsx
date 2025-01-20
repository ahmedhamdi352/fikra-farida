import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Fikra Farida",
  description: "Communication between people easily and in the fastest way",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
