/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  Search, 
  BarChart3, 
  Globe2, 
  History, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { ThemeMode } from '../types';

export type TabType = 'prompt' | 'audit' | 'data' | 'cms' | 'implementation' | 'reports';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingApprovalsCount: number;
  criticalIssuesCount: number;
  theme: ThemeMode;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
  criticalIssuesCount,
  theme,
}) => {
  const isDark = theme === 'dark';

  const tabs = [
    {
      id: 'prompt' as TabType,
      label: 'AI Copilot & Prompt Studio',
      icon: Sparkles,
      badge: null,
      description: 'Natural language instructions & multi-source analysis',
    },
    {
      id: 'audit' as TabType,
      label: 'Live Website Audit',
      icon: Search,
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} alerts` : null,
      badgeColor: isDark 
        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
        : 'bg-rose-100 text-rose-700 border border-rose-200',
      description: 'DOM crawler, technical issues & automated fixes',
    },
    {
      id: 'data' as TabType,
      label: 'Data Hub (GSC & GA4)',
      icon: BarChart3,
      badge: null,
      description: 'Search queries, impressions, CTR and traffic metrics',
    },
    {
      id: 'cms' as TabType,
      label: 'CMS & Integrations',
      icon: Globe2,
      badge: null,
      description: 'WordPress, Shopify, Webhook & Google account links',
    },
    {
      id: 'implementation' as TabType,
      label: 'Implementation & Rollback',
      icon: History,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} pending` : null,
      badgeColor: isDark 
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' 
        : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse',
      description: 'Approve staged fixes, change logs & 1-click undo',
    },
    {
      id: 'reports' as TabType,
      label: 'Reports & Exports',
      icon: FileText,
      badge: 'PDF / XLS / DOC',
      badgeColor: isDark 
        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
        : 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      description: 'Multi-format executive reports with instant downloads',
    },
  ];

  return (
    <div className={`border-b transition-colors ${
      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth" aria-label="Main Navigation Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'scale-110 text-white' : isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-800'
                }`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1 ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
