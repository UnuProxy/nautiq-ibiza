import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Optional: set these in `.env.local` to avoid hard-coding emails
// RESEND_TO=info@nautiqibiza.com
// RESEND_FROM="Nautiq Ibiza <onboarding@resend.dev>"

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      contact?: string;
      date?: string;
      guests?: string;
      budget?: string;
      message?: string;
    };

    // Basic validation
    if (!body?.contact || !body?.date || !body?.guests || !body?.budget) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const contact = String(body.contact).trim();
    const date = String(body.date).trim();
    const guests = String(body.guests).trim();
    const budget = String(body.budget).trim();
    const msg = String(body.message || "").trim();

    const to = process.env.RESEND_TO || "info@nautiqibiza.com";
    const from = process.env.RESEND_FROM || "Nautiq Ibiza <onboarding@resend.dev>";

    // If the contact looks like an e-mail, use it as reply-to
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

    const html = `
      <h2>New Charter Enquiry</h2>
      <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
      <p><strong>Date:</strong> ${escapeHtml(date)}</p>
      <p><strong>Guests:</strong> ${escapeHtml(guests)}</p>
      <p><strong>Budget:</strong> €${escapeHtml(budget)}</p>
      ${msg ? `<p><strong>Message:</strong><br>${escapeHtml(msg).replace(/\n/g, "<br/>")}</p>` : ""}
      <hr/>
      <p style="font-size:12px;color:#64748b">Sent from nautiq-ibiza.com</p>
    `;

    const text =
`New Charter Enquiry
Contact: ${contact}
Date: ${date}
Guests: ${guests}
Budget: €${budget}
${msg ? `Message:\n${msg}\n` : ""}`;

    const sendResult = await resend.emails.send({
      from,
      to,
      subject: `New enquiry — ${date} • ${guests} guests • €${budget}`,
      html,
      text,
      ...(looksLikeEmail ? { reply_to: contact } : {}),
    });

    return NextResponse.json({ success: true, data: sendResult });
  } catch (err: any) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to send message." },
      { status: 500 }
    );
  }
}

/** tiny helper to avoid HTML injection */
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

