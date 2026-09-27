import type { Metadata } from "next";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FAMZI — by Dfamiliz",
  description: "Order freshly prepared meals from Dfamiliz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}