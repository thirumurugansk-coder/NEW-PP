import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Zap,
  Activity,
  Calendar,
  DollarSign,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Sliders,
  ArrowUpRight,
  Flame,
  AirVent,
  Tv,
  Cpu,
  Refrigerator,
  Sparkles,
  Info,
  Radio,
  Building2,
  PhoneCall,
  ShieldAlert,
  Clock,
  IndianRupee,
  Usb,
  Wifi,
  Power,
  ChevronRight,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { ConnectEsp32Modal } from '../esp32/ConnectEsp32Modal';

export const DashboardOverview: React.FC = () => {
  const {
    metrics,
    appliances,
    toggleAppliance,
    liveTelemetry,
    dailyTelemetry,
    alerts,
    suggestions,
    applySuggestion,
    setActiveTab,
    triggerGoalCelebration,
    userProfile,
    outageNotices,
    iotConfig,
    isSerialConnected,
    connectWebSerial,
    disconnectWebSerial,
    dataSourceMode,
  } = useEnergy();

  const [chartMode, setChartMode] = useState<'live' | '24h'>('live');
  const [showConnectModal, setShowConnectModal] = useState(false);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const topAppliances = [...appliances].sort((a, b) => b.currentWatts - a.currentWatts);

  // Pie chart breakdown data with TNEB colors
  const categoryColors: Record<string, string> = {
    hvac: '#0284c7', // sky
    kitchen: '#06b6d4', // cyan
    utility: '#f59e0b', // amber
    ev: '#8b5cf6', // purple
    workstation: '#3b82f6', // blue
    entertainment: '#ec4899', // pink
    lighting: '#eab308', // gold
  };

  const appliancePieData = appliances
    .filter((a) => a.currentWatts > 0)
    .map((a) => ({
      name: a.name,
      value: a.currentWatts,
      color: categoryColors[a.category] || '#0284c7',
    }));

  return (
    <div className="space-y-6">
      {/* Official TNEB Substation & Consumer Live Telemetry Header Banner */}
      <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#09224f] to-[#040e24] p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-sky-600 text-slate-950 shadow-md font-black">
              <Zap className="h-6 w-6 text-slate-950" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></span>
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  TNEB Smart Meter Console (LT Tariff 1A)
                </h2>
                <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
                  {userProfile?.serviceConnectionType || userProfile?.phaseType || '3-Phase LT Domestic'}
                </span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  100 Free Units Active ✓
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Consumer: <strong className="text-white">{userProfile?.fullName || userProfile?.name || 'Er. S. Thirumurugan'}</strong> • No: <strong className="text-amber-300 font-mono">{userProfile?.consumerNumber || '09-245-014-1082'}</strong> • Section: <strong className="text-sky-200">{userProfile?.sectionOffice || 'Guindy'}</strong> ({userProfile?.distributionCircle || userProfile?.circle || 'Chennai South EDC'})
              </p>
            </div>
          </div>

          {/* Substation & Feeder Electrical Health Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-num">
            <div className="rounded-lg bg-[#030b1e]/90 px-3 py-1.5 border border-[#1a365d]">
              <span className="text-slate-400 text-[10px] block">Feeder Line</span>
              <span className="font-bold text-sky-300">{userProfile?.distributionTransformer || userProfile?.transformerId || 'DT-GND-014'}</span>
            </div>
            <div className="rounded-lg bg-[#030b1e]/90 px-3 py-1.5 border border-[#1a365d]">
              <span className="text-slate-400 text-[10px] block">RMS Voltage</span>
              <span className="font-bold text-white">{metrics.voltageVolts} V</span>
            </div>
            <div className="rounded-lg bg-[#030b1e]/90 px-3 py-1.5 border border-[#1a365d]">
              <span className="text-slate-400 text-[10px] block">Current / PF</span>
              <span className="font-bold text-emerald-400">{metrics.currentAmps}A ({metrics.powerFactor})</span>
            </div>
            <div className="rounded-lg bg-[#030b1e]/90 px-3 py-1.5 border border-[#1a365d] hidden sm:block">
              <span className="text-slate-400 text-[10px] block">Grid Freq</span>
              <span className="font-bold text-amber-300">{metrics.frequencyHz} Hz</span>
            </div>
          </div>
        </div>
      </div>

      {/* ESP32 Hardware Integration Quick Connect Bar */}
      <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-r from-[#030b1e] via-[#071b3b] to-[#030b1e] p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow ${
            isSerialConnected
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-gradient-to-br from-amber-400 to-sky-500 text-slate-950'
          }`}>
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>ESP32 Physical Hardware Integration</span>
              </h3>
              <span className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                isSerialConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              }`}>
                {isSerialConnected ? 'CONNECTED @ 115200' : 'METER NOT CONNECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isSerialConnected
                ? 'Streaming active measurements directly from your ESP32 + PZEM-004T / CT sensor module.'
                : 'Connect your physical ESP32 microcontroller via USB Web Serial, WiFi WebSocket, or MQTT to monitor real circuit currents.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowConnectModal(true)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition-all shadow-md ${
              isSerialConnected
                ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                : 'bg-gradient-to-r from-amber-400 via-sky-400 to-sky-500 hover:opacity-95 text-slate-950'
            }`}
            id="dash-connect-esp32-btn"
          >
            <Usb className="h-4 w-4" />
            <span>{isSerialConnected ? 'Manage ESP32 Link' : 'Connect ESP32 Hardware'}</span>
          </button>

          <button
            onClick={() => setActiveTab('esp32')}
            className="flex items-center gap-1 rounded-xl border border-[#1a365d] bg-[#081b3d] hover:bg-[#0d2a5e] px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
          >
            <span>Firmware &amp; Pinout</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards (Tailored for TNEB Consumer Use) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Current Power Active Draw */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Instantaneous Load
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Zap className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-num text-white tracking-tight">
              {metrics.currentPowerWatts}
            </span>
            <span className="text-xs font-medium text-slate-400">Watts ({metrics.currentPowerKw} kW)</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1a365d]">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Activity className="h-3 w-3 animate-pulse" />
              <span>Sanctioned: {userProfile.sanctionedLoadKw} kW</span>
            </div>
            <span className="font-mono-num text-amber-300 font-bold">
              {metrics.tnebSanctionedLoadPercent || 36}% capacity
            </span>
          </div>
        </div>

        {/* Metric 2: Daily Consumption */}
        <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Today's Consumption
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-num text-white tracking-tight">
              {metrics.dailyConsumptionKwh}
            </span>
            <span className="text-xs font-medium text-slate-400">Units (kWh)</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1a365d]">
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingDown className="h-3 w-3" />
              <span>-5.4% vs yesterday</span>
            </div>
            <span className="font-mono-num font-semibold text-slate-200">
              Run-rate: ~{(metrics.dailyConsumptionKwh * 30).toFixed(0)} units/mo
            </span>
          </div>
        </div>

        {/* Metric 3: Estimated TNEB Bi-Monthly Bill */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              TNEB Bi-Monthly Bill
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              ₹
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-num text-amber-300 tracking-tight">
              ₹{metrics.estimatedBiMonthlyBillINR || 1240}
            </span>
            <span className="text-xs font-medium text-slate-400">for 60 days</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1a365d]">
            <span className="text-emerald-400 font-semibold">100 Free Units Saved ₹450</span>
            <button
              onClick={() => setActiveTab('bill')}
              className="text-sky-400 hover:underline flex items-center gap-0.5 font-semibold"
            >
              <span>View Slabs</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Metric 4: Energy Efficiency Score */}
        <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Grid Efficiency Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Gauge className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono-num text-emerald-300 tracking-tight">
              {metrics.efficiencyScore}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
            <span className="ml-auto rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
              {metrics.efficiencyScore > 80 ? 'Grade A+' : metrics.efficiencyScore > 65 ? 'Grade B' : 'Grade C'}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1a365d]">
            <span>CO2: {metrics.carbonFootprintKg} kg</span>
            <button
              onClick={() => setActiveTab('advisor')}
              className="text-sky-400 hover:underline flex items-center gap-0.5 font-semibold"
            >
              <span>Tips</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* TNERC 100 Free Units & Bi-Monthly Tariff Milestone Tracker */}
      <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#09224f] to-[#040e24] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1a365d]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span>TNERC Bi-Monthly Slab Progress (100 Free Units Scheme)</span>
              </h3>
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-500/30 font-bold">
                {metrics.monthlyConsumptionKwh} / {metrics.goalKwh} Units
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Tamil Nadu Govt provides first 100 units 100% free under Domestic Tariff 1A. Slabs escalate past 200/400/500 units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerGoalCelebration}
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 text-xs font-bold text-amber-300 transition-colors"
              title="Test slab optimization target"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Within Free Tier Target</span>
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs font-mono-num text-slate-300">
            <span className="text-emerald-400 font-bold">0 – 100 Free (₹0)</span>
            <span className="text-sky-300 font-bold">101 – 200 (₹2.25)</span>
            <span className="text-amber-300 font-bold">201 – 400 (₹4.50)</span>
            <span className="text-rose-400 font-bold">&gt; 500 (₹8.00+)</span>
          </div>

          <div className="h-3.5 w-full overflow-hidden rounded-full bg-[#030b1e] p-0.5 border border-[#1a365d]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                metrics.goalPercentUsed > 90
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : metrics.goalPercentUsed > 75
                  ? 'bg-gradient-to-r from-sky-400 to-amber-400'
                  : 'bg-gradient-to-r from-emerald-400 to-sky-400'
              }`}
              style={{ width: `${Math.min(100, metrics.goalPercentUsed)}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 pt-1">
            <span>
              Sanctioned Load Utilized: <strong className="text-amber-300">{(metrics.currentPowerWatts / 1000).toFixed(2)} kW / {userProfile.sanctionedLoadKw} kW</strong>
            </span>
            <span>
              Govt Subsidy Benefitted: <strong className="text-emerald-400 font-bold">₹{metrics.govtSubsidyINR || 450}.00</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Load Curve Section */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Interactive Power Consumption Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1a365d]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-400" />
                <span>TNEB Grid Consumption Profile & Diurnal Load</span>
              </h3>
              <p className="text-xs text-slate-400">
                {chartMode === 'live'
                  ? 'Real-time telemetry stream from PZEM-004T sensor (1-second updates)'
                  : '24-hour diurnal profile highlighting TNEB evening peak hours (6:00 PM – 10:00 PM)'}
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center rounded-xl bg-[#030b1e] p-1 border border-[#1a365d]">
              <button
                onClick={() => setChartMode('live')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                  chartMode === 'live'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Live AMI Stream
              </button>
              <button
                onClick={() => setChartMode('24h')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                  chartMode === '24h'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                24-Hour Load Curve
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'live' ? (
                <AreaChart data={liveTelemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="livePowerGradTneb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2f55" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} unit="W" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#071738',
                      borderColor: '#1a365d',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`${val} W`, 'Active Load']}
                  />
                  <Area
                    type="monotone"
                    dataKey="powerWatts"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#livePowerGradTneb)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              ) : (
                <AreaChart data={dailyTelemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="daily24hGradTneb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2f55" />
                  <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit="W" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#071738',
                      borderColor: '#1a365d',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: number, name: string, item: any) => [
                      `${val} W (${(val / 1000).toFixed(2)} kW)`,
                      item.payload.isPeakHour ? 'TNEB Peak Hour (6-10 PM) ⚠️' : 'Normal Grid Draw',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="powerWatts"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#daily24hGradTneb)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Chart footer legend & indicators */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 pt-2 border-t border-[#1a365d]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                <span>Base load</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span>TNEB Evening Peak Window (6 PM – 10 PM)</span>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Full Analytics Suite</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Live Load Breakdown Pie */}
        <div className="lg:col-span-4 rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-[#1a365d]">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Appliance Load Split</span>
              <span className="text-xs font-mono font-bold text-amber-300">{metrics.currentPowerWatts}W</span>
            </h3>
            <p className="text-xs text-slate-400">Sub-circuit distribution on mains breaker</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appliancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {appliancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071738',
                    borderColor: '#1a365d',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(val: number) => [`${val} W`, 'Load']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold font-mono-num text-white">{metrics.currentPowerWatts}W</span>
              <span className="text-[10px] text-sky-400 font-bold">Active Load</span>
            </div>
          </div>

          {/* Mini active list */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {topAppliances.slice(0, 4).map((app) => (
              <div key={app.id} className="flex items-center justify-between text-xs py-1 border-b border-[#1a365d]/50">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColors[app.category] || '#0284c7' }}
                  />
                  <span className="text-slate-300 truncate font-medium">{app.name}</span>
                </div>
                <span className="font-mono-num font-bold text-amber-300">
                  {app.status === 'on' ? `${app.currentWatts}W` : 'Standby'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appliance Quick Power Matrix with 1-Click Toggles */}
      <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1a365d]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-sky-400" />
              <span>Consumer Circuit Relays & Instant Control</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive load shedding to prevent exceeding TNEB 5.0 kW Sanctioned Demand
            </p>
          </div>

          <button
            onClick={() => setActiveTab('appliances')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>All Circuits & Appliances ({appliances.length})</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topAppliances.slice(0, 6).map((app) => (
            <div
              key={app.id}
              className={`rounded-xl border p-3.5 transition-all ${
                app.status === 'on'
                  ? 'bg-[#061738] border-sky-500/40 shadow-sm'
                  : 'bg-[#030b1e]/60 border-[#1a365d] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      app.status === 'on'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-[#0a1e42] text-slate-400'
                    }`}
                  >
                    {app.category === 'hvac' ? (
                      <AirVent className="h-4 w-4" />
                    ) : app.category === 'kitchen' ? (
                      <Refrigerator className="h-4 w-4" />
                    ) : app.category === 'workstation' ? (
                      <Cpu className="h-4 w-4" />
                    ) : app.category === 'utility' ? (
                      <Flame className="h-4 w-4" />
                    ) : (
                      <Tv className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[150px]">
                      {app.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">{app.room} • {app.ratingWatts}W rating</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleAppliance(app.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    app.status === 'on'
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-[#0a1e42] text-slate-400 hover:text-white border border-[#1a365d]'
                  }`}
                  id={`dashboard-toggle-${app.id}`}
                >
                  {app.status === 'on' ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#1a365d]">
                <span className="text-slate-400">Power Draw:</span>
                <span className="font-mono-num font-bold text-amber-300">
                  {app.status === 'on' ? `${app.currentWatts} W` : `Standby (${app.standbyWatts}W)`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Section: Active Outage Notices / Grievances & Energy Saving Advice */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Outage & Grid Notices Box */}
        <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1a365d]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>TNEB Outage Notices & Grid Alerts</span>
            </h3>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs text-sky-400 hover:underline font-semibold"
            >
              View All ({activeAlerts.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {outageNotices.slice(0, 1).map((outage) => (
              <div
                key={outage.id}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>{outage.title}</span>
                  </span>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase">
                    {outage.category}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{outage.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Substation: <strong className="text-white">{outage.substation}</strong></span>
                  <span className="text-amber-300 font-mono font-semibold">{outage.timing}</span>
                </div>
              </div>
            ))}

            {activeAlerts.slice(0, 1).map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-[#1a365d] bg-[#061738] p-3 flex items-start gap-3"
              >
                <div
                  className={`mt-0.5 rounded-lg p-1.5 ${
                    alert.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{alert.title}</span>
                    <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{alert.description}</p>
                  {alert.detectedValue && (
                    <div className="mt-1 text-[11px] font-mono text-amber-300">
                      Reading: {alert.detectedValue} (Cap: {alert.thresholdValue})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Energy-Saving Tip Card with BEE Star Ratings */}
        <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-br from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1a365d]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span>TNEB Energy Conservation Recommendation</span>
            </h3>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
              High Bill Impact
            </span>
          </div>

          {suggestions[0] && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                {suggestions[0].title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {suggestions[0].description}
              </p>

              <div className="flex items-center justify-between rounded-xl bg-[#030b1e] p-3 border border-[#1a365d] text-xs">
                <div>
                  <span className="text-slate-400">Potential Bi-Monthly Bill Saving:</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono-num">
                    +₹{suggestions[0].potentialMonthlySavingsINR || 340} / {suggestions[0].potentialMonthlySavingsKWh} Units
                  </div>
                </div>

                <button
                  onClick={() => applySuggestion(suggestions[0].id)}
                  disabled={suggestions[0].applied}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    suggestions[0].applied
                      ? 'bg-[#0a2046] text-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-slate-950 shadow-md font-bold'
                  }`}
                  id="dash-apply-suggestion-btn"
                >
                  {suggestions[0].applied ? 'Applied ✓' : suggestions[0].actionLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connect ESP32 Hardware Modal */}
      <ConnectEsp32Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
};

