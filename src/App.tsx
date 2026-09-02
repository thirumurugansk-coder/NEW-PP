/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EnergyProvider, useEnergy } from './context/EnergyContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ApplianceMonitoring } from './components/appliances/ApplianceMonitoring';
import { BillEstimator } from './components/bill/BillEstimator';
import { AlertsCenter } from './components/alerts/AlertsCenter';
import { EnergyAdvisor } from './components/advisor/EnergyAdvisor';
import { ProfileAndHardware } from './components/profile/ProfileAndHardware';
import { Esp32Integration } from './components/esp32/Esp32Integration';
import { Zap, ShieldCheck, Heart, Radio, Activity } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, iotConfig, metrics } = useEnergy();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container with Sidebar + View */}
      <div className="flex-1 flex w-full mx-auto max-w-7xl">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'home' && <LandingPage />}
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'esp32' && <Esp32Integration />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'appliances' && <ApplianceMonitoring />}
          {activeTab === 'bill' && <BillEstimator />}
          {activeTab === 'alerts' && <AlertsCenter />}
          {activeTab === 'advisor' && <EnergyAdvisor />}
          {activeTab === 'profile' && <ProfileAndHardware />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-200">
              WattWise Smart Energy Monitoring System
            </span>
            <span className="text-slate-700">|</span>
            <span>IoT & ECE Engineering Capstone</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('esp32')}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Radio className="h-3 w-3 animate-pulse" />
              <span>ESP32 Web Serial & WiFi Gateway</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('bill')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              TNEB Tariff 1A Slabs
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Hardware Pinouts
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('advisor')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Efficiency Guidelines
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <EnergyProvider>
      <MainContent />
    </EnergyProvider>
  );
}
