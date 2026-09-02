import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  TrendingDown,
  TrendingUp,
  Zap,
  Clock,
  Flame,
  Leaf,
  DollarSign,
  FileSpreadsheet,
  Check,
  Building2,
  IndianRupee,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import { TimeframeType } from '../../types';

export const AnalyticsView: React.FC = () => {
  const {
    dailyTelemetry,
    weeklyTelemetry,
    monthlyTelemetry,
    yearlyTelemetry,
    metrics,
    tariffPlan,
    userProfile,
  } = useEnergy();

  const [timeframe, setTimeframe] = useState<TimeframeType>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'kwh' | 'cost' | 'carbon'>('kwh');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Select dataset based on timeframe
  const currentDataset =
    timeframe === '24h'
      ? dailyTelemetry
      : timeframe === '7d'
      ? weeklyTelemetry
      : timeframe === '30d'
      ? monthlyTelemetry
      : yearlyTelemetry;

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'TimeLabel', 'Active_Power_W', 'Units_kWh', 'Est_Cost_INR', 'Voltage_V', 'Current_A', 'Consumer_No'];
    const rows = currentDataset.map((d) => [
      d.timestamp,
      d.timeLabel,
      d.powerWatts,
      d.powerKw,
      (d.powerKw * 4.5).toFixed(2),
      d.voltage,
      d.current,
      userProfile.consumerNumber,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TNEB_${userProfile.consumerNumber}_telemetry_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // TNEB Peak vs Off-Peak split
  const peakDistribution = [
    { name: 'TNEB Evening Peak (6 PM – 10 PM)', value: 42, color: '#f59e0b' },
    { name: 'Normal Day Hours (6 AM – 6 PM)', value: 38, color: '#0284c7' },
    { name: 'Night Off-Peak (10 PM – 6 AM)', value: 20, color: '#10b981' },
  ];

  // 24-Hour Load Heatmap Matrix (Days vs 4-hour slots)
  const heatmapSlots = ['12-4 AM', '4-8 AM', '8-12 PM', '12-4 PM', '4-8 PM', '8-12 AM'];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getHeatIntensity = (dayIdx: number, slotIdx: number) => {
    const base = slotIdx === 4 || slotIdx === 5 ? 75 : slotIdx === 1 ? 55 : 30;
    const weekendBoost = dayIdx >= 5 ? 20 : 0;
    return Math.min(100, base + weekendBoost + (dayIdx * 3) % 15);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#09224f] to-[#040e24] p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-sky-400" />
              <span>TNEB Feeder Load & Telemetry Analytics</span>
            </h2>
            <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
              AMI Smart Metering
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Diurnal load curves, TNEB evening peak disaggregation, and seasonal consumption trends
          </p>
        </div>

        {/* Timeframe & Metric Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-xl bg-[#030b1e] p-1 border border-[#1a365d]">
            {(['24h', '7d', '30d', '12m'] as TimeframeType[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  timeframe === tf
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex rounded-xl bg-[#030b1e] p-1 border border-[#1a365d]">
            <button
              onClick={() => setSelectedMetric('kwh')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                selectedMetric === 'kwh'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Units (kWh)
            </button>
            <button
              onClick={() => setSelectedMetric('cost')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                selectedMetric === 'cost'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cost (₹)
            </button>
            <button
              onClick={() => setSelectedMetric('carbon')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                selectedMetric === 'carbon'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CO2 (kg)
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-[#1a365d] bg-[#030b1e] hover:bg-[#0a2046] px-3.5 py-2 text-xs font-bold text-slate-200 transition-colors"
            id="export-csv-btn"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-sky-400" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Analytics Chart Card */}
      <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1a365d]">
          <div>
            <h3 className="text-sm font-bold text-white">
              {timeframe === '24h'
                ? '24-Hour Granular Consumption Profile (1-Hour Intervals)'
                : timeframe === '7d'
                ? 'Past 7 Days Electricity Consumption & Load Dynamics'
                : timeframe === '30d'
                ? 'Past 30 Days Daily Consumption Curve'
                : '12-Month Annual Seasonal Energy History'}
            </h3>
            <span className="text-xs text-slate-400">
              Metric: {selectedMetric === 'kwh' ? 'Electricity Units (kWh)' : selectedMetric === 'cost' ? 'Estimated Cost (₹ INR)' : 'Carbon Footprint (kg CO2)'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-num text-slate-300">
            <span className="rounded bg-[#030b1e] px-2.5 py-1 border border-[#1a365d]">
              Avg: {(currentDataset.reduce((acc, d) => acc + d.powerKw, 0) / currentDataset.length).toFixed(1)} Units/slot
            </span>
            <span className="rounded bg-[#030b1e] px-2.5 py-1 border border-[#1a365d] text-amber-300 font-bold">
              Total: {currentDataset.reduce((acc, d) => acc + d.powerKw, 0).toFixed(1)} Units
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentDataset} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2f55" />
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                unit={selectedMetric === 'kwh' ? ' U' : selectedMetric === 'cost' ? '₹' : 'kg'}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#071738',
                  borderColor: '#1a365d',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: number) => {
                  if (selectedMetric === 'kwh') return [`${val} Units`, 'Energy'];
                  if (selectedMetric === 'cost') return [`₹${(val * 4.5).toFixed(2)}`, 'Cost'];
                  return [`${(val * 0.42).toFixed(1)} kg CO2`, 'Carbon'];
                }}
              />
              <Bar
                dataKey="powerKw"
                radius={[6, 6, 0, 0]}
                fill="#0284c7"
              >
                {currentDataset.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isPeakHour
                        ? '#f59e0b'
                        : selectedMetric === 'cost'
                        ? '#38bdf8'
                        : selectedMetric === 'carbon'
                        ? '#10b981'
                        : '#0284c7'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Deep Analytics Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Peak vs Off-Peak Pie & Insights */}
        <div className="lg:col-span-5 rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-[#1a365d]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>TNEB Time-of-Day (ToD) Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">Grid demand distribution across tariff windows</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={peakDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {peakDistribution.map((entry, index) => (
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
                  formatter={(val: number) => [`${val}%`, 'Grid Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {peakDistribution.map((band, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#1a365d]/60">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: band.color }} />
                  <span className="text-slate-300 font-medium">{band.name}</span>
                </div>
                <span className="font-mono-num font-bold text-amber-300">{band.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Load Intensity Heatmap */}
        <div className="lg:col-span-7 rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-[#1a365d]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Weekly Feeder Load Intensity Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">Identify heavy consumption hours across days of the week</p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-300 pb-1">
              <div className="text-left">Slot / Day</div>
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {heatmapSlots.map((slot, slotIdx) => (
              <div key={slot} className="grid grid-cols-7 gap-1.5 items-center">
                <div className="text-[10px] text-slate-400 font-mono truncate">{slot}</div>
                {daysOfWeek.map((_, dayIdx) => {
                  const intensity = getHeatIntensity(dayIdx, slotIdx);
                  const bgColor =
                    intensity > 75
                      ? 'bg-rose-500/80 text-rose-100'
                      : intensity > 50
                      ? 'bg-amber-500/70 text-slate-950 font-bold'
                      : intensity > 30
                      ? 'bg-sky-600/70 text-sky-100'
                      : 'bg-[#030b1e] text-slate-400 border border-[#1a365d]';
                  return (
                    <div
                      key={dayIdx}
                      className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-transform hover:scale-110 cursor-pointer ${bgColor}`}
                      title={`${daysOfWeek[dayIdx]} ${slot}: ${intensity}% feeder load`}
                    >
                      {intensity}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-[#1a365d]">
            <span>Low Draw (0–30%)</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-4 rounded bg-[#030b1e] border border-[#1a365d]" />
              <span className="h-3 w-4 rounded bg-sky-600/70" />
              <span className="h-3 w-4 rounded bg-amber-500/70" />
              <span className="h-3 w-4 rounded bg-rose-500/80" />
            </div>
            <span>Peak Demand (75–100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

