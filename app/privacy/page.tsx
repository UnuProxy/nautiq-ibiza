"use client";

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-light text-[#0B1120] mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-12">
          Last updated: October 2025
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              Nautiq Ibiza SL ("we", "us", "our", or "Company") operates the website nautiqibiza.com and related services. We are committed to protecting your privacy and ensuring transparent communication about how we collect, use, and protect your personal data.
            </p>
            <p>
              This Privacy Policy explains our practices regarding personal data collection and processing. We comply with the EU General Data Protection Regulation (GDPR) and Spanish Data Protection Laws. By using our services, you consent to this policy.
            </p>
          </section>

          {/* 2. Data Controller */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              2. Data Controller
            </h2>
            <p>
              <strong>Nautiq Ibiza SL</strong><br />
              Marina Botafoch<br />
              07800 Ibiza, Spain<br />
              Email: info@nautiqibiza.com<br />
              Phone: +34 692 688 348
            </p>
          </section>

          {/* 3. Data We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              3. Data We Collect
            </h2>
            <p>We collect personal data in the following ways:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Contact Information:</strong> Name, email, phone number, address</li>
              <li><strong>Booking Details:</strong> Preferred dates, number of guests, budget, boat preferences</li>
              <li><strong>Payment Information:</strong> Bank details, payment method (processed securely)</li>
              <li><strong>Identity Documents:</strong> Passport/ID copies for charter compliance and security</li>
              <li><strong>Special Requests:</strong> Dietary requirements, medical information, accessibility needs</li>
              <li><strong>Communication Data:</strong> Messages, calls, and correspondence with our team</li>
              <li><strong>Technical Data:</strong> IP address, browser type, pages visited (via analytics)</li>
              <li><strong>Guest Feedback:</strong> Reviews, ratings, testimonials (with consent)</li>
            </ul>
          </section>

          {/* 4. Legal Basis for Processing */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              4. Legal Basis for Processing
            </h2>
            <p>We process your data based on:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Contract Performance:</strong> Processing necessary to execute your booking and provide services</li>
              <li><strong>Legal Obligation:</strong> Compliance with maritime law, Spanish regulations, and tax requirements</li>
              <li><strong>Legitimate Interest:</strong> Fraud prevention, security, service improvement, marketing communications (where you've opted in)</li>
              <li><strong>Your Consent:</strong> Marketing emails, newsletter subscriptions, testimonial use</li>
            </ul>
          </section>

          {/* 5. How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              5. How We Use Your Data
            </h2>
            <p>Your personal data is used for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Processing and managing your charter booking</li>
              <li>Payment processing and billing</li>
              <li>Pre-charter communication and updates</li>
              <li>Safety and security verification (captain background checks, etc.)</li>
              <li>Legal compliance and regulatory reporting</li>
              <li>Customer support and issue resolution</li>
              <li>Service improvement and analytics</li>
              <li>Marketing communications (only with your consent)</li>
              <li>Guest reviews and testimonials (with explicit permission)</li>
              <li>Fraud detection and prevention</li>
            </ul>
          </section>

          {/* 6. Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              6. Data Sharing
            </h2>
            <p>We share your data only when necessary:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>With Boat Captains & Crew:</strong> Essential information for your charter (booking details, special requests, safety requirements)</li>
              <li><strong>With Third-Party Service Providers:</strong> Payment processors, insurance companies, accounting software (all under strict confidentiality agreements)</li>
              <li><strong>Legal Requirements:</strong> When required by Spanish or EU authorities, courts, or law enforcement</li>
              <li><strong>Business Transfers:</strong> In case of merger or acquisition, your data may be transferred (you'll be notified)</li>
            </ul>
            <p className="mt-4">
              <strong>We do not:</strong> Sell your data to third parties, share data with marketing companies without consent, or transfer data outside the EU/EEA without proper safeguards.
            </p>
          </section>

          {/* 7. Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              7. Data Retention
            </h2>
            <p>We retain your data as follows:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Booking Data:</strong> 7 years (legal and tax requirements)</li>
              <li><strong>Payment Records:</strong> 7 years (accounting/tax compliance)</li>
              <li><strong>Identity Documents:</strong> Until 30 days after charter completion, then securely deleted</li>
              <li><strong>Communication Records:</strong> 3 years unless longer required by law</li>
              <li><strong>Marketing Preferences:</strong> Until you unsubscribe</li>
              <li><strong>Testimonials/Reviews:</strong> As long as posted, removable upon request</li>
            </ul>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              8. Your Rights (GDPR)
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your data we hold</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured, portable format</li>
              <li><strong>Objection:</strong> Opt-out of marketing and non-essential processing</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for any processing at any time</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at info@nautiqibiza.com or +34 692 688 348.
            </p>
          </section>

          {/* 9. Security */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              9. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>HTTPS encryption for all website communications</li>
              <li>Secure payment gateways (PCI-DSS compliant)</li>
              <li>Restricted access to personal data (staff only as needed)</li>
              <li>Regular security audits and updates</li>
              <li>Confidentiality agreements with all service providers</li>
              <li>Secure document destruction protocols</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> While we maintain high security standards, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* 10. Cookies & Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              10. Cookies & Tracking
            </h2>
            <p>
              Our website uses cookies and similar technologies for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Session management (essential, no consent required)</li>
              <li>Analytics (Google Analytics - anonymized)</li>
              <li>Remembering user preferences</li>
            </ul>
            <p className="mt-4">
              You can disable cookies in your browser settings. Disabling essential cookies may affect website functionality.
            </p>
          </section>

          {/* 11. Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              11. Third-Party Links
            </h2>
            <p>
              Our website may contain links to external sites (Instagram, Facebook, etc.). We are not responsible for their privacy practices. Please review their privacy policies before sharing information.
            </p>
          </section>

          {/* 12. Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              12. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. Significant changes will be communicated via email or website notice. Continued use of our services constitutes acceptance of updated policies.
            </p>
          </section>

          {/* 13. Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              13. Contact Us
            </h2>
            <p>
              For privacy concerns or to exercise your rights, contact:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p><strong>Nautiq Ibiza SL</strong></p>
              <p>Marina Botafoch</p>
              <p>07800 Ibiza, Spain</p>
              <p>Email: info@nautiqibiza.com</p>
              <p>Phone: +34 692 688 348</p>
            </div>
            <p className="mt-4">
              You also have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}