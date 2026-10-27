/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Sparkles, 
  MousePointer, 
  Eye, 
  Percent, 
  Layers,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { GscProperty, Ga4Property, GscQuery, Ga4LandingPage } from '../types';

interface DataHubViewProps {
  gscData: GscProperty;
  ga4Data: Ga4Property;
  onAskAiAboutQuery: (query: GscQuery) => void;
  onAskAiAboutPage: (page: Ga4LandingPage) => void;
}

export const DataHubView: React.FC<DataHubViewProps> = ({
  gscData,
  ga4Data,
  onAskAiAboutQuery,
  onAskAiAboutPage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'gsc' | 'ga4'>('gsc');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredQueries = gscData.topQueries.filter((q) =>
    q.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredPages = ga4Data.topLandingPages.filter((p) =>
    p.pagePath.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.pageTitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Tab Switcher & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => {
              setActiveSubTab('gsc');
              setSearchFilter('');
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'gsc'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search Console (GSC)</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('ga4');
              setSearchFilter('');
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'ga4'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Google Analytics 4 (GA4)</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Verified Connected Property: <strong className="text-white">{gscData.siteUrl}</strong></span>
        </div>
      </div>

      {activeSubTab === 'gsc' ? (
        <>
          {/* GSC Overview KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Total Clicks (30d)</span>
                <MousePointer className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {gscData.totalClicks.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>+12.4% vs previous 30d</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Impressions</span>
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {gscData.totalImpressions.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>+18.7% search visibility</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Average CTR</span>
                <Percent className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {gscData.avgCtr}%
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1">
                <span>Target: 5.5% (High CTR potential)</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                <span>Avg Position</span>
                <ArrowUpDown className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-2">
                #{gscData.avgPosition}
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>Page 1 threshold</span>
              </div>
            </div>
          </div>

          {/* Queries Explorer Table */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Search Queries & CTR Opportunities</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Queries with high impressions but low CTR are prime candidates for AI meta title updates.
                </p>
              </div>

              {/* Filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter queries..."
                  className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] font-semibold uppercase text-slate-400 bg-slate-900/60 border-y border-slate-700/80">
                  <tr>
                    <th className="py-3 px-4">Search Query</th>
                    <th className="py-3 px-4 text-right">Clicks</th>
                    <th className="py-3 px-4 text-right">Impressions</th>
                    <th className="py-3 px-4 text-right">CTR</th>
                    <th className="py-3 px-4 text-right">Position</th>
                    <th className="py-3 px-4">AI Opportunity Insight</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredQueries.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-750/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <span>{q.query}</span>
                          {q.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          {q.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-blue-300 font-semibold">
                        {q.clicks.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        {q.impressions.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className={`px-2 py-0.5 rounded ${q.ctr < 3.0 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300'}`}>
                          {q.ctr}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        #{q.position}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                        {q.opportunityNote || 'Solid performer; monitor ranking changes'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onAskAiAboutQuery(q)}
                          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-blue-400" />
                          <span>Optimize with AI</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* GA4 Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Users (30d)</div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {ga4Data.totalUsers.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">+9.8% month-over-month</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Sessions</div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {ga4Data.totalSessions.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">1.37 sessions / user</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Bounce Rate</div>
              <div className="text-2xl font-extrabold text-white mt-2">
                {ga4Data.bounceRate}%
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">-3.1% improved retention</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-semibold uppercase">Conversions / Goals</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-2">
                {ga4Data.conversions.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">2.7% overall conversion rate</div>
            </div>
          </div>

          {/* Landing Pages Table */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Top Organic Landing Pages</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyze bounce rates and conversion funnel drop-offs for top organic URLs.
                </p>
              </div>

              {/* Filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter pages..."
                  className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] font-semibold uppercase text-slate-400 bg-slate-900/60 border-y border-slate-700/80">
                  <tr>
                    <th className="py-3 px-4">Landing Page Path</th>
                    <th className="py-3 px-4 text-right">Sessions</th>
                    <th className="py-3 px-4 text-right">Users</th>
                    <th className="py-3 px-4 text-right">Bounce Rate</th>
                    <th className="py-3 px-4 text-right">Conversions</th>
                    <th className="py-3 px-4 text-right">Avg Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredPages.map((page, idx) => (
                    <tr key={idx} className="hover:bg-slate-750/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="font-mono text-blue-300">{page.pagePath}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm">{page.pageTitle}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                        {page.sessions.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        {page.users.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className={`px-2 py-0.5 rounded font-semibold ${page.bounceRate > 50 ? 'bg-red-500/20 text-red-300' : 'text-emerald-300'}`}>
                          {page.bounceRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        {page.conversions.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        {page.avgEngagementTimeSec}s
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onAskAiAboutPage(page)}
                          className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>Audit Page</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
