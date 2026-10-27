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
import { AuthModal } from './components/AuthModal';
import { ConnectPropertyModal } from './components/ConnectPropertyModal';

import { 
  INITIAL_MODULES, 
  INITIAL_GOOGLE_ACCOUNT, 
  INITIAL_CMS_CONNECTIONS, 
  INITIAL_AUDIT_ISSUES,
  DEFAULT_USER,
  PLATFORM_CREATOR
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
  MetaTagCheckResult,
  UserProfile,
  ThemeMode
} from './types';

export default function App() {
  // Theme state (Modern Light by default, or Pro Dark)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('rankagent_theme');
    return (saved as ThemeMode) || 'light';
  });

  // Current logged in user (dynamic multi-user support for any visitor)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rankagent_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const [currentModule, setCurrentModule] = useState<PlatformModule>(INITIAL_MODULES[0]);
  const [googleAccount, setGoogleAccount] = useState<GoogleAccount>(() => {
    return {
      ...INITIAL_GOOGLE_ACCOUNT,
      email: currentUser.email,
      name: currentUser.name,
    };
  });

  const [cmsConnections, setCmsConnections] = useState<CmsConnection[]>(INITIAL_CMS_CONNECTIONS);
  const [activeDomain, setActiveDomain] = useState<string>('https://myshop.com');
  const [availableDomains, setAvailableDomains] = useState<string[]>([
    'https://myshop.com',
    'https://blog.techvision.io',
  ]);
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

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('rankagent_theme', nextTheme);
  };

  // Login handler
  const handleLoginUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('rankagent_user', JSON.stringify(user));
    setGoogleAccount((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      isConnected: true,
    }));
  };

  // Logout handler
  const handleLogoutUser = () => {
    const guestUser: UserProfile = {
      id: 'usr-guest',
      name: 'Guest User',
      email: 'guest@workspace.org',
      role: 'guest',
      isGoogleConnected: false,
    };
    setCurrentUser(guestUser);
    localStorage.setItem('rankagent_user', JSON.stringify(guestUser));
    setGoogleAccount((prev) => ({
      ...prev,
      name: 'Guest User',
      email: 'guest@workspace.org',
      isConnected: false,
    }));
  };

  // Add custom domain / property handler
  const handleAddProperty = (newGsc: any, newGa4: any) => {
    const domain = newGsc.siteUrl;
    if (!availableDomains.includes(domain)) {
      setAvailableDomains((prev) => [domain, ...prev]);
    }
    setActiveDomain(domain);
    setGoogleAccount((prev) => ({
      ...prev,
      gscProperties: [newGsc, ...prev.gscProperties],
      ga4Properties: [newGa4, ...prev.ga4Properties],
    }));

    // Trigger immediate live crawl audit for this newly added website
    handleAuditUrl(domain);
  };

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
        if (!availableDomains.includes(url)) {
          setAvailableDomains((prev) => [url, ...prev]);
        }
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
        setStagedChangeIds((prev) => new Set([...prev, item.id]));
      }
    } catch {
      const fallbackItem: WebsiteChangeItem = {
        ...item,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setChanges((prev) => [fallbackItem, ...prev.filter((c) => c.id !== item.id)]);
      setStagedChangeIds((prev) => new Set([...prev, item.id]));
    }
  };

  // Apply change to live website
  const handleApplyChange = async (changeId: string) => {
    setIsProcessingId(changeId);
    try {
      const res = await fetch('/api/changes/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: changeId,
          user: currentUser.name,
        }),
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
                  appliedBy: `${currentUser.name} (${currentUser.email})`,
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
                rolledBackAt: new Date().toISOString(),
                report: c.report ? { ...c.report, status: 'rolled_back' } : undefined,
              };
            }
            return c;
          })
        );
      }
    } catch {
      setChanges((prev) =>
        prev.map((c) =>
          c.id === changeId
            ? {
                ...c,
                status: 'rolled_back',
                rolledBackAt: new Date().toISOString(),
              }
            : c
        )
      );
    } finally {
      setIsProcessingId(undefined);
    }
  };

  // Test CMS Connection
  const handleTestConnection = async (cmsId: string) => {
    setIsTestingCmsId(cmsId);
    try {
      const res = await fetch(`/api/cms/test/${cmsId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCmsConnections((prev) =>
          prev.map((c) =>
            c.id === cmsId
              ? {
                  ...c,
                  status: 'active',
                  lastPingMs: data.pingMs || 110,
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
        user: {
          name: currentUser.name,
          email: currentUser.email,
        },
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
    const promptText = `Landing page "${page.pagePath}" (${page.pageTitle}) has ${page.sessions.toLocaleString()} sessions and a bounce rate of ${page.bounceRate}%. Analyze technical and semantic SEO factors and recommend concrete fixes to improve engagement and conversions.`;
    handleSendMessage(promptText, ['ga4', 'crawler'], 'gemini-3.8-flash');
  };

  // Route to Reports tab from Prompt
  const handleExportReportFromPrompt = (_content: string, _prompt: string) => {
    setActiveTab('reports');
  };

  const pendingApprovalsCount = changes.filter((c) => c.status === 'pending').length;
  const criticalIssuesCount = issues.filter((i) => i.severity === 'critical').length;
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white' 
        : 'bg-slate-50/70 text-slate-900 selection:bg-indigo-600 selection:text-white'
    }`}>
      {/* Header */}
      <Header
        currentModule={currentModule}
        availableModules={INITIAL_MODULES}
        onSelectModule={setCurrentModule}
        currentUser={currentUser}
        googleAccount={googleAccount}
        activeDomain={activeDomain}
        availableDomains={availableDomains}
        onSelectDomain={setActiveDomain}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        criticalIssuesCount={criticalIssuesCount}
        theme={theme}
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
            theme={theme}
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
            theme={theme}
          />
        )}

        {activeTab === 'data' && (
          <DataHubView
            gscData={activeGscData}
            ga4Data={activeGa4Data}
            onAskAiAboutQuery={handleAskAiAboutQuery}
            onAskAiAboutPage={handleAskAiAboutPage}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            theme={theme}
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
            theme={theme}
          />
        )}

        {activeTab === 'implementation' && (
          <ImplementationHub
            changes={changes}
            onApplyChange={handleApplyChange}
            onRollbackChange={handleRollbackChange}
            isProcessingId={isProcessingId}
            theme={theme}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            activeDomain={activeDomain}
            healthScore={healthScore}
            gscData={activeGscData}
            ga4Data={activeGa4Data}
            issues={issues}
            theme={theme}
          />
        )}
      </main>

      {/* Global Platform Footer */}
      <footer className={`border-t py-4 px-4 sm:px-6 lg:px-8 text-xs transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>RankAgent AI OS</span>
            <span>&bull;</span>
            <span>Architected &amp; Built by <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{PLATFORM_CREATOR.name}</strong></span>
            <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
              Platform Founder
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span>Active Session: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{currentUser.email}</strong></span>
            <span>&bull;</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Switch Account
            </button>
          </div>
        </div>
      </footer>

      {/* User Login & Google Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLoginUser}
        onLogout={handleLogoutUser}
        theme={theme}
      />

      {/* Connect Property & GSC / GA4 Modal */}
      <ConnectPropertyModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAddProperty={handleAddProperty}
        theme={theme}
      />
    </div>
  );
}
