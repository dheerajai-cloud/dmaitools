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
import { WebsiteChangeItem, ImplementationReport } from '../types';

interface ImplementationHubProps {
  changes: WebsiteChangeItem[];
  onApplyChange: (changeId: string) => Promise<void>;
  onRollbackChange: (changeId: string) => Promise<void>;
  isProcessingId?: string;
}

export const ImplementationHub: React.FC<ImplementationHubProps> = ({
  changes,
  onApplyChange,
  onRollbackChange,
  isProcessingId,
}) => {
  const [activeReport, setActiveReport] = useState<ImplementationReport | null>(null);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'applied'>('pending');

  const pendingChanges = changes.filter((c) => c.status === 'pending');
  const historyChanges = changes.filter((c) => c.status === 'applied' || c.status === 'rolled_back');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <History className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Website Implementation & Rollback Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review AI-proposed changes before they touch your live website. Every deployed fix automatically compiles an 
            <strong className="text-white"> Implementation Report</strong> and creates a snapshot with <strong className="text-emerald-400">1-click instant rollback</strong>.
          </p>
        </div>

        {/* Status Count */}
        <div className="flex items-center space-x-3 text-xs shrink-0">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xl font-extrabold text-amber-400">{pendingChanges.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Approval</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xl font-extrabold text-emerald-400">{historyChanges.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Deployed / Monitored</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            selectedTab === 'pending'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Pending Approvals ({pendingChanges.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('applied')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            selectedTab === 'applied'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Deployed Changelog & Rollbacks ({historyChanges.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Approvals */}
      {selectedTab === 'pending' && (
        <div className="space-y-4">
          {pendingChanges.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Pending Changes</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                All proposed changes have been reviewed or applied. Run a new audit in the Live Website Audit tab or ask the AI Copilot to stage optimizations.
              </p>
            </div>
          ) : (
            pendingChanges.map((change) => {
              const isProcessing = isProcessingId === change.id;

              return (
                <div
                  key={change.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:border-slate-600"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {change.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono truncate max-w-md">
                          {change.url}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">
                        {change.title}
                      </h3>
                    </div>

                    <button
                      disabled={isProcessing}
                      onClick={() => onApplyChange(change.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                        isProcessing
                          ? 'bg-emerald-600/50 text-emerald-200 cursor-wait'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer'
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
                          <span>Approve & Deploy to Website</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Diff View (Previous vs Proposed) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-slate-950/80 border border-red-500/20 rounded-xl p-3 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-red-400 flex items-center space-x-1">
                        <span>BEFORE (CURRENT WEBSITE STATE)</span>
                      </div>
                      <div className="text-slate-300 break-words whitespace-pre-wrap">
                        {change.previousValue || '(empty / missing on site)'}
                      </div>
                    </div>

                    <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1">
                        <span>AFTER (PROPOSED BY AI AGENT)</span>
                      </div>
                      <div className="text-emerald-300 break-words whitespace-pre-wrap font-semibold">
                        {change.proposedValue}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Target CMS: <strong className="text-slate-300">{change.siteId}</strong></span>
                    <span>Staged: {new Date(change.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-10 text-center text-slate-400 text-xs">
              No deployed changes yet.
            </div>
          ) : (
            historyChanges.map((change) => {
              const isRolledBack = change.status === 'rolled_back';
              const isProcessing = isProcessingId === change.id;

              return (
                <div
                  key={change.id}
                  className={`border rounded-2xl p-5 shadow-sm space-y-3 transition-all ${
                    isRolledBack
                      ? 'bg-slate-900/60 border-slate-800 opacity-80'
                      : 'bg-slate-800/90 border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isRolledBack
                              ? 'bg-slate-700 text-slate-300 border-slate-600'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {isRolledBack ? 'ROLLED BACK' : 'LIVE ON WEBSITE'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono truncate max-w-sm">
                          {change.url}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">
                        {change.title}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {/* View Implementation Report */}
                      {change.report && (
                        <button
                          onClick={() => setActiveReport(change.report!)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Implementation Report</span>
                        </button>
                      )}

                      {/* 1-Click Rollback / Undo */}
                      {!isRolledBack && (
                        <button
                          disabled={isProcessing}
                          onClick={() => onRollbackChange(change.id)}
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                            isProcessing
                              ? 'bg-red-500/20 text-red-300 border-red-500/40 cursor-wait'
                              : 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30 hover:border-red-500/50 cursor-pointer'
                          }`}
                          title="Instantly undo this change and restore the website to its prior backup state"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                          <span>{isProcessing ? 'Reverting...' : 'Undo / Rollback'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs font-mono">
                    <div className="text-slate-400 truncate">
                      <span className="text-slate-500 mr-2">LIVE VALUE:</span>
                      <span className={isRolledBack ? 'line-through text-slate-500' : 'text-emerald-300'}>
                        {isRolledBack ? change.previousValue : change.proposedValue}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Deployed At: {new Date(change.appliedAt || change.createdAt).toLocaleString()}</span>
                    {isRolledBack && change.report?.rollbackTimestamp && (
                      <span className="text-amber-400">
                        Rolled back at: {new Date(change.report.rollbackTimestamp).toLocaleTimeString()}
                      </span>
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Implementation Report</h3>
                  <div className="text-[11px] text-slate-400">ID: {activeReport.id}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Header */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white text-sm">{activeReport.actionTitle}</div>
                  <div className="text-slate-400 font-mono text-[11px] mt-0.5">{activeReport.targetUrl}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  activeReport.status === 'applied' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                }`}>
                  {activeReport.status.toUpperCase()}
                </span>
              </div>

              {/* What was changed */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1">
                  1. What Was Changed
                </h4>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-slate-300 leading-relaxed font-mono">
                  {activeReport.whatWasChanged}
                </div>
              </div>

              {/* Why it was changed */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1">
                  2. Why It Was Changed
                </h4>
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-slate-300 leading-relaxed">
                  {activeReport.whyItWasChanged}
                </div>
              </div>

              {/* Issues resolved */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1">
                  3. Issues Resolved
                </h4>
                <div className="space-y-1.5">
                  {activeReport.issuesResolved.map((issue, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs & Results to Monitor */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1">
                  4. KPIs & Performance Metrics to Monitor
                </h4>
                <div className="space-y-1.5">
                  {activeReport.metricsToMonitor.map((metric, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Search Impact */}
              <div>
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-1">
                  5. Projected Organic Search Impact
                </h4>
                <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3 text-blue-200 leading-relaxed font-medium">
                  {activeReport.expectedImpact}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setActiveReport(null)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
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
