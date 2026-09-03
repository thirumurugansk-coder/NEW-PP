import React from 'react';

export interface VoltPulseLogoProps {
  variant?: 'icon' | 'wordmark' | 'app-icon' | 'emblem-full';
  size?: number | string;
  theme?: 'dark' | 'light' | 'ivory';
  showTagline?: boolean;
  className?: string;
  id?: string;
}

/**
 * VoltPulse IoT Official Brand Vector Emblem & Typography
 * Recreated accurately from the official brand identity specification:
 * - Circular frame: Deep forest green arc with top IoT node terminal
 * - Top-right metallic gold meter graduation calibration ticks
 * - Bottom Wi-Fi / wireless transmission waves
 * - Classic bold serif letter "V" in deep forest green
 * - Sharp metallic gold electrical lightning bolt
 * - Deep forest green pulse waveform breaking out horizontally
 * - "Volt" in bold forest green + "Pulse" in sleek modern metallic gold
 * - Rule with "IoT" centered
 * - Tagline: "SMART ENERGY. REAL-TIME INSIGHT."
 */
export const VoltPulseLogo: React.FC<VoltPulseLogoProps> = ({
  variant = 'icon',
  size = 40,
  theme = 'dark',
  showTagline = false,
  className = '',
  id,
}) => {
  // Official brand color palette
  const forestGreen = '#164430';
  const forestGreenDark = '#0F3022';
  const metallicGold = '#C59B46';
  const metallicGoldBright = '#DCAE58';
  const metallicGoldDark = '#A88033';
  const warmIvory = '#F5EFE6';
  const charcoal = '#14181E';

  // SVG dimensions
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  // Primary Vector Emblem exactly matching the uploaded brand asset
  const renderEmblemSvg = (badgeMode = false) => (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none"
      role="img"
      aria-label="VoltPulse IoT Master Emblem"
    >
      <defs>
        {/* Metallic Gold Gradient */}
        <linearGradient id="vp-official-gold" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={metallicGoldBright} />
          <stop offset="60%" stopColor={metallicGold} />
          <stop offset="100%" stopColor={metallicGoldDark} />
        </linearGradient>

        {/* Forest Green Gradient */}
        <linearGradient id="vp-official-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1C533C" />
          <stop offset="100%" stopColor={forestGreenDark} />
        </linearGradient>

        {/* Squircle Badge Background */}
        <linearGradient id="vp-badge-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#164430" />
          <stop offset="100%" stopColor="#0B241A" />
        </linearGradient>
      </defs>

      {/* Optional App Launcher Squircle Background */}
      {badgeMode && (
        <rect
          x="4"
          y="4"
          width="132"
          height="132"
          rx="32"
          fill="url(#vp-badge-bg)"
          stroke="url(#vp-official-gold)"
          strokeWidth="2.5"
        />
      )}

      <g transform={badgeMode ? 'scale(0.88) translate(9.5, 9.5)' : ''}>
        {/* 1. TOP-LEFT TO BOTTOM: Deep Forest Green Outer Arc with IoT Terminal Dot */}
        {/* Terminal IoT Dot at the top-left */}
        <circle
          cx="44"
          cy="25"
          r="4.5"
          fill={badgeMode ? '#FAF7F0' : forestGreen}
        />

        {/* Forest green circular stroke starting from the dot and curving around the left */}
        <path
          d="M 44 25 A 48 48 0 0 0 66 117"
          fill="none"
          stroke={badgeMode ? '#FAF7F0' : forestGreen}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 2. TOP-RIGHT: Metallic Gold Meter Arc & Graduation Calibration Ticks */}
        {/* Outer gold arc from 12 o'clock to 4 o'clock */}
        <path
          d="M 70 22 A 48 48 0 0 1 113 86"
          fill="none"
          stroke="url(#vp-official-gold)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Radial meter graduation tick marks pointing inward */}
        {/* Tick 1 (around 73° from vertical) */}
        <line x1="77" y1="28" x2="81" y2="35" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="84" y1="32" x2="87" y2="39" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="91" y1="37" x2="93" y2="44" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="97" y1="43" x2="98" y2="50" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="102" y1="50" x2="102" y2="57" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="106" y1="58" x2="104" y2="65" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="109" y1="67" x2="105" y2="73" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="110" y1="76" x2="105" y2="81" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="109" y1="85" x2="104" y2="89" stroke="url(#vp-official-gold)" strokeWidth="2.4" strokeLinecap="round" />

        {/* 3. BOTTOM CENTER: Wi-Fi / Wireless Transmission Icon */}
        <g transform="translate(70, 114)">
          {/* Base dot */}
          <circle cx="0" cy="0" r="3.2" fill={metallicGold} />
          {/* Wave 1 */}
          <path
            d="M -7 -6 A 9 9 0 0 1 7 -6"
            fill="none"
            stroke={metallicGold}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Wave 2 */}
          <path
            d="M -13 -13 A 17 17 0 0 1 13 -13"
            fill="none"
            stroke={metallicGold}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>

        {/* 4. CORE: Bold Classical Serif Letter "V" in Deep Forest Green */}
        <g fill={badgeMode ? '#FAF7F0' : forestGreen}>
          {/* Left Serif top bracket */}
          <path
            d="M 33 34 L 49 34 C 47 37 46 39 46 43 L 64 100 L 73 70 L 67 48 L 73 34 L 84 34 L 75 58 L 65 108 L 57 108 L 38 46 C 36 40 34 37 33 34 Z"
          />
        </g>

        {/* 5. CORE: Metallic Gold Electrical Lightning Bolt */}
        <path
          d="M 83 17 L 63 60 L 76 58 L 69 98 L 92 50 L 78 52 Z"
          fill="url(#vp-official-gold)"
          stroke={badgeMode ? forestGreenDark : '#FAF7F0'}
          strokeWidth="0.8"
        />

        {/* 6. CORE: Deep Forest Green Pulse Waveform (breaking through right border) */}
        <path
          d="M 76 68 L 84 68 L 87 56 L 93 84 L 98 48 L 102 74 L 106 68 L 126 68"
          fill="none"
          stroke={badgeMode ? '#FAF7F0' : forestGreen}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  // 1. Standalone Emblem
  if (variant === 'icon') {
    return (
      <div
        id={id}
        style={{ width: pixelSize, height: pixelSize }}
        className={`inline-flex items-center justify-center relative select-none shrink-0 ${className}`}
      >
        {renderEmblemSvg(false)}
      </div>
    );
  }

  // 2. Square App Icon
  if (variant === 'app-icon') {
    return (
      <div
        id={id}
        style={{ width: pixelSize, height: pixelSize }}
        className={`inline-flex items-center justify-center relative select-none rounded-[24%] shadow-xl overflow-hidden shrink-0 ${className}`}
      >
        {renderEmblemSvg(true)}
      </div>
    );
  }

  // 3. Full Emblem + Wordmark + Tagline Stacked (as in the uploaded visual identity)
  if (variant === 'emblem-full') {
    return (
      <div
        id={id}
        className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}
      >
        {/* Master Emblem */}
        <div style={{ width: pixelSize, height: pixelSize }} className="shrink-0 mb-3">
          {renderEmblemSvg(false)}
        </div>

        {/* Wordmark: Volt [Forest Green] + Pulse [Metallic Gold] */}
        <div className="flex items-baseline justify-center tracking-tight leading-none mb-2">
          <span
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: theme === 'ivory' ? forestGreen : '#FFFFFF', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Volt
          </span>
          <span
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: metallicGold, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Pulse
          </span>
        </div>

        {/* Centered Rule: —— IoT —— */}
        <div className="flex items-center justify-center gap-3 w-48 my-1">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C59B46] to-[#C59B46]" />
          <span
            className="text-sm font-bold tracking-[0.25em]"
            style={{ color: theme === 'ivory' ? forestGreen : '#FAF7F0' }}
          >
            IoT
          </span>
          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C59B46] to-[#C59B46]" />
        </div>

        {/* Tagline */}
        <div
          className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase mt-1"
          style={{ color: theme === 'ivory' ? forestGreen : '#C59B46' }}
        >
          SMART ENERGY. REAL-TIME INSIGHT.
        </div>
      </div>
    );
  }

  // 4. Horizontal Wordmark (Navbar & Standard Lockup)
  return (
    <div
      id={id}
      className={`inline-flex items-center gap-3 select-none ${className}`}
      style={{ height: pixelSize }}
    >
      <div style={{ width: pixelSize, height: pixelSize }} className="shrink-0">
        {renderEmblemSvg(false)}
      </div>

      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl font-black tracking-tight ${
              theme === 'ivory' ? 'text-[#164430]' : 'text-slate-100'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Volt<span style={{ color: metallicGold }}>Pulse</span>
          </span>
          <span
            className="rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-widest border ml-1"
            style={{
              backgroundColor: '#164430',
              color: '#FAF7F0',
              borderColor: '#C59B46',
            }}
          >
            IoT
          </span>
        </div>

        {showTagline ? (
          <span
            className="text-[9px] tracking-[0.18em] uppercase font-bold"
            style={{ color: theme === 'ivory' ? forestGreen : '#C59B46' }}
          >
            SMART ENERGY. REAL-TIME INSIGHT.
          </span>
        ) : (
          <span
            className={`text-[9px] tracking-wider uppercase font-semibold ${
              theme === 'ivory' ? 'text-[#164430]' : 'text-slate-400'
            }`}
          >
            Smart Energy & Power Telemetry
          </span>
        )}
      </div>
    </div>
  );
};
