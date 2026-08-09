import "./globals.css";

export const metadata = {
  title: "BEE GIRL Shopping",
  description: "BEE GIRL Shopping - Women's Fashion"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
