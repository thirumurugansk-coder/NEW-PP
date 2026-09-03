import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Usb,
  Wifi,
  Cloud,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  ExternalLink,
  Power,
  RefreshCw,
  Terminal,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

interface ConnectEsp32ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectEsp32Modal: React.FC<ConnectEsp32ModalProps> = ({ isOpen, onClose }) => {
  const {
    metrics,
    isSerialConnected,
    isWifiConnected,
    isMqttConnected,
    isEsp32Connected,
    setWifiConnected,
    connectWebSerial,
    disconnectWebSerial,
    disconnectHardware,
    setActiveTab,
    dataSourceMode,
    setDataSourceMode,
    serialLog,
    injectLiveTelemetry,
  } = useEnergy();

  const [selectedMethod, setSelectedMethod] = useState<'serial' | 'wifi' | 'mqtt'>('serial');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.184');
  const [port, setPort] = useState<number>(81);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setConnectionError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSerialConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      const success = await connectWebSerial(baudRate);
      if (!success) {
        setConnectionError(
          'Could not connect via Web Serial. Ensure your browser supports Web Serial (Chrome/Edge/Opera), plug in your ESP32 with a data USB cable, and select the device COM port.'
        );
      }
    } catch (err: any) {
      setConnectionError(err.message || 'Serial connection failed.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleWifiConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      // Connect to WebSocket on ESP32
      const wsUrl = `ws://${ipAddress}:${port}/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWifiConnected(true);
        setDataSourceMode('rest_webhook');
        setIsConnecting(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          injectLiveTelemetry({
            powerWatts: Number(data.watts || data.powerWatts || data.active_power || data.w || 0),
            voltage: Number(data.voltage || data.volts || data.v || 230),
            current: Number(data.current || data.current_a || data.amps || data.i || 0),
            powerFactor: Number(data.powerFactor || data.pf || 0.98),
            frequency: Number(data.frequency || data.freq || data.hz || 50.0),
          });
        } catch (e) {
          // ignore parsing error
        }
      };

      ws.onerror = () => {
        setWifiConnected(false);
        setConnectionError(`Could not establish WebSocket connection to ws://${ipAddress}:${port}/ws. Verify ESP32 IP & network.`);
        setIsConnecting(false);
      };

      ws.onclose = () => {
        setWifiConnected(false);
      };
    } catch (err: any) {
      setWifiConnected(false);
      setConnectionError(err.message || 'WiFi WebSocket connection failed.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#1a365d] bg-gradient-to-b from-[#081b3d] via-[#05132d] to-[#030b1e] p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1a365d]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-sky-500 text-slate-950 font-black shadow-lg">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Connect ESP32 Hardware Node</span>
                <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-500/30">
                  v3.4 AMI
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Stream live sensor telemetry (PZEM-004T, SCT-013, ZMPT101B) directly to your TNEB monitor.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1a365d] hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Status indicator */}
        <div className="mt-4 rounded-xl bg-[#020814] p-3.5 border border-[#1a365d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3.5 w-3.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isEsp32Connected ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex h-3.5 w-3.5 rounded-full ${
                  isEsp32Connected ? 'bg-emerald-500' : 'bg-rose-400'
                }`}
              />
            </span>
            <div>
              <div className="text-xs font-bold text-white">
                {isSerialConnected
                  ? 'ESP32 Connected via USB Web Serial'
                  : isWifiConnected
                  ? 'ESP32 Connected via Local WiFi WebSocket'
                  : isMqttConnected
                  ? 'ESP32 Connected via MQTT SCADA Broker'
                  : 'ESP32 Disconnected (No Telemetry — 0 W / 0 V / 0 A)'}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {isEsp32Connected
                  ? `Live Telemetry: ${metrics.voltageVolts}V | ${metrics.currentAmps}A | ${metrics.currentPowerWatts}W`
                  : 'Hardware offline. Plug in your ESP32 below to receive real readings.'}
              </div>
            </div>
          </div>

          {isEsp32Connected && (
            <button
              onClick={() => disconnectHardware()}
              className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-all"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Protocol Selector Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={() => setSelectedMethod('serial')}
            className={`flex flex-col items-center gap-1 rounded-xl p-3 border text-xs font-bold transition-all ${
              selectedMethod === 'serial'
                ? 'border-amber-400 bg-amber-400/10 text-amber-300 shadow-md'
                : 'border-[#1a365d] bg-[#030b1e] text-slate-400 hover:text-white'
            }`}
          >
            <Usb className="h-5 w-5" />
            <span>USB Web Serial</span>
            <span className="text-[9px] font-normal text-slate-400 font-mono">Recommended (Fast)</span>
          </button>

          <button
            onClick={() => setSelectedMethod('wifi')}
            className={`flex flex-col items-center gap-1 rounded-xl p-3 border text-xs font-bold transition-all ${
              selectedMethod === 'wifi'
                ? 'border-sky-400 bg-sky-400/10 text-sky-300 shadow-md'
                : 'border-[#1a365d] bg-[#030b1e] text-slate-400 hover:text-white'
            }`}
          >
            <Wifi className="h-5 w-5" />
            <span>WiFi / WebSocket</span>
            <span className="text-[9px] font-normal text-slate-400 font-mono">LAN Direct (Wireless)</span>
          </button>

          <button
            onClick={() => setSelectedMethod('mqtt')}
            className={`flex flex-col items-center gap-1 rounded-xl p-3 border text-xs font-bold transition-all ${
              selectedMethod === 'mqtt'
                ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-md'
                : 'border-[#1a365d] bg-[#030b1e] text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="h-5 w-5" />
            <span>MQTT SCADA Broker</span>
            <span className="text-[9px] font-normal text-slate-400 font-mono">Cloud Pub/Sub</span>
          </button>
        </div>

        {/* Selected Protocol Content */}
        <div className="mt-4 rounded-xl border border-[#1a365d] bg-[#030b1e] p-4 text-xs space-y-4">
          {selectedMethod === 'serial' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Usb className="h-4 w-4 text-sky-400" />
                    <span>Direct Web Serial API Connection</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Connects directly from your browser to the USB COM port of your ESP32-WROOM-32 or NodeMCU.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Select Baud Rate:</label>
                  <select
                    value={baudRate}
                    onChange={(e) => setBaudRate(Number(e.target.value))}
                    disabled={isSerialConnected}
                    className="w-full rounded-lg bg-[#081b3d] border border-[#1a365d] p-2 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value={115200}>115200 Baud (Standard ESP32)</option>
                    <option value={9600}>9600 Baud (PZEM-004T Default)</option>
                    <option value={57600}>57600 Baud</option>
                    <option value={230400}>230400 Baud (High Speed)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={isSerialConnected ? disconnectWebSerial : handleSerialConnect}
                    disabled={isConnecting}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl p-2.5 font-bold shadow-lg transition-all ${
                      isSerialConnected
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-gradient-to-r from-amber-400 via-sky-500 to-blue-600 text-slate-950 hover:opacity-95'
                    }`}
                    id="modal-connect-serial-btn"
                  >
                    {isConnecting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                    <span>{isSerialConnected ? 'Disconnect USB Port' : 'Choose Port & Connect'}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-[#081b3d]/70 p-2.5 border border-[#1a365d]/60 text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="text-amber-300 font-sans font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Quick Start Guide:</span>
                </div>
                <div>1. Connect your ESP32 to your computer via USB (CP2102/CH340 driver).</div>
                <div>2. Click &quot;Choose Port &amp; Connect&quot; and select your device (e.g., Silicon Labs CP210x or USB-SERIAL CH340).</div>
                <div>3. Serial frames will be decoded automatically into real-time power metrics.</div>
              </div>
            </div>
          )}

          {selectedMethod === 'wifi' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Wifi className="h-4 w-4 text-sky-400" />
                  <span>ESP32 AsyncWebSocket Local Stream</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Connects wirelessly over your local home WiFi network without sending data to external cloud servers.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-300 font-semibold block mb-1">ESP32 IP Address:</label>
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.184"
                    className="w-full rounded-lg bg-[#081b3d] border border-[#1a365d] p-2 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Port:</label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    placeholder="81"
                    className="w-full rounded-lg bg-[#081b3d] border border-[#1a365d] p-2 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <button
                onClick={handleWifiConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 p-2.5 font-bold text-slate-950 shadow-lg hover:opacity-95 transition-all"
              >
                {isConnecting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wifi className="h-4 w-4" />}
                <span>{isWifiConnected ? 'Reconnect WebSocket' : 'Connect Wireless WebSocket'}</span>
              </button>
            </div>
          )}

          {selectedMethod === 'mqtt' && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Cloud className="h-4 w-4 text-emerald-400" />
                  <span>TNEB SCADA MQTT Telemetry Ingestion</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Subscribe to live substation and consumer telemetry feeds published via MQTT protocol.
                </p>
              </div>

              <div className="rounded-lg bg-[#081b3d] p-3 border border-[#1a365d] text-[11px] space-y-1 font-mono">
                <div className="text-slate-300">Broker: <strong className="text-emerald-400">wss://broker.emqx.io:8084/mqtt</strong></div>
                <div className="text-slate-300">Topic: <strong className="text-amber-300">tneb/consumer/09-245-014-1082/telemetry</strong></div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('esp32');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 p-2.5 font-bold text-slate-950 shadow-lg transition-all"
              >
                <span>Configure MQTT Broker &amp; Topics</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {connectionError && (
          <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-rose-200">Connection Failed</div>
              <p className="text-[11px] leading-relaxed">{connectionError}</p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-5 pt-4 border-t border-[#1a365d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              setActiveTab('esp32');
            }}
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold transition-colors"
          >
            <Layers className="h-4 w-4" />
            <span>Open Full ESP32 Console, Pinouts &amp; Firmware Sketches (.ino)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#081b3d] border border-[#1a365d] px-4 py-2 font-bold text-slate-300 hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
