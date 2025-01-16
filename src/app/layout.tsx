import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";


import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "./_components/NavBar";
import { Toaster } from "~/components/ui/toaster";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "TCG Tools",
  description: "The ultimate companion app for One Piece Trading Card Game players and collectors, offering analytics, deckbuilding, price tracking, and meta insights",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NavBar />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
