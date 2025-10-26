"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "Home", href: "/" },
      { label: "Boats", href: "/fleet" },
      { label: "Why Us", href: "/why-us" },
      { label: "Catering", href: "/catering" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Contact", href: "#contact" },
    ],
    social: [
      { label: "Instagram", href: "https://www.instagram.com/nautiqibiza", external: true },
      { label: "Facebook", href: "https://www.facebook.com/nautiqibiza", external: true },
      { label: "WhatsApp", href: "https://wa.me/34692688348", external: true },
    ],
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">NAUTIQ</h2>
            <p className="text-gray-400 text-sm mb-4">
              Ibiza & Formentera yacht charters
            </p>
            <p className="text-gray-500 text-xs">
              Local expertise since 2018. Fully licensed & insured.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-6">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#C9A55C] mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+34692688348"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  +34 692 688 348
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#C9A55C] mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@nautiqibiza.com"
                  className="text-gray-400 hover:text-white text-sm transition-colors break-all"
                >
                  info@nautiqibiza.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C9A55C] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Marina Botafoch<br />
                  07800 Ibiza, Spain
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {currentYear} Nautiq Ibiza. All rights reserved.
            <br className="md:hidden" />
            Fully licensed & insured.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {footerLinks.social.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-gray-400 hover:text-[#C9A55C] transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}