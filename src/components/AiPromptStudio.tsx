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
import { AiChatMessage, GscProperty, Ga4Property, WebsiteChangeItem } from '../types';

interface AiPromptStudioProps {
  messages: AiChatMessage[];
  onSendMessage: (prompt: string, selectedSources: string[], model: string) => Promise<void>;
  isLoading: boolean;
  activeDomain: string;
  gscData: GscProperty;
  ga4Data: Ga4Property;
  onStageChange: (item: Omit<WebsiteChangeItem, 'status' | 'createdAt'>) => void;
  onExportReportFromPrompt: (content: string, prompt: string) => void;
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
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['gsc', 'ga4', 'crawler']);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [stagedIds, setStagedIds] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

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
      title: 'Global Multilingual SEO Strategy',
      prompt: `Analyze our international and multilingual search performance for ${activeDomain}. Identify top country queries in GSC, detect localized landing page gaps, and recommend technical hreflang and metadata optimizations.`,
      icon: '🌐',
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Controls: Sources & AI Model Toggles */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 mb-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Data Sources Toggles */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Connected Sources:</span>
            </span>

            <button
              onClick={() => toggleSource('gsc')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                selectedSources.includes('gsc')
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-700/50 text-slate-400 border border-transparent hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Search Console (GSC)</span>
            </button>

            <button
              onClick={() => toggleSource('ga4')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                selectedSources.includes('ga4')
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-700/50 text-slate-400 border border-transparent hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Analytics (GA4)</span>
            </button>

            <button
              onClick={() => toggleSource('crawler')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                selectedSources.includes('crawler')
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-700/50 text-slate-400 border border-transparent hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Live Website Crawler</span>
            </button>

            <button
              onClick={() => toggleSource('cms')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                selectedSources.includes('cms')
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-700/50 text-slate-400 border border-transparent hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>CMS Bridge (WP/Shopify)</span>
            </button>
          </div>

          {/* AI Model Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Reasoning Engine:</span>
            </span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Fast & Grounded)</option>
              <option value="gemini-4-argon">Gemini 4 Argon (Deep Reasoning)</option>
              <option value="chatgpt-engine">GPT-4o Agent Engine</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-2">
              <span>Built by Dheeraj Rawat Mohan</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              RankAgent Autonomous Prompt Studio
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Give instructions in English or any global language. 
              Designed and built by Dheeraj, RankAgent directly queries your connected Google Search Console, GA4, and live website DOM to uncover real issues, produce tailored reports, and implement approved fixes.
            </p>

            {/* Quick Prompt Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 w-full text-left">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(qp.prompt, selectedSources, selectedModel)}
                  className="p-3 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-blue-500/50 rounded-xl transition-all group cursor-pointer text-xs"
                >
                  <div className="flex items-center space-x-2 font-semibold text-slate-200 group-hover:text-blue-300">
                    <span>{qp.icon}</span>
                    <span>{qp.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-normal">
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
                    ? 'bg-blue-600 text-white rounded-br-none ml-12'
                    : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none mr-12 w-full'
                }`}
              >
                {/* Header for assistant message */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/70 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-white">RankAgent Intelligence</span>
                      {msg.modelUsed && (
                        <span className="text-[10px] text-slate-400 bg-slate-700/60 px-1.5 py-0.5 rounded">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Export Report from this prompt */}
                      <button
                        onClick={() => onExportReportFromPrompt(msg.content, 'AI Prompt Analysis Report')}
                        className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/20 transition-colors"
                        title="Download or export this analysis into PDF, Word, Excel, or PowerPoint"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Export as Report</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-invert max-w-none prose-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Proposed Changes Actions (if agent generated fix suggestions) */}
                {msg.proposedChanges && msg.proposedChanges.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Recommended Fixes Ready for Staging & Approval:</span>
                    </div>

                    <div className="space-y-2">
                      {msg.proposedChanges.map((change) => {
                        const isStaged = stagedIds.has(change.id);
                        return (
                          <div
                            key={change.id}
                            className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="text-xs">
                              <span className="font-semibold text-white">{change.title}</span>
                              <div className="text-slate-400 text-[11px] font-mono mt-0.5 truncate max-w-md">
                                {change.url}
                              </div>
                              <div className="text-[11px] text-emerald-400 mt-1 line-clamp-1">
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
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                              }`}
                            >
                              {isStaged ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
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

              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center space-x-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 max-w-md text-xs text-slate-300 animate-pulse">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <span className="font-semibold text-white">RankAgent is retrieving connected data...</span>
              <p className="text-[11px] text-slate-400">Correlating Search Console queries, GA4 engagement & DOM elements</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mt-3 relative">
        <div className="relative rounded-2xl bg-slate-800 border border-slate-700 shadow-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all overflow-hidden">
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
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 p-3.5 pr-24 resize-none focus:outline-none"
          />

          <div className="absolute right-2.5 bottom-2.5 flex items-center space-x-1.5">
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                prompt.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 cursor-pointer'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
              aria-label="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1.5">
          <span>Press <kbd className="bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-slate-300">Enter</kbd> to execute &bull; Shift + Enter for new line</span>
          <span className="text-emerald-400 font-medium">⚡ Real-time GSC & GA4 integration active</span>
        </div>
      </form>
    </div>
  );
};
