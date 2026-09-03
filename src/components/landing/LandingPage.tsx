import React from 'react';
import {
  Zap,
  Activity,
  Cpu,
  ShieldAlert,
  BarChart3,
  Sliders,
  DollarSign,
  Lightbulb,
  ArrowRight,
  Radio,
  Layers,
  CheckCircle2,
  Gauge,
  Leaf,
  Wifi,
  Terminal,
  Settings,
  Flame,
  AirVent,
  Tv,
  Building2,
  PhoneCall,
  IndianRupee,
  FileText,
  Usb,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { ConnectEsp32Modal } from '../esp32/ConnectEsp32Modal';
import { VoltPulseLogo } from '../brand/VoltPulseLogo';
import { BrandIdentityModal } from '../brand/BrandIdentityModal';
import officialIdentityImg from '../../assets/images/voltpulse_official_identity_1788445932843.jpg';
import officialEmblemImg from '../../assets/images/voltpulse_official_emblem_1788445955257.jpg';
import emblemImg from '../../assets/images/voltpulse_emblem_1788443970834.jpg';
import wordmarkImg from '../../assets/images/voltpulse_wordmark_1788443986648.jpg';
import appIconImg from '../../assets/images/voltpulse_app_icon_1788444002184.jpg';
import controlCenterBg from '../../assets/images/voltpulse_iot_background_1788444639285.jpg';
import lightBackdropImg from '../../assets/images/voltpulse_light_backdrop_1788445665660.jpg';

export const LandingPage: React.FC = () => {
  const { setActiveTab, metrics, appliances, toggleAppliance, userProfile, calculateBill, isEsp32Connected } = useEnergy();
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const [showBrandModal, setShowBrandModal] = React.useState(false);

  const currentBillDetails = isEsp32Connected ? calculateBill(metrics.dailyConsumptionKwh * 60) : null;

  const keyFeatures = [
    {
      icon: Activity,
      title: 'TNEB AMI Smart Meter Telemetry',
      description: 'Continuous DLMS/COSEM sampling of active power (kW), line voltage, load current, and power factor with direct TANGEDCO SCADA link.',
      color: 'sky',
    },
    {
      icon: Sliders,
      title: 'Appliance-Level Circuit Disaggregation',
      description: 'Isolate circuit-level consumption from high-draw HVAC and water pumps down to standby loads to protect your 5kW Sanctioned Load limit.',
      color: 'amber',
    },
    {
      icon: IndianRupee,
      title: 'TNERC LT Tariff 1A Bill Engine',
      description: 'Official Tamil Nadu bi-monthly slab calculator with automatic 100-unit free scheme subsidy deduction and FPPCA adjustment.',
      color: 'emerald',
    },
    {
      icon: ShieldAlert,
      title: 'Minnagam 1912 & Outage Dispatch',
      description: 'Instant automated alerts for feeder line trips, scheduled substation maintenance, sanctioned load violations, and direct 1912 filing.',
      color: 'rose',
    },
    {
      icon: Lightbulb,
      title: 'TNEB Slab Escalation Advisor',
      description: 'Proactive energy-saving advisor designed to keep your bi-monthly consumption below higher penal tariff slabs (₹8.00–₹11.00/unit).',
      color: 'amber',
    },
    {
      icon: Leaf,
      title: 'Grid Power Factor & Eco Rating',
      description: 'Maintains optimal 0.98+ power factor to prevent low-PF penalties and computes carbon savings across Tamil Nadu generation mix.',
      color: 'teal',
    },
  ];

  const hardwareComponents = [
    {
      name: 'TNEB AMI Smart Meter Class 1.0',
      category: 'Smart Metering & Telemetry',
      role: 'IS 16444 / IS 15959 compliant static electronic meter measuring bi-directional active and reactive energy.',
      spec: '240V AC / 10-60A Class 1.0',
    },
    {
      name: 'ESP32 SCADA IoT Gateway',
      category: 'Processing & Headend Link',
      role: 'Dual-core 240MHz processor communicating with TANGEDCO SCADA headend via opto-isolated RS-485 / NB-IoT.',
      spec: 'TLS 1.3 / MQTT QoS-1',
    },
    {
      name: 'Split-Core CT Sensor Array',
      category: 'Sub-Circuit Monitoring',
      role: 'Non-invasive high-precision Current Transformers (100A/50mA) monitoring critical household distribution circuits.',
      spec: 'Non-invasive 100A RMS',
    },
    {
      name: 'Minnagam 1912 Integration Engine',
      category: 'Grievance & Outage System',
      role: 'Automated bi-directional integration with Tamil Nadu Centralized 24x7 Customer Care Centre.',
      spec: 'TANGEDCO REST API / 1912',
    },
  ];

  return (
    <div className="space-y-16 py-4 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] via-[#040e24] to-[#020713] p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Tamil Nadu Electricity Board (TNEB / TANGEDCO) Official Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              VoltPulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-sky-400">IoT</span>: Smart Energy Portal
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Advanced AMI Smart Metering, bi-monthly TNERC LT Tariff 1A bill estimation, 100-unit free scheme subsidy tracker, and direct Minnagam 1912 outage reporting.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                id="hero-launch-btn"
              >
                <span>Launch TNEB SCADA Dashboard</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => setShowConnectModal(true)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all shadow-md ${
                  isEsp32Connected
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-950/40'
                    : 'border border-amber-400/50 bg-[#081b3d] text-amber-300 hover:bg-[#0c2e6b]'
                }`}
                id="hero-connect-esp32-btn"
              >
                <Cpu className="h-4 w-4 text-amber-400" />
                <span>{isEsp32Connected ? 'ESP32 Linked ✓' : 'Connect ESP32 Hardware'}</span>
              </button>

              <button
                onClick={() => setActiveTab('bill')}
                className="flex items-center gap-2 rounded-xl border border-[#1a365d] bg-[#09224f]/80 hover:bg-[#0c2e6b] px-5 py-3 text-sm font-bold text-white transition-colors"
                id="hero-bill-btn"
              >
                <IndianRupee className="h-4 w-4 text-amber-400" />
                <span>TNERC Tariff Calculator</span>
              </button>

              <button
                onClick={() => setActiveTab('alerts')}
                className="flex items-center gap-2 rounded-xl border border-[#1a365d] bg-[#030b1e] hover:bg-[#071738] px-4 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                id="hero-1912-btn"
              >
                <PhoneCall className="h-4 w-4 text-rose-400" />
                <span>Minnagam 1912</span>
              </button>
            </div>

            {/* Live Telemetry Ticker Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1a365d]">
              <div className="rounded-xl bg-[#030b1e] p-3 border border-[#1a365d]">
                <div className="text-[11px] text-slate-400">Current Load</div>
                <div className="text-xl font-bold font-mono-num text-amber-300 mt-0.5">
                  {isEsp32Connected ? `${(metrics.currentPowerWatts / 1000).toFixed(2)} kW` : '0.00 kW'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isEsp32Connected ? `Sanctioned: ${userProfile.sanctionedLoadKw} kW` : 'Hardware Disconnected'}
                </div>
              </div>

              <div className="rounded-xl bg-[#030b1e] p-3 border border-[#1a365d]">
                <div className="text-[11px] text-slate-400">Today's Usage</div>
                <div className="text-xl font-bold font-mono-num text-slate-100 mt-0.5">
                  {isEsp32Connected ? `${metrics.dailyConsumptionKwh} Units` : '0.0 Units'}
                </div>
                <div className={`text-[10px] ${isEsp32Connected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isEsp32Connected ? 'Live Meter Stream' : 'No Reading'}
                </div>
              </div>

              <div className="rounded-xl bg-[#030b1e] p-3 border border-[#1a365d]">
                <div className="text-[11px] text-slate-400">Bi-Monthly Est. Bill</div>
                <div className="text-xl font-bold font-mono-num text-amber-300 mt-0.5">
                  {isEsp32Connected && currentBillDetails ? `₹${(currentBillDetails.totalCost ?? 0).toLocaleString('en-IN')}` : '₹0.00'}
                </div>
                <div className={`text-[10px] font-bold ${isEsp32Connected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isEsp32Connected ? '100 Free Units Applied' : 'Awaiting ESP32 Link'}
                </div>
              </div>

              <div className="rounded-xl bg-[#030b1e] p-3 border border-[#1a365d]">
                <div className="text-[11px] text-slate-400">TNEB Score</div>
                <div className="text-xl font-bold font-mono-num text-sky-300 mt-0.5">
                  {isEsp32Connected ? `${metrics.efficiencyScore}/100` : '-- / 100'}
                </div>
                <div className={`text-[10px] font-semibold ${isEsp32Connected ? 'text-sky-400' : 'text-slate-500'}`}>
                  {isEsp32Connected ? 'Grade A' : 'Sensor Offline'}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right: Live IoT Telemetry Console Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#1a365d]">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isEsp32Connected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {isEsp32Connected ? 'TNEB Smart Meter Live Stream' : 'ESP32 Offline (0 Watts)'}
                  </span>
                </div>
                <span className="rounded bg-[#030b1e] px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-500/30">
                  {userProfile.consumerNumber}
                </span>
              </div>

              {/* Power Dial & Live Readout */}
              <div className="py-4 text-center">
                <div className="text-xs text-slate-400 font-medium">Instantaneous Grid Draw</div>
                <div className="text-4xl sm:text-5xl font-black font-mono-num text-amber-300 tracking-tight my-1">
                  {metrics.currentPowerWatts} <span className="text-lg font-normal text-slate-400">Watts</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-mono-num text-slate-400 mt-2">
                  <span>V: <strong className="text-slate-200">{metrics.voltageVolts}V</strong></span>
                  <span>I: <strong className="text-slate-200">{metrics.currentAmps}A</strong></span>
                  <span>PF: <strong className="text-emerald-300">{metrics.powerFactor}</strong></span>
                  <span>f: <strong className="text-slate-200">{metrics.frequencyHz}Hz</strong></span>
                </div>
              </div>

              {/* Quick Interactive Appliance Toggles */}
              <div className="mt-2 space-y-2 pt-3 border-t border-[#1a365d]">
                <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>Sanctioned Load Circuit Controls:</span>
                </div>
                <div className="space-y-1.5">
                  {appliances.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        app.status === 'on'
                          ? 'bg-[#09224f] border-sky-500/40'
                          : 'bg-[#030b1e] border-[#1a365d]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                            app.status === 'on'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-[#040e24] text-slate-400'
                          }`}
                        >
                          {app.category === 'hvac' ? <AirVent className="h-4 w-4" /> : app.category === 'utility' ? <Flame className="h-4 w-4" /> : <Tv className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 truncate max-w-[170px]">
                            {app.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {app.status === 'on' ? `${app.currentWatts} W active` : 'Off / Standby'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAppliance(app.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          app.status === 'on'
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-[#040e24] text-slate-400 hover:text-white border border-[#1a365d]'
                        }`}
                        id={`landing-toggle-${app.id}`}
                      >
                        {app.status === 'on' ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Full Dashboard Banner */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-4 w-full rounded-xl bg-[#09224f] hover:bg-[#0c2e6b] p-2.5 text-center text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors flex items-center justify-center gap-1.5 border border-[#1a365d]"
              >
                <span>Access Full TNEB SCADA Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section (ECE & IoT Focus) */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-300">
            <Radio className="h-3.5 w-3.5" />
            <span>TNEB Smart Metering Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            TANGEDCO AMI & SCADA Telemetry Architecture
          </h2>
          <p className="text-sm text-slate-400">
            Compliant with IS 16444 standards for Automated Metering Infrastructure (AMI), cellular NB-IoT backhaul, and real-time distribution transformer telemetry.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hardwareComponents.map((comp, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-[#1a365d] bg-[#081b3d] p-5 transition-all hover:border-sky-400/50 hover:bg-[#0c2552] hover:shadow-xl"
            >
              <div className="flex items-center justify-between pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-bold font-mono text-amber-300 border border-amber-500/30">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {comp.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {comp.name}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {comp.role}
              </p>

              <div className="mt-4 pt-3 border-t border-[#1a365d] flex items-center justify-between text-[11px] font-mono text-sky-300">
                <span>Spec:</span>
                <span>{comp.spec}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
            <Layers className="h-3.5 w-3.5" />
            <span>Official TNEB Consumer Utilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Engineered for Transparency & Energy Conservation
          </h2>
          <p className="text-sm text-slate-400">
            Empowering Tamil Nadu power consumers with real-time tariff insights, slab protection, and 24x7 service grievance handling.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {keyFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#1a365d] bg-[#081b3d] p-6 transition-all hover:border-amber-400/40 hover:bg-[#0a234e]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* VoltPulse IoT Brand Identity & System Showcase */}
      <section className="rounded-3xl border border-[#C5A059]/40 bg-gradient-to-b from-[#0D1520] via-[#090F17] to-[#050A10] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0D382B]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/50 bg-[#0D382B] px-3.5 py-1 text-xs font-bold text-[#FAF7F0] mb-3">
                <span className="h-2 w-2 rounded-full bg-[#C5A059] animate-pulse" />
                <span>VoltPulse IoT Brand System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FAF7F0] tracking-tight">
                Engineering Identity: <span className="text-[#C5A059]">VoltPulse IoT</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                A classic technology brand aesthetic merging utility power-meter geometry, instantaneous lightning strike,
                continuous electrical frequency waveforms, and decentralized IoT node telemetry.
              </p>
            </div>

            <button
              onClick={() => setShowBrandModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0D382B] hover:bg-[#124838] px-5 py-2.5 text-xs font-bold text-[#FAF7F0] border border-[#C5A059]/60 shadow-lg shadow-black/40 transition-all hover:scale-[1.02] self-start md:self-auto"
            >
              <span>View Full Brand Guidelines & Palette</span>
              <ArrowRight className="h-4 w-4 text-[#C5A059]" />
            </button>
          </div>

          {/* ★ Official Master Brand Identity Hero Artwork (Matching uploaded design) */}
          <div className="rounded-2xl border-2 border-[#C59B46]/60 bg-[#090F17] p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#164430] text-xs font-bold text-[#C59B46] border border-[#C59B46]/50">
                  ★
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-100">
                  Official Master Brand Visual Identity
                </h3>
                <span className="rounded bg-[#C59B46] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950">
                  Primary Spec
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#C59B46] flex items-center gap-2">
                <span>16:9 Warm Ivory</span>
                <span>•</span>
                <span className="text-slate-300 font-bold">SMART ENERGY. REAL-TIME INSIGHT.</span>
              </div>
            </div>

            <div className="relative rounded-xl border border-[#C59B46]/40 overflow-hidden shadow-2xl bg-[#F5EFE6]">
              <img
                src={officialIdentityImg}
                alt="VoltPulse IoT Official Master Brand Visual Identity"
                className="w-full h-auto max-h-[480px] object-contain object-center mx-auto transition-transform duration-700 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* 3 Core Deliverables Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Standalone Emblem */}
            <div className="rounded-2xl border border-slate-800/90 bg-[#121824]/80 p-5 flex flex-col justify-between hover:border-[#C5A059]/50 transition-colors group">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-bold text-[#C59B46] uppercase tracking-wider">Asset 01</span>
                  <span className="font-mono text-[11px]">1:1 Master Emblem</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-1">
                  Standalone VoltPulse Emblem
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Integrated circular power-meter ring, subtle “V” chevron, central electrical lightning bolt, and IoT node terminals.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#F5EFE6] p-6 border border-[#C59B46]/40 min-h-[220px]">
                <img
                  src={officialEmblemImg}
                  alt="VoltPulse IoT Master Emblem"
                  className="h-36 w-36 object-contain transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="mt-3 text-[11px] font-mono font-bold text-[#164430]">
                  Official Warm Ivory Lockup
                </span>
              </div>
            </div>

            {/* 2. Wordmark Logo */}
            <div className="rounded-2xl border border-slate-800/90 bg-[#121824]/80 p-5 flex flex-col justify-between hover:border-[#C5A059]/50 transition-colors group">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-bold text-[#C5A059] uppercase tracking-wider">Asset 02</span>
                  <span className="font-mono text-[11px]">Horizontal Lockup</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-1">
                  Icon + “VoltPulse IoT” Wordmark
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Master emblem paired with modern technical sans-serif typography in charcoal black and muted metallic gold.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#FAF7F0] p-6 border border-[#C5A059]/30 min-h-[220px]">
                <img
                  src={wordmarkImg}
                  alt="VoltPulse IoT Wordmark"
                  className="w-full h-auto max-h-28 object-contain transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="mt-3 text-[11px] font-mono font-bold text-[#14181E]">
                  Corporate Engineering Lockup
                </span>
              </div>
            </div>

            {/* 3. Square App Icon */}
            <div className="rounded-2xl border border-slate-800/90 bg-[#121824]/80 p-5 flex flex-col justify-between hover:border-[#C5A059]/50 transition-colors group">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-bold text-[#C5A059] uppercase tracking-wider">Asset 03</span>
                  <span className="font-mono text-[11px]">Square App Icon</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-1">
                  Mobile & PWA App Launcher
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  High-contrast Deep Forest Green squircle with metallic gold rim for iOS, Android, and browser favicons.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#14181E] p-6 border border-slate-800 min-h-[220px]">
                <img
                  src={appIconImg}
                  alt="VoltPulse IoT Square App Icon"
                  className="h-32 w-32 object-contain rounded-2xl shadow-xl border border-[#C5A059]/40 transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="mt-3 text-[11px] font-mono font-bold text-slate-300">
                  Squircle App Icon Version
                </span>
              </div>
            </div>
          </div>

          {/* Master 16:9 Backdrops Showcase (Dark Control Center & Light Visual Identity) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset 04: Industrial Dark Control Center Canvas */}
            <div className="rounded-2xl border border-[#C5A059]/40 bg-[#121824]/90 p-5 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#C5A059] uppercase tracking-wider text-xs">Asset 04</span>
                    <h3 className="text-base font-bold text-slate-100">
                      Industrial IoT Control Center (16:9 Dark)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#C5A059] bg-[#0D382B] px-2 py-0.5 rounded border border-[#C5A059]/40">
                    Control Center
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Charcoal & Deep Forest Green substrate with faint PCB traces, power-grid lines, and generous dark negative space.
                </p>
              </div>

              <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-2xl h-52 sm:h-64">
                <img
                  src={controlCenterBg}
                  alt="VoltPulse IoT Industrial Control Center Background"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090F17]/95 via-transparent to-black/20 flex items-end p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-[#0D382B] px-2 py-0.5 text-[10px] font-bold text-[#FAF7F0] border border-[#C5A059]/50">
                      50 Hz Waveforms
                    </span>
                    <span className="rounded bg-[#14181E] px-2 py-0.5 text-[10px] font-bold text-[#C5A059] border border-white/10">
                      Circuit Traces
                    </span>
                    <span className="rounded bg-[#14181E] px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-white/10">
                      IoT Nodes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset 05: Warm Ivory Light Visual Identity Backdrop */}
            <div className="rounded-2xl border border-[#C5A059]/40 bg-[#121824]/90 p-5 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#C5A059] uppercase tracking-wider text-xs">Asset 05</span>
                    <h3 className="text-base font-bold text-slate-100">
                      Light Visual Identity Backdrop (16:9 Ivory)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#0D382B] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#C5A059]/60 font-bold">
                    Logo Identity
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Warm ivory engineering canvas with flowing pulse curves, blueprint geometry, and central clearing for logo focus.
                </p>
              </div>

              <div className="relative rounded-xl border border-[#C5A059]/40 overflow-hidden shadow-2xl h-52 sm:h-64 bg-[#FAF7F0] group">
                <img
                  src={lightBackdropImg}
                  alt="VoltPulse IoT Light Visual Identity Backdrop"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Centered Logo Preview Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#C5A059]/40 shadow-lg">
                    <VoltPulseLogo variant="icon" size={38} theme="ivory" />
                    <div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-base font-black text-[#14181E]">Volt<span className="text-[#C5A059]">Pulse</span></span>
                        <span className="text-[10px] bg-[#0D382B] text-[#FAF7F0] font-bold px-1.5 py-0.5 rounded">IoT</span>
                      </div>
                      <span className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Engineering Identity</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#14181E]/70 to-transparent p-3 flex items-center justify-between">
                  <span className="text-[10px] text-[#FAF7F0] font-bold">Splash Screen • Hero • Presentation Decks</span>
                  <button
                    onClick={() => setShowBrandModal(true)}
                    className="text-[10px] font-bold text-[#C5A059] hover:underline flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette Strip */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#14181E]/60 p-4 sm:p-5">
            <div className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Brand Color Palette System</span>
              <span className="text-[11px] text-[#C5A059] font-mono">Deep Forest Green • Charcoal • Warm Ivory • Metallic Gold</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-white/10 bg-[#0D382B] p-3 text-white">
                <div className="text-[10px] uppercase font-bold text-emerald-300">Primary Tone</div>
                <div className="text-xs font-bold mt-0.5">Deep Forest Green</div>
                <div className="text-[11px] font-mono text-emerald-200/80 mt-1">#0D382B</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#14181E] p-3 text-white">
                <div className="text-[10px] uppercase font-bold text-slate-400">Chassis & Text</div>
                <div className="text-xs font-bold mt-0.5">Charcoal Black</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">#14181E</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#FAF7F0] p-3 text-slate-900">
                <div className="text-[10px] uppercase font-bold text-slate-600">Canvas & Contrast</div>
                <div className="text-xs font-bold mt-0.5">Warm Ivory</div>
                <div className="text-[11px] font-mono text-slate-700 mt-1">#FAF7F0</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#C5A059] p-3 text-amber-950">
                <div className="text-[10px] uppercase font-bold text-amber-900">Metallic Accent</div>
                <div className="text-xs font-bold mt-0.5">Muted Gold</div>
                <div className="text-[11px] font-mono text-amber-900 mt-1">#C5A059</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Sections CTA */}
      <section className="rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#040e24] to-[#09224f] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <h3 className="text-xl font-bold text-white">
              Ready to manage your TNEB service connection?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Access the live AMI telemetry stream, calculate TNERC LT 1A bi-monthly tariffs, file Minnagam 1912 complaints, and optimize your Sanctioned Load.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-sky-500 hover:opacity-95 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md transition-all"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Connect ESP32</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 rounded-xl border border-[#1a365d] bg-[#09224f] hover:bg-[#0c2e6b] px-5 py-2.5 text-xs font-black text-white shadow-md transition-all"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('bill')}
              className="flex items-center gap-2 rounded-xl border border-[#1a365d] bg-[#09224f] hover:bg-[#0c2e6b] px-4 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <IndianRupee className="h-3.5 w-3.5 text-amber-400" />
              <span>Bill Estimator</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className="flex items-center gap-2 rounded-xl border border-[#1a365d] bg-[#030b1e] hover:bg-[#061838] px-4 py-2.5 text-xs font-semibold text-rose-300 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 text-rose-400" />
              <span>Minnagam 1912</span>
            </button>
          </div>
        </div>
      </section>

      {/* Connect ESP32 Hardware Modal */}
      <ConnectEsp32Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
};

