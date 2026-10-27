/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SeoIssue, MetaTagCheckResult } from './utils/seoAuditRules';
import { WebsiteChangeItem, ImplementationReport } from './utils/rollbackEngine';
import { ReportData } from './utils/reportExport';

export type { SeoIssue, MetaTagCheckResult, WebsiteChangeItem, ImplementationReport, ReportData };

export interface GscQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  trend: 'up' | 'down' | 'steady';
  opportunityNote?: string;
}

export interface GscProperty {
  id: string;
  siteUrl: string;
  permissionLevel: 'siteOwner' | 'siteFullUser' | 'siteRestrictedUser';
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  topQueries: GscQuery[];
  lastSynced: string;
}

export interface Ga4LandingPage {
  pagePath: string;
  pageTitle: string;
  sessions: number;
  users: number;
  bounceRate: number;
  conversions: number;
  avgEngagementTimeSec: number;
}

export interface Ga4Property {
  propertyId: string;
  displayName: string;
  websiteUrl: string;
  totalUsers: number;
  totalSessions: number;
  bounceRate: number;
  conversions: number;
  topLandingPages: Ga4LandingPage[];
  lastSynced: string;
}

export interface GoogleAccount {
  email: string;
  name: string;
  avatarUrl?: string;
  isConnected: boolean;
  connectedAt?: string;
  gscProperties: GscProperty[];
  ga4Properties: Ga4Property[];
}

export type CmsPlatformType = 'wordpress' | 'shopify' | 'custom_webhook';

export interface CmsConnection {
  id: string;
  platform: CmsPlatformType;
  siteName: string;
  siteUrl: string;
  isConnected: boolean;
  status: 'active' | 'disconnected' | 'testing' | 'error';
  lastPingMs?: number;
  verifiedAt?: string;
  config: {
    endpoint?: string;
    username?: string;
    accessToken?: string;
    themeVersion?: string;
    autoDeployApproved?: boolean;
  };
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  selectedSources: string[];
  modelUsed?: string;
  proposedChanges?: WebsiteChangeItem[];
  suggestedPrompts?: string[];
}

export interface PlatformModule {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  isActive: boolean;
}
