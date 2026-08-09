import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bee Girl Shopping",
  description: "Women's Clothing",
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
      <body>{children}</body>
    </html>
  );
}
