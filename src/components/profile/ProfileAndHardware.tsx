import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Wifi,
  Terminal,
  User,
  Home,
  Check,
  Download,
  Settings,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Layers,
  Building2,
  FileText,
  Clock,
  Gauge,
  MapPin,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export const ProfileAndHardware: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    metrics,
    iotConfig,
    updateIoTConfig,
    userProfile,
    updateUserProfile,
    dataSourceMode,
    setDataSourceMode,
    livePacketStats,
    connectWebSerial,
    disconnectWebSerial,
    isSerialConnected,
    serialLog,
  } = useEnergy();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [consumerNumber, setConsumerNumber] = useState(userProfile.consumerNumber);
  const [sectionOffice, setSectionOffice] = useState(userProfile.sectionOffice);
  const [sanctionedLoadKw, setSanctionedLoadKw] = useState(userProfile.sanctionedLoadKw);
  const [distributionCircle, setDistributionCircle] = useState(userProfile.distributionCircle);
  const [homeType, setHomeType] = useState(userProfile.homeType);
  const [householdMembers, setHouseholdMembers] = useState(userProfile.householdMembers);
  const [homeAreaSqFt, setHomeAreaSqFt] = useState(userProfile.homeAreaSqFt);
  const [monthlyBudgetKwh, setMonthlyBudgetKwh] = useState(userProfile.monthlyBudgetKwh);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      consumerNumber,
      sectionOffice,
      sanctionedLoadKw: Number(sanctionedLoadKw),
      distributionCircle,
      homeType,
      householdMembers: Number(householdMembers),
      homeAreaSqFt: Number(homeAreaSqFt),
      monthlyBudgetKwh: Number(monthlyBudgetKwh),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const liveMqttPayload = JSON.stringify(
    {
      tneb_consumer_no: userProfile.consumerNumber,
      smart_meter_id: userProfile.meterNumber || "TNEB-AMI-CHE-9842",
      distribution_circle: userProfile.distributionCircle,
      section_office: userProfile.sectionOffice,
      feeder_line: userProfile.feederName,
      timestamp: livePacketStats.lastPacketIso,
      tneb_telemetry: {
        voltage_rms_v: metrics.voltageVolts,
        current_rms_a: metrics.currentAmps,
        active_power_kw: Number((metrics.currentPowerWatts / 1000).toFixed(3)),
        sanctioned_load_kw: userProfile.sanctionedLoadKw,
        power_factor: metrics.powerFactor,
        frequency_hz: metrics.frequencyHz,
        bi_monthly_kwh_accumulated: metrics.biMonthlyUnitsKwh,
        free_scheme_units_consumed: Math.min(100, metrics.biMonthlyUnitsKwh),
        billable_units: Math.max(0, Number((metrics.biMonthlyUnitsKwh - 100).toFixed(2))),
      },
      meter_diagnostics: {
        tamper_status: "NORMAL_SEALED",
        cellular_signal_csq: 24,
        mcu_temp_c: 39.8,
        crc_status: livePacketStats.crcStatus,
        total_packets: livePacketStats.totalPackets,
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#1a365d] bg-gradient-to-r from-[#081b3d] via-[#09224f] to-[#040e24] p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-400" />
              <span>TNEB Consumer Service Profile & AMI Smart Meter Specs</span>
            </h2>
            <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
              TANGEDCO Official LT 1A
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Consumer service connection credentials, Sanctioned Load limits, and DLMS/COSEM Smart Meter IoT Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#030b1e] px-3.5 py-1.5 border border-[#1a365d]">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-300 font-bold">
              {userProfile.consumerNumber} (Active)
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Hardware Specs & User Profile */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 6 Cols: TNEB Smart Meter Hardware & MQTT Spec */}
        <div className="lg:col-span-6 space-y-6">
          {/* Real-time Hardware Bridge & Physical Serial Ingestion */}
          <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a365d]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-sky-400" />
                <span>Live Data Source & Physical Hardware Bridge</span>
              </h3>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                Active: {dataSourceMode.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Select Telemetry Ingestion Mode:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setDataSourceMode('smart_meter_adc')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'smart_meter_adc'
                      ? 'border-sky-500 bg-sky-500/20 text-white'
                      : 'border-[#1a365d] bg-[#030b1e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sky-300">Smart Meter ADC</div>
                  <div className="text-[10px] font-sans text-slate-400">High-Precision CT/PT Sensor Stream</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataSourceMode('web_serial')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'web_serial'
                      ? 'border-emerald-500 bg-emerald-500/20 text-white'
                      : 'border-[#1a365d] bg-[#030b1e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-emerald-300">Web Serial (USB/UART)</div>
                  <div className="text-[10px] font-sans text-slate-400">ESP32 / PZEM-004T / Arduino</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataSourceMode('mqtt')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'mqtt'
                      ? 'border-amber-500 bg-amber-500/20 text-white'
                      : 'border-[#1a365d] bg-[#030b1e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-amber-300">MQTT Broker Bridge</div>
                  <div className="text-[10px] font-sans text-slate-400">TNEB Headend SCADA Broker</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataSourceMode('rest_api')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'rest_api'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-[#1a365d] bg-[#030b1e] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-purple-300">REST API Pull</div>
                  <div className="text-[10px] font-sans text-slate-400">TANGEDCO Gateway HTTP Polling</div>
                </button>
              </div>

              {/* Physical Web Serial USB Port Controller */}
              <div className="rounded-xl border border-[#1a365d] bg-[#030b1e] p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Physical USB Serial Port (Baud: 115200)</span>
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                      isSerialConnected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isSerialConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>

                <div className="flex gap-2">
                  {!isSerialConnected ? (
                    <button
                      type="button"
                      onClick={connectWebSerial}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 p-2 text-xs font-bold text-slate-950 shadow transition-all"
                      id="connect-serial-btn"
                    >
                      Connect USB / ESP32 Device
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={disconnectWebSerial}
                      className="flex-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 p-2 text-xs font-bold transition-all"
                      id="disconnect-serial-btn"
                    >
                      Disconnect Port
                    </button>
                  )}
                </div>

                {serialLog.length > 0 && (
                  <div className="rounded-lg bg-[#040e24] p-2 text-[10px] font-mono text-slate-300 max-h-24 overflow-y-auto space-y-0.5 border border-[#1a365d]">
                    {serialLog.map((log, idx) => (
                      <div key={idx} className="leading-tight">{log}</div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('esp32')}
                  className="w-full flex items-center justify-between rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-400/10 via-sky-500/10 to-transparent p-2.5 text-xs text-amber-300 hover:bg-amber-400/20 transition-all font-bold"
                >
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-4 w-4 text-amber-400" />
                    <span>Open Dedicated ESP32 Hardware Console & Firmware Flasher</span>
                  </span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>

          {/* MQTT Telemetry Payload Terminal Box */}
          <div className="rounded-2xl border border-[#1a365d] bg-[#030b1e] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a365d]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Terminal className="h-4 w-4 text-amber-400" />
                <span>Live TNEB Smart Meter SCADA Packet (JSON)</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono">TANGEDCO Secure</span>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-[#040e24] p-3 text-[11px] font-mono text-sky-300 leading-relaxed border border-[#1a365d] max-h-52">
              {liveMqttPayload}
            </pre>
          </div>
        </div>

        {/* Right 6 Cols: Consumer Energy Profile Form */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] to-[#040e24] p-6 shadow-xl space-y-5">
            <div className="pb-2 border-b border-[#1a365d]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-amber-400" />
                <span>TNEB Consumer Service Information</span>
              </h3>
              <p className="text-xs text-slate-400">Update consumer credentials and bi-monthly consumption targets</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Consumer Service No.
                  </label>
                  <input
                    type="text"
                    value={consumerNumber}
                    onChange={(e) => setConsumerNumber(e.target.value)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs font-mono text-amber-300 font-bold focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sanctioned Load (kW)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="50"
                    value={sanctionedLoadKw}
                    onChange={(e) => setSanctionedLoadKw(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Consumer Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Section Office
                  </label>
                  <input
                    type="text"
                    value={sectionOffice}
                    onChange={(e) => setSectionOffice(e.target.value)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Email (EB Alerts)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Distribution EDC Circle
                  </label>
                  <input
                    type="text"
                    value={distributionCircle}
                    onChange={(e) => setDistributionCircle(e.target.value)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Household Occupants
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={householdMembers}
                    onChange={(e) => setHouseholdMembers(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Floor Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="20000"
                    value={homeAreaSqFt}
                    onChange={(e) => setHomeAreaSqFt(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bi-Monthly Energy Consumption Target (Units / kWh)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={monthlyBudgetKwh * 2}
                    onChange={(e) => setMonthlyBudgetKwh(Number(e.target.value) / 2)}
                    className="w-full rounded-xl border border-[#1a365d] bg-[#030b1e] px-3 py-2 text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-300 font-mono whitespace-nowrap">
                    Units / Bi-Monthly
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used by TNEB SmartGrid to calculate your efficiency score and slab escalation warnings.
                </span>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 py-2.5 text-xs font-black text-slate-950 shadow-md transition-all flex items-center justify-center gap-1.5"
                  id="save-profile-btn"
                >
                  {isSaved ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>TNEB Profile Updated Successfully!</span>
                    </>
                  ) : (
                    <span>Save TNEB Consumer Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

