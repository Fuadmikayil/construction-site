import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rəşidoğlu İnşaat MMC",
  description:
    "Rəşidoğlu İnşaat MMC müştərilərinə bir ünvandan tam və etibarlı tikinti məhsulları təqdim edir.",
  metadataBase: new URL("https://residogluinsaat.com"),
  openGraph: {
    title: "Rəşidoğlu İnşaat MMC",
    description:
      "Rəşidoğlu İnşaat MMC müştərilərinə bir ünvandan tam və etibarlı tikinti məhsulları təqdim edir.",
    url: "https://residogluinsaat.com",
    siteName: "Rəşidoğlu İnşaat MMC",
   images: [
    {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Rəşidoğlu İnşaat MMC",
    },
    ],
    locale: "az_AZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
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
