import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle2,
  Trash2,
  BellRing,
  Sparkles,
  Flame,
  Radio,
  Sliders,
  Check,
  Building2,
  PhoneCall,
  Info,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { EnergyAlert } from '../../types';

export const AlertsCenter: React.FC = () => {
  const {
    alerts,
    dismissAlert,
    resolveAlert,
    triggerDiagnosticTest,
    userProfile,
    updateUserProfile,
  } = useEnergy();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('all');
  const [thresholdWatts, setThresholdWatts] = useState<number>(userProfile.alertThresholdWatts || 3800);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  const handleSaveThreshold = () => {
    updateUserProfile({ alertThresholdWatts: thresholdWatts });
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Hardware Diagnostic Safety Probes */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border-2 border-[#C59B46]/50 bg-white/95 p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#164430] flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <span>TNEB Grid Outage & Consumer Alert Center</span>
            </h2>
            <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
              Minnagam 1912 Sync
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Real-time notifications for sanctioned load exceedance, feeder maintenance, and 100-unit free subsidy threshold
          </p>
        </div>

        {/* Hardware Diagnostic & Protection Circuit Test */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold mr-1">Safety Diagnostic Test:</span>
          <button
            onClick={() => triggerDiagnosticTest('surge')}
            className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-800 transition-colors flex items-center gap-1.5"
            id="diag-surge-btn"
            title="Test Sanctioned Peak Load Limit Exceedance trip alert"
          >
            <Zap className="h-3.5 w-3.5 text-rose-600" />
            <span>Load Trip Probe</span>
          </button>
          <button
            onClick={() => triggerDiagnosticTest('voltage')}
            className="rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 transition-colors flex items-center gap-1.5"
            id="diag-voltage-btn"
            title="Test Feeder Under-Voltage condition alert"
          >
            <Activity className="h-3.5 w-3.5 text-amber-600" />
            <span>Feeder Sag Probe</span>
          </button>
          <button
            onClick={() => triggerDiagnosticTest('phantom')}
            className="rounded-xl border border-[#C59B46]/40 bg-[#FAF7F0] hover:bg-white px-3 py-1.5 text-xs font-bold text-[#164430] transition-colors flex items-center gap-1.5"
            id="diag-phantom-btn"
            title="Test Circuit Vampire Standby Leak alert"
          >
            <Radio className="h-3.5 w-3.5 text-[#C59B46]" />
            <span>Phantom Leak Probe</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Alerts List + Threshold Config */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Filterable Alerts Feed */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C59B46]/40 bg-white/95 p-3">
            <div className="flex items-center gap-1.5">
              {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                    filterSeverity === sev
                      ? 'bg-[#164430] text-[#FAF7F0] border border-[#C59B46]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {(['all', 'active', 'resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                    filterStatus === st
                      ? 'bg-[#164430] text-[#FAF7F0]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Cards */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="rounded-2xl border-2 border-[#C59B46]/30 bg-white/95 p-10 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">No Active TNEB Grid Alerts</h3>
                <p className="text-xs text-slate-500">All power feeder parameters operating within nominal TNERC limits.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-2xl border-2 p-4.5 transition-all ${
                    alert.status === 'resolved'
                      ? 'border-slate-200 bg-[#FAF7F0]/60 opacity-70'
                      : alert.severity === 'critical'
                      ? 'border-rose-300 bg-rose-50/40'
                      : alert.severity === 'warning'
                      ? 'border-amber-300 bg-amber-50/40'
                      : 'border-[#C59B46]/40 bg-white/95'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-xl p-2 shrink-0 ${
                          alert.severity === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : alert.severity === 'warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              alert.severity === 'critical'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : alert.severity === 'warning'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {alert.severity}
                          </span>
                          {alert.status === 'resolved' && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                              Resolved ✓
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {alert.description}
                        </p>

                        {alert.detectedValue && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono-num text-slate-500">
                            <span>
                              Telemetry Draw: <strong className="text-[#164430]">{alert.detectedValue}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Sanctioned Limit: <strong className="text-slate-700">{alert.thresholdValue}</strong>
                            </span>
                          </div>
                        )}

                        {alert.recommendation && (
                          <div className="mt-2 rounded-lg bg-[#FAF7F0] p-2 text-[11px] text-[#164430] border border-[#C59B46]/30">
                            💡 <strong>TNEB Recommendation:</strong> {alert.recommendation}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {alert.status === 'active' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2.5 py-1 text-xs font-bold border border-emerald-300 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Dismiss alert"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 4 Cols: Threshold Tuning Panel & Minnagam Helpdesk */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#C59B46]" />
                <span>Consumer Threshold Configuration</span>
              </h3>
              <p className="text-xs text-slate-500">Adjust automatic TNEB grid overload limits</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Demand Overload Trigger</span>
                  <span className="font-mono text-[#164430] font-bold">{thresholdWatts} W ({(thresholdWatts / 1000).toFixed(1)} kW)</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="6000"
                  step="100"
                  value={thresholdWatts}
                  onChange={(e) => setThresholdWatts(Number(e.target.value))}
                  className="w-full accent-[#164430] cursor-pointer h-1.5 rounded-lg bg-slate-200"
                />
                <span className="text-[10px] text-slate-500 block">
                  Alerts if total home draw approaches sanctioned load limit.
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">TNEB Evening Peak Notifications (6-10 PM)</span>
                  <input
                    type="checkbox"
                    checked={userProfile.peakAlertEnabled}
                    onChange={(e) => updateUserProfile({ peakAlertEnabled: e.target.checked })}
                    className="accent-[#164430] h-4 w-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">100-Unit Free Scheme Expiry Alert</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#164430] h-4 w-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">Feeder Maintenance Outage SMS</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#164430] h-4 w-4 rounded"
                  />
                </label>
              </div>

              <button
                onClick={handleSaveThreshold}
                className="w-full rounded-xl bg-[#164430] hover:bg-[#1e583e] py-2.5 text-xs font-black text-[#FAF7F0] shadow-sm transition-all flex items-center justify-center gap-1.5"
                id="save-thresholds-btn"
              >
                {thresholdSaved ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Configuration Saved!</span>
                  </>
                ) : (
                  <span>Update Alert Thresholds</span>
                )}
              </button>
            </div>
          </div>

          {/* Minnagam Helpline Card */}
          <div className="rounded-2xl border border-[#C59B46]/40 bg-[#FAF7F0] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#164430] font-bold">
              <PhoneCall className="h-4 w-4 text-[#C59B46]" />
              <span>TANGEDCO Minnagam 1912</span>
            </div>
            <p className="text-[11px] text-slate-600">
              For transformer faults, street light issues, or power restoration status, dial <strong>1912</strong> (Toll-Free 24x7).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

