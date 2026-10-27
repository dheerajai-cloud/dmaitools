/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Search, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { GscProperty, Ga4Property } from '../types';

interface ConnectPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newGsc: GscProperty, newGa4: Ga4Property) => void;
  theme: 'light' | 'dark';
}

export const ConnectPropertyModal: React.FC<ConnectPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  theme,
}) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [ga4Id, setGa4Id] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl.trim()) return;

    setIsVerifying(true);

    setTimeout(() => {
      let cleanUrl = siteUrl.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      // Remove trailing slash for consistency
      cleanUrl = cleanUrl.replace(/\/$/, '');

      const domainName = cleanUrl.replace(/^https?:\/\//, '');
      const displayName = siteName.trim() || `${domainName} Property`;
      const measurementId = ga4Id.trim() || `G-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const newGsc: GscProperty = {
        id: `gsc-${Date.now()}`,
        siteUrl: cleanUrl,
        permissionLevel: 'siteOwner',
        totalClicks: 3250,
        totalImpressions: 89400,
        avgCtr: 3.6,
        avgPosition: 14.2,
        lastSynced: 'Just now',
        topQueries: [
          {
            query: `${domainName.split('.')[0]} reviews`,
            clicks: 820,
            impressions: 12400,
            ctr: 6.6,
            position: 2.1,
            trend: 'up',
            opportunityNote: 'Strong branded anchor. Ensure Schema.org entity markup is active.',
          },
          {
            query: `best ${domainName.split('.')[0]} alternatives`,
            clicks: 410,
            impressions: 18200,
            ctr: 2.3,
            position: 8.4,
            trend: 'down',
            opportunityNote: 'High impression query; add comparative FAQ content to capture page 1.',
          },
          {
            query: `pricing plans ${domainName.split('.')[0]}`,
            clicks: 290,
            impressions: 6400,
            ctr: 4.5,
            position: 4.8,
            trend: 'steady',
          },
        ],
      };

      const newGa4: Ga4Property = {
        propertyId: `ga4-${Date.now()}`,
        displayName,
        websiteUrl: cleanUrl,
        totalUsers: 14200,
        totalSessions: 19800,
        bounceRate: 42.1,
        conversions: 380,
        lastSynced: 'Just now',
        topLandingPages: [
          {
            pagePath: '/',
            pageTitle: `${displayName} - Home`,
            sessions: 9400,
            users: 7100,
            bounceRate: 38.5,
            conversions: 210,
            avgEngagementTimeSec: 135,
          },
          {
            pagePath: '/features',
            pageTitle: 'Features & Capabilities',
            sessions: 4200,
            users: 3300,
            bounceRate: 46.2,
            conversions: 95,
            avgEngagementTimeSec: 92,
          },
        ],
      };

      onAddProperty(newGsc, newGa4);
      setIsVerifying(false);
      onClose();
    }, 800);
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-750 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-start justify-between ${isDark ? 'border-slate-800 bg-slate-850/50' : 'border-slate-100 bg-slate-50/70'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Connect Website & Google Properties</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Link Google Search Console & GA4 data streams to your account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Website URL (e.g. your production website) *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com or yourbrand.com"
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' 
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Used for live DOM crawling, keyword queries, and automated SEO patch verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Property Display Name (Optional)
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="e.g. MyBrand Store (Production)"
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' 
                  : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GA4 Measurement ID (Optional)
            </label>
            <div className="relative">
              <BarChart3 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={ga4Id}
                onChange={(e) => setGa4Id(e.target.value)}
                placeholder="G-XXXXXXXXXX (leave blank to auto-generate stream)"
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none transition-all ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' 
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                }`}
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs space-y-2 ${
            isDark ? 'bg-slate-850 border-slate-800 text-slate-300' : 'bg-emerald-50/60 border-emerald-100 text-slate-700'
          }`}>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>What happens next?</span>
            </div>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Auto-provisions verified Search Console read access for impressions, CTR & rank positions</li>
              <li>Connects Google Analytics 4 session metrics & bounce rates</li>
              <li>Instantly enables live DOM SEO crawler and AI reasoning on your site</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>{isVerifying ? 'Verifying & Linking...' : 'Connect Property'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
