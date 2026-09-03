import React, { useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Layers, ShieldCheck, Cpu, Wifi } from 'lucide-react';
import { VoltPulseLogo } from './VoltPulseLogo';

// Asset paths for high-res generated identity renders
import officialIdentityImg from '../../assets/images/voltpulse_official_identity_1788445932843.jpg';
import officialEmblemImg from '../../assets/images/voltpulse_official_emblem_1788445955257.jpg';
import emblemImg from '../../assets/images/voltpulse_emblem_1788443970834.jpg';
import wordmarkImg from '../../assets/images/voltpulse_wordmark_1788443986648.jpg';
import appIconImg from '../../assets/images/voltpulse_app_icon_1788444002184.jpg';
import controlCenterBg from '../../assets/images/voltpulse_iot_background_1788444639285.jpg';
import lightBackdropImg from '../../assets/images/voltpulse_light_backdrop_1788445665660.jpg';

interface BrandIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandIdentityModal: React.FC<BrandIdentityModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'master' | 'icon' | 'wordmark' | 'appicon' | 'bg' | 'lightbg' | 'specs'>('all');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyColorToClipboard = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const brandColors = [
    {
      name: 'Deep Forest Green',
      hex: '#164430',
      desc: 'Primary foundation, energy conservation, grid balance & electrical stability',
      textColor: 'text-emerald-100',
    },
    {
      name: 'Muted Metallic Gold',
      hex: '#C59B46',
      desc: 'Electrical conductivity, instantaneous lightning strike & meter calibration dial',
      textColor: 'text-amber-950',
    },
    {
      name: 'Warm Ivory',
      hex: '#F5EFE6',
      desc: 'High-contrast engineering canvas, pristine optical clarity & blueprint legibility',
      textColor: 'text-slate-900',
    },
    {
      name: 'Charcoal Black',
      hex: '#14181E',
      desc: 'Technical chassis grounding, hardware enclosures & meter frame structure',
      textColor: 'text-slate-100',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-[#C5A059]/40 bg-[#0D1520] p-6 text-slate-100 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#0D382B] border border-[#C5A059]/50 shadow-md">
              <VoltPulseLogo variant="icon" size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">
                  VoltPulse <span className="text-[#C5A059]">IoT</span> Brand Identity
                </h2>
                <span className="rounded-full bg-[#0D382B] px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-[#FAF7F0] border border-[#C5A059]/40">
                  Official Assets
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Smart Electricity Consumption Monitoring & Real-Time Energy Analytics Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-4 pb-2 border-b border-slate-800/80">
          {[
            { id: 'all', label: 'All Brand Assets' },
            { id: 'master', label: '★ Official Master Identity Artwork' },
            { id: 'icon', label: '1. Master Emblem' },
            { id: 'wordmark', label: '2. Wordmark & Tagline' },
            { id: 'appicon', label: '3. Square App Icon' },
            { id: 'bg', label: '4. Control Center Background' },
            { id: 'lightbg', label: '5. Light Identity Backdrop' },
            { id: 'specs', label: 'Palette & Geometry Specs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#164430] text-white border border-[#C59B46]'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* ★ MASTER OFFICIAL VISUAL IDENTITY ARTWORK */}
          {(activeTab === 'all' || activeTab === 'master') && (
            <div className="rounded-2xl border-2 border-[#C59B46]/60 bg-[#090F17] p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#164430] text-xs font-bold text-[#C59B46] border border-[#C59B46]/50">
                    ★
                  </span>
                  <h3 className="text-base font-bold text-slate-100">
                    Official Master Visual Identity Artwork
                  </h3>
                  <span className="rounded bg-[#C59B46] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950">
                    Official Spec
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#C59B46]">Full Composition • 16:9 Warm Ivory</span>
              </div>

              {/* Master Artwork Canvas Frame */}
              <div className="relative rounded-xl border border-[#C59B46]/50 overflow-hidden shadow-2xl bg-[#F5EFE6] group">
                <img
                  src={officialIdentityImg}
                  alt="VoltPulse IoT Official Master Visual Identity Artwork"
                  className="w-full h-auto max-h-[460px] object-contain object-center mx-auto transition-transform duration-700 group-hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                    TAGLINE: SMART ENERGY. REAL-TIME INSIGHT.
                  </span>
                </div>
              </div>

              {/* Composition Breakdown Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-[11px]">
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C59B46] font-bold uppercase">Transmission Pylon</div>
                  <div className="text-slate-400 mt-0.5">High-voltage utility grid tower & cables</div>
                </div>
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C59B46] font-bold uppercase">Smart Meter Display</div>
                  <div className="text-slate-400 mt-0.5">Digital readout at 230.5 kWh</div>
                </div>
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C59B46] font-bold uppercase">Frequency Sine Waves</div>
                  <div className="text-slate-400 mt-0.5">50 Hz alternating current pulse curves</div>
                </div>
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C59B46] font-bold uppercase">Analytics Bar Chart</div>
                  <div className="text-slate-400 mt-0.5">Consumption trends with IoT nodes</div>
                </div>
              </div>
            </div>
          )}

          {/* 1. STANDALONE ICON */}
          {(activeTab === 'all' || activeTab === 'icon') && (
            <div className="rounded-2xl border border-slate-800 bg-[#090F17] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#164430] text-xs font-bold text-[#C59B46]">
                    1
                  </span>
                  <h3 className="text-base font-bold text-slate-100">Standalone VoltPulse IoT Emblem</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">1:1 Ratio • Vector & High-Res</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Official High-Res Render Asset */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#F5EFE6] p-6 border border-[#C59B46]/40">
                  <img
                    src={officialEmblemImg}
                    alt="VoltPulse IoT Official Master Emblem"
                    className="h-48 w-48 object-contain rounded-lg shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <span className="mt-3 text-xs font-semibold text-[#164430]">
                    Official Master Emblem (Warm Ivory)
                  </span>
                </div>

                {/* SVG Vector Interactive Preview */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#164430] p-6 border border-[#C59B46]/40">
                  <VoltPulseLogo variant="icon" size={160} />
                  <span className="mt-3 text-xs font-semibold text-[#FAF7F0]">
                    Deep Forest Green Vector Engine
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3">
                Precision vector emblem featuring circular power-meter ring with top IoT node terminal, metallic gold meter calibration ticks,
                bottom Wi-Fi transmission waves, classic serif letter “V”, sharp metallic gold lightning bolt, and horizontal pulse waveform breaking out to the right.
              </p>
            </div>
          )}

          {/* 2. WORDMARK & OFFICIAL IDENTITY LOCKUP */}
          {(activeTab === 'all' || activeTab === 'wordmark') && (
            <div className="rounded-2xl border border-slate-800 bg-[#090F17] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#164430] text-xs font-bold text-[#C59B46]">
                    2
                  </span>
                  <h3 className="text-base font-bold text-slate-100">Official Wordmark & Tagline Lockup</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Horizontal & Full Stacked Versions</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Stacked Vector Presentation Canvas (Ivory) */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#F5EFE6] p-8 border border-[#C59B46]/40 shadow-inner">
                  <VoltPulseLogo variant="emblem-full" size={120} theme="ivory" />
                  <span className="mt-4 text-[11px] font-bold text-[#164430] tracking-wider uppercase">
                    Official Stacked Identity (Ivory Canvas)
                  </span>
                </div>

                {/* Dark Technical Horizontal & Stacked Preview */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#14181E] p-8 border border-slate-800 space-y-6">
                  <VoltPulseLogo variant="emblem-full" size={110} theme="dark" />
                  <div className="w-full pt-4 border-t border-slate-800 flex justify-center">
                    <VoltPulseLogo variant="wordmark" size={48} showTagline={true} />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-[#121824] p-3.5 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#C59B46]">Official Tagline:</span>{' '}
                  <span className="font-mono text-white tracking-wider">SMART ENERGY. REAL-TIME INSIGHT.</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:inline">Tracked Uppercase</span>
              </div>
            </div>
          )}

          {/* 3. SQUARE APP ICON */}
          {(activeTab === 'all' || activeTab === 'appicon') && (
            <div className="rounded-2xl border border-slate-800 bg-[#090F17] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D382B] text-xs font-bold text-[#C5A059]">
                    3
                  </span>
                  <h3 className="text-base font-bold text-slate-100">Square App Icon Version</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">iOS / Android / PWA App Launcher</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Full Generated Asset */}
                <div className="sm:col-span-2 flex flex-col items-center justify-center rounded-xl bg-[#14181E] p-6 border border-slate-800">
                  <img
                    src={appIconImg}
                    alt="VoltPulse IoT Mobile App Icon"
                    className="h-44 w-44 object-contain rounded-3xl shadow-xl border-2 border-[#C5A059]/40"
                    referrerPolicy="no-referrer"
                  />
                  <span className="mt-3 text-xs font-semibold text-slate-300">
                    Master Mobile App Icon (Rounded Squircle Format)
                  </span>
                </div>

                {/* Scaling verification preview */}
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-[#070B10] p-4 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Size Scalability Check
                  </span>
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <VoltPulseLogo variant="app-icon" size={64} />
                      <span className="text-[10px] font-mono text-slate-500">64px</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <VoltPulseLogo variant="app-icon" size={48} />
                      <span className="text-[10px] font-mono text-slate-500">48px</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <VoltPulseLogo variant="app-icon" size={32} />
                      <span className="text-[10px] font-mono text-slate-500">32px</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Retains optical clarity, contrast, and distinct recognition down to 32px favicon dimension.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. CONTROL CENTER UI BACKGROUND */}
          {(activeTab === 'all' || activeTab === 'bg') && (
            <div className="rounded-2xl border border-slate-800 bg-[#090F17] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0D382B] text-xs font-bold text-[#C5A059]">
                    4
                  </span>
                  <h3 className="text-base font-bold text-slate-100">Industrial IoT Control Center Background</h3>
                </div>
                <span className="text-[11px] font-mono text-[#C5A059]">16:9 • Ultra-High Resolution Canvas</span>
              </div>

              {/* Background Canvas Frame */}
              <div className="relative rounded-xl border border-[#C5A059]/40 overflow-hidden shadow-2xl group">
                <img
                  src={controlCenterBg}
                  alt="VoltPulse IoT Control Center Background"
                  className="w-full h-64 sm:h-80 object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid UI Spec Callout */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090F17] via-transparent to-transparent flex flex-col justify-end p-5">
                  <div className="rounded-xl border border-white/10 bg-[#090F17]/90 p-4 backdrop-blur-md max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
                      <Cpu className="h-4 w-4" />
                      <span>Telemetry Backdrop Architecture</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Engineered with a low-contrast dark charcoal (#14181E) and deep forest green (#0D382B) substrate,
                      etched with delicate electrical circuit traces, power-grid lines, smooth pulse waveforms, IoT connection nodes,
                      and subtle warm-gold metallic accents with vast negative space for effortless dashboard data readability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-[11px]">
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C5A059] font-bold">CIRCUIT TRACES</div>
                  <div className="text-slate-400 mt-0.5">Subtle etched PCB pathways</div>
                </div>
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C5A059] font-bold">POWER-GRID GEOMETRY</div>
                  <div className="text-slate-400 mt-0.5">Vector utility grid coordination</div>
                </div>
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C5A059] font-bold">WAVEFORM PULSES</div>
                  <div className="text-slate-400 mt-0.5">50 Hz AC frequency waveforms</div>
                </div>
                <div className="rounded-lg bg-[#14181E] p-2.5 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-[#C5A059] font-bold">GOLD HIGHLIGHTS</div>
                  <div className="text-slate-400 mt-0.5">Muted metallic conductivity accents</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. LIGHT VISUAL IDENTITY BACKDROP */}
          {(activeTab === 'all' || activeTab === 'lightbg') && (
            <div className="rounded-2xl border border-slate-800 bg-[#090F17] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF7F0] text-xs font-bold text-[#0D382B]">
                    5
                  </span>
                  <h3 className="text-base font-bold text-slate-100">Light Visual Identity Backdrop</h3>
                </div>
                <span className="text-[11px] font-mono text-[#C5A059]">16:9 • Warm Ivory Engineering Canvas</span>
              </div>

              {/* Master Light Backdrop with Centered Logo Showcase */}
              <div className="relative rounded-xl border border-[#C5A059]/40 overflow-hidden shadow-2xl group bg-[#FAF7F0]">
                {/* 16:9 Backdrop Image */}
                <img
                  src={lightBackdropImg}
                  alt="VoltPulse IoT Light Visual Identity Backdrop"
                  className="w-full h-72 sm:h-96 object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />

                {/* Centered Logo Preview directly in the soft central clearing */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
                  <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/70 backdrop-blur-sm border border-[#C5A059]/40 shadow-xl max-w-md">
                    <VoltPulseLogo variant="icon" size={80} theme="ivory" />
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-2xl font-black tracking-tight text-[#14181E]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                        Volt<span className="text-[#C5A059]">Pulse</span>
                      </span>
                      <span className="rounded bg-[#0D382B] px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-[#FAF7F0] border border-[#C5A059]/60">
                        IoT
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0D382B] tracking-wider uppercase mt-1">
                      Smart Electricity Monitoring & Energy Intelligence
                    </span>
                  </div>
                </div>

                {/* Overlaid Context Ribbon */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#14181E]/80 via-[#14181E]/40 to-transparent p-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#FAF7F0]">
                    Modern Electrical Infrastructure • European Industrial Aesthetic
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#0D382B] px-2 py-0.5 text-[10px] font-bold text-[#FAF7F0]">
                      Warm Ivory Canvas
                    </span>
                    <span className="rounded bg-[#FAF7F0] px-2 py-0.5 text-[10px] font-bold text-[#0D382B]">
                      Muted Gold Accents
                    </span>
                  </div>
                </div>
              </div>

              {/* Architectural Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-[11px]">
                <div className="rounded-lg bg-[#FAF7F0] p-2.5 border border-[#C5A059]/30 text-slate-900">
                  <div className="text-[10px] text-[#0D382B] font-bold uppercase">Abstract Pulse Curves</div>
                  <div className="text-slate-600 mt-0.5">Flowing electricity frequency arcs</div>
                </div>
                <div className="rounded-lg bg-[#FAF7F0] p-2.5 border border-[#C5A059]/30 text-slate-900">
                  <div className="text-[10px] text-[#0D382B] font-bold uppercase">Architectural Grid</div>
                  <div className="text-slate-600 mt-0.5">Subtle power transmission lines</div>
                </div>
                <div className="rounded-lg bg-[#FAF7F0] p-2.5 border border-[#C5A059]/30 text-slate-900">
                  <div className="text-[10px] text-[#0D382B] font-bold uppercase">Blueprint Details</div>
                  <div className="text-slate-600 mt-0.5">Smart meter geometry & circuits</div>
                </div>
                <div className="rounded-lg bg-[#FAF7F0] p-2.5 border border-[#C5A059]/30 text-slate-900">
                  <div className="text-[10px] text-[#0D382B] font-bold uppercase">Use Cases</div>
                  <div className="text-slate-600 mt-0.5">Splash, hero, decks & presentations</div>
                </div>
              </div>
            </div>
          )}

          {/* 6. DESIGN SPECS & PALETTE */}
          {(activeTab === 'all' || activeTab === 'specs') && (
            <div className="rounded-2xl border border-slate-800 bg-[#090F17] p-5 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C5A059]" />
                  Brand Color Palette
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click any swatch to copy its hexadecimal code to your clipboard.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  {brandColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => copyColorToClipboard(color.hex, color.name)}
                      className="group flex flex-col rounded-xl border border-slate-800 bg-[#14181E] p-3 text-left transition-all hover:border-[#C5A059]/60 hover:scale-[1.02]"
                    >
                      <div
                        className="h-16 w-full rounded-lg border border-white/10 flex items-end justify-end p-2 transition-transform shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      >
                        {copiedColor === color.name ? (
                          <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Copied
                          </span>
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{color.name}</span>
                          <span className="text-xs font-mono font-bold text-[#C5A059]">{color.hex}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">{color.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Geometric Symbology Meaning */}
              <div className="border-t border-slate-800 pt-5">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#C5A059]" />
                  Geometric Symbology & Engineering Architecture
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs">
                  <div className="rounded-xl border border-slate-800/80 bg-[#121824] p-3.5">
                    <div className="font-bold text-[#C59B46] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C59B46]" />
                      Deep Green Outer Arc & IoT Node
                    </div>
                    <p className="text-slate-400 mt-1.5 leading-relaxed">
                      Deep forest green containment perimeter starting with a circular terminal node dot, symbolizing edge sensor connectivity and continuous grid circuit protection.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-[#121824] p-3.5">
                    <div className="font-bold text-[#C59B46] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C59B46]" />
                      Gold Meter Graduation Ticks
                    </div>
                    <p className="text-slate-400 mt-1.5 leading-relaxed">
                      Radial calibration gauge markings along the gold perimeter representing utility-grade AMI smart meter calibration and active kWh measurement.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-[#121824] p-3.5">
                    <div className="font-bold text-[#C59B46] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C59B46]" />
                      Bottom Wi-Fi Transmission Waves
                    </div>
                    <p className="text-slate-400 mt-1.5 leading-relaxed">
                      Three-tier wireless radiation waves at the 6 o&apos;clock apex representing continuous IoT broadcast across Wi-Fi, MQTT, and Web Serial.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-[#121824] p-3.5">
                    <div className="font-bold text-[#C59B46] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C59B46]" />
                      Classical Serif Letter “V”
                    </div>
                    <p className="text-slate-400 mt-1.5 leading-relaxed">
                      The foundational letter “V” of VoltPulse crafted in authoritative deep forest green with top bracket serifs anchoring the core identity.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-[#121824] p-3.5">
                    <div className="font-bold text-[#C59B46] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C59B46]" />
                      Sharp Metallic Gold Lightning Bolt
                    </div>
                    <p className="text-slate-400 mt-1.5 leading-relaxed">
                      Dynamic electrical bolt emerging from the center of the V, signifying instantaneous voltage potential, high-speed sampling, and active power.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-[#121824] p-3.5">
                    <div className="font-bold text-[#C59B46] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C59B46]" />
                      Horizontal Pulse Waveform
                    </div>
                    <p className="text-slate-400 mt-1.5 leading-relaxed">
                      An electrocardiogram / 50 Hz power pulse that breaches through the right border of the dial, signifying real-time live telemetry escaping static bounds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>VoltPulse IoT Brand System • Vector Geometry Certified</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#0D382B] px-5 py-2 text-xs font-bold text-white hover:bg-[#124838] transition-colors border border-[#C5A059]/40"
          >
            Close Brand Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
