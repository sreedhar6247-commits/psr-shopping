import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bee Girl Shopping",
  description: "Women's Clothing",
  verification: {
    google: "PASTE_YOUR_GOOGLE_CODE_HERE",
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
