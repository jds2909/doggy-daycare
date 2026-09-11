import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doggy Day Care & Home Boarding | Launceston, Cornwall",
  description:
    "Friendly, fully insured home-based doggy day care and boarding in Launceston, Cornwall.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
