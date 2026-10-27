/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  History, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Eye,
  Check,
  ChevronDown,
  X
} from 'lucide-react';
import { WebsiteChangeItem, ImplementationReport, ThemeMode } from '../types';

interface ImplementationHubProps {
  changes: WebsiteChangeItem[];
  onApplyChange: (changeId: string) => Promise<void>;
  onRollbackChange: (changeId: string) => Promise<void>;
  isProcessingId?: string;
  theme?: ThemeMode;
}

export const ImplementationHub: React.FC<ImplementationHubProps> = ({
  changes,
  onApplyChange,
  onRollbackChange,
  isProcessingId,
  theme = 'light',
}) => {
  const [activeReport, setActiveReport] = useState<ImplementationReport | null>(null);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'applied'>('pending');

  const isDark = theme === 'dark';

  const pendingChanges = changes.filter((c) => c.status === 'pending');
  const historyChanges = changes.filter((c) => c.status === 'applied' || c.status === 'rolled_back');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Info */}
      <div className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <History className="w-5 h-5" />
            </span>
            <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Website Implementation &amp; Rollback Hub
            </h2>
          </div>
          <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Review AI-proposed changes before they touch your live website. Every deployed fix automatically compiles an 
            <strong className={isDark ? 'text-white' : 'text-slate-900'}> Implementation Report</strong> and creates a snapshot with <strong className="text-emerald-600 dark:text-emerald-400">1-click instant rollback</strong>.
          </p>
        </div>

        {/* Status Count */}
        <div className="flex items-center space-x-3 text-xs shrink-0">
          <div className={`p-3 rounded-xl border text-center ${
            isDark ? 'bg-slate-900 border-slate-750' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">{pendingChanges.length}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Pending Approval</div>
          </div>
          <div className={`p-3 rounded-xl border text-center ${
            isDark ? 'bg-slate-900 border-slate-750' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{historyChanges.length}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Deployed / Monitored</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className={`flex items-center space-x-2 border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            selectedTab === 'pending'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Pending Approvals ({pendingChanges.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('applied')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            selectedTab === 'applied'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Deployed Changelog &amp; Rollbacks ({historyChanges.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Approvals */}
      {selectedTab === 'pending' && (
        <div className="space-y-4">
          {pendingChanges.length === 0 ? (
            <div className={`p-10 rounded-2xl border text-center space-y-3 ${
              isDark ? 'bg-slate-850/60 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Pending Changes</h4>
              <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                All proposed changes have been reviewed or applied. Run a new audit in the Live Website Audit tab or ask the AI Copilot to stage optimizations.
              </p>
            </div>
          ) : (
            pendingChanges.map((change) => {
              const isProcessing = isProcessingId === change.id;

              return (
                <div
                  key={change.id}
                  className={`p-5 rounded-2xl border shadow-sm space-y-4 transition-all ${
                    isDark ? 'bg-slate-850/90 border-slate-750 hover:border-slate-650' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                    isDark ? 'border-slate-750' : 'border-slate-100'
                  }`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                          {change.category}
                        </span>
                        <span className="text-xs text-slate-500 font-mono truncate max-w-md">
                          {change.url}
                        </span>
                      </div>
                      <h3 className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {change.title}
                      </h3>
                    </div>

                    <button
                      disabled={isProcessing}
                      onClick={() => onApplyChange(change.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                        isProcessing
                          ? 'bg-emerald-600/50 text-emerald-200 cursor-wait'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 cursor-pointer'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Applying to Website...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Approve &amp; Deploy to Website</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Previous vs Proposed Diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className={`p-3.5 rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-rose-50/40 border-rose-100'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center justify-between">
                        <span>Original Website State</span>
                        <span>Defective</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-300 break-all leading-relaxed">
                        {change.previousValue || '(Missing / Blank)'}
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/40 border-emerald-100'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                        <span>AI Optimized Staging</span>
                        <span>Ready for Approval</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-slate-800 dark:text-emerald-300 break-all leading-relaxed font-semibold">
                        {change.proposedValue}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Deployed Changelog & Rollbacks */}
      {selectedTab === 'applied' && (
        <div className="space-y-4">
          {historyChanges.length === 0 ? (
            <div className={`p-10 rounded-2xl border text-center space-y-3 ${
              isDark ? 'bg-slate-850/60 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <History className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Deployed Changes Yet</h4>
              <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Approved fixes will appear here with complete rollback snapshots and automated implementation reports.
              </p>
            </div>
          ) : (
            historyChanges.map((change) => {
              const isProcessing = isProcessingId === change.id;
              const isRolledBack = change.status === 'rolled_back';

              return (
                <div
                  key={change.id}
                  className={`p-5 rounded-2xl border shadow-sm space-y-4 transition-all ${
                    isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                    isDark ? 'border-slate-750' : 'border-slate-100'
                  }`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isRolledBack
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isRolledBack ? 'Rolled Back / Reverted' : 'Live on Website'}
                        </span>
                        <span className="text-xs text-slate-500 font-mono truncate max-w-md">
                          {change.url}
                        </span>
                      </div>
                      <h3 className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {change.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {change.report && (
                        <button
                          onClick={() => setActiveReport(change.report || null)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                            isDark ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span>View Report</span>
                        </button>
                      )}

                      {!isRolledBack && (
                        <button
                          disabled={isProcessing}
                          onClick={() => onRollbackChange(change.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-all cursor-pointer"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                          <span>{isProcessing ? 'Reverting...' : 'Instant Rollback'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <div>
                      <span className="text-slate-400">Deployed Value: </span>
                      <span className={isRolledBack ? 'line-through text-slate-400' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                        {change.proposedValue}
                      </span>
                    </div>
                    {isRolledBack && (
                      <div>
                        <span className="text-slate-400">Reverted Back To: </span>
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">{change.previousValue}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Implementation Report Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-xs space-y-4 border overflow-y-auto max-h-[90vh] ${
            isDark ? 'bg-slate-900 border-slate-750 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-slate-750' : 'border-slate-100'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Implementation Report</h3>
                  <div className="text-[11px] text-slate-400">ID: {activeReport.id}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-850 border-slate-750' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="font-bold text-sm">{activeReport.actionTitle}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">{activeReport.targetUrl}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {activeReport.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">
                  1. What Was Changed
                </h4>
                <div className={`p-3 rounded-xl border leading-relaxed font-mono ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  {activeReport.whatWasChanged}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">
                  2. Why It Was Changed
                </h4>
                <div className={`p-3 rounded-xl border leading-relaxed ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  {activeReport.whyItWasChanged}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">
                  3. Issues Resolved
                </h4>
                <div className="space-y-1.5">
                  {activeReport.issuesResolved.map((issue, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-lg font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">
                  4. KPIs &amp; Performance Metrics to Monitor
                </h4>
                <div className="space-y-1.5">
                  {activeReport.metricsToMonitor.map((metric, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-3 py-2 rounded-lg font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-1">
                  5. Projected Organic Search Impact
                </h4>
                <div className={`p-3 rounded-xl border leading-relaxed font-semibold ${
                  isDark ? 'bg-indigo-950/30 border-indigo-900 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-900'
                }`}>
                  {activeReport.expectedImpact}
                </div>
              </div>
            </div>

            <div className={`pt-3 border-t flex justify-end ${isDark ? 'border-slate-750' : 'border-slate-100'}`}>
              <button
                onClick={() => setActiveReport(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
