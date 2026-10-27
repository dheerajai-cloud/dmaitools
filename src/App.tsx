/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { AiPromptStudio } from './components/AiPromptStudio';
import { WebsiteAuditView } from './components/WebsiteAuditView';
import { DataHubView } from './components/DataHubView';
import { CmsIntegrationsView } from './components/CmsIntegrationsView';
import { ImplementationHub } from './components/ImplementationHub';
import { ReportsView } from './components/ReportsView';

import { 
  INITIAL_MODULES, 
  INITIAL_GOOGLE_ACCOUNT, 
  INITIAL_CMS_CONNECTIONS, 
  INITIAL_AUDIT_ISSUES 
} from './data/mockData';
import { 
  PlatformModule, 
  GoogleAccount, 
  CmsConnection, 
  SeoIssue, 
  AiChatMessage, 
  WebsiteChangeItem,
  GscQuery,
  Ga4LandingPage,
  MetaTagCheckResult
} from './types';

export default function App() {
  const [currentModule, setCurrentModule] = useState<PlatformModule>(INITIAL_MODULES[0]);
  const [googleAccount, setGoogleAccount] = useState<GoogleAccount>(INITIAL_GOOGLE_ACCOUNT);
  const [cmsConnections, setCmsConnections] = useState<CmsConnection[]>(INITIAL_CMS_CONNECTIONS);
  const [activeDomain, setActiveDomain] = useState<string>('https://myshop.com');
  const [activeTab, setActiveTab] = useState<TabType>('prompt');

  // Audit state
  const [healthScore, setHealthScore] = useState<number>(78);
  const [issues, setIssues] = useState<SeoIssue[]>(INITIAL_AUDIT_ISSUES);
  const [auditSignals, setAuditSignals] = useState<MetaTagCheckResult | undefined>({
    title: 'Ergonomic Office Chairs & Workstations | ErgoStore',
    titleLength: 48,
    isTitleValid: true,
    metaDescription: 'Explore ergonomic office chairs with lumbar support.',
    descriptionLength: 53,
    isDescriptionValid: false,
    h1Count: 1,
    isH1Valid: true,
    canonicalUrl: 'https://myshop.com',
    hasCanonical: false,
    hasViewport: true,
    hasOgTitle: true,
    hasOgImage: false,
    totalImages: 14,
    imagesWithAlt: 11,
    altCoveragePercent: 78,
    hasSchema: false,
    schemaTypes: [],
  });
  const [isAuditing, setIsAuditing] = useState(false);

  // Implementation / Rollback state
  const [changes, setChanges] = useState<WebsiteChangeItem[]>([]);
  const [isProcessingId, setIsProcessingId] = useState<string | undefined>();
  const [stagedChangeIds, setStagedChangeIds] = useState<Set<string>>(new Set());

  // AI Prompt Studio state
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTestingCmsId, setIsTestingCmsId] = useState<string | undefined>();

  // Fetch initial changes from backend API
  useEffect(() => {
    fetch('/api/changes')
      .then((res) => res.json())
      .then((data) => {
        if (data.changes && Array.isArray(data.changes)) {
          setChanges(data.changes);
        }
      })
      .catch((err) => {
        console.warn('Backend /api/changes not reached, using memory state:', err);
      });
  }, []);

  const activeGscData = googleAccount.gscProperties.find((p) => p.siteUrl === activeDomain) || googleAccount.gscProperties[0];
  const activeGa4Data = googleAccount.ga4Properties.find((p) => p.websiteUrl === activeDomain) || googleAccount.ga4Properties[0];
  const availableDomains = [
    'https://myshop.com',
    'https://blog.techvision.io',
  ];

  // Refresh data action
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/changes');
      const data = await res.json();
      if (data.changes) setChanges(data.changes);
    } catch {
      // keep existing state
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Run live website audit
  const handleAuditUrl = async (url: string) => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/audit/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setHealthScore(data.healthScore);
        setIssues(data.issues || []);
        if (data.signals) setAuditSignals(data.signals);
        setActiveDomain(url);
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Stage a change into the Implementation Hub
  const handleStageChange = async (item: Omit<WebsiteChangeItem, 'status' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/changes/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setChanges((prev) => [data.item, ...prev.filter((c) => c.id !== data.item.id)]);
      } else {
        // Local fallback
        const localItem: WebsiteChangeItem = {
          ...item,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        setChanges((prev) => [localItem, ...prev]);
      }
      setStagedChangeIds((prev) => new Set([...prev, item.id]));
    } catch {
      const localItem: WebsiteChangeItem = {
        ...item,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setChanges((prev) => [localItem, ...prev]);
      setStagedChangeIds((prev) => new Set([...prev, item.id]));
    }
  };

  // Approve and apply change to website
  const handleApplyChange = async (changeId: string) => {
    setIsProcessingId(changeId);
    try {
      const res = await fetch('/api/changes/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: changeId, appliedBy: `User (${googleAccount.name})` }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setChanges((prev) => prev.map((c) => (c.id === changeId ? data.item : c)));
      } else {
        // Local state fallback
        setChanges((prev) =>
          prev.map((c) => {
            if (c.id === changeId) {
              return {
                ...c,
                status: 'applied',
                appliedAt: new Date().toISOString(),
                report: {
                  id: `rep-${Date.now()}`,
                  changeId: c.id,
                  timestamp: new Date().toISOString(),
                  targetSite: c.siteId,
                  targetUrl: c.url,
                  actionTitle: c.title,
                  actionType: c.actionType,
                  whatWasChanged: `Updated ${c.actionType} to "${c.proposedValue}"`,
                  whyItWasChanged: `Fixed SEO issue on ${c.url}`,
                  issuesResolved: [`Resolved ${c.actionType} deficiency`],
                  metricsToMonitor: [
                    'Google Search Console: Query CTR & average position',
                    'Google Analytics 4: Organic landing page bounce rate',
                  ],
                  expectedImpact: '+15% to +30% CTR improvement and resolved indexing alerts.',
                  appliedBy: `User (${googleAccount.name})`,
                  previousValue: c.previousValue,
                  appliedValue: c.proposedValue,
                  status: 'applied',
                },
              };
            }
            return c;
          })
        );
      }
    } catch {
      // Local apply fallback
      setChanges((prev) =>
        prev.map((c) =>
          c.id === changeId
            ? {
                ...c,
                status: 'applied',
                appliedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } finally {
      setIsProcessingId(undefined);
    }
  };

  // Rollback / Undo change
  const handleRollbackChange = async (changeId: string) => {
    setIsProcessingId(changeId);
    try {
      const res = await fetch('/api/changes/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: changeId }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setChanges((prev) => prev.map((c) => (c.id === changeId ? data.item : c)));
      } else {
        setChanges((prev) =>
          prev.map((c) => {
            if (c.id === changeId) {
              return {
                ...c,
                status: 'rolled_back',
                report: c.report
                  ? {
                      ...c.report,
                      status: 'rolled_back',
                      rollbackTimestamp: new Date().toISOString(),
                    }
                  : undefined,
              };
            }
            return c;
          })
        );
      }
    } catch {
      setChanges((prev) =>
        prev.map((c) => (c.id === changeId ? { ...c, status: 'rolled_back' } : c))
      );
    } finally {
      setIsProcessingId(undefined);
    }
  };

  // Test CMS connection
  const handleTestConnection = async (cmsId: string) => {
    setIsTestingCmsId(cmsId);
    try {
      const conn = cmsConnections.find((c) => c.id === cmsId);
      const res = await fetch('/api/cms/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: conn?.platform, url: conn?.siteUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setCmsConnections((prev) =>
          prev.map((c) =>
            c.id === cmsId
              ? {
                  ...c,
                  status: 'active',
                  lastPingMs: 110,
                  verifiedAt: new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch {
      // keep state
    } finally {
      setIsTestingCmsId(undefined);
    }
  };

  // Send AI prompt
  const handleSendMessage = async (promptText: string, selectedSources: string[], model: string) => {
    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toISOString(),
      selectedSources,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const contextData = {
        domain: activeDomain,
        gsc: {
          totalClicks: activeGscData.totalClicks,
          totalImpressions: activeGscData.totalImpressions,
          avgCtr: activeGscData.avgCtr,
          avgPosition: activeGscData.avgPosition,
          topQueries: activeGscData.topQueries,
        },
        ga4: {
          totalUsers: activeGa4Data.totalUsers,
          totalSessions: activeGa4Data.totalSessions,
          bounceRate: activeGa4Data.bounceRate,
          conversions: activeGa4Data.conversions,
          topLandingPages: activeGa4Data.topLandingPages,
        },
        audit: {
          healthScore,
          criticalIssuesCount: issues.filter((i) => i.severity === 'critical').length,
          issues: issues.slice(0, 5),
        },
        cms: cmsConnections.find((c) => c.siteUrl === activeDomain),
      };

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          context: contextData,
          model,
        }),
      });

      const data = await res.json();
      const analysisText = data.analysis || 'Analysis complete.';

      // Generate suggested change item if prompt requested fixes
      const proposedChanges: WebsiteChangeItem[] = [];
      if (promptText.toLowerCase().includes('fix') || promptText.toLowerCase().includes('title') || promptText.toLowerCase().includes('schema') || promptText.toLowerCase().includes('audit') || promptText.toLowerCase().includes('ctr')) {
        proposedChanges.push({
          id: `prop-${Date.now()}`,
          siteId: activeDomain,
          url: `${activeDomain}/products/standing-desk`,
          title: 'Optimize Product Title Tag with High-CTR Modifiers',
          category: 'On-Page SEO',
          actionType: 'meta_title',
          previousValue: 'Standing Desk - Buy Online',
          proposedValue: 'Best Ergonomic Standing Desk Converter | Dual Monitor Lift - Free Shipping',
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }

      const assistantMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: analysisText,
        timestamp: new Date().toISOString(),
        selectedSources,
        modelUsed: data.modelUsed || model,
        proposedChanges,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: AiChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `Diagnostic: ${err.message || 'Error communicating with reasoning engine.'}`,
        timestamp: new Date().toISOString(),
        selectedSources,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Route from GSC query to AI Prompt
  const handleAskAiAboutQuery = (query: GscQuery) => {
    setActiveTab('prompt');
    const promptText = `Our Search Console query "${query.query}" receives ${query.impressions.toLocaleString()} impressions but only has a ${query.ctr}% CTR at rank #${query.position}. How should we rewrite the page title tag and meta description to lift CTR above 5%?`;
    handleSendMessage(promptText, ['gsc', 'crawler'], 'gemini-3.8-flash');
  };

  // Route from GA4 landing page to AI Prompt
  const handleAskAiAboutPage = (page: Ga4LandingPage) => {
    setActiveTab('prompt');
    const promptText = `Landing page "${page.pagePath}" (${page.pageTitle}) has ${page.sessions.toLocaleString()} sessions and a high bounce rate of ${page.bounceRate}%. Analyze technical and semantic SEO factors and recommend concrete fixes to improve engagement and conversions.`;
    handleSendMessage(promptText, ['ga4', 'crawler'], 'gemini-3.8-flash');
  };

  // Route to Reports tab from Prompt
  const handleExportReportFromPrompt = (_content: string, _prompt: string) => {
    setActiveTab('reports');
  };

  const pendingApprovalsCount = changes.filter((c) => c.status === 'pending').length;
  const criticalIssuesCount = issues.filter((i) => i.severity === 'critical').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        currentModule={currentModule}
        availableModules={INITIAL_MODULES}
        onSelectModule={setCurrentModule}
        googleAccount={googleAccount}
        activeDomain={activeDomain}
        availableDomains={availableDomains}
        onSelectDomain={setActiveDomain}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        criticalIssuesCount={criticalIssuesCount}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'prompt' && (
          <AiPromptStudio
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isAiLoading}
            activeDomain={activeDomain}
            gscData={activeGscData}
            ga4Data={activeGa4Data}
            onStageChange={handleStageChange}
            onExportReportFromPrompt={handleExportReportFromPrompt}
          />
        )}

        {activeTab === 'audit' && (
          <WebsiteAuditView
            activeUrl={activeDomain}
            healthScore={healthScore}
            issues={issues}
            signals={auditSignals}
            onAuditUrl={handleAuditUrl}
            isAuditing={isAuditing}
            onStageChange={handleStageChange}
            stagedChangeIds={stagedChangeIds}
          />
        )}

        {activeTab === 'data' && (
          <DataHubView
            gscData={activeGscData}
            ga4Data={activeGa4Data}
            onAskAiAboutQuery={handleAskAiAboutQuery}
            onAskAiAboutPage={handleAskAiAboutPage}
          />
        )}

        {activeTab === 'cms' && (
          <CmsIntegrationsView
            googleAccount={googleAccount}
            cmsConnections={cmsConnections}
            onTestConnection={handleTestConnection}
            isTestingId={isTestingCmsId}
            onAddConnection={(newConn) => {
              const conn: CmsConnection = {
                ...newConn,
                id: `cms-${Date.now()}`,
                isConnected: true,
                status: 'active',
                verifiedAt: new Date().toISOString(),
                lastPingMs: 120,
              };
              setCmsConnections((prev) => [...prev, conn]);
            }}
          />
        )}

        {activeTab === 'implementation' && (
          <ImplementationHub
            changes={changes}
            onApplyChange={handleApplyChange}
            onRollbackChange={handleRollbackChange}
            isProcessingId={isProcessingId}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            activeDomain={activeDomain}
            healthScore={healthScore}
            gscData={activeGscData}
            ga4Data={activeGa4Data}
            issues={issues}
          />
        )}
      </main>

      {/* Global Platform Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200">RankAgent AI OS</span>
            <span>&bull;</span>
            <span>Created & Built by <strong className="text-blue-400 font-semibold">Dheeraj Rawat Mohan</strong></span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>Google Search Console &bull; GA4 &bull; WordPress &bull; Shopify &bull; Gemini 3.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
