import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/sessionWrapper";
import { ThemeProviders } from "./themeProviders";
import dynamic from "next/dynamic";
import Footer from "@/components/footer";
import { Bounce, ToastContainer } from "react-toastify";


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
      <body className="antialiased" suppressHydrationWarning>
        <SessionWrapper>
          <ThemeProviders>
          <ToastContainer
                position="top-left"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Bounce}
            />
            {children}
            <div suppressHydrationWarning>
            <Footer />
            </div>
          </ThemeProviders>
        </SessionWrapper>
      </body>
    </html >
  );
}
