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
  const { activeTab, setActiveTab, alerts, metrics, userProfile, iotConfig, isEsp32Connected } = useEnergy();

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
    <aside className="hidden lg:flex w-64 flex-col border-r border-[#C59B46]/30 bg-[#FAF7F0]/85 backdrop-blur-md p-4 shrink-0 transition-colors shadow-sm">
      {/* TNEB Consumer Information Card */}
      <div className="mb-4 rounded-2xl border border-[#C59B46]/40 bg-white/90 p-3.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#164430] text-[#FAF7F0] border border-[#C59B46]/60 shadow-sm">
            <Building2 className="h-4 w-4 text-[#C59B46]" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-[#164430] truncate">{userProfile?.fullName || userProfile?.name || 'Er. S. Thirumurugan'}</div>
            <div className="text-[10px] text-slate-600 font-mono font-semibold truncate">
              {userProfile?.consumerNumber || '09-245-014-1082'}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-[#C59B46]/20 grid grid-cols-2 gap-1 text-[10px]">
          <div>
            <span className="text-slate-500 block font-medium">Section</span>
            <span className="font-bold text-slate-800 truncate block">{(userProfile?.sectionOffice || 'Guindy').split(' ')[0]}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-medium">Sanctioned</span>
            <span className="font-bold text-[#164430] block">{userProfile?.sanctionedLoadKw || 5.0} kW (1-Ph)</span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#164430]">
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
                  ? 'bg-[#164430] text-[#FAF7F0] shadow-sm border border-[#C59B46]/60'
                  : 'text-slate-700 hover:bg-[#C59B46]/15 hover:text-[#164430]'
              }`}
              id={`sidebar-tab-${item.id}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#C59B46] text-slate-950 font-bold'
                      : 'bg-white border border-[#C59B46]/30 text-slate-600 group-hover:bg-[#164430] group-hover:text-[#C59B46]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight text-xs font-bold">{item.label}</div>
                  <div className={`text-[9px] font-normal leading-tight ${isActive ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {item.tamil}
                  </div>
                </div>
              </div>

              {item.badge ? (
                <span className="flex h-4 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-sm animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Hardware Feeder & Substation Snapshot Box */}
      <div className="mt-auto pt-3 space-y-2.5">
        <div className="rounded-2xl border border-[#C59B46]/40 bg-white/90 p-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#C59B46]/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#164430]">
              <Radio className={`h-3.5 w-3.5 ${isEsp32Connected ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              <span>TNEB Feeder AMI</span>
            </div>
            <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold border ${isEsp32Connected ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              {isEsp32Connected ? iotConfig.nodeId : 'OFFLINE'}
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs">
            <div className="rounded-xl bg-[#FAF7F0] p-2 border border-[#C59B46]/30">
              <div className="text-[9px] text-slate-500 font-medium">Sanctioned Load</div>
              <div className="font-mono-num font-bold text-[#164430] text-xs">
                {metrics.tnebSanctionedLoadPercent}% used
              </div>
            </div>
            <div className="rounded-xl bg-[#FAF7F0] p-2 border border-[#C59B46]/30">
              <div className="text-[9px] text-slate-500 font-medium">Govt Subsidy</div>
              <div className="font-mono-num font-bold text-emerald-700 text-xs">
                ₹{metrics.govtSubsidyINR}
              </div>
            </div>
          </div>

          {/* Monthly Budget bar */}
          <div className="mt-2.5 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500 font-medium">Bi-Monthly Units Target</span>
              <span className="font-mono-num text-slate-800 font-bold">
                {metrics.monthlyConsumptionKwh} / {metrics.goalKwh} kWh
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.goalPercentUsed > 90
                    ? 'bg-rose-500'
                    : metrics.goalPercentUsed > 75
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-[#C59B46] to-[#164430]'
                }`}
                style={{ width: `${Math.min(100, metrics.goalPercentUsed)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Minnagam 1912 Helpline badge */}
        <div className="rounded-xl border border-[#C59B46]/50 bg-[#C59B46]/15 p-2.5 text-center">
          <div className="text-[9px] text-[#164430] font-bold uppercase tracking-wider">
            24x7 TNEB Customer Care
          </div>
          <div className="text-[11px] font-bold text-[#164430] flex items-center justify-center gap-1.5 mt-0.5">
            <PhoneCall className="h-3 w-3 text-[#C59B46]" />
            <span>MINNAGAM 1912</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

