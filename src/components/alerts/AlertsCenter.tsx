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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#09224f] to-[#040e24] p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <span>TNEB Grid Outage & Consumer Alert Center</span>
            </h2>
            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
              Minnagam 1912 Sync
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time notifications for sanctioned load exceedance, feeder maintenance, and 100-unit free subsidy threshold
          </p>
        </div>

        {/* Hardware Diagnostic & Protection Circuit Test */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Safety Diagnostic Test:</span>
          <button
            onClick={() => triggerDiagnosticTest('surge')}
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 transition-colors flex items-center gap-1.5"
            id="diag-surge-btn"
            title="Test Sanctioned Peak Load Limit Exceedance trip alert"
          >
            <Zap className="h-3.5 w-3.5 text-rose-400" />
            <span>Load Trip Probe</span>
          </button>
          <button
            onClick={() => triggerDiagnosticTest('voltage')}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 transition-colors flex items-center gap-1.5"
            id="diag-voltage-btn"
            title="Test Feeder Under-Voltage condition alert"
          >
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span>Feeder Sag Probe</span>
          </button>
          <button
            onClick={() => triggerDiagnosticTest('phantom')}
            className="rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 text-xs font-bold text-sky-300 transition-colors flex items-center gap-1.5"
            id="diag-phantom-btn"
            title="Test Circuit Vampire Standby Leak alert"
          >
            <Radio className="h-3.5 w-3.5 text-sky-400" />
            <span>Phantom Leak Probe</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Alerts List + Threshold Config */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Filterable Alerts Feed */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1a365d] bg-[#030b1e] p-3">
            <div className="flex items-center gap-1.5">
              {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                    filterSeverity === sev
                      ? 'bg-[#0f2c59] text-white border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
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
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
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
              <div className="rounded-2xl border border-[#1a365d] bg-[#040e24] p-10 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Active TNEB Grid Alerts</h3>
                <p className="text-xs text-slate-400">All power feeder parameters operating within nominal TNERC limits.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-2xl border p-4.5 transition-all ${
                    alert.status === 'resolved'
                      ? 'border-[#1a365d] bg-[#030b1e]/60 opacity-70'
                      : alert.severity === 'critical'
                      ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/30 to-[#040e24]'
                      : alert.severity === 'warning'
                      ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/30 to-[#040e24]'
                      : 'border-[#1a365d] bg-[#081b3d]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-xl p-2 shrink-0 ${
                          alert.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-400'
                            : alert.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-sky-500/20 text-sky-400'
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              alert.severity === 'critical'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : alert.severity === 'warning'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            }`}
                          >
                            {alert.severity}
                          </span>
                          {alert.status === 'resolved' && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                              Resolved ✓
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {alert.description}
                        </p>

                        {alert.detectedValue && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono-num text-slate-400">
                            <span>
                              Telemetry Draw: <strong className="text-amber-300">{alert.detectedValue}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Sanctioned Limit: <strong className="text-slate-300">{alert.thresholdValue}</strong>
                            </span>
                          </div>
                        )}

                        {alert.recommendation && (
                          <div className="mt-2 rounded-lg bg-[#030b1e] p-2 text-[11px] text-sky-300 border border-[#1a365d]">
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
                          className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-2.5 py-1 text-xs font-bold border border-emerald-500/40 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
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
          <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
            <div className="pb-2 border-b border-[#1a365d]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-400" />
                <span>Consumer Threshold Configuration</span>
              </h3>
              <p className="text-xs text-slate-400">Adjust automatic TNEB grid overload limits</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Demand Overload Trigger</span>
                  <span className="font-mono text-amber-300 font-bold">{thresholdWatts} W ({(thresholdWatts / 1000).toFixed(1)} kW)</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="6000"
                  step="100"
                  value={thresholdWatts}
                  onChange={(e) => setThresholdWatts(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                />
                <span className="text-[10px] text-slate-400 block">
                  Alerts if total home draw approaches sanctioned load limit.
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1a365d] text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">TNEB Evening Peak Notifications (6-10 PM)</span>
                  <input
                    type="checkbox"
                    checked={userProfile.peakAlertEnabled}
                    onChange={(e) => updateUserProfile({ peakAlertEnabled: e.target.checked })}
                    className="accent-amber-400 h-4 w-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">100-Unit Free Scheme Expiry Alert</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-amber-400 h-4 w-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Feeder Maintenance Outage SMS</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-amber-400 h-4 w-4 rounded"
                  />
                </label>
              </div>

              <button
                onClick={handleSaveThreshold}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 py-2.5 text-xs font-black text-slate-950 shadow-md transition-all flex items-center justify-center gap-1.5"
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
          <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#081b3d] to-[#030b1e] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold">
              <PhoneCall className="h-4 w-4 text-amber-400" />
              <span>TANGEDCO Minnagam 1912</span>
            </div>
            <p className="text-[11px] text-slate-300">
              For transformer faults, street light issues, or power restoration status, dial <strong>1912</strong> (Toll-Free 24x7).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

