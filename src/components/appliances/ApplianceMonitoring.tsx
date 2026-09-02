import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Zap,
  Power,
  Search,
  Filter,
  Flame,
  AirVent,
  Tv,
  Cpu,
  Refrigerator,
  Microwave,
  Lightbulb,
  WashingMachine,
  AlertCircle,
  Clock,
  Trash2,
  DollarSign,
  ShieldCheck,
  Radio,
  IndianRupee,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { Appliance, ApplianceCategory } from '../../types';

export const ApplianceMonitoring: React.FC = () => {
  const {
    appliances,
    toggleAppliance,
    updateAppliance,
    addAppliance,
    deleteAppliance,
    metrics,
    tariffPlan,
    userProfile,
  } = useEnergy();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New appliance form state
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<ApplianceCategory>('kitchen');
  const [newAppRoom, setNewAppRoom] = useState('Living Room');
  const [newAppRating, setNewAppRating] = useState<number>(1000);
  const [newAppStandby, setNewAppStandby] = useState<number>(5);
  const [newAppHours, setNewAppHours] = useState<number>(3);

  const categories = [
    { id: 'all', label: 'All Connected Loads' },
    { id: 'hvac', label: 'AC & Climate' },
    { id: 'kitchen', label: 'Kitchen & Refrigeration' },
    { id: 'utility', label: 'Water Pump & Heaters' },
    { id: 'ev', label: 'EV Charger' },
    { id: 'workstation', label: 'Workstation' },
    { id: 'entertainment', label: 'Media & TV' },
    { id: 'lighting', label: 'LED Lighting' },
  ];

  const filteredAppliances = appliances.filter((app) => {
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalStandbyWatts = appliances.reduce((sum, a) => sum + a.standbyWatts, 0);
  const totalActiveWatts = appliances.reduce((sum, a) => sum + (a.status === 'on' ? a.currentWatts : 0), 0);
  const activeKw = totalActiveWatts / 1000;
  const isOverSanctioned = activeKw > userProfile.sanctionedLoadKw;

  const handleCreateAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const dailyKwh = Number(((newAppRating * newAppHours) / 1000).toFixed(2));
    const monthlyKwh = Number((dailyKwh * 30).toFixed(1));

    addAppliance({
      name: newAppName.trim(),
      category: newAppCategory,
      room: newAppRoom,
      ratingWatts: Number(newAppRating),
      currentWatts: 0,
      dailyKwh,
      monthlyKwh,
      status: 'off',
      standbyWatts: Number(newAppStandby),
      dailyHoursUsed: Number(newAppHours),
      isSmartControlled: true,
      isHighLoad: newAppRating >= 1500,
      iconName: 'Zap',
      priority: newAppRating >= 1500 ? 'heavy' : 'flexible',
    });

    setNewAppName('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: ApplianceCategory) => {
    switch (category) {
      case 'hvac':
        return <AirVent className="h-4 w-4" />;
      case 'kitchen':
        return <Refrigerator className="h-4 w-4" />;
      case 'utility':
        return <Flame className="h-4 w-4" />;
      case 'workstation':
        return <Cpu className="h-4 w-4" />;
      case 'entertainment':
        return <Tv className="h-4 w-4" />;
      case 'lighting':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#09224f] to-[#040e24] p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-sky-400" />
              <span>TNEB Connected Load & Smart Relay Disaggregation</span>
            </h2>
            <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
              Sanctioned Load: {userProfile.sanctionedLoadKw} kW
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time sub-meter telemetry, automated load shedding, and phantom vampire power isolation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono-num">
            <span className="rounded-xl bg-[#030b1e] px-3 py-1.5 border border-[#1a365d] text-slate-300">
              Live Draw: <strong className="text-amber-300 font-bold">{totalActiveWatts} W</strong> ({activeKw.toFixed(2)} kW)
            </span>
            <span className="rounded-xl bg-[#030b1e] px-3 py-1.5 border border-[#1a365d] text-slate-300">
              Standby Drain: <strong className="text-sky-300 font-bold">{totalStandbyWatts} W</strong>
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 px-4 py-2 text-xs font-black text-slate-950 shadow-md transition-all"
            id="add-appliance-btn"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add Connected Load</span>
          </button>
        </div>
      </div>

      {/* Sanctioned Load Warning Alert if exceeded */}
      {isOverSanctioned && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/60 bg-rose-950/40 p-4 text-xs text-rose-200 shadow-md">
          <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0" />
          <div className="flex-1">
            <strong className="font-bold text-rose-300">TNEB Maximum Demand Penalty Notice:</strong> Active draw ({activeKw.toFixed(2)} kW) exceeds your registered sanctioned load ({userProfile.sanctionedLoadKw} kW). Toggle non-essential high-wattage loads below to avoid RMD penal tariff charges.
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex w-full sm:w-auto items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'border border-[#1a365d] bg-[#030b1e] text-slate-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search load or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Appliances Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAppliances.map((app) => {
          const estimatedCostBiMonthly = Math.round(app.monthlyKwh * 2 * 4.5);
          const isHigh = app.ratingWatts >= 1500;

          return (
            <div
              key={app.id}
              className={`group relative rounded-2xl border p-5 transition-all ${
                app.status === 'on'
                  ? 'bg-[#081b3d] border-sky-400/50 shadow-lg'
                  : 'bg-[#040e24] border-[#1a365d] opacity-80'
              }`}
            >
              {/* Top Row: Icon, Name, Room, Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      app.status === 'on'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-[#030b1e] text-slate-400'
                    }`}
                  >
                    {getCategoryIcon(app.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {app.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{app.room}</span>
                      <span>•</span>
                      <span className="capitalize">{app.category}</span>
                    </div>
                  </div>
                </div>

                {/* Smart Toggle */}
                <button
                  onClick={() => toggleAppliance(app.id)}
                  className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
                    app.status === 'on' ? 'bg-sky-500' : 'bg-[#030b1e] border border-[#1a365d]'
                  }`}
                  title={app.status === 'on' ? 'Open Smart Relay' : 'Close Smart Relay'}
                  id={`toggle-app-${app.id}`}
                >
                  <div
                    className={`h-6 w-6 rounded-full bg-slate-950 transition-transform ${
                      app.status === 'on' ? 'translate-x-6' : 'translate-x-0'
                    } flex items-center justify-center shadow-md`}
                  >
                    <Power
                      className={`h-3 w-3 ${
                        app.status === 'on' ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Power & Telemetry Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono-num">
                <div className="rounded-xl bg-[#030b1e] p-2.5 border border-[#1a365d]">
                  <div className="text-[10px] text-slate-400">Active Draw</div>
                  <div className="text-base font-black text-amber-300">
                    {app.status === 'on' ? `${app.currentWatts} W` : '0 W'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    Rated: {app.ratingWatts}W
                  </div>
                </div>

                <div className="rounded-xl bg-[#030b1e] p-2.5 border border-[#1a365d]">
                  <div className="text-[10px] text-slate-400">Bi-Monthly Est.</div>
                  <div className="text-base font-black text-slate-100">
                    ₹{estimatedCostBiMonthly}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    {(app.monthlyKwh * 2).toFixed(0)} Units/cycle
                  </div>
                </div>
              </div>

              {/* Daily hours slider control */}
              <div className="mt-3.5 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Daily Usage Duty Cycle</span>
                  <span className="font-mono text-sky-300 font-bold">{app.dailyHoursUsed} hrs/day</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={app.dailyHoursUsed}
                  onChange={(e) => {
                    const hours = parseFloat(e.target.value);
                    const dailyKwh = Number(((app.ratingWatts * hours) / 1000).toFixed(2));
                    const monthlyKwh = Number((dailyKwh * 30).toFixed(1));
                    updateAppliance(app.id, {
                      dailyHoursUsed: hours,
                      dailyKwh,
                      monthlyKwh,
                    });
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                />
              </div>

              {/* Card Footer: Standby & Actions */}
              <div className="mt-3.5 pt-2.5 border-t border-[#1a365d] flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Radio className="h-3 w-3 text-sky-400" />
                  <span>Phantom Standby: {app.standbyWatts}W</span>
                </span>

                <button
                  onClick={() => deleteAppliance(app.id)}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                  title="Remove appliance"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phantom Load / Standby Power Detection Banner */}
      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>TNEB Phantom Vampire Load Disaggregation & Power Factor Report</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Connected loads draw <strong className="text-amber-300 font-mono">{totalStandbyWatts} Watts</strong> in idle standby (~{((totalStandbyWatts * 24 * 60) / 1000).toFixed(1)} units/bi-monthly cycle, adding approx. <strong className="text-white font-mono">₹{Math.round(((totalStandbyWatts * 24 * 60) / 1000) * 4.5)}</strong> to your bill). TNEB smart relays can be scheduled to cut phantom loads automatically during non-operational hours.
        </p>
      </div>

      {/* Add Appliance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1a365d] bg-[#071738] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a365d]">
              <h3 className="text-base font-bold text-white">Add Connected Load / Sub-Circuit</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppliance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Load / Appliance Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Agricultural 5HP Pump, Inverter Split AC, Induction Stove"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newAppCategory}
                    onChange={(e) => setNewAppCategory(e.target.value as ApplianceCategory)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="kitchen">Kitchen & Refrigeration</option>
                    <option value="hvac">AC & Climate</option>
                    <option value="utility">Water Pump & Heaters</option>
                    <option value="ev">EV Charger</option>
                    <option value="workstation">Workstation</option>
                    <option value="entertainment">Media & TV</option>
                    <option value="lighting">LED Lighting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Zone / Phase</label>
                  <input
                    type="text"
                    value={newAppRoom}
                    onChange={(e) => setNewAppRoom(e.target.value)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Power (Watts)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={newAppRating}
                    onChange={(e) => setNewAppRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Standby (W)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAppStandby}
                    onChange={(e) => setNewAppStandby(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Hrs/Day
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="24"
                    step="0.5"
                    value={newAppHours}
                    onChange={(e) => setNewAppHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[#1a365d] px-4 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 px-5 py-2 text-xs font-black text-slate-950 shadow-md"
                >
                  Save Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

