import { generateConfirmationEmail, generateSupportEmail } from '@/lib/email-templates';

interface BookingEmailRequest {
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
}

/**
 * Send booking confirmation emails
 * Email 1: Automated confirmation from no-reply
 * Email 2: Personalized request from support team
 */
export async function POST(request: Request) {
  try {
    const body: BookingEmailRequest = await request.json();

    // Validate required fields
    if (!body.bookingNumber || !body.customerEmail || !body.customerName) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email 1: Automated Confirmation
    const confirmationHtml = generateConfirmationEmail({
      bookingNumber: body.bookingNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      origin: body.origin,
      destination: body.destination,
      containerType: body.containerType,
      noOfContainers: body.noOfContainers,
      commodity: body.commodity,
      commodityDetails: body.commodityDetails,
      cargoReadyDate: body.cargoReadyDate,
      shippingType: body.shippingType,
      totalAmount: body.totalAmount,
      validity: body.validity,
    });

    // Email 2: Support Request
    const supportHtml = generateSupportEmail({
      bookingNumber: body.bookingNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      origin: body.origin,
      destination: body.destination,
      containerType: body.containerType,
      noOfContainers: body.noOfContainers,
      commodity: body.commodity,
      commodityDetails: body.commodityDetails,
      cargoReadyDate: body.cargoReadyDate,
      shippingType: body.shippingType,
      totalAmount: body.totalAmount,
      validity: body.validity,
      supportContact: {
        name: 'Olena Pasku',
        email: 'olena.pasku@vcanfreight.com',
        title: 'Senior Booking Manager',
      },
    });

    // In production, you would use an email service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Cloudflare Email Routing + Workers Mail
    // For now, we'll log the emails and return success

    console.log('📧 Email 1: Automated Confirmation');
    console.log(`To: ${body.customerEmail}`);
    console.log(`From: no-reply@vcanfreight.com`);
    console.log(`Subject: Booking #${body.bookingNumber} has been created`);
    console.log('---');

    console.log('📧 Email 2: Support Request');
    console.log(`To: ${body.customerEmail}`);
    console.log(`From: olena.pasku@vcanfreight.com`);
    console.log(`Subject: Thank you for booking with VCAN Freight - Action Required`);
    console.log('---');

    // TODO: Integrate with actual email service
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(env.SENDGRID_API_KEY);
    // await sgMail.send([
    //   {
    //     to: body.customerEmail,
    //     from: 'no-reply@vcanfreight.com',
    //     subject: `Booking #${body.bookingNumber} has been created`,
    //     html: confirmationHtml,
    //   },
    //   {
    //     to: body.customerEmail,
    //     from: 'olena.pasku@vcanfreight.com',
    //     subject: 'Thank you for booking with VCAN Freight - Action Required',
    //     html: supportHtml,
    //   },
    // ]);

    return Response.json({
      success: true,
      message: 'Emails queued for sending',
      bookingNumber: body.bookingNumber,
      customerEmail: body.customerEmail,
      emailsSent: 2,
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return Response.json(
      { 
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
