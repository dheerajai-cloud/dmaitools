/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Database, 
  Globe, 
  Cpu, 
  Check, 
  FileDown, 
  Layers, 
  ChevronRight, 
  ArrowUpRight, 
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { AiChatMessage, GscProperty, Ga4Property, WebsiteChangeItem, ThemeMode } from '../types';

interface AiPromptStudioProps {
  messages: AiChatMessage[];
  onSendMessage: (prompt: string, selectedSources: string[], model: string) => Promise<void>;
  isLoading: boolean;
  activeDomain: string;
  gscData: GscProperty;
  ga4Data: Ga4Property;
  onStageChange: (item: Omit<WebsiteChangeItem, 'status' | 'createdAt'>) => void;
  onExportReportFromPrompt: (content: string, prompt: string) => void;
  theme?: ThemeMode;
}

export const AiPromptStudio: React.FC<AiPromptStudioProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeDomain,
  gscData,
  ga4Data,
  onStageChange,
  onExportReportFromPrompt,
  theme = 'light',
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['gsc', 'ga4', 'crawler']);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [stagedIds, setStagedIds] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleSource = (sourceKey: string) => {
    if (selectedSources.includes(sourceKey)) {
      if (selectedSources.length === 1) return; // Keep at least one source
      setSelectedSources(selectedSources.filter((s) => s !== sourceKey));
    } else {
      setSelectedSources([...selectedSources, sourceKey]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    const currentPrompt = prompt;
    setPrompt('');
    await onSendMessage(currentPrompt, selectedSources, selectedModel);
  };

  const quickPrompts = [
    {
      title: 'Full Technical & Content Audit',
      prompt: `Perform a comprehensive technical SEO audit for ${activeDomain}. Inspect title tags, meta descriptions, H1 headings, and schema markup. List all critical issues and stage recommended fixes.`,
      icon: '🔍',
    },
    {
      title: 'Find Low CTR GSC Opportunities',
      prompt: `Analyze our Google Search Console queries with high search impressions (>30k) but low click-through rates (<3.5%). Suggest revised high-converting title tags and meta descriptions to boost traffic.`,
      icon: '📈',
    },
    {
      title: 'Generate Rich Schema JSON-LD',
      prompt: `Generate valid Schema.org JSON-LD for ${activeDomain} including Organization, WebSite, and Product entity schemas with breadcrumb structure ready for direct deployment.`,
      icon: '🧩',
    },
    {
      title: 'Multilingual Search Strategy',
      prompt: `Analyze search performance for ${activeDomain}. Identify top country queries in GSC, detect localized landing page gaps, and recommend technical hreflang and metadata optimizations.`,
      icon: '🌐',
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Controls: Sources & AI Model Toggles */}
      <div className={`p-3.5 rounded-2xl border shadow-sm backdrop-blur mb-4 transition-all ${
        isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Data Sources Toggles */}
          <div className="flex items-center space-x-2">
            <span className={`font-semibold flex items-center space-x-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Connected Sources:</span>
            </span>

            <button
              onClick={() => toggleSource('gsc')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
                selectedSources.includes('gsc')
                  ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40'
                  : isDark ? 'bg-slate-800 text-slate-400 border-transparent hover:text-slate-200' : 'bg-slate-100 text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span>Search Console (GSC)</span>
            </button>

            <button
              onClick={() => toggleSource('ga4')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
                selectedSources.includes('ga4')
                  ? 'bg-emerald-600/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                  : isDark ? 'bg-slate-800 text-slate-400 border-transparent hover:text-slate-200' : 'bg-slate-100 text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Analytics (GA4)</span>
            </button>

            <button
              onClick={() => toggleSource('crawler')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
                selectedSources.includes('crawler')
                  ? 'bg-cyan-600/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40'
                  : isDark ? 'bg-slate-800 text-slate-400 border-transparent hover:text-slate-200' : 'bg-slate-100 text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
              <span>Live DOM Crawler</span>
            </button>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center space-x-2">
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reasoning Engine:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`border text-xs rounded-xl px-2.5 py-1 outline-none font-medium transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (High Speed &amp; Precision)</option>
              <option value="gemini-3.8-pro">Gemini 3.8 Pro (Deep SEO Reasoning)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className={`flex-1 overflow-y-auto rounded-2xl border p-4 sm:p-6 space-y-5 transition-all ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-200 shadow-inner'
      }`}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto p-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                What would you like to analyze or fix on {activeDomain.replace(/^https?:\/\//, '')}?
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter any prompt in any language. RankAgent retrieves verified GSC queries, GA4 engagement, and live DOM crawl signals to write exact solutions.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left pt-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(qp.prompt, selectedSources, selectedModel)}
                  className={`p-3 border rounded-xl transition-all group cursor-pointer text-xs ${
                    isDark 
                      ? 'bg-slate-850 hover:bg-slate-800 border-slate-750 hover:border-indigo-500' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    <span>{qp.icon}</span>
                    <span>{qp.title}</span>
                  </div>
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {qp.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-4xl rounded-2xl p-5 shadow-sm text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none ml-12'
                    : isDark 
                      ? 'bg-slate-850 border border-slate-750 text-slate-200 rounded-bl-none mr-12 w-full' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none mr-12 w-full shadow-sm'
                }`}
              >
                {/* Header for assistant message */}
                {msg.role === 'assistant' && (
                  <div className={`flex items-center justify-between pb-3 mb-3 border-b text-xs ${
                    isDark ? 'border-slate-750' : 'border-slate-100'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        RankAgent Intelligence
                      </span>
                      {msg.modelUsed && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'
                        }`}>
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onExportReportFromPrompt(msg.content, 'AI Prompt Analysis Report')}
                        className="flex items-center space-x-1 text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors font-medium"
                        title="Download or export this analysis into PDF, Word, Excel, or PowerPoint"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Export as Report</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose max-w-none prose-sm leading-relaxed whitespace-pre-wrap font-sans dark:prose-invert">
                  {msg.content}
                </div>

                {/* Proposed Changes Actions */}
                {msg.proposedChanges && msg.proposedChanges.length > 0 && (
                  <div className={`mt-4 pt-3 border-t ${isDark ? 'border-slate-750' : 'border-slate-100'}`}>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Recommended Fixes Ready for Staging &amp; Approval:</span>
                    </div>

                    <div className="space-y-2">
                      {msg.proposedChanges.map((change) => {
                        const isStaged = stagedIds.has(change.id);
                        return (
                          <div
                            key={change.id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              isDark ? 'bg-slate-900 border-slate-750' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="text-xs">
                              <span className="font-bold text-slate-900 dark:text-white">{change.title}</span>
                              <div className="text-slate-500 text-[11px] font-mono mt-0.5 truncate max-w-md">
                                {change.url}
                              </div>
                              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 line-clamp-1 font-medium">
                                &rarr; {change.proposedValue}
                              </div>
                            </div>

                            <button
                              disabled={isStaged}
                              onClick={() => {
                                onStageChange({
                                  id: change.id,
                                  siteId: change.siteId,
                                  url: change.url,
                                  title: change.title,
                                  category: change.category,
                                  actionType: change.actionType,
                                  previousValue: change.previousValue,
                                  proposedValue: change.proposedValue,
                                });
                                setStagedIds(new Set([...stagedIds, change.id]));
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center space-x-1.5 ${
                                isStaged
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 cursor-default'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                              }`}
                            >
                              {isStaged ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span>Staged in Hub</span>
                                </>
                              ) : (
                                <>
                                  <Layers className="w-3 h-3" />
                                  <span>Stage for Approval</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}

        {isLoading && (
          <div className={`p-4 rounded-2xl border max-w-md text-xs animate-pulse flex items-center space-x-3 ${
            isDark ? 'bg-slate-850 border-slate-750 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">RankAgent is retrieving connected data...</span>
              <p className="text-[11px] text-slate-500">Correlating Search Console queries, GA4 engagement &amp; DOM elements</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mt-3 relative">
        <div className={`rounded-2xl border shadow-lg transition-all overflow-hidden ${
          isDark 
            ? 'bg-slate-850 border-slate-750 focus-within:border-indigo-500' 
            : 'bg-white border-slate-300 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600/30'
        }`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Ask RankAgent in any language... (e.g., "Find high-impression low-CTR queries in Search Console and write improved title tags for ${activeDomain.replace(/^https?:\/\//, '')}")`}
            rows={2}
            className={`w-full bg-transparent text-sm p-3.5 pr-24 resize-none outline-none ${
              isDark ? 'text-slate-100 placeholder-slate-400' : 'text-slate-900 placeholder-slate-400'
            }`}
          />

          <div className="absolute right-2.5 bottom-2.5 flex items-center space-x-1.5">
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                prompt.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 cursor-pointer'
                  : isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={`flex items-center justify-between text-[11px] px-2 pt-1.5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>Press <kbd className="border px-1 py-0.5 rounded text-[10px] font-mono">Enter</kbd> to execute &bull; Shift + Enter for new line</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">⚡ Real-time GSC &amp; GA4 integration active</span>
        </div>
      </form>
    </div>
  );
};
