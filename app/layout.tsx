import "./globals.css";

export const metadata = {
  title: "BeeGirl Shopping",
  description: "Women's Fashion",
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
