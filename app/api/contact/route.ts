import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact, date, guests, budget, message } = body;

    if (!contact || !date || !guests || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const formattedDate = new Date(date).toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Email to you (notification)
    await resend.emails.send({
      from: 'Nautiq Ibiza <info@nautiqibiza.com>',
      to: ['info@nautiqibiza.com'],
      replyTo: contact,
      subject: `New Booking Enquiry - ${guests} guests, €${budget}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <div style="background: linear-gradient(135deg, #2095AE 0%, #0284c7 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="margin:0; font-size: 24px;">⛵ New Booking Enquiry</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Someone wants to charter a boat!</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2095AE;">
              <div style="font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase;">📅 Preferred Date</div>
              <div style="font-size: 18px; color: #0f172a; margin-top: 5px;">${formattedDate}</div>
            </div>
            <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2095AE;">
              <div style="font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase;">👥 Guests</div>
              <div style="font-size: 18px; color: #0f172a; margin-top: 5px;">${guests} guests</div>
            </div>
            <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2095AE;">
              <div style="font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase;">💰 Budget</div>
              <div style="font-size: 18px; color: #0f172a; margin-top: 5px;">€${budget}/day</div>
            </div>
            <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2095AE;">
              <div style="font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase;">📱 Contact</div>
              <div style="font-size: 18px; color: #0f172a; margin-top: 5px;">${contact}</div>
            </div>
            ${message ? `
              <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2095AE;">
                <div style="font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase;">💬 Message</div>
                <div style="font-size: 18px; color: #0f172a; margin-top: 5px;">${message}</div>
              </div>
            ` : ''}
            <a href="https://wa.me/${contact.replace(/\D/g, '')}" style="display: inline-block; background: #2095AE; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600;">
              💬 Reply on WhatsApp
            </a>
            <p style="margin-top: 20px; font-size: 14px; color: #64748b;">
              <strong>Next steps:</strong><br>
              1. Check availability for ${formattedDate}<br>
              2. Prepare 2-3 boat options within €${budget} budget<br>
              3. Reply within 10 minutes for best conversion 🚀
            </p>
          </div>
        </div>
      `,
    });

    // Confirmation email to customer
    await resend.emails.send({
      from: 'Nautiq Ibiza <info@nautiqibiza.com>',
      to: [contact],
      subject: 'We received your enquiry - Nautiq Ibiza',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #2095AE 0%, #0284c7 100%); color: white; border-radius: 12px;">
            <h1 style="margin: 0;">Thanks for reaching out!</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">We'll reply shortly</p>
          </div>
          <div style="padding: 30px 20px;">
            <p>Hi there,</p>
            <p>Thanks for your enquiry about chartering a boat in Ibiza with Nautiq. We've received your request and we'll reply within <strong>~10 minutes</strong> with tailored options.</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <strong>Your request:</strong><br>
              📅 Date: ${formattedDate}<br>
              👥 Guests: ${guests}<br>
              💰 Budget: €${budget}/day
            </div>
            <p><strong>What happens next:</strong></p>
            <ul>
              <li>We'll check real-time availability</li>
              <li>Match you with 2-3 perfect boats</li>
              <li>Include skipper options & extras</li>
              <li>Answer any questions you have</li>
            </ul>
            <p>Warm regards,<br><strong>The Nautiq Ibiza Team</strong><br>📱 WhatsApp: +34 692 688 348</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}