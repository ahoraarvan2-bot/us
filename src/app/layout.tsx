import type { Metadata, Viewport } from "next";
import "./globals.css";
import { archivo } from "./fonts";
import { site } from "@/content/site";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ONYX Motor House | Beyond the drive",
    template: "%s | ONYX Motor House",
  },
  description: site.description,
  applicationName: site.fullName,
  openGraph: {
    type: "website",
    siteName: site.fullName,
    title: "ONYX Motor House | Beyond the drive",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "ONYX Motor House: a graphite Ferrari 458 Spider in a black studio" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-32.png", sizes: "32x32", type: "image/png" }], apple: "/apple-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: site.fullName,
  url: site.url,
  description: site.description,
  telephone: site.contact.phone,
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.street,
    addressLocality: site.contact.city,
    postalCode: site.contact.postcode,
    addressCountry: "GB",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.contact.lat, longitude: site.contact.lng },
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={archivo.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <PageTransition />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
