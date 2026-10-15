import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { Assistant } from "@/components/ai/assistant";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingActions } from "@/components/layout/floating-actions";
import { RESTAURANT } from "@/data/catalog";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display-next",
  style: ["normal", "italic"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-next",
});

export const metadata: Metadata = {
  title: {
    default: "Koreyaki Indiranagar | Authentic Korean Restaurant in Bengaluru",
    template: "%s · Koreyaki",
  },
  description:
    "Authentic Korean food in Indiranagar, Bengaluru. Explore Koreyaki's menu in 3D, customize published options, and order via WhatsApp.",
};

export const viewport = {
  themeColor: "#D32F2F",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT.name,
    telephone: RESTAURANT.phone,
    email: RESTAURANT.email,
    url: RESTAURANT.siteUrl,
    servesCuisine: "Korean",
    priceRange: RESTAURANT.priceRange,
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT.address.line2,
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560008",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: RESTAURANT.geo.lat,
      longitude: RESTAURANT.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "13:30",
      closes: "22:30",
    },
  };

  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} bg-[#0F0F10] text-[#F5F5F5] antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SiteHeader />
        {children}
        <SiteFooter />
        <FloatingActions />
        <Assistant />
      </body>
    </html>
  );
}
