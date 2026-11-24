import type { Metadata } from "next";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/900.css";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: {
    default: "گیمزل | فروشگاه اکانت بازی",
    template: "%s | گیمزل",
  },
  description:
    "گیمزل؛ فروشگاه اکانت‌های اورجینال بازی — دوتا ۲، GTA V، FC27 و ده‌ها بازی دیگر با تحویل فوری و ضمانت.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="fa" dir="rtl">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header user={user ? { name: user.name, role: user.role } : null} />
          <main className="flex-1">{children}</main>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
