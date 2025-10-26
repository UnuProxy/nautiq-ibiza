// sendEmail.js
import { Resend } from "resend";
import dotenv from "dotenv";

// Load .env.local explicitly
dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestEmail() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "info@nautiqibiza.com",
      subject: "Hello from Nautiq Ibiza",
      html: "<p>Congrats on sending your <strong>first email</strong> via Resend 🎉</p>",
    });
    console.log("✅ Email sent:", data);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  sendTestEmail();
}
