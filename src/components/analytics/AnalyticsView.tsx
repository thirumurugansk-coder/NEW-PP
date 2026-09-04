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
    isEsp32Connected,
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

  // TNEB Peak vs Off-Peak split - only populated when hardware is actively streaming
  const peakDistribution = isEsp32Connected
    ? [
        { name: 'TNEB Evening Peak (6 PM – 10 PM)', value: 42, color: '#C59B46' },
        { name: 'Normal Day Hours (6 AM – 6 PM)', value: 38, color: '#164430' },
        { name: 'Night Off-Peak (10 PM – 6 AM)', value: 20, color: '#2d7a54' },
      ]
    : [
        { name: 'TNEB Evening Peak (6 PM – 10 PM)', value: 0, color: '#C59B46' },
        { name: 'Normal Day Hours (6 AM – 6 PM)', value: 0, color: '#164430' },
        { name: 'Night Off-Peak (10 PM – 6 AM)', value: 0, color: '#2d7a54' },
      ];

  // 24-Hour Load Heatmap Matrix (Days vs 4-hour slots)
  const heatmapSlots = ['12-4 AM', '4-8 AM', '8-12 PM', '12-4 PM', '4-8 PM', '8-12 AM'];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getHeatIntensity = (dayIdx: number, slotIdx: number) => {
    if (!isEsp32Connected) return 0;
    const base = slotIdx === 4 || slotIdx === 5 ? 75 : slotIdx === 1 ? 55 : 30;
    const weekendBoost = dayIdx >= 5 ? 20 : 0;
    return Math.min(100, base + weekendBoost + (dayIdx * 3) % 15);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-2 border-[#C59B46]/50 bg-white/95 p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#164430] flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#C59B46]" />
              <span>TNEB Feeder Load & Telemetry Analytics</span>
            </h2>
            <span className="rounded-md bg-[#FAF7F0] px-2 py-0.5 text-[10px] font-bold text-[#164430] border border-[#C59B46]/40">
              AMI Smart Metering
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Diurnal load curves, TNEB evening peak disaggregation, and seasonal consumption trends
          </p>
        </div>

        {/* Timeframe & Metric Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-xl bg-[#FAF7F0] p-1 border border-[#C59B46]/30">
            {(['24h', '7d', '30d', '12m'] as TimeframeType[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  timeframe === tf
                    ? 'bg-[#164430] text-[#FAF7F0] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex rounded-xl bg-[#FAF7F0] p-1 border border-[#C59B46]/30">
            <button
              onClick={() => setSelectedMetric('kwh')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                selectedMetric === 'kwh'
                  ? 'bg-[#164430] text-[#FAF7F0]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Units (kWh)
            </button>
            <button
              onClick={() => setSelectedMetric('cost')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                selectedMetric === 'cost'
                  ? 'bg-[#C59B46] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cost (₹)
            </button>
            <button
              onClick={() => setSelectedMetric('carbon')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                selectedMetric === 'carbon'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CO2 (kg)
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-[#C59B46]/40 bg-white hover:bg-[#FAF7F0] px-3.5 py-2 text-xs font-bold text-slate-800 transition-colors shadow-sm"
            id="export-csv-btn"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-[#C59B46]" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Analytics Chart Card */}
      <div className="rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {timeframe === '24h'
                ? '24-Hour Granular Consumption Profile (1-Hour Intervals)'
                : timeframe === '7d'
                ? 'Past 7 Days Electricity Consumption & Load Dynamics'
                : timeframe === '30d'
                ? 'Past 30 Days Daily Consumption Curve'
                : '12-Month Annual Seasonal Energy History'}
            </h3>
            <span className="text-xs text-slate-500">
              Metric: {selectedMetric === 'kwh' ? 'Electricity Units (kWh)' : selectedMetric === 'cost' ? 'Estimated Cost (₹ INR)' : 'Carbon Footprint (kg CO2)'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-num text-slate-700">
            <span className="rounded bg-[#FAF7F0] px-2.5 py-1 border border-[#C59B46]/30">
              Avg: {(currentDataset.reduce((acc, d) => acc + d.powerKw, 0) / currentDataset.length).toFixed(1)} Units/slot
            </span>
            <span className="rounded bg-[#FAF7F0] px-2.5 py-1 border border-[#C59B46]/30 text-[#164430] font-bold">
              Total: {currentDataset.reduce((acc, d) => acc + d.powerKw, 0).toFixed(1)} Units
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentDataset} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                unit={selectedMetric === 'kwh' ? ' U' : selectedMetric === 'cost' ? '₹' : 'kg'}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF7F0',
                  borderColor: '#C59B46',
                  borderRadius: '12px',
                  color: '#1e293b',
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
                fill="#164430"
              >
                {currentDataset.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isPeakHour
                        ? '#C59B46'
                        : selectedMetric === 'cost'
                        ? '#2d7a54'
                        : selectedMetric === 'carbon'
                        ? '#15803d'
                        : '#164430'
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
        <div className="lg:col-span-5 rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C59B46]" />
              <span>TNEB Time-of-Day (ToD) Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">Grid demand distribution across tariff windows</p>
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
                    backgroundColor: '#FAF7F0',
                    borderColor: '#C59B46',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#1e293b',
                  }}
                  formatter={(val: number) => [`${val}%`, 'Grid Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {!isEsp32Connected && (
              <div className="rounded-lg bg-[#FAF7F0] p-2 text-center text-[11px] text-slate-600 border border-[#C59B46]/30">
                Hardware offline: Connect ESP32 to record live Time-of-Day distribution.
              </div>
            )}
            {peakDistribution.map((band, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: band.color }} />
                  <span className="text-slate-700 font-medium">{band.name}</span>
                </div>
                <span className="font-mono-num font-bold text-[#164430]">{band.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Load Intensity Heatmap */}
        <div className="lg:col-span-7 rounded-2xl border-2 border-[#C59B46]/40 bg-white/95 p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#C59B46]" />
              <span>Weekly Feeder Load Intensity Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">Identify heavy consumption hours across days of the week</p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-700 pb-1">
              <div className="text-left">Slot / Day</div>
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {heatmapSlots.map((slot, slotIdx) => (
              <div key={slot} className="grid grid-cols-7 gap-1.5 items-center">
                <div className="text-[10px] text-slate-500 font-mono truncate">{slot}</div>
                {daysOfWeek.map((_, dayIdx) => {
                  const intensity = getHeatIntensity(dayIdx, slotIdx);
                  const bgColor =
                    intensity > 75
                      ? 'bg-rose-500 text-white'
                      : intensity > 50
                      ? 'bg-[#C59B46] text-white font-bold'
                      : intensity > 30
                      ? 'bg-[#164430] text-white'
                      : 'bg-[#FAF7F0] text-slate-500 border border-[#C59B46]/30';
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

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
            <span>Low Draw (0–30%)</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-4 rounded bg-[#FAF7F0] border border-[#C59B46]/30" />
              <span className="h-3 w-4 rounded bg-[#164430]" />
              <span className="h-3 w-4 rounded bg-[#C59B46]" />
              <span className="h-3 w-4 rounded bg-rose-500" />
            </div>
            <span>Peak Demand (75–100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

