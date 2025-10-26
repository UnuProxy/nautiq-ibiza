"use client";

export default function TermsPage() {
  return (
    <main className="bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-light text-[#0B1120] mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 mb-12">
          Last updated: October 2025
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          {/* 1. Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By booking a yacht charter with Nautiq Ibiza SL ("Company," "we," "us"), you agree to be bound by these Terms & Conditions. These terms govern your entire relationship with us, including the use of our website and services. If you do not agree to these terms, please do not proceed with your booking.
            </p>
          </section>

          {/* 2. Booking & Reservation */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              2. Booking & Reservation
            </h2>
            <p>
              <strong>Quotation:</strong> All quotes provided are valid for 7 days and subject to availability. Quotes are non-binding until a signed contract is executed.
            </p>
            <p>
              <strong>Reservation Process:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate guest details (name, email, phone)</li>
              <li>Confirm charter dates, guest count, and budget</li>
              <li>Review boat specifications and included amenities</li>
              <li>Receive formal contract and payment schedule</li>
              <li>Sign contract (digital or paper) to confirm reservation</li>
            </ul>
            <p className="mt-4">
              <strong>Minimum Age:</strong> Guest of responsibility (skipper/renter) must be 18+. Government-issued ID required.
            </p>
          </section>

          {/* 3. Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              3. Payment Terms
            </h2>
            <p>
              <strong>Payment Schedule:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>30% deposit upon booking confirmation (non-refundable, see cancellation policy)</li>
              <li>70% balance due 30 days before charter start date</li>
              <li>All prices in EUR; payment in EUR or USD (at current exchange rate)</li>
            </ul>
            <p className="mt-4">
              <strong>Payment Methods:</strong> Bank transfer, credit card, PayPal.
            </p>
            <p>
              <strong>Security Deposit:</strong> €500–€2,000 security deposit (refundable, held during charter). Returned within 7 days post-charter unless damage claims apply.
            </p>
            <p>
              <strong>Late Payment:</strong> Bookings must be paid in full 30 days before start date. Failure to pay may result in cancellation without refund.
            </p>
          </section>

          {/* 4. Cancellation & Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              4. Cancellation & Refund Policy
            </h2>
            <p>
              <strong>By Guest:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>More than 60 days before charter: Full refund minus 10% admin fee</li>
              <li>30–60 days before charter: 50% refund of paid amount</li>
              <li>Less than 30 days before charter: No refund (deposit forfeited)</li>
              <li>No-show: No refund</li>
            </ul>
            <p className="mt-4">
              <strong>By Nautiq Ibiza:</strong> In rare cases (mechanical failure, unsafe weather, force majeure), we will offer alternative dates or full refund, no penalties.
            </p>
            <p>
              <strong>Travel Insurance:</strong> We recommend travel insurance covering trip cancellation. We cannot be held liable for unforeseen circumstances.
            </p>
          </section>

          {/* 5. Charter Conditions */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              5. Charter Conditions
            </h2>
            <p>
              <strong>Guest Responsibilities:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Obey all laws, maritime regulations, and captain instructions</li>
              <li>Treat the yacht with care and respect</li>
              <li>Use only authorized ports and approved anchorages</li>
              <li>Not deviate from planned itinerary without captain approval</li>
              <li>Not allow unauthorized persons aboard</li>
              <li>Maintain reasonable behavior (no excessive noise after 22:00)</li>
              <li>Report all damage or mechanical issues immediately</li>
              <li>Follow safety protocols (life jackets, emergency procedures)</li>
            </ul>
            <p className="mt-4">
              <strong>Captain Authority:</strong> Captains have absolute authority over the vessel and guest safety. Captain reserves the right to end charter early if:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Guest violates these terms</li>
              <li>Guest behavior endangers safety</li>
              <li>Guest is under the influence of alcohol/drugs</li>
              <li>Unsafe weather or sea conditions develop</li>
            </ul>
            <p className="mt-4">
              Early termination due to guest conduct will result in no refund.
            </p>
          </section>

          {/* 6. Included & Excluded */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              6. What's Included & Excluded
            </h2>
            <p>
              <strong>Included:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Yacht, crew (captain/skipper, hostess/chef if applicable)</li>
              <li>Fuel for approved itinerary</li>
              <li>Basic provisioning & watersports equipment (as listed)</li>
              <li>Port fees (standard anchorages)</li>
              <li>Insurance (standard hull & liability)</li>
            </ul>
            <p className="mt-4">
              <strong>NOT Included:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Flights or transportation to/from yacht</li>
              <li>Meals (unless catering package booked)</li>
              <li>Alcohol or beverages</li>
              <li>Shore excursions or activities</li>
              <li>Premium mooring fees (Ibiza town center, exclusive clubs)</li>
              <li>Extra fuel costs (if itinerary exceeds planned distance)</li>
              <li>Damage or loss due to guest negligence</li>
            </ul>
          </section>

          {/* 7. Damage & Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              7. Damage & Liability
            </h2>
            <p>
              <strong>Guest Liability for Damage:</strong> Guests are liable for any damage caused by negligence, misuse, or violation of terms. Damage costs will be deducted from security deposit or invoiced separately. Examples:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reckless driving or grounding</li>
              <li>Deliberate damage to furniture, equipment, or fittings</li>
              <li>Unauthorized use of equipment</li>
              <li>Loss of equipment or personal items of crew</li>
            </ul>
            <p className="mt-4">
              <strong>Normal Wear & Tear:</strong> Minor scratches, small stains, worn linens are not charged.
            </p>
            <p>
              <strong>Nautiq Liability Limits:</strong> Nautiq Ibiza is not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Lost or stolen personal items</li>
              <li>Guest injury (guests assume all maritime risks)</li>
              <li>Weather-related disruptions or cancellations</li>
              <li>Mechanical failures (we will provide alternative boat/refund)</li>
              <li>Force majeure events (acts of God, pandemic, etc.)</li>
              <li>Indirect or consequential damages</li>
            </ul>
          </section>

          {/* 8. Safety & Health */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              8. Safety & Health
            </h2>
            <p>
              <strong>Medical Conditions:</strong> Guests with serious medical conditions must inform us before booking. We reserve the right to decline bookings if medical emergencies at sea cannot be adequately managed.
            </p>
            <p>
              <strong>Pregnancy:</strong> Guests in their third trimester should not charter.
            </p>
            <p>
              <strong>Alcohol & Substances:</strong> Guests cannot operate the yacht while under the influence. Excessive alcohol consumption may result in charter termination.
            </p>
            <p>
              <strong>Life Jackets & Safety:</strong> All guests must comply with safety protocols. Life jackets are mandatory in rough seas or when required by captain.
            </p>
            <p>
              <strong>COVID-19 & Illness:</strong> Guests arriving ill will not be permitted to board. No refund issued. If guests become ill during charter, captain may terminate charter with partial refund.
            </p>
          </section>

          {/* 9. Our Guarantee */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              9. Nautiq Guarantee
            </h2>
            <p>
              <strong>30-Minute Backup Promise:</strong> If your assigned yacht develops a significant mechanical issue during your charter, we will relocate you to a comparable or superior vessel within 30 minutes at no additional cost.
            </p>
            <p>
              <strong>Satisfaction Commitment:</strong> We are committed to your satisfaction. If you experience a serious issue, notify us immediately so we can resolve it.
            </p>
          </section>

          {/* 10. Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              10. Intellectual Property
            </h2>
            <p>
              All content on our website (text, images, videos, logos) is owned by Nautiq Ibiza or licensed partners. You may not reproduce, distribute, or use this content without written permission.
            </p>
          </section>

          {/* 11. Testimonials & Reviews */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              11. Testimonials & Reviews
            </h2>
            <p>
              By providing a testimonial, review, or feedback, you grant Nautiq Ibiza the right to use your name, photos, and comments on our website and marketing materials. Testimonials are used at our discretion.
            </p>
          </section>

          {/* 12. Limitations of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              12. Limitations of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Nautiq Ibiza's total liability for any claim shall not exceed the total amount paid for the charter. Nautiq Ibiza is not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Lost profits or lost data</li>
              <li>Third-party claims or damages</li>
            </ul>
          </section>

          {/* 13. Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              13. Dispute Resolution
            </h2>
            <p>
              <strong>Governing Law:</strong> These terms are governed by Spanish law and the laws of the Balearic Islands.
            </p>
            <p>
              <strong>Jurisdiction:</strong> Any disputes shall be resolved in the courts of Ibiza, Spain.
            </p>
            <p>
              <strong>Mediation:</strong> Before legal action, we encourage parties to attempt good-faith resolution through mediation.
            </p>
          </section>

          {/* 14. Amendments */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              14. Amendments to Terms
            </h2>
            <p>
              Nautiq Ibiza reserves the right to update these terms at any time. Changes take effect when posted to the website. Continued use of our services constitutes acceptance of updated terms.
            </p>
          </section>

          {/* 15. Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              15. Contact Information
            </h2>
            <p>
              For questions or concerns regarding these Terms & Conditions:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p><strong>Nautiq Ibiza SL</strong></p>
              <p>Marina Botafoch</p>
              <p>07800 Ibiza, Spain</p>
              <p>Email: info@nautiqibiza.com</p>
              <p>Phone: +34 692 688 348</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1120] mt-8 mb-4">
              Acknowledgment
            </h2>
            <p>
              By proceeding with a booking, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions and our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}