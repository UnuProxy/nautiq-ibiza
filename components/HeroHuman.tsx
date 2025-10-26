"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroHuman() {
  return (
    <>
      <TrustBar />

      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
         <Image
    src="/portada_mar_ibiza.jpg"
    alt="Crystal clear waters and yacht in Ibiza"
    fill
    style={{
      objectFit: 'cover',
      objectPosition: 'center'
    }}
    priority
    quality={90}
  />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(12, 74, 110, 0.85) 0%, rgba(3, 105, 161, 0.75) 50%, rgba(6, 182, 212, 0.4) 100%)'
          }} />
        </div>

        <div className="container" style={{ 
          position: 'relative', 
          zIndex: 1,
          padding: 'clamp(60px, 10vh, 100px) 20px 40px'
        }}>
          <div style={{ maxWidth: '700px' }}>
            <h1 style={{
              fontSize: 'clamp(32px, 7vw, 64px)',
              fontWeight: '900',
              lineHeight: '1.1',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              Your perfect Ibiza boat day
            </h1>

            <p style={{
              fontSize: 'clamp(16px, 3vw, 24px)',
              lineHeight: '1.5',
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              Secret coves. Beach club lunch. Sunset drinks. Zero stress.
            </p>

            <p style={{
              fontSize: 'clamp(16px, 2.8vw, 22px)',
              lineHeight: '1.6',
              color: 'white',
              marginBottom: '24px',
              fontWeight: '700',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              We prevent the 6 things that ruin boat days.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                flex: '1 1 calc(50% - 6px)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', color: 'white' }}>4.9★</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>From 1,247 guests</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                flex: '1 1 calc(50% - 6px)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', color: 'white' }}>324</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>Surprise upgrades</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                flex: '1 1 calc(50% - 6px)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px', color: 'white' }}>&lt;5m</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>Reply time</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <a 
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'white',
                  color: '#0369a1',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
                  flex: '1 1 auto',
                  minWidth: '160px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
                }}
              >
                Plan My Day →
              </a>

              <a 
                href="#fleet"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  flex: '1 1 auto',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                See boats
              </a>
            </div>

            <div style={{ marginTop: '12px' }}>
              <a 
                href="#whatgoeswrong" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'white', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  textDecoration: 'underline', 
                  textUnderlineOffset: '4px',
                  opacity: 0.95,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.95'}
              >
                See what we actually handle →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="how" style={{
        padding: 'clamp(60px, 10vw, 100px) 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '800',
              marginBottom: '16px',
              color: '#0e1424'
            }}>
              Here's your perfect day
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              From pickup to sunset, every detail handled
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            marginBottom: '56px'
          }}>
            {[
              {
                time: '9:00 AM',
                title: 'We pick you up',
                desc: 'Skipper meets you at your hotel',
                color: '#fbbf24',
                img: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=400&fit=crop'
              },
              {
                time: '11:00 AM',
                title: 'Secret coves',
                desc: 'Swim in crystal-clear hidden spots',
                color: '#06b6d4',
                img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
              },
              {
                time: '2:00 PM',
                title: 'Beach club lunch',
                desc: 'Reserved table, Mediterranean feast',
                color: '#ec4899',
                img: 'https://images.unsplash.com/photo-1566024287286-457247b70310?w=600&h=400&fit=crop'
              },
              {
                time: '6:00 PM',
                title: 'Golden hour',
                desc: 'Sunset with drinks and music',
                color: '#f97316',
                img: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=600&h=400&fit=crop'
              }
            ].map((step, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={step.img}
                    alt={step.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{
                    display: 'inline-block',
                    background: step.color,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    {step.time}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#0e1424'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '2px solid #bfdbfe',
            borderRadius: '24px',
            padding: 'clamp(32px, 6vw, 48px)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: 'clamp(22px, 4vw, 28px)',
              fontWeight: '800',
              marginBottom: '16px',
              color: '#0c4a6e'
            }}>
              Not just a boat rental
            </h3>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              color: '#075985',
              maxWidth: '700px',
              margin: '0 auto 32px',
              lineHeight: '1.7'
            }}>
              I'm Julian — born in Ibiza, 7 years curating perfect days. I know the secret spots, 
              the best skippers, and exactly what makes magic happen. You get my local expertise, not just a boat.
            </p>
            <a 
              href="https://wa.me/34600000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(14,165,233,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,0.3)';
              }}
            >
              Let's Plan Your Day →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function TrustBar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div 
      style={{ 
        position: scrolled ? 'fixed' : 'relative',
        top: scrolled ? '64px' : '0',
        left: 0,
        right: 0,
        zIndex: 40,
        background: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '10px 0',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none'
      }}
    >
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '12px',
          flexWrap: 'wrap',
          fontSize: '12px',
          color: 'var(--gray-700)',
          fontWeight: 500,
          padding: '0 10px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#059669' }}>✓</span> Licensed & Insured
          </span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span>18 boats available</span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span>12 vetted skippers</span>
          <span style={{ opacity: 0.3, display: 'none' }} className="hide-mobile">•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#059669' }}>✓</span> Replacement guarantee
          </span>
        </div>
      </div>
    </div>
  );
}


