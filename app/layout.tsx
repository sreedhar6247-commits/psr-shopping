import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEE GIRL Shopping",
  description: "Shop women's clothes online at BEE GIRL Shopping.",
  verification: {
    google: "xiC2GuXgH7p_ucrAS1wJTvlQBao9sj7cfUteihTeCmw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
