import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Rəşidoğlu İnşaat MMC",
  description:
    "Rəşidoğlu İnşaat MMC müştərilərinə bir ünvandan tam və etibarlı tikinti məhsulları təqdim edir. Construction company website",
  icons: {
    icon: "/images/logo.gif",
    shortcut: "/images/logo.gif",
    apple: "/images/logo.gif",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
