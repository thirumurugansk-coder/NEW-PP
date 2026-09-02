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
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export const EnergyAdvisor: React.FC = () => {
  const { metrics, suggestions, applySuggestion, userProfile } = useEnergy();

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

  const scoreFactors = [
    { title: 'TNEB Peak Shifting (6-10 PM)', score: 92, status: 'Optimal', desc: 'No heavy inductive water pump loads during evening peak.' },
    { title: 'Vampire / Standby Loss', score: 76, status: 'Needs Improvement', desc: '~48W idle standby power detected across appliances.' },
    { title: 'AC Temperature Setting', score: 90, status: 'Optimal', desc: 'Inverter AC thermostat maintained at 24°C eco band.' },
    { title: '100 Free Unit Optimization', score: 85, status: 'On Track', desc: 'Bi-monthly usage managed to stay within lower tariff slab.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#09224f] to-[#040e24] p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <span>TNEB Consumer Energy Conservation Advisor</span>
            </h2>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
              TNERC Tariff 1A Optimizer
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Official energy-saving algorithms tailored for Tamil Nadu LT domestic tariff slabs, 100-free-unit schemes, and peak-window load reduction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#030b1e] px-4 py-2 border border-[#1a365d] text-right">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">
              Available Bi-Monthly Savings
            </span>
            <span className="text-xl font-black font-mono-num text-amber-300">
              +₹{(totalPotentialSavingsINR * 2).toLocaleString('en-IN')}/cycle
            </span>
          </div>
        </div>
      </div>

      {/* Efficiency Score Breakdown */}
      <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] to-[#040e24] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Radial Score Gauge Visual */}
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-4 border-amber-400/40 bg-[#030b1e] shadow-inner">
            <div className="text-center">
              <span className="text-4xl font-extrabold font-mono-num text-amber-300">
                {metrics.efficiencyScore}
              </span>
              <span className="block text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                TNEB Score
              </span>
            </div>
          </div>

          <div className="space-y-3 flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <h3 className="text-lg font-bold text-white">
                Consumer Efficiency Index: <span className="text-amber-300">Grade A (Star Rated)</span>
              </h3>
              <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-xs font-bold text-sky-300 border border-sky-500/30">
                Top 10% in {userProfile.distributionCircle}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Your service connection draws ~{metrics.dailyConsumptionKwh} units/day, which is well-managed within the 500-unit bi-monthly slab. Adopting the recommendations below will prevent escalation into higher slab rates (₹8.00 - ₹11.00/unit) and save <strong className="text-amber-300 font-mono">₹{(totalPotentialSavingsINR * 2).toLocaleString('en-IN')}</strong> per billing cycle.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {scoreFactors.map((factor, idx) => (
                <div key={idx} className="rounded-xl bg-[#030b1e] p-2.5 border border-[#1a365d]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{factor.title}</span>
                    <span className="font-mono text-amber-300 font-bold">{factor.score}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Energy Saving Suggestions Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Curated TNEB Energy Conservation Actions</span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {suggestions.map((sugg) => {
            const savingsInINR = Math.round(sugg.potentialMonthlySavingsUSD * 83 * 2);
            return (
              <div
                key={sugg.id}
                className={`rounded-2xl border p-5 transition-all ${
                  sugg.applied
                    ? 'border-emerald-500/50 bg-[#061838]'
                    : 'border-[#1a365d] bg-[#081b3d] hover:border-sky-400/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          sugg.impact === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {sugg.impact} Impact
                      </span>
                      <span className="rounded bg-[#030b1e] px-2 py-0.5 text-[10px] text-slate-300 capitalize border border-[#1a365d]">
                        {sugg.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{sugg.title}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Bi-Monthly Savings</span>
                    <span className="text-sm font-black font-mono-num text-amber-300">
                      +₹{savingsInINR}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {sugg.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#1a365d] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Units Saved: ~{sugg.potentialMonthlySavingsKWh * 2} Units/cycle
                  </span>

                  <button
                    onClick={() => applySuggestion(sugg.id)}
                    disabled={sugg.applied}
                    className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                      sugg.applied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-slate-950 shadow-md'
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

