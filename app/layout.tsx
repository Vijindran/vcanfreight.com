import type { Metadata } from "next";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import I18nProvider from "@/components/I18nProvider";
import FloatingMenu from "@/components/FloatingMenu";
import ChatSupport from "@/components/ChatSupport";

export const metadata: Metadata = {
  title: "VCANFreight - Global Logistics Partner | FCL LCL Container Shipping",
  description: "Ship FCL and LCL containers worldwide with real-time freight rates. Professional international freight forwarding, airfreight services, and global container shipping solutions for businesses of all sizes. Instant booking, transparent pricing, and 24/7 support.",
  keywords: "FCL shipping, LCL shipping, container shipping, international freight forwarding, airfreight, global logistics, freight rates, ocean freight, cargo shipping, warehouse shipping, supply chain, customs clearance, intermodal transportation, freight consolidation, project cargo",
  openGraph: {
    title: "VCANFreight - Global Logistics Partner",
    description: "Professional international freight forwarding and container shipping services. Real-time rates, instant booking, and reliable delivery worldwide.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Theme Script - Prevents Flash of Wrong Theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  var root = document.documentElement;
                  
                  // Remove all theme classes from root
                  root.classList.remove('light', 'dark');
                  
                  // Add the correct theme to root
                  root.classList.add(theme);
                  root.setAttribute('data-theme', theme);
                } catch (e) {
                  // Fallback to light if error
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "VCANFreight",
              "description": "Global logistics partner providing FCL, LCL, and airfreight shipping services worldwide",
              "url": "https://vcanfreight.com",
              "logo": "https://vcanfreight.com/images/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "vg@vcanresources.com",
                "contactType": "Customer Service"
              },
              "sameAs": [],
              "offers": {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "International Freight Forwarding",
                  "description": "FCL, LCL, and airfreight shipping services with real-time rates and instant booking"
                }
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "serviceType": "Freight Forwarding",
              "provider": {
                "@type": "Organization",
                "name": "VCANFreight"
              },
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Shipping Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "FCL Container Shipping"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "LCL Container Shipping"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Airfreight Services"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body
        className="antialiased font-sans"
      >
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              <BookingProvider>
                {children}
                {/* Global Components */}
                <FloatingMenu />
                <ChatSupport />
              </BookingProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
