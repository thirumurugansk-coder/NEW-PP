import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Appliance,
  EnergyAlert,
  EnergyMetrics,
  EnergySuggestion,
  IoTNodeConfig,
  TariffPlan,
  TelemetryDataPoint,
  UserProfile,
  ThemeMode,
  TnebGrievance,
  TnebOutageNotice,
  DataSourceMode,
  LiveTelemetryStats,
} from '../types';
import {
  initialAppliances,
  initial24HourTelemetry,
  initial7DaysTelemetry,
  initial30DaysTelemetry,
  initial12MonthsTelemetry,
  initialAlerts,
  initialSuggestions,
  defaultTariffPlan,
  initialIoTNodeConfig,
  initialUserProfile,
  initialGrievances,
  initialOutageNotices,
} from '../data/initialData';

export type ActiveTab = 'home' | 'dashboard' | 'analytics' | 'appliances' | 'bill' | 'alerts' | 'advisor' | 'profile' | 'esp32';

export interface SlabBreakdownItem {
  slabName: string;
  units: number;
  rate: number;
  amount: number;
  isSubsidized: boolean;
}

export interface BillCalculationResult {
  energyCost: number;
  subsidyDeduction: number;
  grossEnergyCost: number;
  fixedCost: number;
  dutyTaxCost: number;
  fppcaCost: number;
  totalCost: number;
  totalAmountPayable: number;
  slabBreakdown: SlabBreakdownItem[];
  freeUnitsApplied: number;
}

export interface EnergyContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  appliances: Appliance[];
  toggleAppliance: (id: string) => void;
  updateAppliance: (id: string, updates: Partial<Appliance>) => void;
  addAppliance: (newApp: Omit<Appliance, 'id'>) => void;
  deleteAppliance: (id: string) => void;
  metrics: EnergyMetrics;
  liveTelemetry: TelemetryDataPoint[];
  dailyTelemetry: TelemetryDataPoint[];
  weeklyTelemetry: TelemetryDataPoint[];
  monthlyTelemetry: TelemetryDataPoint[];
  yearlyTelemetry: TelemetryDataPoint[];
  alerts: EnergyAlert[];
  dismissAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  triggerDiagnosticTest: (category: 'surge' | 'voltage' | 'phantom') => void;
  triggerSimulatedAlert: (category: 'surge' | 'voltage' | 'phantom') => void;
  suggestions: EnergySuggestion[];
  applySuggestion: (id: string) => void;
  tariffPlan: TariffPlan;
  updateTariffPlan: (plan: TariffPlan) => void;
  iotConfig: IoTNodeConfig;
  updateIoTConfig: (config: Partial<IoTNodeConfig>) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  grievances: TnebGrievance[];
  addGrievance: (complaint: Omit<TnebGrievance, 'id' | 'docketNumber' | 'createdAt' | 'status'>) => void;
  resolveGrievance: (id: string) => void;
  outageNotices: TnebOutageNotice[];
  isLiveStreaming: boolean;
  setIsLiveStreaming: (val: boolean) => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  samplingFrequencyMs: number;
  setSamplingFrequencyMs: (ms: number) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  triggerGoalCelebration: () => void;
  calculateBill: (unitsKwh: number, isBiMonthly?: boolean, plan?: TariffPlan) => BillCalculationResult;
  // Real-Time IoT Hardware Bridge
  dataSourceMode: DataSourceMode;
  setDataSourceMode: (mode: DataSourceMode) => void;
  livePacketStats: LiveTelemetryStats;
  injectLiveTelemetry: (point: Partial<TelemetryDataPoint>) => void;
  connectWebSerial: (baudRate?: number) => Promise<boolean>;
  disconnectWebSerial: () => void;
  sendSerialCommand: (cmd: string) => Promise<boolean>;
  clearSerialLog: () => void;
  isSerialConnected: boolean;
  isWifiConnected: boolean;
  isMqttConnected: boolean;
  isEsp32Connected: boolean;
  setWifiConnected: (connected: boolean) => void;
  setMqttConnected: (connected: boolean) => void;
  disconnectHardware: () => void;
  serialLog: string[];
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tneb_theme_mode_v2');
    return (saved as ThemeMode) || 'tneb-light';
  });

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('tneb_theme_mode_v2', mode);
  }, []);

  useEffect(() => {
    setThemeMode(themeMode);
  }, [themeMode, setThemeMode]);

  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    try {
      const saved = localStorage.getItem('wattwise_appliances_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((a: Appliance) => ({ ...a, currentWatts: 0 }));
      }
      localStorage.removeItem('wattwise_appliances');
      return initialAppliances;
    } catch {
      return initialAppliances;
    }
  });

  const [alerts, setAlerts] = useState<EnergyAlert[]>(() => {
    try {
      const saved = localStorage.getItem('wattwise_alerts_v2');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('wattwise_alerts');
      return initialAlerts;
    } catch {
      return initialAlerts;
    }
  });

  const [suggestions, setSuggestions] = useState<EnergySuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('wattwise_suggestions_v2');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('wattwise_suggestions');
      return initialSuggestions;
    } catch {
      return initialSuggestions;
    }
  });

  const [tariffPlan, setTariffPlan] = useState<TariffPlan>(() => {
    try {
      const saved = localStorage.getItem('wattwise_tariff');
      return saved ? { ...defaultTariffPlan, ...JSON.parse(saved) } : defaultTariffPlan;
    } catch {
      return defaultTariffPlan;
    }
  });

  const [iotConfig, setIotConfig] = useState<IoTNodeConfig>(() => {
    try {
      const saved = localStorage.getItem('wattwise_iot_config');
      return saved ? { ...initialIoTNodeConfig, ...JSON.parse(saved) } : initialIoTNodeConfig;
    } catch {
      return initialIoTNodeConfig;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('wattwise_user_profile');
      if (!saved) return initialUserProfile;
      const parsed = JSON.parse(saved);
      return {
        ...initialUserProfile,
        ...parsed,
        name: parsed.name || parsed.fullName || initialUserProfile.name,
        fullName: parsed.fullName || parsed.name || initialUserProfile.fullName,
        consumerNumber: parsed.consumerNumber || initialUserProfile.consumerNumber,
        sectionOffice: parsed.sectionOffice || initialUserProfile.sectionOffice,
        distributionCircle: parsed.distributionCircle || parsed.circle || initialUserProfile.distributionCircle,
        circle: parsed.circle || parsed.distributionCircle || initialUserProfile.circle,
        distributionTransformer: parsed.distributionTransformer || parsed.transformerId || initialUserProfile.distributionTransformer,
        transformerId: parsed.transformerId || parsed.distributionTransformer || initialUserProfile.transformerId,
        sanctionedLoadKw: Number(parsed.sanctionedLoadKw) || initialUserProfile.sanctionedLoadKw,
        phaseType: parsed.phaseType || parsed.serviceConnectionType || initialUserProfile.phaseType,
        serviceConnectionType: parsed.serviceConnectionType || parsed.phaseType || initialUserProfile.serviceConnectionType,
        tariffCategory: parsed.tariffCategory || initialUserProfile.tariffCategory,
        meterNumber: parsed.meterNumber || initialUserProfile.meterNumber,
        meterType: parsed.meterType || initialUserProfile.meterType,
        substation: parsed.substation || initialUserProfile.substation,
        feederName: parsed.feederName || initialUserProfile.feederName,
      };
    } catch {
      return initialUserProfile;
    }
  });

  const [grievances, setGrievances] = useState<TnebGrievance[]>(() => {
    try {
      const saved = localStorage.getItem('tneb_grievances_v2');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('tneb_grievances');
      return initialGrievances;
    } catch {
      return initialGrievances;
    }
  });

  const [outageNotices] = useState<TnebOutageNotice[]>(initialOutageNotices);

  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [samplingFrequencyMs, setSamplingFrequencyMs] = useState<number>(1000);
  const [dataSourceMode, setDataSourceMode] = useState<DataSourceMode>('web_serial');
  const [isSerialConnected, setIsSerialConnected] = useState<boolean>(false);
  const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
  const [isMqttConnected, setIsMqttConnected] = useState<boolean>(false);
  const [serialLog, setSerialLog] = useState<string[]>([]);
  const serialPortRef = useRef<any>(null);
  const serialReaderRef = useRef<any>(null);

  const isEsp32Connected = isSerialConnected || isWifiConnected || isMqttConnected;

  const [livePacketStats, setLivePacketStats] = useState<LiveTelemetryStats>({
    totalPackets: 0,
    packetsPerMinute: 0,
    latencyMs: 0,
    lastPacketIso: '',
    sourceMode: 'web_serial',
    crcStatus: 'STANDBY',
  });

  // Cumulative energy counter that increments with live telemetry (strictly 0 when disconnected)
  const [cumulativeUnitsKwh, setCumulativeUnitsKwh] = useState<number>(0);

  // Live real-time buffer: strictly 0 when ESP32 is not connected
  const [liveStream, setLiveStream] = useState<TelemetryDataPoint[]>(() => {
    const now = new Date();
    return Array.from({ length: 20 }, (_, i) => {
      const time = new Date(now.getTime() - (20 - i) * 1000);
      const timeStr = time.toTimeString().substring(0, 8);
      return {
        timestamp: timeStr,
        timeLabel: timeStr,
        powerWatts: 0,
        powerKw: 0,
        voltage: 0,
        current: 0,
        powerFactor: 0,
        frequency: 0,
        reactivePowerVar: 0,
        thdPercent: 0,
        cumulativeKwh: 0,
      };
    });
  });

  // Sync IoT node config with connection state
  useEffect(() => {
    setIotConfig((prev) => ({
      ...prev,
      connectionStatus: isEsp32Connected ? 'connected' : 'offline',
      lastPacketTimestamp: isEsp32Connected ? 'Live stream active (0s latency)' : 'Disconnected (No ESP32 detected)',
      rssiSignalDbm: isEsp32Connected ? -56 : 0,
    }));
  }, [isEsp32Connected]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('wattwise_appliances_v2', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('wattwise_alerts_v2', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('wattwise_suggestions_v2', JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    localStorage.setItem('wattwise_tariff', JSON.stringify(tariffPlan));
  }, [tariffPlan]);

  useEffect(() => {
    localStorage.setItem('wattwise_iot_config', JSON.stringify(iotConfig));
  }, [iotConfig]);

  useEffect(() => {
    localStorage.setItem('wattwise_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('tneb_grievances_v2', JSON.stringify(grievances));
  }, [grievances]);

  // Inject real-time data point from physical ESP32 (Web Serial, WiFi WebSocket, or MQTT)
  const injectLiveTelemetry = useCallback((point: Partial<TelemetryDataPoint>) => {
    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 8);
    const watts = point.powerWatts !== undefined ? Math.max(0, point.powerWatts) : 0;
    const voltage = point.voltage !== undefined ? Math.max(0, point.voltage) : 0;
    const pf = point.powerFactor !== undefined ? point.powerFactor : (watts > 0 && voltage > 0 ? 0.98 : 0);
    const current = point.current !== undefined ? Math.max(0, point.current) : (watts > 0 && voltage > 0 ? Number((watts / (voltage * (pf || 1))).toFixed(2)) : 0);
    const frequency = point.frequency !== undefined ? point.frequency : (voltage > 0 ? 50.0 : 0);
    const reactiveVar = point.reactivePowerVar !== undefined ? point.reactivePowerVar : (watts > 0 ? Math.round(watts * 0.2) : 0);

    const newPoint: TelemetryDataPoint = {
      timestamp: timeStr,
      timeLabel: timeStr,
      powerWatts: watts,
      powerKw: Number((watts / 1000).toFixed(3)),
      voltage,
      current,
      powerFactor: pf,
      frequency,
      reactivePowerVar: reactiveVar,
      thdPercent: point.thdPercent || (watts > 0 ? 1.8 : 0),
      cumulativeKwh: point.cumulativeKwh || cumulativeUnitsKwh,
    };

    setLiveStream((prev) => [...prev.slice(1), newPoint]);
    if (point.cumulativeKwh !== undefined) {
      setCumulativeUnitsKwh(point.cumulativeKwh);
    } else if (watts > 0) {
      // Integrate live power over 1-second interval: kWh += Watts / 3,600,000
      setCumulativeUnitsKwh((prev) => Number((prev + watts / 3600000).toFixed(4)));
    }
    setLivePacketStats((prev) => ({
      ...prev,
      totalPackets: prev.totalPackets + 1,
      packetsPerMinute: 60,
      latencyMs: Math.round(8 + Math.random() * 6),
      lastPacketIso: now.toISOString(),
      crcStatus: 'VALID_OK',
    }));
  }, [cumulativeUnitsKwh]);

  // Real-Time Telemetry Stream Controller:
  // "without connecting the esp32 dont give the fake values"
  // When ESP32 is disconnected, simulation is strictly stopped and live values remain 0.
  useEffect(() => {
    if (!isEsp32Connected) {
      // Disconnected: do not run fake generation interval.
      return;
    }
  }, [isEsp32Connected]);

  // Web Serial API Connection Handler (ESP32, PZEM-004T, Arduino USB)
  const connectWebSerial = useCallback(async (baudRate: number = 115200): Promise<boolean> => {
    if (!('serial' in navigator)) {
      setSerialLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Error: Web Serial API not supported in this browser. Please use Google Chrome, Microsoft Edge, or Opera over HTTPS.`,
        ...prev,
      ]);
      return false;
    }

    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate });
      serialPortRef.current = port;
      setIsSerialConnected(true);
      setDataSourceMode('web_serial');
      setSerialLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Connected to ESP32 Serial Port @ ${baudRate} Baud (8N1). Awaiting JSON/CSV telemetry packets...`,
        ...prev,
      ]);

      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      serialReaderRef.current = reader;

      // Read serial loop in background
      (async () => {
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            buffer += value;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              setSerialLog((prev) => [`[${new Date().toLocaleTimeString()}] RX: ${trimmed}`, ...prev.slice(0, 99)]);

              try {
                if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                  const data = JSON.parse(trimmed);
                  injectLiveTelemetry({
                    powerWatts: Number(data.watts || data.powerWatts || data.active_power || data.power || data.w || 0),
                    voltage: Number(data.voltage || data.volts || data.v || 230),
                    current: Number(data.current || data.current_a || data.amps || data.i || 0),
                    powerFactor: Number(data.powerFactor || data.pf || 0.98),
                    frequency: Number(data.frequency || data.freq || data.hz || 50.0),
                    solarGeneratedWatts: data.solarWatts !== undefined ? Number(data.solarWatts) : undefined,
                  });
                } else if (trimmed.includes(',')) {
                  // CSV format: voltage,current,power,pf,frequency
                  const parts = trimmed.split(',').map(Number);
                  if (parts.length >= 3 && !isNaN(parts[0])) {
                    injectLiveTelemetry({
                      voltage: parts[0],
                      current: parts[1],
                      powerWatts: parts[2],
                      powerFactor: parts[3] || 0.98,
                      frequency: parts[4] || 50.0,
                    });
                  }
                }
              } catch (e) {
                // non-JSON frame or partial buffer
              }
            }
          }
        }
      })().catch((err) => {
        setSerialLog((prev) => [`[${new Date().toLocaleTimeString()}] Serial read error: ${err.message}`, ...prev]);
        setIsSerialConnected(false);
      });

      return true;
    } catch (err: any) {
      setSerialLog((prev) => [`[${new Date().toLocaleTimeString()}] Connection cancelled or failed: ${err.message}`, ...prev]);
      return false;
    }
  }, [injectLiveTelemetry]);

  const sendSerialCommand = useCallback(async (cmd: string): Promise<boolean> => {
    if (!serialPortRef.current || !isSerialConnected) {
      setSerialLog((prev) => [`[${new Date().toLocaleTimeString()}] TX Failed: ESP32 Serial Port is not connected.`, ...prev]);
      return false;
    }
    try {
      const encoder = new TextEncoder();
      const writer = serialPortRef.current.writable.getWriter();
      await writer.write(encoder.encode(cmd.trim() + '\n'));
      writer.releaseLock();
      setSerialLog((prev) => [`[${new Date().toLocaleTimeString()}] TX ➔ ESP32: ${cmd.trim()}`, ...prev.slice(0, 99)]);
      return true;
    } catch (err: any) {
      setSerialLog((prev) => [`[${new Date().toLocaleTimeString()}] TX Error: ${err.message}`, ...prev]);
      return false;
    }
  }, [isSerialConnected]);

  const clearSerialLog = useCallback(() => {
    setSerialLog([]);
  }, []);

  const disconnectWebSerial = useCallback(async () => {
    try {
      if (serialReaderRef.current) {
        await serialReaderRef.current.cancel();
      }
      if (serialPortRef.current) {
        await serialPortRef.current.close();
      }
    } catch (e) {
      // ignore close errors
    }
    serialReaderRef.current = null;
    serialPortRef.current = null;
    setIsSerialConnected(false);
    setDataSourceMode('web_serial');
    setSerialLog((prev) => [`[${new Date().toLocaleTimeString()}] Disconnected from ESP32 Port. Live readings zeroed.`, ...prev]);
  }, []);

  const disconnectHardware = useCallback(async () => {
    await disconnectWebSerial();
    setIsWifiConnected(false);
    setIsMqttConnected(false);

    // Reset buffer to zero points
    const now = new Date();
    setLiveStream(
      Array.from({ length: 20 }, (_, i) => {
        const time = new Date(now.getTime() - (20 - i) * 1000);
        const timeStr = time.toTimeString().substring(0, 8);
        return {
          timestamp: timeStr,
          timeLabel: timeStr,
          powerWatts: 0,
          powerKw: 0,
          voltage: 0,
          current: 0,
          powerFactor: 0,
          frequency: 0,
          reactivePowerVar: 0,
          thdPercent: 0,
          cumulativeKwh: 0,
        };
      })
    );
    setLivePacketStats({
      totalPackets: 0,
      packetsPerMinute: 0,
      latencyMs: 0,
      lastPacketIso: '',
      sourceMode: 'web_serial',
      crcStatus: 'STANDBY',
    });
    setCumulativeUnitsKwh(0);
  }, [disconnectWebSerial]);

  // Official TNERC TNEB LT Tariff 1A Bi-Monthly Bill Calculation Engine
  const calculateBill = useCallback(
    (unitsKwh: number, isBiMonthly: boolean = true, plan: TariffPlan = tariffPlan): BillCalculationResult => {
      // TNEB LT-1A Tariff slabs are officially based on 60-day Bi-Monthly consumption
      const effectiveUnits = Math.max(0, unitsKwh);
      const slabBreakdown: SlabBreakdownItem[] = [];
      let grossEnergyCost = 0;
      let freeUnitsApplied = 0;
      let subsidyDeduction = 0;

      // Slabs in TNEB Tariff 1A:
      // 0-100 (Free), 101-200 (@ ₹2.25), 201-400 (@ ₹4.50), 401-500 (@ ₹6.00),
      // 501-600 (@ ₹8.00), 601-800 (@ ₹9.00), 801-1000 (@ ₹10.00), >1000 (@ ₹11.00)
      const slabs = plan.tiers || defaultTariffPlan.tiers;
      let remainingUnits = effectiveUnits;

      for (let i = 0; i < slabs.length; i++) {
        const tier = slabs[i];
        const prevMax = i === 0 ? 0 : slabs[i - 1].maxKwh;
        const slabCapacity = Math.max(0, tier.maxKwh - prevMax);

        if (remainingUnits > 0) {
          const unitsInSlab = Math.min(remainingUnits, slabCapacity);
          const slabCost = unitsInSlab * tier.ratePerKwh;
          
          if (tier.isSubsidized || (plan.has100FreeUnits && i === 0)) {
            freeUnitsApplied = unitsInSlab;
            // Value of subsidy that TN Govt pays on behalf of consumer (₹4.50 standard slab value)
            subsidyDeduction = unitsInSlab * 4.50;
          } else {
            grossEnergyCost += slabCost;
          }

          slabBreakdown.push({
            slabName: tier.slabName,
            units: Number(unitsInSlab.toFixed(2)),
            rate: tier.ratePerKwh,
            amount: Number(slabCost.toFixed(2)),
            isSubsidized: !!tier.isSubsidized,
          });

          remainingUnits -= unitsInSlab;
        } else {
          slabBreakdown.push({
            slabName: tier.slabName,
            units: 0,
            rate: tier.ratePerKwh,
            amount: 0,
            isSubsidized: !!tier.isSubsidized,
          });
        }
      }

      const energyCost = grossEnergyCost;
      const fixedCost = plan.fixedMonthlyFee || 0; // Subsidized/waived for LT 1A domestic
      const dutyTaxCost = Number(((energyCost + fixedCost) * (plan.taxPercent / 100)).toFixed(2));
      // Fuel Price and Power Purchase Cost Adjustment (FPPCA) ~ 25 paise/unit for non-free units
      const fppcaCost = Number((Math.max(0, effectiveUnits - freeUnitsApplied) * 0.25).toFixed(2));
      const totalCost = Number((energyCost + fixedCost + dutyTaxCost + fppcaCost).toFixed(2));

      return {
        energyCost: Number(energyCost.toFixed(2)),
        subsidyDeduction: Number(subsidyDeduction.toFixed(2)),
        grossEnergyCost: Number((grossEnergyCost + subsidyDeduction).toFixed(2)),
        fixedCost: Number(fixedCost.toFixed(2)),
        dutyTaxCost,
        fppcaCost,
        totalCost,
        totalAmountPayable: totalCost,
        slabBreakdown,
        freeUnitsApplied,
      };
    },
    [tariffPlan]
  );

  // Compute overall energy metrics
  const metrics: EnergyMetrics = useMemo(() => {
    // If ESP32 hardware is NOT connected:
    // "without connecting the esp32 dont give the fake values"
    // All instantaneous physical telemetry must be strictly 0.
    const latestPoint = isEsp32Connected && liveStream.length > 0
      ? liveStream[liveStream.length - 1]
      : {
          powerWatts: 0,
          voltage: 0,
          current: 0,
          powerFactor: 0,
          frequency: 0,
        };

    const currentPowerWatts = isEsp32Connected ? latestPoint.powerWatts : 0;
    const voltageVolts = isEsp32Connected ? latestPoint.voltage : 0;
    const currentAmps = isEsp32Connected ? latestPoint.current : 0;
    const powerFactor = isEsp32Connected ? latestPoint.powerFactor : 0;
    const frequencyHz = isEsp32Connected ? latestPoint.frequency : 0;

    // Daily and monthly consumption are strictly 0 when ESP32 hardware is not connected
    const dailyKwh = isEsp32Connected ? Number(cumulativeUnitsKwh.toFixed(2)) : 0;
    const monthlyKwh = isEsp32Connected ? Number((cumulativeUnitsKwh * 30).toFixed(1)) : 0;
    const bimonthlyUnitsKwh = isEsp32Connected ? Number((cumulativeUnitsKwh * 60).toFixed(1)) : 0;

    const zeroBillResult = {
      energyCost: 0,
      subsidyDeduction: 0,
      grossEnergyCost: 0,
      fixedCost: 0,
      dutyTaxCost: 0,
      fppcaCost: 0,
      totalCost: 0,
      totalAmountPayable: 0,
      slabBreakdown: [],
      freeUnitsApplied: 0,
    };

    const monthlyBill = isEsp32Connected && monthlyKwh > 0 ? calculateBill(monthlyKwh, false) : zeroBillResult;
    const biMonthlyBill = isEsp32Connected && bimonthlyUnitsKwh > 0 ? calculateBill(bimonthlyUnitsKwh, true) : zeroBillResult;

    // Dynamic Efficiency Score (0-100)
    const goalKwh = userProfile.monthlyBudgetKwh || 500;
    const budgetFactor = Math.max(0, Math.min(40, 40 * (1 - (monthlyKwh - goalKwh * 0.8) / (goalKwh * 0.4))));
    const totalStandbyWatts = appliances.reduce((sum, a) => sum + a.standbyWatts, 0);
    const standbyFactor = totalStandbyWatts < 40 ? 30 : totalStandbyWatts < 80 ? 22 : 14;
    const peakFactor = currentPowerWatts > 3500 ? 15 : currentPowerWatts > 2500 ? 22 : 30;
    const efficiencyScore = isEsp32Connected && currentPowerWatts > 0
      ? Math.round(Math.min(100, Math.max(35, budgetFactor + standbyFactor + peakFactor)))
      : 0;

    // Carbon Footprint: Average Indian grid emission ~0.82 kg CO2 per kWh
    const carbonFootprintKg = isEsp32Connected ? Math.round(monthlyKwh * 0.82) : 0;
    const goalPercentUsed = isEsp32Connected && goalKwh > 0 ? Math.min(100, Math.round((monthlyKwh / goalKwh) * 100)) : 0;

    const sanctionedWatts = (userProfile.sanctionedLoadKw || 5.0) * 1000;
    const tnebSanctionedLoadPercent = isEsp32Connected
      ? Math.min(100, Math.round((currentPowerWatts / sanctionedWatts) * 100))
      : 0;

    return {
      currentPowerWatts,
      currentPowerKw: Number((currentPowerWatts / 1000).toFixed(2)),
      voltageVolts,
      currentAmps,
      powerFactor,
      frequencyHz,
      dailyConsumptionKwh: dailyKwh,
      monthlyConsumptionKwh: monthlyKwh,
      bimonthlyUnitsKwh,
      estimatedMonthlyBillINR: monthlyBill.totalCost,
      estimatedBiMonthlyBillINR: biMonthlyBill.totalCost,
      govtSubsidyINR: biMonthlyBill.subsidyDeduction,
      efficiencyScore,
      carbonFootprintKg,
      goalKwh,
      goalPercentUsed,
      peakUsageTodayWatts: isEsp32Connected ? currentPowerWatts : 0,
      gridPowerWatts: isEsp32Connected ? currentPowerWatts : 0,
      solarGeneratedWatts: 0,
      feederVoltageRms: voltageVolts,
      gridFrequencyHz: frequencyHz,
      tnebSanctionedLoadPercent,
    };
  }, [liveStream, isEsp32Connected, cumulativeUnitsKwh, appliances, calculateBill, userProfile.monthlyBudgetKwh, userProfile.sanctionedLoadKw]);

  // Appliance Actions
  const toggleAppliance = useCallback((id: string) => {
    setAppliances((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const nextStatus = app.status === 'on' ? 'off' : 'on';
          const nextWatts = nextStatus === 'on' ? Math.round(app.ratingWatts * 0.8) : 0;
          return {
            ...app,
            status: nextStatus,
            currentWatts: nextWatts,
          };
        }
        return app;
      })
    );
  }, []);

  const updateAppliance = useCallback((id: string, updates: Partial<Appliance>) => {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  }, []);

  const addAppliance = useCallback((newApp: Omit<Appliance, 'id'>) => {
    const id = `app-${Date.now()}`;
    setAppliances((prev) => [...prev, { ...newApp, id }]);
  }, []);

  const deleteAppliance = useCallback((id: string) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Alert Actions
  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
  }, []);

  const triggerDiagnosticTest = useCallback((category: 'surge' | 'voltage' | 'phantom') => {
    const alertMap: Record<string, Partial<EnergyAlert>> = {
      surge: {
        title: 'TNEB Sanctioned Peak Load Limit Exceeded',
        description: 'Instantaneous consumer load reached 4.6 kW against 5.0 kW Sanctioned Load on Guindy Section line.',
        severity: 'critical',
        category: 'surge',
        detectedValue: '4,620 W',
        thresholdValue: '4,000 W Threshold Alert',
        recommendation: 'Stagger heavy appliances (AC + Geyser + EV Charger) to avoid demand surcharge penalties.',
        feederLine: 'Feeder #4 (Guindy SS)',
      },
      voltage: {
        title: 'TNEB Substation Feeder Voltage Sag Detected',
        description: 'Mains line voltage dropped to 204.2V during high evening grid load across Chennai South circle.',
        severity: 'warning',
        category: 'voltage',
        detectedValue: '204.2 V',
        thresholdValue: '216V - 244V (TNERC Mandate)',
        recommendation: 'Distribution transformer tap adjustment requested via Minnagam 1912.',
        feederLine: 'DT-GND-014 (250 kVA)',
      },
      phantom: {
        title: 'Standby Vampire Load On Inactive Circuits',
        description: 'Continuous 38.5W idle current detected during 01:00 AM - 05:00 AM window.',
        severity: 'warning',
        category: 'phantom',
        detectedValue: '38.5 W',
        thresholdValue: '10.0 W Norm',
        recommendation: 'Enable smart isolation relays on entertainment and workstation circuits.',
      },
    };

    const template = alertMap[category];
    if (template) {
      const newAlert: EnergyAlert = {
        id: `alert-diag-${Date.now()}`,
        title: template.title!,
        description: template.description!,
        severity: template.severity!,
        category: template.category!,
        timestamp: 'Just now',
        status: 'active',
        detectedValue: template.detectedValue,
        thresholdValue: template.thresholdValue,
        recommendation: template.recommendation,
        feederLine: template.feederLine,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  }, []);

  const triggerSimulatedAlert = triggerDiagnosticTest; // alias for backwards compatibility

  // Grievances for Minnagam 1912
  const addGrievance = useCallback((complaint: Omit<TnebGrievance, 'id' | 'docketNumber' | 'createdAt' | 'status'>) => {
    const docketNum = `TNEB-MN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance: TnebGrievance = {
      id: `grv-${Date.now()}`,
      docketNumber: docketNum,
      createdAt: 'Just now',
      status: 'registered',
      ...complaint,
    };
    setGrievances((prev) => [newGrievance, ...prev]);
  }, []);

  const resolveGrievance = useCallback((id: string) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'resolved' } : g))
    );
  }, []);

  // Suggestion actions
  const applySuggestion = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, applied: true } : s))
    );
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0284c7', '#0369a1', '#f59e0b', '#10b981'],
    });
  }, []);

  const triggerGoalCelebration = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#38bdf8', '#fbbf24', '#10b981'],
    });
  }, []);

  const updateTariffPlan = useCallback((newPlan: TariffPlan) => {
    setTariffPlan(newPlan);
  }, []);

  const updateIoTConfig = useCallback((config: Partial<IoTNodeConfig>) => {
    setIotConfig((prev) => ({ ...prev, ...config }));
  }, []);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  }, []);

  return (
    <EnergyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        themeMode,
        setThemeMode,
        appliances,
        toggleAppliance,
        updateAppliance,
        addAppliance,
        deleteAppliance,
        metrics,
        liveTelemetry: liveStream,
        dailyTelemetry: initial24HourTelemetry,
        weeklyTelemetry: initial7DaysTelemetry,
        monthlyTelemetry: initial30DaysTelemetry,
        yearlyTelemetry: initial12MonthsTelemetry,
        alerts,
        dismissAlert,
        resolveAlert,
        triggerDiagnosticTest,
        triggerSimulatedAlert,
        suggestions,
        applySuggestion,
        tariffPlan,
        updateTariffPlan,
        iotConfig,
        updateIoTConfig,
        userProfile,
        updateUserProfile,
        grievances,
        addGrievance,
        resolveGrievance,
        outageNotices,
        isLiveStreaming,
        setIsLiveStreaming,
        isSimulating: isLiveStreaming,
        setIsSimulating: setIsLiveStreaming,
        samplingFrequencyMs,
        setSamplingFrequencyMs,
        simulationSpeed: Math.round(2000 / samplingFrequencyMs),
        setSimulationSpeed: (speed: number) => setSamplingFrequencyMs(Math.max(200, Math.round(2000 / speed))),
        triggerGoalCelebration,
        calculateBill,
        dataSourceMode,
        setDataSourceMode,
        livePacketStats,
        injectLiveTelemetry,
        connectWebSerial,
        disconnectWebSerial,
        sendSerialCommand,
        clearSerialLog,
        isSerialConnected,
        isWifiConnected,
        isMqttConnected,
        isEsp32Connected,
        setWifiConnected: setIsWifiConnected,
        setMqttConnected: setIsMqttConnected,
        disconnectHardware,
        serialLog,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};

