"use client";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string; isButton?: boolean };

const navItems: NavItem[] = [
  { href: "/fleet", label: "Boats" },
  { href: "/why-us", label: "Why us" },
  { href: "/catering", label: "Catering" },
  { href: "#contact", label: "Enquire", isButton: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusable = useRef<HTMLButtonElement>(null);
  const lastFocusable = useRef<HTMLAnchorElement>(null);

  // Sticky condense
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on ≥1024
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Body lock
  useEffect(() => {
    const html = document.documentElement;
    if (open) html.classList.add("menu-open"); else html.classList.remove("menu-open");
    return () => html.classList.remove("menu-open");
  }, [open]);

  // ESC + focus trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
      if (e.key === "Tab" && open && firstFocusable.current && lastFocusable.current) {
        const focusable = [firstFocusable.current, lastFocusable.current];
        const active = document.activeElement;
        if (e.shiftKey && active === firstFocusable.current) {
          e.preventDefault(); lastFocusable.current.focus();
        } else if (!e.shiftKey && active === lastFocusable.current) {
          e.preventDefault(); firstFocusable.current.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleNavClick = () => setOpen(false);

  return (
    <>
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="w-full px-4 md:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <nav className="nav" aria-label="Main">
            <a href="/" className="brand" aria-label="Nautiq Ibiza — Home">
              <img
                src="/Nautiq.Logo03.png"
                alt="Nautiq Ibiza logo"
                className="brand-logo"
                decoding="async"
                fetchPriority="high"
              />
            </a>

            {/* Desktop */}
            <div className="nav-links" aria-label="Primary">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className={item.isButton ? "btn btn-primary nav-cta" : ""}>
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`nav-burger ${open ? "nav-burger--open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              ref={firstFocusable}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      {/* Drawer */}
      <div
        className={`menu-overlay ${open ? "menu-overlay--open" : ""}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      >
        <div
          className="menu-content"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          ref={drawerRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" aria-label="Close menu" className="menu-close" onClick={() => setOpen(false)}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <nav className="menu-nav">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={item.isButton ? "btn btn-primary menu-cta" : ""}
                onClick={handleNavClick}
                ref={item.href === navItems[navItems.length - 1].href ? lastFocusable : null}
              >
                {item.label}
              </a>
            ))}

            <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid #e5e7eb" }}>
              <p className="muted" style={{ fontSize: 14, marginBottom: 12 }}>Connect with us</p>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="https://www.instagram.com/nautiqibiza" target="_blank" rel="noopener noreferrer" className="btn" style={{ flex: 1, fontSize: 14, padding: "10px" }} onClick={handleNavClick}>Instagram</a>
                <a href="https://www.facebook.com/nautiqibiza" target="_blank" rel="noopener noreferrer" className="btn" style={{ flex: 1, fontSize: 14, padding: "10px" }} onClick={handleNavClick}>Facebook</a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

