import { Outfit } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/layout/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata = {
  title: "UniFlow | Campus Event Discovery",
  description: "Discover campus events tailored to your interests.",
};

import ScrollToTop from "@/components/layout/ScrollToTop";

// ... existing imports

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased bg-background text-foreground overflow-x-hidden`}>
        <StoreProvider>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
