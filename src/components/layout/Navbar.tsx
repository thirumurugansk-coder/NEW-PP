import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Bell,
  Cpu,
  Wifi,
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Home,
  LayoutDashboard,
  BarChart3,
  Sliders,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  PhoneCall,
  Flame,
  FileText,
  Radio,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { ThemeMode } from '../../types';
import { ConnectEsp32Modal } from '../esp32/ConnectEsp32Modal';
import { VoltPulseLogo } from '../brand/VoltPulseLogo';
import { BrandIdentityModal } from '../brand/BrandIdentityModal';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    themeMode,
    setThemeMode,
    metrics,
    alerts,
    isLiveStreaming,
    setIsLiveStreaming,
    samplingFrequencyMs,
    setSamplingFrequencyMs,
    dataSourceMode,
    setDataSourceMode,
    livePacketStats,
    connectWebSerial,
    disconnectWebSerial,
    isSerialConnected,
    isEsp32Connected,
    iotConfig,
    userProfile,
  } = useEnergy();

  const [showSimMenu, setShowSimMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const navItems = [
    { id: 'home', label: 'Home / முகப்பு', icon: Home },
    { id: 'dashboard', label: 'TNEB Dashboard', icon: LayoutDashboard },
    { id: 'esp32', label: 'ESP32 Hardware Bridge', icon: Cpu },
    { id: 'analytics', label: 'Analytics & Grid Load', icon: BarChart3 },
    { id: 'appliances', label: 'Circuits & Appliances', icon: Sliders },
    { id: 'bill', label: 'TNEB Bill Estimator', icon: DollarSign },
    { id: 'alerts', label: 'Alerts & Outages', icon: AlertTriangle, badge: activeAlertsCount },
    { id: 'advisor', label: 'Energy Advisor', icon: Lightbulb },
    { id: 'profile', label: 'Official Consumer Profile', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#C59B46]/40 bg-[#FAF7F0]/90 backdrop-blur-md transition-colors shadow-sm">
      {/* Official TNEB Top Gov Ribbon */}
      <div className="bg-[#164430] border-b border-[#C59B46]/40 px-4 py-1.5 text-[11px] text-[#FAF7F0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#C59B46]">தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம்</span>
            <span className="text-emerald-300/60 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-100 font-medium">Government of Tamil Nadu • TANGEDCO / TNEB</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-200">
            <span className="hidden md:inline font-mono">
              Consumer No: <strong className="text-[#C59B46]">{userProfile?.consumerNumber || '09-245-014-1082'}</strong> ({(userProfile?.tariffCategory || 'LT Tariff 1A').split(' ').slice(0, 2).join(' ')})
            </span>
            <span className="hidden lg:inline text-emerald-300/60">|</span>
            <a
              href="tel:1912"
              className="flex items-center gap-1 text-[#C59B46] hover:text-amber-200 font-bold"
              title="TNEB 24x7 Minnagam Grievance Helpline"
            >
              <PhoneCall className="h-3 w-3" />
              <span>MINNAGAM: 1912</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="group flex items-center gap-3 text-left focus:outline-none"
            id="tneb-brand-logo-btn"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#164430] border-2 border-[#C59B46]/80 shadow-md shadow-slate-900/10 transition-transform group-hover:scale-105">
              <VoltPulseLogo variant="icon" size={34} />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C59B46] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C59B46]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#164430]">
                  Volt<span className="text-[#C59B46]">Pulse</span>
                </span>
                <span className="rounded bg-[#164430] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF7F0] border border-[#C59B46]/60">
                  IoT
                </span>
              </div>
              <p className="text-[10px] text-[#C59B46] tracking-[0.16em] uppercase hidden sm:block font-bold">
                SMART ENERGY. REAL-TIME INSIGHT.
              </p>
            </div>
          </button>

          {/* Quick Brand Assets trigger */}
          <button
            onClick={() => setShowBrandModal(true)}
            className="hidden lg:flex items-center gap-1.5 rounded-full bg-[#164430] px-3 py-1 text-[10px] font-bold text-[#FAF7F0] border border-[#C59B46]/60 hover:bg-[#1f573e] transition-colors shadow-sm"
            title="Inspect Official VoltPulse IoT Brand Identity, Vector Symbols & Palette"
          >
            <Sparkles className="h-3 w-3 text-[#C59B46]" />
            <span>Brand Assets</span>
          </button>
        </div>

        {/* Center Live Telemetry Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5 rounded-full border border-[#C59B46]/40 bg-white/90 px-4 py-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isEsp32Connected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
              }`}></span>
              <span className={`relative inline-flex h-2 w-2 rounded-full ${
                isEsp32Connected ? 'bg-emerald-600' : 'bg-rose-500'
              }`}></span>
            </span>
            <span className={`text-xs font-bold ${isEsp32Connected ? 'text-emerald-700' : 'text-rose-600'}`}>
              {isEsp32Connected ? 'ESP32 Live Telemetry' : 'ESP32 Disconnected'}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-3 text-xs font-mono-num text-slate-700 font-semibold">
            <span className="text-[#164430] font-bold">
              {metrics.currentPowerWatts} W
            </span>
            <span className="text-slate-600">
              {metrics.voltageVolts} V RMS
            </span>
            <span className="text-slate-600">
              {metrics.currentAmps} A
            </span>
            <span className="text-emerald-700 hidden lg:inline">
              PF: {metrics.powerFactor}
            </span>
            <span className="text-slate-500 hidden xl:inline">
              {metrics.frequencyHz} Hz
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Connect ESP32 Hardware Button */}
          <button
            onClick={() => setShowConnectModal(true)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all shadow-sm ${
              isEsp32Connected
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-[#C59B46] to-amber-500 hover:opacity-95 text-slate-950 border border-[#C59B46]'
            }`}
            title="Connect Physical ESP32 Hardware via Web Serial / WiFi / MQTT"
            id="navbar-connect-esp32-btn"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isEsp32Connected ? 'bg-white animate-ping' : 'bg-slate-950'
                }`}
              />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isEsp32Connected ? 'bg-white' : 'bg-slate-950'}`} />
            </span>
            <Cpu className="h-3.5 w-3.5" />
            <span className="font-mono">
              {isEsp32Connected ? 'ESP32 Live' : 'Connect ESP32'}
            </span>
          </button>

          {/* Theme Selector Button */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1 rounded-xl border border-[#C59B46]/40 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#FAF7F0] transition-colors shadow-sm"
              title="Official VoltPulse Theme"
              id="theme-toggle-btn"
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline font-semibold">
                Ivory Gold
              </span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#C59B46]/50 bg-[#FAF7F0] p-2.5 shadow-2xl backdrop-blur-md z-50 text-slate-800">
                <div className="px-2 py-1 text-[11px] font-bold text-[#164430] uppercase tracking-wider border-b border-[#C59B46]/30 mb-1.5">
                  Official Theme
                </div>
                {[
                  { id: 'tneb-light', label: 'VoltPulse Ivory & Gold', sub: 'Technical Blueprint Theme', icon: Sun },
                  { id: 'tneb-dark', label: 'TNEB Navy Console', sub: 'Control Center Theme', icon: Moon },
                  { id: 'tneb-scada', label: 'Substation SCADA', sub: 'Grid Operator Console', icon: Shield },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeMode(t.id as ThemeMode);
                      setShowThemeMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors ${
                      themeMode === t.id
                        ? 'bg-[#164430] text-[#FAF7F0] font-bold shadow-sm'
                        : 'text-slate-700 hover:bg-[#C59B46]/15'
                    }`}
                  >
                    <div>
                      <div>{t.label}</div>
                      <div className={`text-[10px] ${themeMode === t.id ? 'text-[#C59B46]' : 'text-slate-500'} font-normal`}>{t.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time SCADA Stream Controller */}
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="flex items-center gap-1.5 rounded-xl border border-[#C59B46]/40 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#FAF7F0] transition-colors shadow-sm"
              title="TNEB AMI Smart Meter Real-Time Telemetry Stream"
              id="stream-controls-btn"
            >
              <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">
                {isLiveStreaming ? `${samplingFrequencyMs}ms Live` : 'Paused'}
              </span>
            </button>

            {showSimMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#C59B46]/50 bg-[#FAF7F0] p-3.5 shadow-2xl backdrop-blur-md z-50 space-y-3 text-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-[#C59B46]/30 text-xs font-bold text-[#164430]">
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-[#C59B46]" />
                    <span>TNEB SCADA Link</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">
                    {livePacketStats.latencyMs}ms Latency
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Live Ingestion</span>
                    <button
                      onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        isLiveStreaming
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {isLiveStreaming ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      {isLiveStreaming ? 'Streaming' : 'Paused'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>Sampling Rate</span>
                      <span className="font-mono text-[#164430] font-bold">{samplingFrequencyMs}ms</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[250, 500, 1000, 2000].map((ms) => (
                        <button
                          key={ms}
                          onClick={() => setSamplingFrequencyMs(ms)}
                          className={`rounded-lg py-1 text-[11px] font-mono font-bold transition-colors ${
                            samplingFrequencyMs === ms
                              ? 'bg-[#164430] text-[#FAF7F0] shadow-sm'
                              : 'bg-white border border-[#C59B46]/40 text-slate-700 hover:bg-[#FAF7F0]'
                          }`}
                        >
                          {ms < 1000 ? `${ms}ms` : `${ms / 1000}s`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 text-[10px] font-mono text-slate-600 space-y-1 border border-[#C59B46]/30">
                    <div className="flex justify-between">
                      <span>Total Packets:</span>
                      <span className="text-[#164430] font-bold">{livePacketStats.totalPackets.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CRC Checksum:</span>
                      <span className="text-emerald-700 font-bold">{livePacketStats.crcStatus}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSimMenu(false)}
                  className="w-full rounded-xl bg-[#164430] py-1.5 text-center text-xs font-bold text-[#FAF7F0] hover:bg-[#1f573e]"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Active Alerts Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative rounded-xl border border-[#C59B46]/40 bg-white/90 p-2 text-slate-700 hover:bg-[#FAF7F0] transition-colors shadow-sm"
            title="TNEB Grid Alerts & Outage Notices"
            id="navbar-alerts-btn"
          >
            <Bell className="h-4 w-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-md animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Primary View Switcher */}
          {activeTab === 'home' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 rounded-xl bg-[#164430] hover:bg-[#1f573e] px-3.5 py-1.5 text-xs font-bold text-[#FAF7F0] shadow-sm transition-all border border-[#C59B46]/60"
              id="launch-dashboard-btn"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#C59B46]" />
              <span>Consumer Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('home')}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#C59B46]/40 bg-white/90 hover:bg-[#FAF7F0] px-3 py-1.5 text-xs font-bold text-[#164430] transition-colors shadow-sm"
              id="view-landing-btn"
            >
              <Home className="h-3.5 w-3.5 text-[#C59B46]" />
              <span>Portal Home</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl border border-[#C59B46]/40 bg-white/90 p-2 text-slate-700 hover:text-slate-950 shadow-sm"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C59B46]/30 bg-[#FAF7F0] px-4 py-3 space-y-1.5 text-slate-800 shadow-xl">
          <div className="px-3 py-1.5 mb-2 rounded-xl bg-white border border-[#C59B46]/40 text-[11px] text-[#164430] font-mono font-bold">
            Consumer No: {userProfile.consumerNumber}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#164430] text-[#FAF7F0] shadow-sm'
                    : 'text-slate-700 hover:bg-[#C59B46]/15 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#C59B46]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
      {/* ESP32 Connect Quick Modal */}
      <ConnectEsp32Modal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />

      {/* Official Brand Identity Showcase Modal */}
      <BrandIdentityModal
        isOpen={showBrandModal}
        onClose={() => setShowBrandModal(false)}
      />
    </header>
  );
};

