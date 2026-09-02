import React from 'react';
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Sliders,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Settings,
  Zap,
  Radio,
  Cpu,
  Building2,
  PhoneCall,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useEnergy, ActiveTab } from '../../context/EnergyContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, metrics, userProfile, iotConfig } = useEnergy();

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; desc: string; tamil: string }[] = [
    { id: 'home', label: 'Home Portal', tamil: 'முகப்பு பக்கம்', icon: Home, desc: 'TNEB AMI Overview' },
    { id: 'dashboard', label: 'TNEB Dashboard', tamil: 'நுகர்வோர் பலகை', icon: LayoutDashboard, desc: 'Live feeder & meter metrics' },
    { id: 'esp32', label: 'ESP32 Hardware Bridge', tamil: 'ESP32 நேரடி இணைப்பு', icon: Cpu, desc: 'Web Serial, WiFi & PZEM-004T' },
    { id: 'analytics', label: 'Analytics & Load Curve', tamil: 'மின் பயன்பாட்டு வரைபடம்', icon: BarChart3, desc: 'TNEB grid peak analysis' },
    { id: 'appliances', label: 'Circuits & Loads', tamil: 'சுற்று & மின்சாதனங்கள்', icon: Sliders, desc: 'Sub-circuit power split' },
    { id: 'bill', label: 'TNEB Bill Estimator', tamil: 'மின்கட்டணக் கணக்கீடு', icon: DollarSign, desc: 'TNERC 100 free unit slabs' },
    { id: 'alerts', label: 'Grid Alerts & Outages', tamil: 'மின்தடை அறிவிப்புகள்', icon: AlertTriangle, badge: activeAlertsCount, desc: 'Feeder sags & warnings' },
    { id: 'advisor', label: 'Energy Conservation', tamil: 'மின்சேமிப்பு வழிகாட்டி', icon: Lightbulb, desc: 'BEE star rating tips' },
    { id: 'profile', label: 'Consumer & Hardware', tamil: 'நுகர்வோர் விவரம்', icon: Settings, desc: 'TNEB Section & ESP32' },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-[#1a2f55] bg-[#040e24]/90 p-4 shrink-0 transition-colors">
      {/* TNEB Consumer Information Card */}
      <div className="mb-4 rounded-xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-3 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{userProfile?.fullName || userProfile?.name || 'Er. S. Thirumurugan'}</div>
            <div className="text-[10px] text-sky-300 font-mono font-medium truncate">
              {userProfile?.consumerNumber || '09-245-014-1082'}
            </div>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#1a365d]/80 grid grid-cols-2 gap-1 text-[10px]">
          <div>
            <span className="text-slate-400 block">Section</span>
            <span className="font-semibold text-slate-200 truncate block">{(userProfile?.sectionOffice || 'Guindy').split(' ')[0]}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Sanctioned</span>
            <span className="font-semibold text-amber-300 block">{userProfile?.sanctionedLoadKw || 5.0} kW (1-Ph)</span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          TNEB Consumer Portal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm shadow-sky-950/40'
                  : 'text-slate-300 hover:bg-[#081b3d] hover:text-white'
              }`}
              id={`sidebar-tab-${item.id}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-400 to-sky-500 text-slate-950 font-bold'
                      : 'bg-[#081b3d] text-slate-400 group-hover:bg-[#0d2a5e] group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight text-xs font-semibold">{item.label}</div>
                  <div className="text-[9px] text-slate-400 font-normal leading-tight">
                    {item.tamil}
                  </div>
                </div>
              </div>

              {item.badge ? (
                <span className="flex h-4 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-sm shadow-rose-500/40 animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Hardware Feeder & Substation Snapshot Box */}
      <div className="mt-auto pt-3 space-y-2.5">
        <div className="rounded-xl border border-[#1a365d] bg-[#071738] p-3 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-[#1a365d]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>TNEB Feeder AMI</span>
            </div>
            <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-bold text-sky-300 border border-sky-500/30">
              {iotConfig.nodeId}
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs">
            <div className="rounded-lg bg-[#030b1e] p-2 border border-[#1a365d]">
              <div className="text-[9px] text-slate-400">Sanctioned Load</div>
              <div className="font-mono-num font-bold text-amber-300 text-xs">
                {metrics.tnebSanctionedLoadPercent || 36}% used
              </div>
            </div>
            <div className="rounded-lg bg-[#030b1e] p-2 border border-[#1a365d]">
              <div className="text-[9px] text-slate-400">Govt Subsidy</div>
              <div className="font-mono-num font-bold text-emerald-300 text-xs">
                ₹{metrics.govtSubsidyINR || 450}
              </div>
            </div>
          </div>

          {/* Monthly Budget bar */}
          <div className="mt-2.5 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Bi-Monthly Units Target</span>
              <span className="font-mono-num text-slate-300 font-semibold">
                {metrics.monthlyConsumptionKwh} / {metrics.goalKwh} kWh
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#030b1e]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.goalPercentUsed > 90
                    ? 'bg-rose-500'
                    : metrics.goalPercentUsed > 75
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-sky-400 to-emerald-400'
                }`}
                style={{ width: `${Math.min(100, metrics.goalPercentUsed)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Minnagam 1912 Helpline badge */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-center">
          <div className="text-[9px] text-amber-300 font-semibold uppercase tracking-wider">
            24x7 TNEB Customer Care
          </div>
          <div className="text-[11px] font-bold text-amber-200 flex items-center justify-center gap-1.5 mt-0.5">
            <PhoneCall className="h-3 w-3 text-amber-300" />
            <span>MINNAGAM 1912</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

