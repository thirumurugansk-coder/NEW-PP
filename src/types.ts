export type TimeframeType = 'live' | '24h' | '7d' | '30d' | '12m';

export type TariffType = 'tneb_domestic' | 'tneb_commercial' | 'tou' | 'flat';

export type ThemeMode = 'tneb-dark' | 'tneb-light' | 'tneb-scada';

export type DataSourceMode = 'smart_meter_adc' | 'web_serial' | 'mqtt_broker' | 'rest_webhook';

export type ApplianceCategory = 'hvac' | 'kitchen' | 'entertainment' | 'lighting' | 'ev' | 'utility' | 'workstation';

export interface TelemetryDataPoint {
  timestamp: string;
  timeLabel: string;
  powerWatts: number;
  powerKw: number;
  voltage: number;
  current: number;
  powerFactor: number;
  frequency: number;
  reactivePowerVar?: number;
  thdPercent?: number;
  cumulativeKwh?: number;
  solarGeneratedWatts?: number;
  cost?: number;
  isPeakHour?: boolean;
}

export interface LiveTelemetryStats {
  totalPackets: number;
  packetsPerMinute: number;
  latencyMs: number;
  lastPacketIso: string;
  sourceMode: DataSourceMode;
  serialPortName?: string;
  mqttBrokerConnected?: boolean;
  activeTopic?: string;
  crcStatus: 'VALID_OK' | 'CRC_ERROR' | 'STANDBY';
}

export interface Appliance {
  id: string;
  name: string;
  category: ApplianceCategory;
  room: string;
  ratingWatts: number;
  currentWatts: number;
  dailyKwh: number;
  monthlyKwh: number;
  status: 'on' | 'off' | 'standby';
  standbyWatts: number;
  dailyHoursUsed: number;
  isSmartControlled: boolean;
  isHighLoad: boolean;
  iconName: string;
  priority: 'essential' | 'flexible' | 'heavy';
}

export interface EnergyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'surge' | 'overload' | 'phantom' | 'voltage' | 'budget' | 'feeder_outage' | 'tariff_peak';
  timestamp: string;
  status: 'active' | 'resolved' | 'snoozed';
  applianceName?: string;
  detectedValue?: string;
  thresholdValue?: string;
  recommendation?: string;
  feederLine?: string;
}

export interface EnergySuggestion {
  id: string;
  title: string;
  category: 'behavior' | 'timing' | 'hardware' | 'automation';
  potentialMonthlySavingsUSD: number;
  potentialMonthlySavingsINR: number;
  potentialMonthlySavingsKWh: number;
  difficulty: 'easy' | 'medium' | 'advanced';
  impact: 'high' | 'medium' | 'low';
  description: string;
  actionLabel: string;
  applied: boolean;
}

export interface TariffPlan {
  id: string;
  name: string;
  nameTamil?: string;
  type: TariffType;
  baseRatePerKwh: number;
  fixedMonthlyFee: number;
  taxPercent: number; // TNEB Electricity Duty (ED) 5%
  currency: string;
  currencySymbol: string;
  billingCycleDays: number; // 60 for TNEB Bi-monthly, 30 for monthly
  has100FreeUnits: boolean; // Tamil Nadu 100 Free Units Subsidy Scheme
  tiers: {
    minKwh: number;
    maxKwh: number;
    ratePerKwh: number;
    slabName: string;
    isSubsidized?: boolean;
  }[];
  peakRatePerKwh: number;
  offPeakRatePerKwh: number;
  peakHours: string; // "18:00 - 22:00"
}

export interface IoTNodeConfig {
  nodeId: string;
  deviceModel: string;
  mcu: string;
  firmwareVersion: string;
  ipAddress: string;
  macAddress: string;
  mqttBroker: string;
  mqttTopic: string;
  samplingIntervalMs: number;
  ctSensorModel: string;
  adcModel: string;
  connectionStatus: 'connected' | 'reconnecting' | 'offline';
  rssiSignalDbm: number;
  uptimeSeconds: number;
  lastPacketTimestamp: string;
  feederId: string;
  substationName: string;
  dtCode: string;
}

export interface UserProfile {
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  homeType: string;
  householdMembers: number;
  homeAreaSqFt: number;
  monthlyBudgetKwh: number;
  monthlyBudgetINR: number;
  alertThresholdWatts: number;
  peakAlertEnabled: boolean;
  emailAlertsEnabled: boolean;
  currency: string;
  currencySymbol: string;
  // Official TNEB / TANGEDCO Consumer Credentials
  consumerNumber: string; // e.g. "09-245-014-1082"
  sectionOffice: string; // e.g. "Guindy / Chennai EDC (South)"
  distributionCircle: string; // e.g. "Chennai South EDC"
  circle?: string;
  distributionTransformer: string; // e.g. "DT-GND-014 (250 kVA, 11kV/433V)"
  transformerId?: string;
  sanctionedLoadKw: number; // e.g. 5.0 kW
  phaseType: string; // "3-Phase LT"
  serviceConnectionType?: string;
  tariffCategory: string; // "LT Tariff 1A (Domestic / வீட்டு மின் நுகர்வு)"
  meterNumber: string; // "TNEB-AMI-2026-88942-LT1A"
  meterType: string; // "BIS IS 16444 Compliant 3-Phase Smart Meter"
  substation: string; // "Guindy 230/110/33kV Substation"
  feederName: string; // "11kV Feeder #4 (Velachery Road Link)"
  billingCycle: 'bi-monthly' | 'monthly';
  freeUnitsEligible: boolean; // 100 Free Units Scheme by TN Govt
}

export interface TnebGrievance {
  id: string;
  docketNumber: string;
  complaintType: 'voltage_fluctuation' | 'meter_defect' | 'line_snapping' | 'billing_dispute' | 'transformer_spark';
  title: string;
  description: string;
  status: 'registered' | 'assigned' | 'in_progress' | 'resolved';
  createdAt: string;
  assignedEngineer: string;
  contactNumber: string;
}

export interface TnebOutageNotice {
  id: string;
  substation: string;
  feeder: string;
  areaAffected: string;
  date: string;
  timeWindow: string;
  reason: string;
  status: 'scheduled' | 'active' | 'completed';
}

export interface EnergyMetrics {
  currentPowerWatts: number;
  currentPowerKw: number;
  voltageVolts: number;
  currentAmps: number;
  powerFactor: number;
  frequencyHz: number;
  dailyConsumptionKwh: number;
  monthlyConsumptionKwh: number;
  bimonthlyUnitsKwh: number;
  estimatedMonthlyBillINR: number;
  estimatedBiMonthlyBillINR: number;
  govtSubsidyINR: number; // Value of 100 free units subsidy provided by TN Govt
  efficiencyScore: number;
  carbonFootprintKg: number;
  goalKwh: number;
  goalPercentUsed: number;
  peakUsageTodayWatts: number;
  gridPowerWatts: number;
  solarGeneratedWatts: number;
  feederVoltageRms: number;
  gridFrequencyHz: number;
  tnebSanctionedLoadPercent: number;
}
