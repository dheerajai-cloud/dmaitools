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

export type TabType = 'prompt' | 'audit' | 'data' | 'cms' | 'implementation' | 'reports';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingApprovalsCount: number;
  criticalIssuesCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
  criticalIssuesCount,
}) => {
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
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} issues` : null,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
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
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse',
      description: 'Approve staged fixes, change logs & 1-click undo',
    },
    {
      id: 'reports' as TabType,
      label: 'Reports & Exports',
      icon: FileText,
      badge: 'PDF / Excel / Word / PPT',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      description: 'Multi-format executive reports with instant downloads',
    },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth" aria-label="Main Navigation Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1 ${tab.badgeColor || 'bg-slate-800 text-slate-300'}`}>
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
