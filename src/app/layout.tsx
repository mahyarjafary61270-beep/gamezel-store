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

const SITE_TITLE = "گیمزل | فروشگاه اکانت بازی";
const SITE_DESCRIPTION =
  "گیمزل؛ فروشگاه اکانت‌های اورجینال بازی — دوتا ۲، GTA V، FC27 و ده‌ها بازی دیگر با تحویل فوری و ضمانت.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | گیمزل",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
