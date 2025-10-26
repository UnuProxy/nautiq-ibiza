"use client";

import { Heart, Anchor, Users, Compass, Smile } from "lucide-react";

export default function WhyUsPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-24 md:py-40 bg-gradient-to-b from-[#0B1120] to-[#0B1120]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
            Why Nautiq
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Because I measure success by how happy you are when you leave, not how much I make.
          </p>
        </div>
      </section>

      {/* The Real Story */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-light text-[#0B1120] mb-12">
            My Philosophy
          </h2>
          
          <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
            <p>
              I started Nautiq because I believe people deserve to feel cared for when they're on holiday. Not managed. Not upsold. Actually cared for.
            </p>

            <p>
              People come first. Always. That's not a slogan for our website—it's how I actually operate.
            </p>

            <p>
              There are days when someone calls with their heart set on a specific boat, a specific date, but their budget is €500 short. They apologize. They're clearly disappointed. Most yacht companies say "sorry, the price is the price."
            </p>

            <p>
              I don't.
            </p>

            <p>
              I figure out how to make it work. Sometimes that means zero profit on my end. Sometimes it means I'm making nothing. But when I hear them laughing on the boat with their family, or when they email me two weeks later saying "that was the best holiday we've ever had"—that feeling beats profit every single time.
            </p>

            <p>
              I genuinely believe that. It's not marketing. It's how I'm wired.
            </p>

            <p className="text-xl italic text-[#0B1120]">
              I get more joy from your happiness than I get from a paycheck.
            </p>

            <p>
              I'm not here to tell you I'm better than other companies. I don't think like that. I just know what matters to me: You. Your family. Your experience. Your memories. That's what I protect every single day.
            </p>

            <p>
              When I meet people—at dinner, at the port, anywhere—and they tell me about their Nautiq charter, I feel it. That feeling when someone you care about had something good happen. I genuinely believe that's what business should be about.
            </p>
          </div>
        </div>
      </section>

      {/* What This Means */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-light text-[#0B1120] mb-12">
            What This Actually Looks Like
          </h2>

          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Heart className="w-8 h-8 text-[#2095AE] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0B1120] mb-3">
                  We Listen More Than We Sell
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When you call, I want to understand what matters to you. Not to upsell you on premium packages. To make sure we give you exactly what you need. Sometimes that means suggesting a smaller boat if it's better for your group. Sometimes it means saying "come back next month, the weather will be perfect."
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Anchor className="w-8 h-8 text-[#2095AE] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0B1120] mb-3">
                  We Know You Matter More Than The Booking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your daughter is scared of water? We'll ease her in gently. Your partner has mobility issues? We'll figure out the best boat and the best help. Your family just wants to sit and do nothing? Perfect—that's what we do. Your joy is the metric. Not your spend.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-[#2095AE] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0B1120] mb-3">
                  We're Genuinely Happy For You
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When you email me three weeks after your charter saying "that was the best week of our lives," I feel it deeply. I'm not being paid extra for this feeling. I just... genuinely care that you had a good experience. That feeling is why I do this.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Smile className="w-8 h-8 text-[#2095AE] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0B1120] mb-3">
                  We Make Exceptions
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Budget doesn't add up? We'll find a way. Dates are tight but important? We'll make it work. You need something special? We'll figure it out. I don't have a manual for this. I just ask: "What do these people need to be happy?" And then I do it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Promise */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-[#0B1120] to-[#0F1627]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-8 text-center">
            Here's What You Actually Get
          </h2>
          
          <div className="bg-white/10 rounded-2xl p-12 border border-white/20 backdrop-blur mt-8">
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <span className="text-[#C9A55C] font-bold text-2xl flex-shrink-0">✓</span>
                <p className="text-white text-lg">
                  Someone who actually listens to what matters to you.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-[#C9A55C] font-bold text-2xl flex-shrink-0">✓</span>
                <p className="text-white text-lg">
                  A captain who cares about your experience as much as I do.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[#C9A55C] font-bold text-2xl flex-shrink-0">✓</span>
                <p className="text-white text-lg">
                  Flexibility when it matters (not everything is about the price tag).
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[#C9A55C] font-bold text-2xl flex-shrink-0">✓</span>
                <p className="text-white text-lg">
                  If something breaks, we fix it immediately because I want you to enjoy your trip.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[#C9A55C] font-bold text-2xl flex-shrink-0">✓</span>
                <p className="text-white text-lg">
                  Someone who genuinely celebrates your happiness.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-[#C9A55C] font-bold text-2xl flex-shrink-0">✓</span>
                <p className="text-white text-lg">
                  A holiday you'll remember for years. The kind you tell your friends about.
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-200 italic text-center pt-6 border-t border-white/20">
              "I don't measure my success by profit margins. I measure it by the email I get from you saying you had the best time of your life."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-[#0B1120] mb-6">
            Let's Create That Memory Together
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Tell me what matters to you. Your budget, your dreams, your family. Let's make it happen.
          </p>
          <a
            href="#contact"
            className="inline-block bg-[#C9A55C] text-[#0B1120] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#B8975A] transition-colors"
          >
            Let's Talk
          </a>
        </div>
      </section>
    </main>
  );
}