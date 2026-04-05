import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { PublicShell } from "@/components/PublicShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://phucuongthinh.vn"),
  title: "Phú Cường Thịnh - Kiến tạo không gian sống",
  description:
    "Đơn vị tiên phong trong ngành VLXD hoàn thiện về gạch khổ lớn và thiết bị vệ sinh/bếp kháng khuẩn.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon.png", sizes: "128x128", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    images: [
      {
        url: "/dacuon.png",
        alt: "Phú Cường Thịnh",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "Công ty TNHH MTV TM Phú Cường Thịnh",
    image: "https://phucuongthinh.vn/dacuon.png",
    "@id": "https://phucuongthinh.vn",
    url: "https://phucuongthinh.vn",
    telephone: "0901234567",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Đường Lê Lợi, P. Phú Cường",
      addressLocality: "Thủ Dầu Một",
      addressRegion: "Bình Dương",
      postalCode: "75000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.98,
      longitude: 106.65,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "07:30",
        closes: "17:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
    sameAs: [
      "https://facebook.com/phucuongthinh",
      "https://zalo.me/0901234567",
    ],
  };

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="relative">
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
      </body>
    </html>
  );
}
