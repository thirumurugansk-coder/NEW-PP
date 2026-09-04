import React from 'react';
import {
  Lightbulb,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Zap,
  Clock,
  Flame,
  ShieldCheck,
  Leaf,
  ArrowRight,
  HelpCircle,
  IndianRupee,
  Building2,
  Cpu,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export const EnergyAdvisor: React.FC = () => {
  const { metrics, suggestions, applySuggestion, userProfile, isEsp32Connected, appliances } = useEnergy();

  const safeSuggestions = suggestions || [];

  const totalPotentialSavingsINR = Math.round(
    safeSuggestions
      .filter((s) => !s.applied)
      .reduce((sum, s) => sum + (s.potentialMonthlySavingsUSD || 0) * 83, 0)
  );

  const totalAppliedSavingsINR = Math.round(
    safeSuggestions
      .filter((s) => s.applied)
      .reduce((sum, s) => sum + (s.potentialMonthlySavingsUSD || 0) * 83, 0)
  );

  const activeStandbyWatts = isEsp32Connected
    ? appliances.reduce((sum, a) => sum + a.standbyWatts, 0)
    : 0;

  const scoreFactors = [
    {
      title: 'TNEB Peak Shifting (6-10 PM)',
      score: isEsp32Connected ? 92 : 0,
      status: isEsp32Connected ? 'Active' : 'Awaiting Hardware',
      desc: isEsp32Connected
        ? 'No heavy inductive pump or EV loads detected during evening peak.'
        : 'Connect ESP32 to monitor peak window consumption.',
    },
    {
      title: 'Vampire / Standby Load',
      score: isEsp32Connected ? (activeStandbyWatts < 40 ? 90 : 70) : 0,
      status: isEsp32Connected ? 'Monitored' : 'Awaiting Hardware',
      desc: isEsp32Connected
        ? `${activeStandbyWatts}W total standby power detected across appliances.`
        : 'Connect ESP32 to detect real idle current leakage.',
    },
    {
      title: 'AC Duty Optimization',
      score: isEsp32Connected ? 88 : 0,
      status: isEsp32Connected ? 'Monitored' : 'Awaiting Hardware',
      desc: isEsp32Connected
        ? 'Compressor duty cycle verified against room load.'
        : 'Connect ESP32 to track thermostat compressor load.',
    },
    {
      title: '100 Free Units Subsidy',
      score: isEsp32Connected ? 95 : 0,
      status: isEsp32Connected ? 'Monitored' : 'Awaiting Hardware',
      desc: isEsp32Connected
        ? 'Consumption tracked within subsidized lower slabs.'
        : 'Connect ESP32 to calculate monthly slab progression.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-2 border-[#C59B46]/50 bg-white/95 p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#164430] flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#C59B46]" />
              <span>TNEB Consumer Energy Conservation Advisor</span>
            </h2>
            <span className="rounded-md bg-[#FAF7F0] px-2 py-0.5 text-[10px] font-bold text-[#164430] border border-[#C59B46]/40">
              TNERC Tariff 1A Optimizer
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Official energy-saving strategies tailored for Tamil Nadu LT domestic tariff slabs, 100-free-unit schemes, and peak-window load reduction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#FAF7F0] px-4 py-2 border border-[#C59B46]/30 text-right">
            <span className="text-[10px] uppercase text-slate-500 block font-semibold">
              Potential Bi-Monthly Savings
            </span>
            <span className="text-xl font-black font-mono-num text-[#164430]">
              +₹{(totalPotentialSavingsINR * 2).toLocaleString('en-IN')}/cycle
            </span>
          </div>
        </div>
      </div>

      {/* Efficiency Score Breakdown */}
      <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Radial Score Gauge Visual */}
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-4 border-[#C59B46] bg-[#FAF7F0] shadow-inner">
            <div className="text-center">
              <span className="text-4xl font-extrabold font-mono-num text-[#164430]">
                {isEsp32Connected ? metrics.efficiencyScore : '--'}
              </span>
              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {isEsp32Connected ? 'TNEB Score' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="space-y-3 flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Consumer Efficiency Index:{' '}
                <span className="text-[#164430]">
                  {isEsp32Connected ? (metrics.efficiencyScore > 80 ? 'Grade A+' : metrics.efficiencyScore > 65 ? 'Grade B' : 'Grade C') : 'Awaiting ESP32 Telemetry'}
                </span>
              </h3>
              <span className="rounded-full bg-[#FAF7F0] px-2.5 py-0.5 text-xs font-bold text-[#164430] border border-[#C59B46]/40">
                {userProfile.sectionOffice}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {isEsp32Connected ? (
                <>
                  Your service connection draws ~{metrics.dailyConsumptionKwh} units/day. Adopting the recommendations below will prevent escalation into higher slab rates (₹8.00 - ₹11.00/unit) and save <strong className="text-[#164430] font-mono">₹{(totalPotentialSavingsINR * 2).toLocaleString('en-IN')}</strong> per billing cycle.
                </>
              ) : (
                <>
                  Hardware telemetry is currently offline. Connect your ESP32 + PZEM-004T energy monitoring unit to generate dynamic efficiency ratings and continuous vampire-load diagnostics. Actionable TNERC slab conservation guidelines are displayed below.
                </>
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {scoreFactors.map((factor, idx) => (
                <div key={idx} className="rounded-xl bg-[#FAF7F0] p-2.5 border border-[#C59B46]/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{factor.title}</span>
                    <span className="font-mono text-[#164430] font-bold">
                      {isEsp32Connected ? `${factor.score}%` : '--'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Energy Saving Suggestions Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#164430] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#C59B46]" />
          <span>Curated TNEB Energy Conservation Actions</span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {suggestions.map((sugg) => {
            const savingsInINR = Math.round(sugg.potentialMonthlySavingsUSD * 83 * 2);
            return (
              <div
                key={sugg.id}
                className={`rounded-2xl border-2 p-5 transition-all ${
                  sugg.applied
                    ? 'border-emerald-500/60 bg-emerald-50/40'
                    : 'border-[#C59B46]/40 bg-white/95 hover:border-[#C59B46]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          sugg.impact === 'high'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {sugg.impact} Impact
                      </span>
                      <span className="rounded bg-[#FAF7F0] px-2 py-0.5 text-[10px] text-slate-700 capitalize border border-[#C59B46]/30">
                        {sugg.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{sugg.title}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Est. Bi-Monthly Savings</span>
                    <span className="text-sm font-black font-mono-num text-[#164430]">
                      +₹{savingsInINR}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {sugg.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    Units Saved: ~{sugg.potentialMonthlySavingsKWh * 2} Units/cycle
                  </span>

                  <button
                    onClick={() => applySuggestion(sugg.id)}
                    disabled={sugg.applied}
                    className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                      sugg.applied
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-[#164430] hover:bg-[#1e583e] text-[#FAF7F0] shadow-sm'
                    }`}
                  >
                    {sugg.applied ? 'Applied to Smart Relays ✓' : sugg.actionLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

