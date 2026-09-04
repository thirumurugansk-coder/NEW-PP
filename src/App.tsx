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
import controlCenterBg from './assets/images/voltpulse_iot_background_1788444639285.jpg';
import homeBackdropBg from './assets/images/voltpulse_home_backdrop_1788519343186.jpg';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useEnergy();

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-[#C59B46] selection:text-slate-950 relative bg-[#F5EFE6] text-slate-800 transition-all duration-300"
      style={{
        backgroundImage: `url(${homeBackdropBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
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
      <footer className="border-t border-[#C59B46]/30 bg-[#FAF7F0]/90 backdrop-blur-md py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 shadow-sm">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#164430]/15 text-[#164430] border border-[#C59B46]/40">
              <Zap className="h-3.5 w-3.5 text-[#C59B46]" />
            </div>
            <span className="font-bold text-[#164430]">
              VoltPulse IoT Smart Energy Monitoring System
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 font-medium">IoT & ECE Engineering Capstone</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab('esp32')}
              className="flex items-center gap-1 text-[#164430] hover:text-[#C59B46] transition-colors"
            >
              <Radio className="h-3 w-3 text-[#C59B46]" />
              <span>ESP32 Web Serial & WiFi Gateway</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('bill')}
              className="text-slate-600 hover:text-[#164430] transition-colors"
            >
              TNEB Tariff 1A Slabs
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-slate-600 hover:text-[#164430] transition-colors"
            >
              Hardware Pinouts
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('advisor')}
              className="text-slate-600 hover:text-[#164430] transition-colors"
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
