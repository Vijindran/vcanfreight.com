/**
 * Professional Email Templates for VCANFreight
 * Matches SeaRates styling and branding
 */

interface BookingEmailData {
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  origin: string;
  destination: string;
  containerType: string;
  noOfContainers: number;
  commodity: string;
  commodityDetails: string;
  cargoReadyDate: string;
  shippingType: string;
  totalAmount: number;
  validity: {
    from: string;
    to: string;
  };
  supportContact?: {
    name: string;
    email: string;
    title: string;
  };
}

/**
 * Email 1: Automatic Booking Confirmation Email
 * Sent from: no-reply@vcanfreight.com
 * Purpose: Confirm booking creation
 */
export function generateConfirmationEmail(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
        }
        .logo {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .booking-number {
            background-color: #f0f9ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .booking-number-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .booking-number-value {
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
        }
        .details {
            margin-top: 30px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
        }
        .detail-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: 600;
            text-align: right;
        }
        .route-info {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .route-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .route-item:last-child {
            margin-bottom: 0;
        }
        .city {
            font-weight: 600;
            color: #1f2937;
        }
        .arrow {
            color: #2563eb;
            font-weight: bold;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff;
            padding: 14px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            margin-top: 30px;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .next-steps {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            padding: 20px;
            margin-top: 30px;
        }
        .next-steps h3 {
            margin: 0 0 15px 0;
            color: #1e40af;
            font-size: 16px;
        }
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
            color: #1f2937;
        }
        .next-steps li {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
        }
        .footer-links {
            margin-bottom: 15px;
        }
        .footer-links a {
            color: #2563eb;
            text-decoration: none;
            margin: 0 10px;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">VCAN FREIGHT</div>
            <h1>Booking Confirmed!</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Dear ${data.customerName},</p>
            
            <p>Your booking has been successfully created in our system. Below is your booking confirmation details:</p>

            <!-- Booking Number -->
            <div class="booking-number">
                <div class="booking-number-label">Your Booking Number</div>
                <div class="booking-number-value">#${data.bookingNumber}</div>
            </div>

            <!-- Route Information -->
            <div class="route-info">
                <div class="route-item">
                    <span class="city">${data.origin}</span>
                    <span class="arrow">→</span>
                    <span class="city">${data.destination}</span>
                </div>
                <div style="color: #6b7280; font-size: 13px; margin-top: 10px;">
                    Shipping Type: <strong>${data.shippingType}</strong> | Container: <strong>${data.containerType}</strong>
                </div>
            </div>

            <!-- Booking Details -->
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">No. of Containers</span>
                    <span class="detail-value">${data.noOfContainers}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Commodity</span>
                    <span class="detail-value">${data.commodity} - ${data.commodityDetails}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cargo Readiness Date</span>
                    <span class="detail-value">${data.cargoReadyDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Quote Validity</span>
                    <span class="detail-value">${data.validity.from} to ${data.validity.to}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount</span>
                    <span class="detail-value" style="color: #2563eb; font-size: 16px;">USD $${data.totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>📋 What's Next?</h3>
                <ul>
                    <li>You will receive a detailed booking request from our support team shortly</li>
                    <li>Please provide shipper, consignee, and notify party details</li>
                    <li>Add any special instructions for cargo handling</li>
                    <li>We'll submit the booking to the carrier for final confirmation</li>
                </ul>
            </div>

            <center>
                <a href="https://vcanfreight.com/booking-confirmation" class="cta-button">View Booking Details</a>
            </center>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="https://vcanfreight.com">Home</a>
                <a href="https://vcanfreight.com">Blog</a>
                <a href="https://vcanfreight.com">Contacts</a>
            </div>
            <p>© 2026 VCAN FREIGHT. All rights reserved.</p>
            <p><a href="#" style="color: #2563eb; text-decoration: none;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
`;
}

/**
 * Email 2: Personalized Support Request Email
 * Sent from: support@vcanfreight.com (personalized contact)
 * Purpose: Request shipping instructions
 */
export function generateSupportEmail(data: BookingEmailData): string {
  const supportName = data.supportContact?.name || "Olena Pasku";
  const supportTitle = data.supportContact?.title || "Senior Booking Manager";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Request - Shipping Instructions Needed</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #ffffff;
            padding: 30px;
            border-bottom: 3px solid #2563eb;
        }
        .logo {
            font-size: 20px;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 20px;
        }
        .greeting-section {
            margin-bottom: 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 10px 0;
        }
        .signature {
            color: #6b7280;
            font-size: 14px;
        }
        .signature strong {
            color: #1f2937;
        }
        .content {
            padding: 30px;
        }
        .intro {
            color: #1f2937;
            font-size: 14px;
            line-height: 1.8;
            margin-bottom: 25px;
        }
        .request-section {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .request-section h3 {
            margin: 0 0 15px 0;
            color: #1e40af;
            font-size: 16px;
        }
        .request-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .request-list li {
            padding: 10px 0;
            border-bottom: 1px solid #bfdbfe;
            color: #1f2937;
            font-size: 14px;
        }
        .request-list li:last-child {
            border-bottom: none;
        }
        .request-list strong {
            color: #1e40af;
        }
        .booking-info {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 6px;
            margin: 25px 0;
        }
        .booking-info h4 {
            margin: 0 0 15px 0;
            color: #1f2937;
            font-size: 14px;
        }
        .booking-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 13px;
            border-bottom: 1px solid #e5e7eb;
        }
        .booking-row:last-child {
            border-bottom: none;
        }
        .booking-label {
            color: #6b7280;
            font-weight: 500;
        }
        .booking-value {
            color: #1f2937;
            font-weight: 600;
        }
        .cta-section {
            background-color: #f0fdf4;
            border: 2px solid #86efac;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff;
            padding: 12px 28px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .timeline {
            margin: 25px 0;
        }
        .timeline-item {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }
        .timeline-marker {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
            background-color: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
        .timeline-content {
            flex: 1;
        }
        .timeline-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .timeline-desc {
            font-size: 13px;
            color: #6b7280;
        }
        .footer {
            background-color: #f9fafb;
            padding: 25px 30px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
        .contact-info {
            background-color: #eff6ff;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .contact-info strong {
            color: #1e40af;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">VCAN FREIGHT</div>
            <div class="greeting-section">
                <p class="greeting">Dear ${data.customerName},</p>
                <p class="signature">Thank you for booking with VCAN Freight!</p>
                <p class="signature">This is <strong>${supportName}</strong> from VCAN Freight, and I will be assisting on your Booking <strong>#${data.bookingNumber}</strong>.</p>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="intro">For us to make sure you have everything to load the cargo on time, kindly provide below required booking information:</p>

            <!-- Request Section -->
            <div class="request-section">
                <h3>📋 Required Information:</h3>
                <ul class="request-list">
                    <li><strong>Shipper's Details:</strong> Full name, address, contact information</li>
                    <li><strong>Consignee's Details:</strong> Full name, address, contact information</li>
                    <li><strong>Notify Party:</strong> Party to be notified upon cargo arrival</li>
                    <li><strong>Special Instructions:</strong> Any special cargo handling requirements</li>
                </ul>
            </div>

            <p style="color: #1f2937; font-size: 14px; margin: 25px 0;">
                As an alternative, you can fill the details in your booking dashboard on the <strong>"Shipping Instructions"</strong> tab.
            </p>

            <!-- Booking Summary -->
            <div class="booking-info">
                <h4>📦 Your Booking Summary:</h4>
                <div class="booking-row">
                    <span class="booking-label">Shipping Type</span>
                    <span class="booking-value">${data.shippingType}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Container Type</span>
                    <span class="booking-value">${data.containerType}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">No. of Containers</span>
                    <span class="booking-value">${data.noOfContainers}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Commodity</span>
                    <span class="booking-value">${data.commodity}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Commodity Details</span>
                    <span class="booking-value">${data.commodityDetails}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Cargo Readiness Date</span>
                    <span class="booking-value">${data.cargoReadyDate}</span>
                </div>
                <div class="booking-row">
                    <span class="booking-label">Route</span>
                    <span class="booking-value">${data.origin} → ${data.destination}</span>
                </div>
            </div>

            <!-- Timeline -->
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-marker">✓</div>
                    <div class="timeline-content">
                        <div class="timeline-title">Booking Created</div>
                        <div class="timeline-desc">Your booking has been registered in our system</div>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker">2</div>
                    <div class="timeline-content">
                        <div class="timeline-title">Submit Details (You are here)</div>
                        <div class="timeline-desc">Provide shipping instructions and party details</div>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker">3</div>
                    <div class="timeline-content">
                        <div class="timeline-title">Carrier Confirmation</div>
                        <div class="timeline-desc">We'll submit to the carrier for final confirmation</div>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker">4</div>
                    <div class="timeline-content">
                        <div class="timeline-title">Cargo Loading</div>
                        <div class="timeline-desc">Your cargo will be loaded on the scheduled date</div>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="cta-section">
                <p style="margin: 0 0 15px 0; color: #1f2937; font-weight: 600;">Ready to move forward? Fill in your details now!</p>
                <a href="https://vcanfreight.com/booking-confirmation" class="cta-button">Provide Shipping Instructions</a>
            </div>

            <!-- Contact Info -->
            <div class="contact-info">
                <strong>${supportName}</strong><br>
                ${supportTitle}<br>
                VCAN Freight<br>
                <span style="color: #6b7280;">📧 shipping@vcanfreight.com</span><br>
                <span style="color: #6b7280;">📞 +1 (555) 123-4567</span>
            </div>

            <p style="color: #1f2937; font-size: 14px; line-height: 1.8;">
                Looking forward to hearing from you and building our future partnership.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2026 VCAN FREIGHT. All rights reserved.</p>
            <p style="margin: 0;">
                <a href="https://vcanfreight.com" style="color: #2563eb; text-decoration: none;">Home</a> •
                <a href="https://vcanfreight.com/blog" style="color: #2563eb; text-decoration: none;">Blog</a> •
                <a href="https://vcanfreight.com/contact" style="color: #2563eb; text-decoration: none;">Contacts</a> •
                <a href="#" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
`;
}
