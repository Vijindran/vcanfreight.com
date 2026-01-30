'use client';
import { useState, useEffect } from 'react';

// 25 SEO-focused messages about services (rotates every 4 seconds)
const seoServiceMessages = [
  "Ship FCL containers worldwide with real-time freight rates and instant booking",
  "Book LCL shipments for smaller cargo volumes with competitive pricing and fast transit",
  "Airfreight services for urgent deliveries with same-day booking and real-time tracking",
  "Express air cargo shipping for time-critical shipments with next-day delivery options",
  "International airfreight forwarding with direct flights and priority handling",
  "Air cargo services for perishable goods, electronics, and high-value shipments",
  "Global airfreight solutions connecting major airports worldwide with competitive rates",
  "Same-day airfreight booking with instant confirmation and 24/7 customer support",
  "Air cargo shipping for urgent business needs with guaranteed transit times",
  "Express airfreight services for documents, samples, and time-sensitive packages",
  "International airfreight forwarding with customs clearance and door-to-door delivery",
  "Air cargo solutions for e-commerce, pharmaceuticals, and temperature-sensitive goods",
  "Priority airfreight services with dedicated handling and expedited clearance",
  "Global container shipping from major ports with transparent pricing and no hidden fees",
  "Ocean freight solutions for FCL and LCL shipments with 24/7 customer support",
  "Reliable container shipping services with real-time rate quotes and instant confirmation",
  "Professional logistics services for import and export businesses worldwide",
  "Cost-effective shipping solutions for small and large businesses with flexible payment options",
  "Secure cargo transportation with full insurance coverage and end-to-end tracking",
  "Multi-modal transportation combining sea, air, and land freight for optimal routes",
  "Customs clearance assistance and documentation support for hassle-free shipping",
  "Warehouse-to-warehouse shipping services with door-to-door delivery options",
  "Bulk shipping solutions for large volume shipments with volume discounts",
  "Temperature-controlled shipping for perishable goods and sensitive cargo",
  "Digital freight marketplace connecting shippers with verified carriers worldwide"
];

// 25 Emotional/compelling messages to capture hearts (rotates every 6 seconds)
const emotionalMessages = [
  "Your dream shipment, our promise. From urgent airfreight to warehouse-scale operations, we make global shipping possible",
  "When time is critical, we deliver. Airfreight services that understand your urgency and your business dreams",
  "Every big business started with a first shipment. We're here for your first air cargo, and your thousandth container",
  "Whether you're shipping urgent documents by air or managing warehouse operations, your cargo matters to us",
  "Big dreams deserve reliable shipping. From express airfreight to ocean containers, we turn logistics challenges into solutions",
  "Your warehouse operations deserve logistics partners who understand urgency, precision, and scale—by air, sea, or land",
  "Small businesses, big ambitions. We make international shipping accessible—from air cargo to full container loads",
  "Every shipment tells a story. We ensure yours reaches its destination safely and on time, whether by air or sea",
  "Building bridges between your business and global markets, one airfreight shipment and container at a time",
  "Your success is our mission. We handle the logistics—from urgent air cargo to bulk ocean freight—so you can focus on growth",
  "Dreaming of expanding globally? We make it happen with reliable airfreight and container shipping solutions",
  "From your first urgent air shipment to managing complex supply chains, we're with you every step of the journey",
  "Big warehouses trust us. Small businesses love us. Your shipping partner for airfreight, FCL, and LCL",
  "Your cargo isn't just boxes—it's your business, your reputation, your dreams. We treat airfreight and containers that way",
  "Whether you're shipping one urgent package by air or a hundred containers by sea, every shipment gets our full attention",
  "Making global trade accessible. Your small business deserves the same shipping excellence—by air or ocean—as the big players",
  "We understand the pressure of warehouse operations. That's why we deliver reliability you can count on, from air to sea",
  "Your first international shipment shouldn't be complicated. We make airfreight and container shipping simple and affordable",
  "From ambitious startups to established enterprises, we provide shipping solutions—air, sea, and land—that scale with you",
  "Every business owner dreams of going global. We're here to make that dream a reality with airfreight and ocean freight",
  "Your warehouse efficiency matters. Our airfreight and container shipping solutions integrate seamlessly with your operations",
  "Small shipments by air, big containers by sea. We believe every business deserves world-class logistics support",
  "Building trust, one shipment at a time. From urgent air cargo to full container loads, we deliver your dreams",
  "Your logistics challenges are our opportunities to shine. We solve problems—by air or sea—before they become crises",
  "Whether you're a solo entrepreneur shipping by air or managing a distribution center with containers, we're your trusted partner"
];

interface RotatingSEOMessagesProps {
  className?: string;
}

export default function RotatingSEOMessages({ className = '' }: RotatingSEOMessagesProps) {
  const [seoIndex, setSeoIndex] = useState(0);
  const [emotionalIndex, setEmotionalIndex] = useState(0);

  // Rotate SEO messages every 4 seconds
  useEffect(() => {
    const seoInterval = setInterval(() => {
      setSeoIndex((prev) => (prev + 1) % seoServiceMessages.length);
    }, 4000);

    return () => clearInterval(seoInterval);
  }, []);

  // Rotate emotional messages every 6 seconds
  useEffect(() => {
    const emotionalInterval = setInterval(() => {
      setEmotionalIndex((prev) => (prev + 1) % emotionalMessages.length);
    }, 6000);

    return () => clearInterval(emotionalInterval);
  }, []);

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* SEO Service Messages - 4 second rotation */}
      <div className="text-center min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center">
        <p 
          key={seoIndex}
          className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed px-4 animate-fade-in"
          style={{
            animation: 'fadeIn 0.5s ease-in-out'
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {seoServiceMessages[seoIndex]}
        </p>
      </div>

      {/* Emotional Messages - 6 second rotation */}
      <div className="text-center min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem] flex items-center justify-center">
        <p 
          key={emotionalIndex}
          className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 font-semibold leading-relaxed px-4 animate-fade-in"
          style={{
            animation: 'fadeIn 0.5s ease-in-out'
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {emotionalMessages[emotionalIndex]}
        </p>
      </div>
    </div>
  );
}

