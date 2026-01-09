import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "../components/providers/Providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LoadingScreen } from "../components/LoadingScreen";


export const metadata: Metadata = {
  title: "SPECIFIC",
  description: "Luxury-tech mobile cases with premium protection.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white antialiased">
        <LoadingScreen />
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
