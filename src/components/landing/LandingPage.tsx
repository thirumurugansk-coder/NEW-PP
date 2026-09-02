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

export const LandingPage: React.FC = () => {
  const { setActiveTab, metrics, appliances, toggleAppliance, userProfile, calculateBill, isSerialConnected } = useEnergy();
  const [showConnectModal, setShowConnectModal] = React.useState(false);

  const currentBillDetails = calculateBill(metrics.dailyConsumptionKwh * 60);

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
              TNEB <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-sky-400">SmartGrid</span>: Consumer Energy Portal
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
                  isSerialConnected
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-950/40'
                    : 'border border-amber-400/50 bg-[#081b3d] text-amber-300 hover:bg-[#0c2e6b]'
                }`}
                id="hero-connect-esp32-btn"
              >
                <Cpu className="h-4 w-4 text-amber-400" />
                <span>{isSerialConnected ? 'ESP32 Linked ✓' : 'Connect ESP32 Hardware'}</span>
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
                  {(metrics.currentPowerWatts / 1000).toFixed(2)} kW
                </div>
                <div className="text-[10px] text-slate-400">Sanctioned: {userProfile.sanctionedLoadKw} kW</div>
              </div>

              <div className="rounded-xl bg-[#030b1e] p-3 border border-[#1a365d]">
                <div className="text-[11px] text-slate-400">Today's Usage</div>
                <div className="text-xl font-bold font-mono-num text-slate-100 mt-0.5">
                  {metrics.dailyConsumptionKwh} Units
                </div>
                <div className="text-[10px] text-emerald-400">Normal Range</div>
              </div>

              <div className="rounded-xl bg-[#030b1e] p-3 border border-[#1a365d]">
                <div className="text-[11px] text-slate-400">Bi-Monthly Est. Bill</div>
                <div className="text-xl font-bold font-mono-num text-amber-300 mt-0.5">
                  ₹{((currentBillDetails?.totalCost ?? currentBillDetails?.totalAmountPayable ?? 0)).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">100 Free Units Applied</div>
              </div>

              <div className="rounded-xl bg-[#030b1e] p-3 border border-[#1a365d]">
                <div className="text-[11px] text-slate-400">TNEB Score</div>
                <div className="text-xl font-bold font-mono-num text-sky-300 mt-0.5">
                  {metrics.efficiencyScore}/100
                </div>
                <div className="text-[10px] text-sky-400 font-semibold">Grade A</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Live IoT Telemetry Console Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#1a365d]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    TNEB Smart Meter Live Stream
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

