import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/sessionWrapper";
import { ThemeProviders } from "./themeProviders";
import Footer from "@/components/footer";


export const metadata: Metadata = {
  title: "Gitfull",
  description: "Turn your git repos into social media engagement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SessionWrapper>
          <ThemeProviders>
            <div className="relative">
              
              {children}
              <Footer />

            </div>
          </ThemeProviders>
        </SessionWrapper>
      </body>
    </html >
  );
}
