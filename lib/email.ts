// Email service for sending automated emails
// Using Resend API (https://resend.com)
import type { CloudflareEnv } from './cloudflare';

const RESEND_API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.RESEND_API_KEY : undefined;
const FROM_EMAIL = 'VCANFreight <noreply@vcanfreight.com>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions, env?: CloudflareEnv): Promise<boolean> {
  const apiKey = env?.RESEND_API_KEY || RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - email not sent');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', error);
      return false;
    }

    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendWelcomeEmail(name: string, email: string, env?: CloudflareEnv): Promise<boolean> {
  const subject = 'Welcome to VCANFreight - Your Global Logistics Partner! 🚢';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f7f8;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1973f0 0%, #0d47a1 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🚢 VCANFreight</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Global Logistics, Simplified</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #111418; margin: 0 0 20px 0; font-size: 24px;">Welcome aboard, ${name}! 🎉</h2>
      
      <p style="color: #60728a; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for joining VCANFreight! We're excited to have you as part of our global logistics community.
      </p>
      
      <p style="color: #60728a; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        With VCANFreight, you can:
      </p>
      
      <ul style="color: #60728a; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
        <li>📦 Book FCL & LCL container shipments instantly</li>
        <li>✈️ Arrange airfreight for urgent deliveries</li>
        <li>💰 Get real-time competitive freight rates</li>
        <li>📍 Track your shipments in real-time</li>
        <li>🌍 Ship to 180+ countries worldwide</li>
      </ul>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://vcanfreight.com/booking" style="display: inline-block; background: #1973f0; color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px;">
          Start Your First Booking →
        </a>
      </div>
      
      <!-- Support Info -->
      <div style="background: #f6f7f8; border-radius: 12px; padding: 20px; margin-top: 30px;">
        <h3 style="color: #111418; margin: 0 0 15px 0; font-size: 16px;">Need Help? We're Here for You!</h3>
        <p style="color: #60728a; font-size: 14px; line-height: 1.6; margin: 0;">
          📞 US: <a href="tel:+12513166847" style="color: #1973f0;">+1 (251) 316-6847</a><br>
          📞 UK: <a href="tel:+447476991927" style="color: #1973f0;">+44 7476 991927</a><br>
          ✉️ Email: <a href="mailto:vg@vcanresources.com" style="color: #1973f0;">vg@vcanresources.com</a>
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 30px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 10px 0;">© 2024 VCANFreight. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://vcanfreight.com" style="color: #1973f0; text-decoration: none;">vcanfreight.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Welcome to VCANFreight, ${name}!

Thank you for joining VCANFreight! We're excited to have you as part of our global logistics community.

With VCANFreight, you can:
- Book FCL & LCL container shipments instantly
- Arrange airfreight for urgent deliveries
- Get real-time competitive freight rates
- Track your shipments in real-time
- Ship to 180+ countries worldwide

Start your first booking: https://vcanfreight.com/booking

Need Help? We're Here for You!
US: +1 (251) 316-6847
UK: +44 7476 991927
Email: vg@vcanresources.com

© 2024 VCANFreight
https://vcanfreight.com
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  }, env);
}

/**
 * Send booking notification to owner/admin
 */
export async function sendOwnerBookingNotification(bookingData: {
  bookingId: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  origin: string;
  destination: string;
  bookingType: string;
  carrier?: string;
  price?: number;
  currency?: string;
  equipment?: string;
  commodity?: string;
  weight?: number;
  readyDate?: string;
}, env?: CloudflareEnv): Promise<boolean> {
  const subject = `🚨 New Booking: ${bookingData.bookingNumber} - ${bookingData.origin} → ${bookingData.destination}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f7f8;">
  <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">🚨 NEW BOOKING ALERT</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Action Required - Process This Booking</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #111418; margin: 0 0 20px 0; font-size: 20px;">Booking Reference: ${bookingData.bookingNumber}</h2>
      
      <!-- Customer Info -->
      <div style="background: #f0f9ff; border-left: 4px solid #1973f0; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
        <h3 style="color: #111418; margin: 0 0 10px 0; font-size: 16px;">👤 Customer Information</h3>
        <p style="color: #60728a; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong>Name:</strong> ${bookingData.customerName}<br>
          <strong>Email:</strong> <a href="mailto:${bookingData.customerEmail}" style="color: #1973f0;">${bookingData.customerEmail}</a>
        </p>
      </div>
      
      <!-- Shipment Details -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
        <h3 style="color: #111418; margin: 0 0 10px 0; font-size: 16px;">📦 Shipment Details</h3>
        <table style="width: 100%; color: #60728a; font-size: 14px; line-height: 1.8;">
          <tr>
            <td style="padding: 4px 0;"><strong>Type:</strong></td>
            <td>${bookingData.bookingType}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Origin:</strong></td>
            <td>${bookingData.origin}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Destination:</strong></td>
            <td>${bookingData.destination}</td>
          </tr>
          ${bookingData.equipment ? `
          <tr>
            <td style="padding: 4px 0;"><strong>Equipment:</strong></td>
            <td>${bookingData.equipment}</td>
          </tr>
          ` : ''}
          ${bookingData.commodity ? `
          <tr>
            <td style="padding: 4px 0;"><strong>Commodity:</strong></td>
            <td>${bookingData.commodity}</td>
          </tr>
          ` : ''}
          ${bookingData.weight ? `
          <tr>
            <td style="padding: 4px 0;"><strong>Weight:</strong></td>
            <td>${bookingData.weight} kg</td>
          </tr>
          ` : ''}
          ${bookingData.readyDate ? `
          <tr>
            <td style="padding: 4px 0;"><strong>Ready Date:</strong></td>
            <td>${bookingData.readyDate}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <!-- Pricing Info -->
      ${bookingData.carrier && bookingData.price ? `
      <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
        <h3 style="color: #111418; margin: 0 0 10px 0; font-size: 16px;">💰 Selected Quote</h3>
        <p style="color: #60728a; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong>Carrier:</strong> ${bookingData.carrier}<br>
          <strong>Price:</strong> ${bookingData.currency || 'USD'} $${bookingData.price.toFixed(2)}
        </p>
      </div>
      ` : ''}
      
      <!-- Action Required -->
      <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 25px; border-radius: 8px;">
        <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">⚠️ Action Required</h3>
        <p style="color: #60728a; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
          Please confirm this booking with ${bookingData.carrier || 'the carrier'} as soon as possible.
        </p>
        <ol style="color: #60728a; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Contact ${bookingData.carrier || 'carrier'} booking department</li>
          <li>Provide shipment details and get carrier booking number</li>
          <li>Update booking status in admin dashboard</li>
          <li>Send confirmation email to customer</li>
        </ol>
      </div>
      
      <!-- CTA Buttons -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="https://vcanfreight.com/admin/bookings/${bookingData.bookingId}" style="display: inline-block; background: #1973f0; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 14px; margin: 0 5px;">
          View in Dashboard →
        </a>
        <a href="mailto:${bookingData.customerEmail}" style="display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 14px; margin: 0 5px;">
          Email Customer →
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">This is an automated notification from VCANFreight booking system</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NEW BOOKING ALERT - Action Required

Booking Reference: ${bookingData.bookingNumber}

CUSTOMER INFORMATION:
Name: ${bookingData.customerName}
Email: ${bookingData.customerEmail}

SHIPMENT DETAILS:
Type: ${bookingData.bookingType}
Origin: ${bookingData.origin}
Destination: ${bookingData.destination}
${bookingData.equipment ? `Equipment: ${bookingData.equipment}` : ''}
${bookingData.commodity ? `Commodity: ${bookingData.commodity}` : ''}
${bookingData.weight ? `Weight: ${bookingData.weight} kg` : ''}
${bookingData.readyDate ? `Ready Date: ${bookingData.readyDate}` : ''}

${bookingData.carrier && bookingData.price ? `
SELECTED QUOTE:
Carrier: ${bookingData.carrier}
Price: ${bookingData.currency || 'USD'} $${bookingData.price.toFixed(2)}
` : ''}

ACTION REQUIRED:
1. Contact ${bookingData.carrier || 'carrier'} booking department
2. Provide shipment details and get carrier booking number
3. Update booking status in admin dashboard
4. Send confirmation email to customer

View booking: https://vcanfreight.com/admin/bookings/${bookingData.bookingId}
  `;

  // Send to owner email
  return sendEmail({
    to: 'vg@vcanresources.com', // Your email
    subject,
    html,
    text,
  }, env);
}

/**
 * Send booking confirmation to customer
 */
export async function sendCustomerBookingConfirmation(bookingData: {
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  origin: string;
  destination: string;
  bookingType: string;
  carrier?: string;
  price?: number;
  currency?: string;
}, env?: CloudflareEnv): Promise<boolean> {
  const subject = `Booking Confirmation - ${bookingData.bookingNumber}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f7f8;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1973f0 0%, #0d47a1 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">✅ Booking Received!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">We're processing your shipment</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #111418; margin: 0 0 20px 0; font-size: 24px;">Thank you, ${bookingData.customerName}!</h2>
      
      <p style="color: #60728a; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Your booking has been successfully received and is being processed by our team.
      </p>
      
      <!-- Booking Details -->
      <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #111418; margin: 0 0 15px 0; font-size: 18px;">📋 Booking Details</h3>
        <table style="width: 100%; color: #60728a; font-size: 15px; line-height: 1.8;">
          <tr>
            <td style="padding: 6px 0;"><strong>Reference:</strong></td>
            <td style="color: #1973f0; font-weight: bold;">${bookingData.bookingNumber}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;"><strong>Type:</strong></td>
            <td>${bookingData.bookingType}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;"><strong>Route:</strong></td>
            <td>${bookingData.origin} → ${bookingData.destination}</td>
          </tr>
          ${bookingData.carrier ? `
          <tr>
            <td style="padding: 6px 0;"><strong>Carrier:</strong></td>
            <td>${bookingData.carrier}</td>
          </tr>
          ` : ''}
          ${bookingData.price ? `
          <tr>
            <td style="padding: 6px 0;"><strong>Price:</strong></td>
            <td>${bookingData.currency || 'USD'} $${bookingData.price.toFixed(2)}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 6px 0;"><strong>Status:</strong></td>
            <td style="color: #f59e0b; font-weight: bold;">⏳ Being Processed</td>
          </tr>
        </table>
      </div>
      
      <!-- What's Next -->
      <div style="background: #dcfce7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #111418; margin: 0 0 15px 0; font-size: 18px;">🚀 What Happens Next?</h3>
        <ol style="color: #60728a; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Our team will confirm your booking with the carrier</li>
          <li>You'll receive a confirmation email within 24 hours</li>
          <li>We'll provide you with tracking details once available</li>
          <li>You can track your shipment in real-time on our platform</li>
        </ol>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://vcanfreight.com/dashboard" style="display: inline-block; background: #1973f0; color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px;">
          View My Bookings →
        </a>
      </div>
      
      <!-- Support Info -->
      <div style="background: #f6f7f8; border-radius: 12px; padding: 20px; margin-top: 30px;">
        <h3 style="color: #111418; margin: 0 0 15px 0; font-size: 16px;">Need Help? We're Here!</h3>
        <p style="color: #60728a; font-size: 14px; line-height: 1.6; margin: 0;">
          📞 US: <a href="tel:+12513166847" style="color: #1973f0;">+1 (251) 316-6847</a><br>
          📞 UK: <a href="tel:+447476991927" style="color: #1973f0;">+44 7476 991927</a><br>
          ✉️ Email: <a href="mailto:vg@vcanresources.com" style="color: #1973f0;">vg@vcanresources.com</a>
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 30px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 10px 0;">© 2024 VCANFreight. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://vcanfreight.com" style="color: #1973f0; text-decoration: none;">vcanfreight.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
BOOKING CONFIRMATION

Thank you, ${bookingData.customerName}!

Your booking has been successfully received and is being processed by our team.

BOOKING DETAILS:
Reference: ${bookingData.bookingNumber}
Type: ${bookingData.bookingType}
Route: ${bookingData.origin} → ${bookingData.destination}
${bookingData.carrier ? `Carrier: ${bookingData.carrier}` : ''}
${bookingData.price ? `Price: ${bookingData.currency || 'USD'} $${bookingData.price.toFixed(2)}` : ''}
Status: Being Processed

WHAT HAPPENS NEXT?
1. Our team will confirm your booking with the carrier
2. You'll receive a confirmation email within 24 hours
3. We'll provide you with tracking details once available
4. You can track your shipment in real-time on our platform

View your bookings: https://vcanfreight.com/dashboard

NEED HELP?
US: +1 (251) 316-6847
UK: +44 7476 991927
Email: vg@vcanresources.com

© 2024 VCANFreight
https://vcanfreight.com
  `;

  return sendEmail({
    to: bookingData.customerEmail,
    subject,
    html,
    text,
  }, env);
}

