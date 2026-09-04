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
import homeBackdropBg from '../../assets/images/voltpulse_home_backdrop_1788519343186.jpg';

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
      {/* Hero Section with Official Technical Engineering Backdrop */}
      <section
        className="relative overflow-hidden rounded-3xl border-2 border-[#C59B46]/60 shadow-2xl p-6 sm:p-10 lg:p-12 transition-all"
        style={{
          backgroundImage: `url(${homeBackdropBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#F5EFE6',
        }}
      >
        {/* Ambient subtle light overlay to ensure flawless contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE6]/30 via-transparent to-[#F5EFE6]/50 pointer-events-none" />

        {/* Master VoltPulse IoT Centered Official Identity (Matching Master Artwork) */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center mb-8 pb-6 border-b border-[#C59B46]/30">
          <div className="p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-[#C59B46]/30 shadow-md">
            <VoltPulseLogo variant="emblem-full" size={130} theme="ivory" />
          </div>
        </div>

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#164430]/30 bg-[#164430]/10 px-3.5 py-1 text-xs font-bold text-[#164430]">
              <Zap className="h-3.5 w-3.5 text-[#C59B46] fill-[#C59B46]" />
              <span>Tamil Nadu Electricity Board (TNEB / TANGEDCO) Official Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#164430] leading-tight drop-shadow-sm">
              Smart Energy & <span className="text-[#C59B46]">SCADA Telemetry</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed max-w-2xl">
              Advanced AMI Smart Metering, bi-monthly TNERC LT Tariff 1A bill estimation, 100-unit free scheme subsidy tracker, and direct Minnagam 1912 outage reporting.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 rounded-xl bg-[#164430] hover:bg-[#1f5c42] px-6 py-3 text-sm font-black text-[#FAF7F0] shadow-xl shadow-[#164430]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                id="hero-launch-btn"
              >
                <span>Launch TNEB SCADA Dashboard</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5] text-[#C59B46]" />
              </button>

              <button
                onClick={() => setShowConnectModal(true)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all shadow-md ${
                  isEsp32Connected
                    ? 'bg-emerald-600 text-white shadow-emerald-950/30'
                    : 'border-2 border-[#C59B46] bg-white/90 hover:bg-white text-[#164430]'
                }`}
                id="hero-connect-esp32-btn"
              >
                <Cpu className="h-4 w-4 text-[#C59B46]" />
                <span>{isEsp32Connected ? 'ESP32 Linked ✓' : 'Connect ESP32 Hardware'}</span>
              </button>

              <button
                onClick={() => setActiveTab('bill')}
                className="flex items-center gap-2 rounded-xl border border-[#C59B46]/60 bg-white/80 hover:bg-white px-5 py-3 text-sm font-bold text-[#164430] shadow-sm transition-colors"
                id="hero-bill-btn"
              >
                <IndianRupee className="h-4 w-4 text-[#C59B46]" />
                <span>TNERC Tariff Calculator</span>
              </button>

              <button
                onClick={() => setActiveTab('alerts')}
                className="flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50/90 hover:bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800 transition-colors shadow-sm"
                id="hero-1912-btn"
              >
                <PhoneCall className="h-4 w-4 text-rose-600" />
                <span>Minnagam 1912</span>
              </button>
            </div>

            {/* Live Telemetry Ticker Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#C59B46]/30">
              <div className="rounded-xl bg-white/85 backdrop-blur-md p-3 border border-[#C59B46]/40 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-600">Current Load</div>
                <div className="text-xl font-bold font-mono-num text-[#164430] mt-0.5">
                  {isEsp32Connected ? `${(metrics.currentPowerWatts / 1000).toFixed(2)} kW` : '0.00 kW'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isEsp32Connected ? `Sanctioned: ${userProfile.sanctionedLoadKw} kW` : 'Hardware Disconnected'}
                </div>
              </div>

              <div className="rounded-xl bg-white/85 backdrop-blur-md p-3 border border-[#C59B46]/40 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-600">Today's Usage</div>
                <div className="text-xl font-bold font-mono-num text-[#164430] mt-0.5">
                  {isEsp32Connected ? `${metrics.dailyConsumptionKwh} Units` : '0.0 Units'}
                </div>
                <div className={`text-[10px] font-bold ${isEsp32Connected ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {isEsp32Connected ? 'Live Meter Stream' : 'No Reading'}
                </div>
              </div>

              <div className="rounded-xl bg-white/85 backdrop-blur-md p-3 border border-[#C59B46]/40 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-600">Bi-Monthly Est. Bill</div>
                <div className="text-xl font-bold font-mono-num text-[#C59B46] mt-0.5">
                  {isEsp32Connected && currentBillDetails ? `₹${(currentBillDetails.totalCost ?? 0).toLocaleString('en-IN')}` : '₹0.00'}
                </div>
                <div className={`text-[10px] font-bold ${isEsp32Connected ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {isEsp32Connected ? '100 Free Units Applied' : 'Awaiting ESP32 Link'}
                </div>
              </div>

              <div className="rounded-xl bg-white/85 backdrop-blur-md p-3 border border-[#C59B46]/40 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-600">TNEB Score</div>
                <div className="text-xl font-bold font-mono-num text-[#164430] mt-0.5">
                  {isEsp32Connected ? `${metrics.efficiencyScore}/100` : '-- / 100'}
                </div>
                <div className={`text-[10px] font-bold ${isEsp32Connected ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {isEsp32Connected ? 'Grade A' : 'Sensor Offline'}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right: Live IoT Telemetry Console Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border-2 border-[#C59B46]/60 bg-white/95 backdrop-blur-xl p-5 shadow-xl relative text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-[#C59B46]/30">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isEsp32Connected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                  <span className="text-xs font-bold text-[#164430] uppercase tracking-wider">
                    {isEsp32Connected ? 'TNEB Smart Meter Live Stream' : 'ESP32 Offline (0 Watts)'}
                  </span>
                </div>
                <span className="rounded-lg bg-[#FAF7F0] px-2 py-0.5 text-[10px] font-mono text-[#164430] font-bold border border-[#C59B46]/40">
                  {userProfile.consumerNumber}
                </span>
              </div>

              {/* Power Dial & Live Readout */}
              <div className="py-4 text-center">
                <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Instantaneous Grid Draw</div>
                <div className="text-4xl sm:text-5xl font-black font-mono-num text-[#164430] tracking-tight my-1">
                  {metrics.currentPowerWatts} <span className="text-lg font-bold text-[#C59B46]">Watts</span>
                </div>
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs font-mono-num text-slate-700 mt-2 font-medium">
                  <span>V: <strong className="text-slate-900">{metrics.voltageVolts}V</strong></span>
                  <span>I: <strong className="text-slate-900">{metrics.currentAmps}A</strong></span>
                  <span>PF: <strong className="text-emerald-700">{metrics.powerFactor}</strong></span>
                  <span>f: <strong className="text-slate-900">{metrics.frequencyHz}Hz</strong></span>
                </div>
              </div>

              {/* Quick Interactive Appliance Toggles */}
              <div className="mt-2 space-y-2 pt-3 border-t border-[#C59B46]/30">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Sanctioned Load Circuit Controls:</span>
                </div>
                <div className="space-y-1.5">
                  {appliances.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        app.status === 'on'
                          ? 'bg-[#FAF7F0] border-[#C59B46]/70 shadow-xs'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                            app.status === 'on'
                              ? 'bg-[#164430] text-[#C59B46]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {app.category === 'hvac' ? <AirVent className="h-4 w-4" /> : app.category === 'utility' ? <Flame className="h-4 w-4" /> : <Tv className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                            {app.name}
                          </div>
                          <div className="text-[10px] text-slate-600 font-mono font-medium">
                            {app.status === 'on' ? `${app.currentWatts} W active` : 'Off / Standby'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAppliance(app.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          app.status === 'on'
                            ? 'bg-[#164430] text-[#FAF7F0] shadow-sm font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
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
                className="mt-4 w-full rounded-xl bg-[#164430] hover:bg-[#1e583e] p-2.5 text-center text-xs font-bold text-[#FAF7F0] transition-colors flex items-center justify-center gap-1.5 border border-[#C59B46]/40 shadow-sm"
              >
                <span>Access Full TNEB SCADA Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#C59B46]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section (ECE & IoT Focus) */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#164430]/30 bg-[#164430]/10 px-3.5 py-1 text-xs font-bold text-[#164430]">
            <Radio className="h-3.5 w-3.5 text-[#C59B46]" />
            <span>TNEB Smart Metering Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#164430]">
            TANGEDCO AMI & SCADA Telemetry Architecture
          </h2>
          <p className="text-sm text-slate-700 font-medium">
            Compliant with IS 16444 standards for Automated Metering Infrastructure (AMI), cellular NB-IoT backhaul, and real-time distribution transformer telemetry.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hardwareComponents.map((comp, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border-2 border-[#C59B46]/40 bg-white/90 backdrop-blur-md p-5 transition-all hover:border-[#C59B46] hover:shadow-xl shadow-sm text-slate-800"
            >
              <div className="flex items-center justify-between pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#164430] text-xs font-bold font-mono text-[#C59B46] border border-[#C59B46]/40">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  {comp.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#164430] group-hover:text-[#C59B46] transition-colors">
                {comp.name}
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {comp.role}
              </p>

              <div className="mt-4 pt-3 border-t border-[#C59B46]/20 flex items-center justify-between text-[11px] font-mono text-emerald-800 font-semibold">
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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#164430]/30 bg-[#164430]/10 px-3.5 py-1 text-xs font-bold text-[#164430]">
            <Layers className="h-3.5 w-3.5 text-[#C59B46]" />
            <span>Official TNEB Consumer Utilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#164430]">
            Engineered for Transparency & Energy Conservation
          </h2>
          <p className="text-sm text-slate-700 font-medium">
            Empowering Tamil Nadu power consumers with real-time tariff insights, slab protection, and 24x7 service grievance handling.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {keyFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/90 backdrop-blur-md p-6 transition-all hover:border-[#C59B46] hover:shadow-xl shadow-sm text-slate-800"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#164430] text-[#C59B46] border border-[#C59B46]/40 mb-4 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#164430] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* VoltPulse IoT Brand Identity & System Showcase */}
      <section className="rounded-3xl border-2 border-[#C59B46]/50 bg-white/90 p-6 sm:p-10 shadow-xl relative overflow-hidden text-slate-800">
        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C59B46]/30 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B46]/50 bg-[#164430] px-3.5 py-1 text-xs font-bold text-[#FAF7F0] mb-3">
                <span className="h-2 w-2 rounded-full bg-[#C59B46] animate-pulse" />
                <span>VoltPulse IoT Brand System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#164430] tracking-tight">
                Engineering Identity: <span className="text-[#C59B46]">VoltPulse IoT</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed font-medium">
                A classic technology brand aesthetic merging utility power-meter geometry, instantaneous lightning strike,
                continuous electrical frequency waveforms, and decentralized IoT node telemetry.
              </p>
            </div>

            <button
              onClick={() => setShowBrandModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#164430] hover:bg-[#1f573e] px-5 py-2.5 text-xs font-bold text-[#FAF7F0] border border-[#C59B46]/60 shadow-sm transition-all hover:scale-[1.02] self-start md:self-auto"
            >
              <span>View Full Brand Guidelines & Palette</span>
              <ArrowRight className="h-4 w-4 text-[#C59B46]" />
            </button>
          </div>

          {/* ★ Official Master Brand Identity Hero Artwork (Matching uploaded design) */}
          <div className="rounded-2xl border-2 border-[#C59B46]/60 bg-[#FAF7F0] p-4 sm:p-6 shadow-md relative overflow-hidden group">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#164430] text-xs font-bold text-[#C59B46] border border-[#C59B46]/50">
                  ★
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#164430]">
                  Official Master Brand Visual Identity
                </h3>
                <span className="rounded bg-[#C59B46] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950">
                  Primary Spec
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#164430] flex items-center gap-2 font-bold">
                <span>16:9 Warm Ivory</span>
                <span>•</span>
                <span className="text-[#C59B46] font-bold">SMART ENERGY. REAL-TIME INSIGHT.</span>
              </div>
            </div>

            <div className="relative rounded-xl border border-[#C59B46]/40 overflow-hidden shadow-lg bg-[#F5EFE6]">
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
            <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/90 p-5 flex flex-col justify-between hover:border-[#C59B46] transition-colors group shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-semibold">
                  <span className="font-bold text-[#164430] uppercase tracking-wider">Asset 01</span>
                  <span className="font-mono text-[11px]">1:1 Master Emblem</span>
                </div>
                <h3 className="text-base font-bold text-[#164430] mb-1">
                  Standalone VoltPulse Emblem
                </h3>
                <p className="text-xs text-slate-600 mb-4">
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
            <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/90 p-5 flex flex-col justify-between hover:border-[#C59B46] transition-colors group shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-semibold">
                  <span className="font-bold text-[#164430] uppercase tracking-wider">Asset 02</span>
                  <span className="font-mono text-[11px]">Official Lockup</span>
                </div>
                <h3 className="text-base font-bold text-[#164430] mb-1">
                  VoltPulse IoT Official Brand Lockup
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Master vector emblem, bilingual brand typography in deep forest green and metallic gold, and official tagline.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#F5EFE6] p-6 border border-[#C59B46]/40 min-h-[220px]">
                <VoltPulseLogo variant="emblem-full" size={105} theme="ivory" />
                <span className="mt-3 text-[11px] font-mono font-bold text-[#164430]">
                  Official Master Brand Stack
                </span>
              </div>
            </div>

            {/* 3. Square App Icon */}
            <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/90 p-5 flex flex-col justify-between hover:border-[#C59B46] transition-colors group shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-semibold">
                  <span className="font-bold text-[#164430] uppercase tracking-wider">Asset 03</span>
                  <span className="font-mono text-[11px]">Square App Icon</span>
                </div>
                <h3 className="text-base font-bold text-[#164430] mb-1">
                  Mobile & PWA App Launcher
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  High-contrast Deep Forest Green squircle with metallic gold rim for iOS, Android, and browser favicons.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#F5EFE6] p-6 border border-[#C59B46]/40 min-h-[220px]">
                <img
                  src={appIconImg}
                  alt="VoltPulse IoT Square App Icon"
                  className="h-32 w-32 object-contain rounded-2xl shadow-md border border-[#C59B46]/40 transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="mt-3 text-[11px] font-mono font-bold text-[#164430]">
                  Squircle App Icon Version
                </span>
              </div>
            </div>
          </div>

          {/* Master 16:9 Backdrops Showcase (Dark Control Center & Light Visual Identity) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset 04: Industrial Control Center Canvas */}
            <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/90 p-5 overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#164430] uppercase tracking-wider text-xs">Asset 04</span>
                    <h3 className="text-base font-bold text-[#164430]">
                      Industrial IoT Control Center (16:9 Dark)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#FAF7F0] bg-[#164430] px-2 py-0.5 rounded border border-[#C59B46]/40 font-bold">
                    Control Center
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Charcoal & Deep Forest Green substrate with faint PCB traces, power-grid lines, and generous dark negative space.
                </p>
              </div>

              <div className="relative rounded-xl border border-[#C59B46]/40 overflow-hidden shadow-md h-52 sm:h-64">
                <img
                  src={controlCenterBg}
                  alt="VoltPulse IoT Industrial Control Center Background"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-end p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-[#164430] px-2 py-0.5 text-[10px] font-bold text-[#FAF7F0] border border-[#C59B46]/50">
                      50 Hz Waveforms
                    </span>
                    <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#164430] border border-[#C59B46]/40">
                      Circuit Traces
                    </span>
                    <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#164430] border border-[#C59B46]/40">
                      IoT Nodes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset 05: Warm Ivory Light Visual Identity Backdrop */}
            <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/90 p-5 overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#164430] uppercase tracking-wider text-xs">Asset 05</span>
                    <h3 className="text-base font-bold text-[#164430]">
                      Light Visual Identity Backdrop (16:9 Ivory)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#164430] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#C59B46]/60 font-bold">
                    Logo Identity
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Warm ivory engineering canvas with flowing pulse curves, blueprint geometry, and central clearing for logo focus.
                </p>
              </div>

              <div className="relative rounded-xl border border-[#C59B46]/40 overflow-hidden shadow-md h-52 sm:h-64 bg-[#FAF7F0] group">
                <img
                  src={lightBackdropImg}
                  alt="VoltPulse IoT Light Visual Identity Backdrop"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Centered Logo Preview Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#C59B46]/50 shadow-md">
                    <VoltPulseLogo variant="icon" size={38} theme="ivory" />
                    <div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="text-base font-black text-[#164430]">Volt<span className="text-[#C59B46]">Pulse</span></span>
                        <span className="text-[10px] bg-[#164430] text-[#FAF7F0] font-bold px-1.5 py-0.5 rounded">IoT</span>
                      </div>
                      <span className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Engineering Identity</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/90 to-transparent p-3 flex items-center justify-between">
                  <span className="text-[10px] text-[#164430] font-bold">Splash Screen • Hero • Presentation Decks</span>
                  <button
                    onClick={() => setShowBrandModal(true)}
                    className="text-[10px] font-bold text-[#164430] hover:underline flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3 text-[#C59B46]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette Strip */}
          <div className="rounded-2xl border border-[#C59B46]/40 bg-[#FAF7F0] p-4 sm:p-5">
            <div className="text-xs font-bold text-[#164430] mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Brand Color Palette System</span>
              <span className="text-[11px] text-[#C59B46] font-mono font-bold">Deep Forest Green • Charcoal • Warm Ivory • Metallic Gold</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-[#C59B46]/40 bg-[#164430] p-3 text-white shadow-sm">
                <div className="text-[10px] uppercase font-bold text-[#C59B46]">Primary Tone</div>
                <div className="text-xs font-bold mt-0.5">Deep Forest Green</div>
                <div className="text-[11px] font-mono text-emerald-200 mt-1">#164430</div>
              </div>
              <div className="rounded-xl border border-[#C59B46]/40 bg-[#14181E] p-3 text-white shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Chassis & Text</div>
                <div className="text-xs font-bold mt-0.5">Charcoal Black</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">#14181E</div>
              </div>
              <div className="rounded-xl border border-[#C59B46]/40 bg-[#FAF7F0] p-3 text-slate-900 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-600">Canvas & Contrast</div>
                <div className="text-xs font-bold mt-0.5">Warm Ivory</div>
                <div className="text-[11px] font-mono text-[#164430] mt-1 font-bold">#FAF7F0</div>
              </div>
              <div className="rounded-xl border border-[#C59B46]/40 bg-[#C59B46] p-3 text-slate-950 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-900">Metallic Accent</div>
                <div className="text-xs font-bold mt-0.5">Muted Gold</div>
                <div className="text-[11px] font-mono text-slate-900 mt-1 font-bold">#C59B46</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Sections CTA */}
      <section className="rounded-3xl border-2 border-[#C59B46]/60 bg-[#164430] p-6 sm:p-10 shadow-xl text-[#FAF7F0]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-[#FAF7F0]">
              Ready to manage your TNEB service connection?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl font-medium">
              Access the live AMI telemetry stream, calculate TNERC LT 1A bi-monthly tariffs, file Minnagam 1912 complaints, and optimize your Sanctioned Load.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B46] to-amber-500 hover:opacity-95 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md transition-all"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Connect ESP32</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 rounded-xl border border-[#C59B46]/60 bg-[#FAF7F0] hover:bg-white px-5 py-2.5 text-xs font-bold text-[#164430] shadow-sm transition-all"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#C59B46]" />
            </button>
            <button
              onClick={() => setActiveTab('bill')}
              className="flex items-center gap-2 rounded-xl border border-[#C59B46]/60 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-[#FAF7F0] transition-colors"
            >
              <IndianRupee className="h-3.5 w-3.5 text-[#C59B46]" />
              <span>Bill Estimator</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className="flex items-center gap-2 rounded-xl border border-rose-400/50 bg-rose-500/20 hover:bg-rose-500/30 px-4 py-2.5 text-xs font-bold text-rose-200 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 text-rose-300" />
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

