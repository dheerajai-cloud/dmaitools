/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Globe2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  ExternalLink,
  ShieldCheck,
  Plus,
  Key,
  Database,
  ArrowRight
} from 'lucide-react';
import { GoogleAccount, CmsConnection } from '../types';

interface CmsIntegrationsViewProps {
  googleAccount: GoogleAccount;
  cmsConnections: CmsConnection[];
  onTestConnection: (cmsId: string) => Promise<void>;
  isTestingId?: string;
  onAddConnection: (newConn: Omit<CmsConnection, 'id' | 'isConnected' | 'status'>) => void;
}

export const CmsIntegrationsView: React.FC<CmsIntegrationsViewProps> = ({
  googleAccount,
  cmsConnections,
  onTestConnection,
  isTestingId,
  onAddConnection,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState<'wordpress' | 'shopify' | 'custom_webhook'>('wordpress');
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newEndpoint, setNewEndpoint] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteUrl.trim()) return;

    onAddConnection({
      platform: newPlatform,
      siteName: newSiteName.trim(),
      siteUrl: newSiteUrl.trim().startsWith('http') ? newSiteUrl.trim() : `https://${newSiteUrl.trim()}`,
      config: {
        endpoint: newEndpoint || `${newSiteUrl.trim()}/wp-json/wp/v2`,
        autoDeployApproved: true,
      },
    });

    setNewSiteName('');
    setNewSiteUrl('');
    setNewEndpoint('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Google Account & Workspace Intelligence Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              G
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{googleAccount.name}</h3>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Authenticated via Google</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{googleAccount.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Auto-discovered:</span>
            <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
              {googleAccount.gscProperties.length} Search Console Properties
            </span>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {googleAccount.ga4Properties.length} GA4 Streams
            </span>
          </div>
        </div>

        {/* Auto-Discovered Google Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Google Search Console</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">Synced</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              Full access to organic search queries, SERP positions, crawl anomalies, and index coverage.
            </p>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Google Analytics 4</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">Synced</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              Real-time user journeys, organic bounce rates, top landing pages, and conversion events.
            </p>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gemini 3.8 AI Engine</span>
              </span>
              <span className="text-cyan-400 font-mono text-[11px]">Active</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              Direct server-side reasoning for automated site audits, multilingual prompt answers, and code fixes.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Websites & CMS Platforms */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-blue-400" />
              <span>Connected CMS & Website Platforms</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect your WordPress, Shopify, Webflow, or headless site so RankAgent can directly implement approved fixes.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Connect New Website</span>
          </button>
        </div>

        {/* CMS Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cmsConnections.map((conn) => {
            const isTesting = isTestingId === conn.id;

            return (
              <div
                key={conn.id}
                className="bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        conn.platform === 'wordpress'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : conn.platform === 'shopify'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      }`}>
                        {conn.platform.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">
                        {conn.siteName}
                      </h4>
                      <a
                        href={conn.siteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-blue-400 hover:underline flex items-center space-x-1 mt-0.5"
                      >
                        <span>{conn.siteUrl}</span>
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Connected</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-lg p-3 mt-3 border border-slate-800 text-xs space-y-1 text-slate-400 font-mono">
                    <div className="flex justify-between">
                      <span>API Endpoint:</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{conn.config.endpoint}</span>
                    </div>
                    {conn.lastPingMs && (
                      <div className="flex justify-between">
                        <span>Ping Latency:</span>
                        <span className="text-emerald-400 font-semibold">{conn.lastPingMs} ms</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Direct AI Fixes:</span>
                      <span className="text-blue-300">Enabled (Requires User Approval)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Verified: {new Date(conn.verifiedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <button
                    disabled={isTesting}
                    onClick={() => onTestConnection(conn.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-blue-400' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add CMS Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Globe2 className="w-5 h-5 text-blue-400" />
                <span>Connect Website / CMS</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select CMS Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['wordpress', 'shopify', 'custom_webhook'] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNewPlatform(p)}
                      className={`p-2.5 rounded-xl border font-semibold text-center uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                        newPlatform === p
                          ? 'bg-blue-600/30 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'wordpress' ? 'WordPress' : p === 'shopify' ? 'Shopify' : 'Webhook/API'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Website Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Online Store"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Website URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {newPlatform === 'wordpress' ? 'REST API Endpoint (Optional)' : newPlatform === 'shopify' ? 'Store Admin URL' : 'Webhook Endpoint'}
                </label>
                <input
                  type="text"
                  placeholder={newPlatform === 'wordpress' ? 'https://example.com/wp-json/wp/v2' : 'https://myshop.myshopify.com/admin/api'}
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 text-[11px] text-blue-300 leading-relaxed">
                <span className="font-bold">Zero-Risk Implementation:</span> RankAgent stages every fix for your review first. Nothing touches your website without your explicit approval, and every change can be reverted with 1-click Rollback.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save & Connect Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
