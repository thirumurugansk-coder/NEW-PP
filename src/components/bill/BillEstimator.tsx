import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  CheckCircle2,
  FileText,
  Download,
  Building2,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Sun,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export const BillEstimator: React.FC = () => {
  const { metrics, tariffPlan, calculateBill, userProfile } = useEnergy();

  // Bi-monthly units as primary unit of measure for TNEB LT-1A
  const [biMonthlyUnits, setBiMonthlyUnits] = useState<number>(metrics.bimonthlyUnitsKwh);
  const [billingCycleMode, setBillingCycleMode] = useState<'bimonthly' | 'monthly'>('bimonthly');
  const [categoryType, setCategoryType] = useState<'LT-1A' | 'LT-3A' | 'LT-3B' | 'LT-4'>('LT-1A');
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [paySuccess, setPaySuccess] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking'>('upi');

  // What-if simulator levers for 60-day cycle
  const [acReductionHours, setAcReductionHours] = useState<number>(2);
  const [shiftPeakLoads, setShiftPeakLoads] = useState<boolean>(true);
  const [solarKwCapacity, setSolarKwCapacity] = useState<number>(0);

  // Solar generation offset: ~120 kWh per kW per month = ~240 kWh per 60-day cycle in Tamil Nadu
  const solarCycleGenerationUnits = solarKwCapacity * 240;
  const netSolarAdjustedUnits = Math.max(0, biMonthlyUnits - solarCycleGenerationUnits);

  // Compute live breakdown with official TNEB LT-1A bi-monthly calculation engine
  const effectiveUnits = billingCycleMode === 'bimonthly' ? netSolarAdjustedUnits : netSolarAdjustedUnits * 2;
  const billBreakdown = calculateBill(effectiveUnits, true, tariffPlan);

  // Scale if viewing monthly equivalent
  const displayTotal = billingCycleMode === 'bimonthly' ? billBreakdown.totalCost : Number((billBreakdown.totalCost / 2).toFixed(2));
  const displayGross = billingCycleMode === 'bimonthly' ? billBreakdown.grossEnergyCost : Number((billBreakdown.grossEnergyCost / 2).toFixed(2));
  const displaySubsidy = billingCycleMode === 'bimonthly' ? billBreakdown.subsidyDeduction : Number((billBreakdown.subsidyDeduction / 2).toFixed(2));
  const displayDuty = billingCycleMode === 'bimonthly' ? billBreakdown.dutyTaxCost : Number((billBreakdown.dutyTaxCost / 2).toFixed(2));
  const displayFppca = billingCycleMode === 'bimonthly' ? billBreakdown.fppcaCost : Number((billBreakdown.fppcaCost / 2).toFixed(2));

  // What-if savings calculation over 60-day bi-monthly cycle
  // 1.5 Ton AC compressor ~ 1.35 kW avg draw
  const acSavingsUnits = Math.round(1.35 * acReductionHours * (billingCycleMode === 'bimonthly' ? 60 : 30));
  // Highest active slab rate
  const activeSlabs = billBreakdown.slabBreakdown.filter((s) => s.units > 0);
  const topSlabRate = activeSlabs.length > 0 ? activeSlabs[activeSlabs.length - 1].rate : 4.5;
  const acSavingsINR = Math.round(acSavingsUnits * (topSlabRate || 4.5));
  const peakShiftSavingsINR = shiftPeakLoads ? 240 : 0;
  const solarSavingsINR = solarKwCapacity > 0 ? Math.round(solarCycleGenerationUnits * topSlabRate) : 0;
  const totalPotentialSavingsINR = acSavingsINR + peakShiftSavingsINR + solarSavingsINR;

  // Next slab threshold distance
  const currentUnits = effectiveUnits;
  let nextSlabBoundary = 100;
  let nextSlabRate = 2.25;
  let currentSlabName = '0 - 100 Units (Free)';

  if (currentUnits <= 100) {
    nextSlabBoundary = 101;
    nextSlabRate = 2.25;
    currentSlabName = '0 – 100 Units (100% Free Power)';
  } else if (currentUnits <= 200) {
    nextSlabBoundary = 201;
    nextSlabRate = 4.50;
    currentSlabName = '101 – 200 Units (@ ₹2.25/U)';
  } else if (currentUnits <= 400) {
    nextSlabBoundary = 401;
    nextSlabRate = 6.00;
    currentSlabName = '201 – 400 Units (@ ₹4.50/U)';
  } else if (currentUnits <= 500) {
    nextSlabBoundary = 501;
    nextSlabRate = 8.00;
    currentSlabName = '401 – 500 Units (@ ₹6.00/U)';
  } else if (currentUnits <= 600) {
    nextSlabBoundary = 601;
    nextSlabRate = 9.00;
    currentSlabName = '501 – 600 Units (@ ₹8.00/U)';
  } else if (currentUnits <= 800) {
    nextSlabBoundary = 801;
    nextSlabRate = 10.00;
    currentSlabName = '601 – 800 Units (@ ₹9.00/U)';
  } else if (currentUnits <= 1000) {
    nextSlabBoundary = 1001;
    nextSlabRate = 11.00;
    currentSlabName = '801 – 1000 Units (@ ₹10.00/U)';
  } else {
    nextSlabBoundary = 99999;
    nextSlabRate = 11.00;
    currentSlabName = '> 1000 Units (@ ₹11.00/U)';
  }

  const unitsToNextSlab = Math.max(0, nextSlabBoundary - currentUnits);

  const handleProcessPayment = () => {
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setShowPayModal(false);
    }, 2800);
  };

  // Slab styling config
  const slabColors: Record<number, { bg: string; border: string; text: string; bar: string }> = {
    0: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', bar: 'bg-emerald-600' },
    1: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800', bar: 'bg-sky-600' },
    2: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800', bar: 'bg-indigo-600' },
    3: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', bar: 'bg-[#C59B46]' },
    4: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', bar: 'bg-orange-600' },
    5: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800', bar: 'bg-rose-600' },
    6: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800', bar: 'bg-purple-600' },
    7: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', bar: 'bg-red-600' },
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-2 border-[#C59B46]/60 bg-white/95 p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#164430] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#164430] text-[#C59B46] font-bold border border-[#C59B46]/40">₹</span>
              <span>TNERC LT Tariff 1A Bi-Monthly Bill Engine</span>
            </h2>
            <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300 font-mono">
              60-Day Bi-Monthly Cycle
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Official TNERC Domestic LT-1A slab rate matrix with Tamil Nadu Govt 100-Unit Free Power Subsidy (G.O. Ms. No. 52)
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono-num">
          <div className="rounded-xl bg-[#FAF7F0] p-3.5 border border-[#C59B46]/50 text-right shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-sans font-semibold">
              {billingCycleMode === 'bimonthly' ? 'Bi-Monthly Net Payable (60 Days)' : 'Equivalent Monthly (30 Days)'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#164430]">
              ₹{displayTotal}
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="text-[10px] text-emerald-700 font-sans font-semibold">
                GoTN Subsidy -₹{displaySubsidy} Applied ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculation & Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Interactive Tariff & Usage Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Bi-Monthly Metered Consumption Controller Card */}
          <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#C59B46]" />
                <span>Bi-Monthly Metered Energy (60-Day Assessment)</span>
              </h3>
              
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-[#FAF7F0] p-0.5 border border-[#C59B46]/30">
                  <button
                    onClick={() => setBillingCycleMode('bimonthly')}
                    className={`rounded px-2.5 py-1 text-[11px] font-bold transition-all ${
                      billingCycleMode === 'bimonthly'
                        ? 'bg-[#164430] text-[#FAF7F0] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bi-Monthly (60 Days)
                  </button>
                  <button
                    onClick={() => setBillingCycleMode('monthly')}
                    className={`rounded px-2.5 py-1 text-[11px] font-bold transition-all ${
                      billingCycleMode === 'monthly'
                        ? 'bg-[#164430] text-[#FAF7F0] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    30 Days
                  </button>
                </div>
                <button
                  onClick={() => setBiMonthlyUnits(metrics.bimonthlyUnitsKwh)}
                  className="flex items-center gap-1 text-xs text-[#164430] hover:underline font-mono font-bold"
                  title="Reset to live smart meter telemetry"
                >
                  <RotateCcw className="h-3 w-3 text-[#C59B46]" />
                  <span>Actual ({metrics.bimonthlyUnitsKwh} U)</span>
                </button>
              </div>
            </div>

            {/* Consumption Slider & Stepper */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline font-mono-num">
                <span className="text-xs text-slate-600">Bi-Monthly Total Consumption:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#164430]">
                    {biMonthlyUnits}
                  </span>
                  <span className="text-xs font-normal text-slate-500">kWh (Units / 60 Days)</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="1200"
                step="5"
                value={biMonthlyUnits}
                onChange={(e) => setBiMonthlyUnits(Number(e.target.value))}
                className="w-full accent-[#164430] cursor-pointer h-2.5 rounded-lg bg-slate-200"
                id="bimonthly-units-slider"
              />

              {/* Quick Stepper Buttons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1.5 text-xs font-mono">
                  <button
                    onClick={() => setBiMonthlyUnits((u) => Math.max(0, u - 50))}
                    className="rounded-lg bg-[#FAF7F0] border border-[#C59B46]/40 px-2.5 py-1 text-slate-700 hover:bg-white transition-all font-bold"
                  >
                    -50 U
                  </button>
                  <button
                    onClick={() => setBiMonthlyUnits((u) => Math.max(0, u - 10))}
                    className="rounded-lg bg-[#FAF7F0] border border-[#C59B46]/40 px-2 py-1 text-slate-700 hover:bg-white transition-all font-bold"
                  >
                    -10 U
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  Avg: {(biMonthlyUnits / 60).toFixed(1)} Units/Day
                </span>

                <div className="flex gap-1.5 text-xs font-mono">
                  <button
                    onClick={() => setBiMonthlyUnits((u) => Math.min(1500, u + 10))}
                    className="rounded-lg bg-[#FAF7F0] border border-[#C59B46]/40 px-2 py-1 text-slate-700 hover:bg-white transition-all font-bold"
                  >
                    +10 U
                  </button>
                  <button
                    onClick={() => setBiMonthlyUnits((u) => Math.min(1500, u + 50))}
                    className="rounded-lg bg-[#FAF7F0] border border-[#C59B46]/40 px-2.5 py-1 text-slate-700 hover:bg-white transition-all font-bold"
                  >
                    +50 U
                  </button>
                </div>
              </div>

              {/* TNEB Benchmark Scenario Presets */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 font-semibold mb-2">
                  Official TNEB Bi-Monthly Consumption Profiles:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setBiMonthlyUnits(80)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      biMonthlyUnits <= 100
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-[#FAF7F0] text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-emerald-800">80 Units</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">₹0.00 (100% Free)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBiMonthlyUnits(180)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      biMonthlyUnits > 100 && biMonthlyUnits <= 200
                        ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold'
                        : 'border-slate-200 bg-[#FAF7F0] text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-sky-800">180 Units</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Modest 1-BHK</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBiMonthlyUnits(380)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      biMonthlyUnits > 200 && biMonthlyUnits <= 400
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-[#FAF7F0] text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-indigo-800">380 Units</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Standard 2/3-BHK</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBiMonthlyUnits(580)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      biMonthlyUnits > 400 && biMonthlyUnits <= 600
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                        : 'border-slate-200 bg-[#FAF7F0] text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-amber-800">580 Units</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">High Summer / AC</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBiMonthlyUnits(850)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      biMonthlyUnits > 600
                        ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                        : 'border-slate-200 bg-[#FAF7F0] text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-rose-800">850 Units</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Heavy 3-Phase</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Tier Progressive Slab Visualizer Card */}
          <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#C59B46]" />
                <span>TNERC LT-1A Bi-Monthly Slab Stack Allocation</span>
              </h3>
              <span className="text-[11px] font-mono text-[#164430] font-bold">
                Active Slab: {currentSlabName}
              </span>
            </div>

            {/* Segmented Visual Progress Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-slate-100 border border-slate-300 overflow-hidden flex shadow-inner">
                {billBreakdown.slabBreakdown.map((slab, idx) => {
                  if (slab.units <= 0) return null;
                  const pct = Math.max(2, (slab.units / effectiveUnits) * 100);
                  const color = slabColors[idx] || slabColors[7];
                  return (
                    <div
                      key={slab.slabName}
                      style={{ width: `${pct}%` }}
                      className={`${color.bar} h-full transition-all duration-300 relative group cursor-pointer`}
                      title={`${slab.slabName}: ${slab.units} Units @ ₹${slab.rate}/kWh`}
                    />
                  );
                })}
              </div>

              {/* Key Indicators below bar */}
              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-600 font-mono gap-1">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block" />
                  <span>0-100 U (₹0.00 Free)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-600 inline-block" />
                  <span>101-200 U (₹2.25)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-600 inline-block" />
                  <span>201-400 U (₹4.50)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#C59B46] inline-block" />
                  <span>401-500 U (₹6.00)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-600 inline-block" />
                  <span>501+ U (₹8.00+)</span>
                </span>
              </div>
            </div>

            {/* Next Slab Threshold Warning */}
            {unitsToNextSlab > 0 && nextSlabBoundary < 99999 && (
              <div className="rounded-xl bg-amber-50 p-3 border border-amber-300 text-xs flex items-center justify-between gap-3 text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-900">Next Slab Barrier: </span>
                    <span className="text-[#164430] font-mono font-bold">{unitsToNextSlab} Units</span>
                    <span className="text-slate-700"> until Rate Escalation to </span>
                    <span className="text-rose-700 font-mono font-bold">₹{nextSlabRate.toFixed(2)}/kWh</span>.
                  </div>
                </div>
                <span className="text-[10px] text-slate-600 font-mono shrink-0 hidden sm:inline">
                  Save {unitsToNextSlab} U to avoid next slab
                </span>
              </div>
            )}
          </div>

          {/* Itemized Slab Calculation Table Card */}
          <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#C59B46]" />
                <span>TNERC LT-1A Bi-Monthly Slab-by-Slab Calculation Table</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Total Billed: {effectiveUnits} Units
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-sans">
                    <th className="pb-2">Slab Range</th>
                    <th className="pb-2 text-right">Units In Slab</th>
                    <th className="pb-2 text-right">Rate (₹/kWh)</th>
                    <th className="pb-2 text-right">Gross Cost</th>
                    <th className="pb-2 text-right">State Subsidy</th>
                    <th className="pb-2 text-right">Net Energy Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-num">
                  {billBreakdown.slabBreakdown.map((slab, idx) => {
                    const isActive = slab.units > 0;
                    const color = slabColors[idx] || slabColors[7];

                    return (
                      <tr
                        key={slab.slabName}
                        className={`transition-colors ${
                          isActive ? 'bg-[#FAF7F0] font-semibold text-slate-900' : 'opacity-40 text-slate-400'
                        }`}
                      >
                        <td className="py-2.5 flex items-center gap-2 font-sans">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isActive ? color.bar : 'bg-slate-300'
                            }`}
                          />
                          <span className={isActive ? 'text-slate-900' : 'text-slate-400'}>
                            {slab.slabName}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-slate-800">
                          {slab.units} <span className="text-[10px] font-normal text-slate-500">U</span>
                        </td>
                        <td className="py-2.5 text-right text-slate-700">
                          ₹{slab.rate.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-right text-slate-700">
                          {idx === 0 ? '₹450.00' : `₹${slab.amount.toFixed(2)}`}
                        </td>
                        <td className="py-2.5 text-right text-emerald-700 font-bold">
                          {idx === 0 && slab.units > 0 ? (
                            <span>-₹{(slab.units * 4.5).toFixed(2)}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-2.5 text-right font-bold text-[#164430]">
                          {idx === 0 ? (
                            <span className="text-emerald-700">₹0.00 (Free)</span>
                          ) : (
                            `₹${slab.amount.toFixed(2)}`
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Additional Statutory Additions Breakdown */}
            <div className="rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-700">
                <span className="font-sans">Subtotal Net Energy Charges:</span>
                <span className="font-bold text-[#164430]">₹{billBreakdown.energyCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span className="font-sans">Fixed Demand Charge (Waived for LT-1A):</span>
                <span className="text-emerald-700">₹0.00 (GoTN Waived)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="font-sans">Electricity Duty (ED 5% on Energy Charges):</span>
                <span>₹{displayDuty.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="font-sans">FPPCA Fuel Surcharge (25p/Unit on {Math.max(0, effectiveUnits - 100)} billable units):</span>
                <span>₹{displayFppca.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-[#C59B46]/30 text-[#164430]">
                <span className="font-sans text-slate-900">Total Bi-Monthly Amount Payable:</span>
                <span className="text-base font-black text-[#164430]">₹{displayTotal}</span>
              </div>
            </div>
          </div>

          {/* Interactive What-If 60-Day Optimization Levers in INR */}
          <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C59B46]" />
                <span>TNEB Bi-Monthly Energy-Saving & Slab Downgrade Levers</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 font-mono-num">
                Potential Bi-Monthly Savings: ~₹{totalPotentialSavingsINR}
              </span>
            </div>

            <div className="space-y-3">
              {/* Lever 1: Reduce Inverter AC Runtime over 60 days */}
              <div className="rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Reduce Air Conditioner Usage By:
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {acReductionHours} hrs/day (-{acSavingsUnits} units in 60 days)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.5"
                  value={acReductionHours}
                  onChange={(e) => setAcReductionHours(Number(e.target.value))}
                  className="w-full accent-[#164430] cursor-pointer h-1.5 rounded-lg bg-slate-200"
                />
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>Downgrades units from high slab ({topSlabRate ? `₹${topSlabRate}/U` : ''}):</span>
                  <strong className="text-[#164430] font-mono">Save ~₹{acSavingsINR} / Cycle</strong>
                </div>
              </div>

              {/* Lever 2: Avoid Peak Hours */}
              <div className="flex items-center justify-between rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 text-xs">
                <div>
                  <div className="font-semibold text-slate-800">
                    Avoid Running Water Pumps & Heaters during Evening Peak (6–10 PM)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Mitigates transformer I²R heat losses and peak tariff exposure.
                  </div>
                </div>
                <button
                  onClick={() => setShiftPeakLoads(!shiftPeakLoads)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    shiftPeakLoads
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  {shiftPeakLoads ? 'Active (-₹240)' : 'Disabled'}
                </button>
              </div>

              {/* Lever 3: Rooftop Solar Net-Metering (TANGEDCO RTS) */}
              <div className="rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-[#C59B46]" />
                    <span>TANGEDCO Rooftop Solar Net-Metering Capacity:</span>
                  </span>
                  <span className="font-mono text-[#164430] font-bold">
                    {solarKwCapacity > 0 ? `${solarKwCapacity} kWp RTS (${solarCycleGenerationUnits} U/cycle)` : 'None'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {[0, 1, 2, 3].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setSolarKwCapacity(kw)}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        solarKwCapacity === kw
                          ? 'border-[#C59B46] bg-[#164430] text-[#FAF7F0] font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-[#FAF7F0]'
                      }`}
                    >
                      {kw === 0 ? 'No Solar' : `${kw} kW RTS`}
                    </button>
                  ))}
                </div>
                {solarKwCapacity > 0 && (
                  <div className="text-[11px] text-emerald-700 font-mono font-bold">
                    Generates ~{solarCycleGenerationUnits} kWh bi-monthly, saving ~₹{solarSavingsINR} on top tariff slabs!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Official TANGEDCO Itemized Bill Statement Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border-2 border-[#C59B46]/50 bg-white/95 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#C59B46]" />
                <div>
                  <h3 className="text-sm font-black text-[#164430] uppercase tracking-wider">
                    TANGEDCO Bi-Monthly Bill
                  </h3>
                  <span className="text-[10px] text-slate-500">Assessment: Jul – Aug 2026</span>
                </div>
              </div>
              <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-mono text-emerald-800 border border-emerald-300 font-bold">
                LT Tariff 1A (60 Days)
              </span>
            </div>

            {/* Consumer details snapshot */}
            <div className="rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Consumer No:</span>
                <span className="font-mono font-bold text-[#164430]">{userProfile?.consumerNumber || '09-245-014-1082'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consumer Name:</span>
                <span className="text-slate-900 font-medium">{userProfile?.fullName || userProfile?.name || 'Er. S. Thirumurugan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Section Office:</span>
                <span className="text-slate-700">{userProfile?.sectionOffice || 'Guindy Section (Code: 245)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sanctioned Load:</span>
                <span className="text-slate-700 font-mono">{userProfile?.sanctionedLoadKw || 5.0} kW (3-Phase LT)</span>
              </div>
            </div>

            {/* Bill Details List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Billing Period</span>
                <span className="text-slate-900 font-medium">60 Days (Bi-Monthly)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Bi-Monthly Units Assessed</span>
                <span className="font-mono-num font-bold text-slate-900">{effectiveUnits} Units (kWh)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Gross Slab Energy Charges</span>
                <span className="font-mono-num text-slate-900">₹{displayGross.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700 font-semibold">
                <span>TN Govt 100 Free Units Subsidy</span>
                <span className="font-mono-num">-₹{displaySubsidy.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Fixed Demand & Meter Rent</span>
                <span className="font-mono-num text-emerald-700">₹0.00 (Subsidized)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Electricity Duty (5% ED)</span>
                <span className="font-mono-num text-slate-900">₹{displayDuty.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">FPPCA Fuel Surcharge</span>
                <span className="font-mono-num text-slate-900">₹{displayFppca.toFixed(2)}</span>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-3 text-sm font-bold text-slate-900 border-t border-slate-200">
                <span className="text-slate-700">Net Bi-Monthly Payable</span>
                <span className="text-2xl font-black font-mono-num text-[#164430]">
                  ₹{displayTotal}
                </span>
              </div>
            </div>

            {/* Side-by-Side Monthly vs Bi-Monthly Comparison Box */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block font-sans">Equivalent 30-Day Rate</span>
                <span className="text-base font-bold text-[#164430]">₹{(displayTotal / 2).toFixed(2)}</span>
                <span className="text-[9px] text-slate-500 block font-sans">per month avg</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-sans">Effective Unit Cost</span>
                <span className="text-base font-bold text-emerald-700">
                  {effectiveUnits > 0 ? `₹${(displayTotal / effectiveUnits).toFixed(2)}` : '₹0.00'}
                </span>
                <span className="text-[9px] text-slate-500 block font-sans">per kWh delivered</span>
              </div>
            </div>

            {/* Action buttons: Pay & Download */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowPayModal(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#164430] hover:bg-[#1e583e] p-2.5 text-xs font-black text-[#FAF7F0] shadow-sm transition-all"
                id="tneb-quick-pay-btn"
              >
                <CreditCard className="h-4 w-4 text-[#C59B46]" />
                <span>Quick Pay Bill</span>
              </button>

              <button
                onClick={() => alert(`Official TANGEDCO Bi-Monthly Statement for Consumer ${userProfile.consumerNumber} downloaded.`)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#C59B46]/50 bg-[#FAF7F0] hover:bg-white p-2.5 text-xs font-bold text-[#164430] transition-all shadow-xs"
              >
                <Download className="h-4 w-4 text-[#C59B46]" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 text-[#164430] font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>TNEB Minnagam Portal Compliance</span>
              </div>
              <p className="text-slate-500 text-[10px]">
                Due Date: <strong className="text-slate-800">15th of next bi-monthly assessment</strong>. Disconnection notice is issued after 15 grace days under Section 56 of Indian Electricity Act.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TANGEDCO Quick Pay Online Portal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border-2 border-[#C59B46]/60 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#164430] flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#C59B46]" />
                <span>TNEB Official Quick Pay Portal</span>
              </h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {paySuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Payment Received & Stamped</h4>
                <div className="rounded-xl bg-[#FAF7F0] p-3 text-xs font-mono space-y-1 text-slate-700 border border-[#C59B46]/40">
                  <div className="text-emerald-700 font-bold">BBPS Ref: TNEB-TN-{Date.now().toString().slice(-8)}</div>
                  <div>Consumer: {userProfile?.consumerNumber || '09-245-014-1082'}</div>
                  <div>Amount Cleared: ₹{displayTotal}</div>
                  <div>Billing Cycle: 60-Day Bi-Monthly</div>
                  <div className="text-[10px] text-slate-500">Timestamp: {new Date().toLocaleString('en-IN')}</div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Official SMS & Email dispatch confirmed with TANGEDCO billing headend.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#FAF7F0] p-3 border border-[#C59B46]/30 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consumer:</span>
                    <span className="font-bold text-slate-900">{userProfile?.fullName || userProfile?.name || 'Er. S. Thirumurugan'} ({userProfile?.consumerNumber || '09-245-014-1082'})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Section Office:</span>
                    <span className="text-slate-700">{userProfile?.sectionOffice || 'Guindy EDC South'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billing Cycle:</span>
                    <span className="text-slate-700">Bi-Monthly (60 Days)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Net Payable Amount:</span>
                    <span className="font-bold text-[#164430] text-sm">₹{displayTotal}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="font-semibold text-slate-700 block">Payment Method:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`rounded-xl border p-2.5 font-bold text-center transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#C59B46] bg-[#164430] text-[#FAF7F0] shadow-xs'
                          : 'border-slate-200 bg-[#FAF7F0] text-slate-700 hover:bg-white'
                      }`}
                    >
                      UPI / Bharat QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`rounded-xl border p-2.5 font-bold text-center transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#C59B46] bg-[#164430] text-[#FAF7F0] shadow-xs'
                          : 'border-slate-200 bg-[#FAF7F0] text-slate-700 hover:bg-white'
                      }`}
                    >
                      NetBanking / Cards
                    </button>
                  </div>
                </div>

                {paymentMethod === 'upi' ? (
                  <div className="rounded-xl border border-[#C59B46]/40 bg-[#FAF7F0] p-3 text-center space-y-1">
                    <div className="text-[11px] text-slate-700 font-mono">TANGEDCO VPA: <span className="text-[#164430] font-bold">tnebebill@tneb</span></div>
                    <div className="text-[10px] text-slate-500">Supports GPay, PhonePe, Paytm, BHIM UPI</div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-[#FAF7F0] p-3 text-xs space-y-1">
                    <div className="text-slate-700">SBI, Canara Bank, Indian Bank, HDFC, ICICI</div>
                    <div className="text-[10px] text-slate-500">Zero transaction surcharge for domestic LT-1A</div>
                  </div>
                )}

                <button
                  onClick={handleProcessPayment}
                  className="w-full rounded-xl bg-[#164430] hover:bg-[#1e583e] p-3 text-xs font-black text-[#FAF7F0] shadow-md transition-all"
                  id="pay-confirm-btn"
                >
                  Pay ₹{displayTotal} Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
