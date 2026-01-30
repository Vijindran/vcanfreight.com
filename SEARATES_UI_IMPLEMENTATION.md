# SeaRates UI/UX Implementation Guide

## Overview
Your VCANFreight application has been updated to follow the SeaRates design pattern and user experience. This document outlines all the changes made and how to use the new components.

## New Components Created

### 1. **SeaRatesStyleSearch** (`components/SeaRatesStyleSearch.tsx`)
A complete reimplementation of the main search/quote page following SeaRates' design.

**Features:**
- Hero headline: "Find the best Freight Quote"
- Tab navigation (RATES, TRACKING, SCHEDULES, REQUEST A QUOTE)
- Search form with:
  - Origin field with city/port/terminal suggestions
  - Destination field with suggestions
  - Departure date picker
  - Container type selector (FCL-20ST, FCL-40ST, FCL-40HC, LCL, AIR)
- Search button with loading state
- Special Offers section showing:
  - Container type
  - Destination
  - Starting price in USD

**Usage:**
The component is now integrated into your home page. Users click "Get Started" to access the search interface.

### 2. **OrderSummary** (`components/OrderSummary.tsx`)
A sticky sidebar component showing the booking summary and total price.

**Features:**
- Route information (departure/arrival)
- Shipping details (mode, date, carrier, container)
- Price breakdown section
- Total price display
- "Book now" button with reCAPTCHA notice
- Responsive design (sticky on desktop, scrollable on mobile)

**Data Displayed:**
- Departure and arrival cities
- Transport mode (Sea, FCL)
- Ready to load date
- Carrier name
- Container configuration
- Itemized pricing
- Total quote price

### 3. **SeaRatesBookingDetails** (`components/SeaRatesBookingDetails.tsx`)
Main booking details page with two-column layout.

**Features:**
- Left column (main content):
  - Shipping details section with route visualization
  - Progress bar showing booking steps
  - Cargo details form with:
    - Product selection
    - Weight and container information
    - Cargo flags (hazardous, perishable, oversized, liquid)
    - Additional information textarea
  - Associated services checkboxes:
    - Insurance
    - Customs Clearance
    - Certification
    - Inspection services
  - Previous/Continue navigation buttons
  
- Right sidebar (sticky):
  - Order summary component
  - Fixed position for easy reference

**Layout:**
- Uses CSS Grid: 2 columns on desktop (2/3 + 1/3), 1 column on mobile
- Fully responsive with Tailwind breakpoints

## Updated Pages

### Home Page (`app/page.tsx`)
- Integrated SeaRates search toggle
- "Get Started" button now shows the search interface
- Maintained existing login/guest access options

### New Booking Page (`app/booking-searates/page.tsx`)
- Uses SeaRates booking details layout
- Integrated with existing BookingContext
- Responsive design with sidebar

## Design Pattern Details

### Tab Navigation
```
┌─────────────────────────────────────┐
│ RATES | TRACKING | SCHEDULES | ... │
└─────────────────────────────────────┘
```
Styled as toggle buttons with active state (blue background for selected tab)

### Search Form Grid
- **Desktop**: 4 columns (origin, destination, date, container)
- **Tablet**: 2 columns
- **Mobile**: 1 column

### Color Scheme
- **Primary**: Blue-600 for buttons and highlights
- **Secondary**: Slate for text and borders
- **Backgrounds**: White/light, dark mode: slate-800/900

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md)
- Desktop: > 1024px (lg)

## Integration with Existing Code

### Context Usage
Both new components use:
- `useBooking()` - Access booking state and update functions
- `useAuth()` - Check user authentication
- `useTranslation()` - i18n support

### Styling
- Uses Tailwind CSS (existing setup)
- Includes Material Symbols icons
- Dark mode support via `dark:` prefix
- Responsive design with proper spacing

## API Integration Points

The search component expects:
- `/api/rates` endpoint with origin/destination parameters
- Carrier data with pricing and transit times
- Port/city suggestion data

The booking details component works with:
- Product selection from catalogue
- Cargo classification system
- Associated services pricing

## Customization Guide

### Modify Special Offers
Edit the offers array in `SeaRatesStyleSearch.tsx`:
```tsx
const offers = [
  { dest: 'Your City', type: 'FCL - 20\'ST', price: 1200, from: true },
  // Add more...
];
```

### Update Ports/Suggestions
Modify the `ports` array in `SeaRatesStyleSearch.tsx`:
```tsx
const ports = [
  { name: 'Port Name', type: 'Port/City/Airport', icon: '📍' },
  // Add more...
];
```

### Change Service Options
Edit services in `SeaRatesBookingDetails.tsx`:
```tsx
const [services, setServices] = useState({
  insurance: false,
  customsClearance: false,
  certification: false,
  inspectionServices: false,
  // Add more services
});
```

## Mobile Responsiveness

All components are fully responsive:
- **OrderSummary**: Sticky on desktop, scrolls on mobile
- **SeaRatesBookingDetails**: Single column on mobile, side-by-side on desktop
- **Search Form**: Adapts from 4 to 2 to 1 column based on screen size
- **Buttons**: Full-width on mobile, proper sizing on desktop

## Next Steps

1. **Connect to Real API**: Update the SeaRates API endpoints in the search component
2. **Add More Services**: Expand the associated services list as needed
3. **Implement Payment Flow**: Connect to your Stripe integration for checkout
4. **Add Tracking Integration**: Implement the TRACKING tab functionality
5. **Configure Schedules**: Build the SCHEDULES tab with schedule data

## Files Modified
- `app/page.tsx` - Added SeaRates search toggle
- `components/SeaRatesStyleSearch.tsx` - NEW
- `components/OrderSummary.tsx` - NEW
- `components/SeaRatesBookingDetails.tsx` - NEW
- `app/booking-searates/page.tsx` - NEW

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Notes
- Proper heading hierarchy (h1, h2, h3)
- Button labels and ARIA attributes
- Keyboard navigation support
- Color contrast compliant
- Form labels associated with inputs

## Performance Considerations
- Components are code-split and lazy loadable
- Images use proper loading attributes
- Sticky position performance optimized
- Responsive grid prevents layout shifts

## Future Enhancements
- Add progress indicator for multi-step booking
- Implement real-time rate updates
- Add booking history from API
- Integrate document upload for cargo details
- Add live chat support
- Implement rate comparison view
