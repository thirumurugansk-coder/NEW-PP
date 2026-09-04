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
        connection_status: isSerialConnected ? "CONNECTED_STREAMING" : "OFFLINE_STANDBY",
        crc_status: livePacketStats.crcStatus,
        total_packets: livePacketStats.totalPackets,
        last_packet: livePacketStats.lastPacketIso || "None",
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-2 border-[#C59B46]/40 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#164430] text-[#FAF7F0] font-black shadow-md border border-[#C59B46]/40">
              <Building2 className="h-5 w-5 text-[#C59B46]" />
            </div>
            <h2 className="text-lg font-black text-[#164430] flex items-center gap-2">
              <span>TNEB Consumer Service Profile & AMI Smart Meter Specs</span>
            </h2>
            <span className="rounded bg-[#FAF7F0] px-2 py-0.5 text-[10px] font-bold text-[#164430] border border-[#C59B46]/40 font-mono">
              TANGEDCO Official LT 1A
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Consumer service connection credentials, Sanctioned Load limits, and DLMS/COSEM Smart Meter IoT Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#FAF7F0] px-3.5 py-1.5 border border-[#C59B46]/30 shadow-xs">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-mono text-[#164430] font-bold">
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
          <div className="rounded-2xl border border-[#C59B46]/30 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#C59B46]/20">
              <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#C59B46]" />
                <span>Live Data Source & Physical Hardware Bridge</span>
              </h3>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-mono text-emerald-800 border border-emerald-300 font-bold">
                Active: {dataSourceMode.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Select Telemetry Ingestion Mode:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setDataSourceMode('smart_meter_adc')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'smart_meter_adc'
                      ? 'border-[#C59B46] bg-[#FAF7F0] text-[#164430] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="font-bold text-[#164430]">Smart Meter ADC</div>
                  <div className="text-[10px] font-sans text-slate-500">High-Precision CT/PT Sensor Stream</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataSourceMode('web_serial')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'web_serial'
                      ? 'border-[#C59B46] bg-[#FAF7F0] text-[#164430] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="font-bold text-emerald-700">Web Serial (USB/UART)</div>
                  <div className="text-[10px] font-sans text-slate-500">ESP32 / PZEM-004T / Arduino</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataSourceMode('mqtt')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'mqtt'
                      ? 'border-[#C59B46] bg-[#FAF7F0] text-[#164430] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="font-bold text-[#C59B46]">MQTT Broker Bridge</div>
                  <div className="text-[10px] font-sans text-slate-500">TNEB Headend SCADA Broker</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataSourceMode('rest_api')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    dataSourceMode === 'rest_api'
                      ? 'border-[#C59B46] bg-[#FAF7F0] text-[#164430] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="font-bold text-slate-800">REST API Pull</div>
                  <div className="text-[10px] font-sans text-slate-500">TANGEDCO Gateway HTTP Polling</div>
                </button>
              </div>

              {/* Physical Web Serial USB Port Controller */}
              <div className="rounded-xl border border-[#C59B46]/20 bg-[#FAF7F0] p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Physical USB Serial Port (Baud: 115200)</span>
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                      isSerialConnected
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600'
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
                      className="flex-1 rounded-xl bg-[#164430] hover:bg-[#1e583e] p-2 text-xs font-bold text-[#FAF7F0] shadow-sm transition-all"
                      id="connect-serial-btn"
                    >
                      Connect USB / ESP32 Device
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={disconnectWebSerial}
                      className="flex-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 p-2 text-xs font-bold transition-all"
                      id="disconnect-serial-btn"
                    >
                      Disconnect Port
                    </button>
                  )}
                </div>

                {serialLog.length > 0 && (
                  <div className="rounded-lg bg-[#0c1a14] p-2 text-[10px] font-mono text-emerald-400 max-h-24 overflow-y-auto space-y-0.5 border border-[#C59B46]/30">
                    {serialLog.map((log, idx) => (
                      <div key={idx} className="leading-tight">{log}</div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('esp32')}
                  className="w-full flex items-center justify-between rounded-xl border border-[#C59B46]/40 bg-white p-2.5 text-xs text-[#164430] hover:bg-[#FAF7F0] transition-all font-bold shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-4 w-4 text-[#C59B46]" />
                    <span>Open Dedicated ESP32 Hardware Console & Firmware Flasher</span>
                  </span>
                  <span className="text-[#C59B46]">➔</span>
                </button>
              </div>
            </div>
          </div>

          {/* MQTT Telemetry Payload Terminal Box */}
          <div className="rounded-2xl border border-[#C59B46]/30 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#C59B46]/20">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Terminal className="h-4 w-4 text-[#C59B46]" />
                <span>Live TNEB Smart Meter SCADA Packet (JSON)</span>
              </div>
              <span className="text-[10px] text-[#164430] font-mono font-bold">TANGEDCO Secure</span>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-[#0c1a14] p-3 text-[11px] font-mono text-emerald-400 leading-relaxed border border-[#C59B46]/30 max-h-52">
              {liveMqttPayload}
            </pre>
          </div>
        </div>

        {/* Right 6 Cols: Consumer Energy Profile Form */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-[#C59B46]/30 bg-white p-6 shadow-sm space-y-5">
            <div className="pb-2 border-b border-[#C59B46]/20">
              <h3 className="text-sm font-bold text-[#164430] flex items-center gap-2">
                <User className="h-4 w-4 text-[#C59B46]" />
                <span>TNEB Consumer Service Information</span>
              </h3>
              <p className="text-xs text-slate-600">Update consumer credentials and bi-monthly consumption targets</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consumer Service No.
                  </label>
                  <input
                    type="text"
                    value={consumerNumber}
                    onChange={(e) => setConsumerNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs font-mono text-[#164430] font-bold focus:border-[#C59B46] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sanctioned Load (kW)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="50"
                    value={sanctionedLoadKw}
                    onChange={(e) => setSanctionedLoadKw(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs font-mono text-slate-900 focus:border-[#C59B46] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Consumer Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs text-slate-900 focus:border-[#C59B46] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Section Office
                  </label>
                  <input
                    type="text"
                    value={sectionOffice}
                    onChange={(e) => setSectionOffice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs text-slate-900 focus:border-[#C59B46] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email (EB Alerts)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs text-slate-900 focus:border-[#C59B46] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Distribution EDC Circle
                  </label>
                  <input
                    type="text"
                    value={distributionCircle}
                    onChange={(e) => setDistributionCircle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs text-slate-900 focus:border-[#C59B46] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Household Occupants
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={householdMembers}
                    onChange={(e) => setHouseholdMembers(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs text-slate-900 focus:border-[#C59B46] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Floor Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max="20000"
                    value={homeAreaSqFt}
                    onChange={(e) => setHomeAreaSqFt(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs text-slate-900 focus:border-[#C59B46] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bi-Monthly Energy Consumption Target (Units / kWh)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={monthlyBudgetKwh * 2}
                    onChange={(e) => setMonthlyBudgetKwh(Number(e.target.value) / 2)}
                    className="w-full rounded-xl border border-slate-300 bg-[#FAF7F0] px-3 py-2 text-xs font-mono text-slate-900 focus:border-[#C59B46] focus:outline-none"
                  />
                  <span className="text-xs text-slate-700 font-mono whitespace-nowrap">
                    Units / Bi-Monthly
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Used by TNEB SmartGrid to calculate your efficiency score and slab escalation warnings.
                </span>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#164430] hover:bg-[#1e583e] py-2.5 text-xs font-black text-[#FAF7F0] shadow-md transition-all flex items-center justify-center gap-1.5"
                  id="save-profile-btn"
                >
                  {isSaved ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3] text-[#C59B46]" />
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

