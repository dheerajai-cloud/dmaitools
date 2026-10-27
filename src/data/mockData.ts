/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleAccount, CmsConnection, PlatformModule, SeoIssue, UserProfile } from '../types';

export const PLATFORM_CREATOR = {
  name: 'Dheeraj Rawat Mohan',
  title: 'Platform Founder & Chief Technical Architect',
  badge: 'Crafted by Dheeraj Mohan',
  bio: 'Conceived and architected RankAgent OS as an autonomous, multi-tenant SEO intelligence & direct CMS patching platform. Built to empower marketers and developers worldwide with real Google Search Console & GA4 automation.',
  email: 'dheerajrawatmohan@gmail.com',
  github: 'https://github.com/dheerajmohan',
  location: 'India',
};

export const INITIAL_MODULES: PlatformModule[] = [
  {
    id: 'seo_automation',
    name: 'SEO Automation & Implementation',
    icon: 'Sparkles',
    badge: 'Core Active Module',
    description: 'Autonomous website auditing, GSC/GA4 deep intelligence, natural-language fixes & 1-click rollback.',
    isActive: true,
  },
  {
    id: 'content_studio',
    name: 'AI Content Engine & Blog Ops',
    icon: 'FileText',
    badge: 'Coming Soon',
    description: 'Auto-generates high-intent pillar articles, refreshes decaying posts, and manages CMS publishing schedules.',
    isActive: false,
  },
  {
    id: 'cro_lab',
    name: 'Conversion Rate Optimization (CRO)',
    icon: 'TrendingUp',
    badge: 'Coming Soon',
    description: 'AI landing page visual heatmaps, dynamic A/B test generation, and checkout funnel optimization.',
    isActive: false,
  },
  {
    id: 'paid_ads_sync',
    name: 'Multi-Channel Paid Ads Hub',
    icon: 'Target',
    badge: 'Coming Soon',
    description: 'Syncs organic search insights directly into Google Ads & Meta PPC campaigns for unified ROI.',
    isActive: false,
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@growthventures.io',
    role: 'member',
    isGoogleConnected: true,
    connectedAt: '2026-10-26T10:00:00Z',
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@globaltech.com',
    role: 'member',
    isGoogleConnected: true,
    connectedAt: '2026-10-26T11:30:00Z',
  },
  {
    id: 'usr-3',
    name: 'David Chen',
    email: 'david.chen@ecommercehub.org',
    role: 'member',
    isGoogleConnected: true,
    connectedAt: '2026-10-26T12:15:00Z',
  },
];

export const DEFAULT_USER: UserProfile = {
  id: 'usr-guest',
  name: 'New Marketing User',
  email: 'user@gmail.com',
  role: 'member',
  isGoogleConnected: true,
  connectedAt: new Date().toISOString(),
};

export const INITIAL_GOOGLE_ACCOUNT: GoogleAccount = {
  email: 'user@gmail.com',
  name: 'New Marketing User',
  isConnected: true,
  connectedAt: new Date().toISOString(),
  gscProperties: [
    {
      id: 'gsc-1',
      siteUrl: 'https://myshop.com',
      permissionLevel: 'siteOwner',
      totalClicks: 14250,
      totalImpressions: 348000,
      avgCtr: 4.1,
      avgPosition: 11.2,
      lastSynced: 'Just now',
      topQueries: [
        {
          query: 'ergonomic office chair',
          clicks: 3420,
          impressions: 68000,
          ctr: 5.0,
          position: 4.2,
          trend: 'up',
          opportunityNote: 'Strong ranking; target top 3 by enhancing meta description CTA.',
        },
        {
          query: 'standing desk converter adjustable',
          clicks: 2150,
          impressions: 72000,
          ctr: 2.9,
          position: 8.8,
          trend: 'down',
          opportunityNote: 'Low CTR alert! High search volume but title tag needs discount/review modifier.',
        },
        {
          query: 'best lumbar support chair for back pain',
          clicks: 1840,
          impressions: 41000,
          ctr: 4.5,
          position: 6.1,
          trend: 'up',
          opportunityNote: 'High intent query. Add medical ergonomics FAQ Schema to claim rich snippets.',
        },
        {
          query: 'custom height desk workstation',
          clicks: 980,
          impressions: 39000,
          ctr: 2.5,
          position: 12.4,
          trend: 'down',
          opportunityNote: 'Page 2 ranking; internal linking from homepage will push this to Page 1.',
        },
        {
          query: 'mesh executive chair breathable',
          clicks: 840,
          impressions: 28000,
          ctr: 3.0,
          position: 9.3,
          trend: 'steady',
          opportunityNote: 'Include customer ratings in schema markup to boost SERP click-through.',
        },
      ],
    },
    {
      id: 'gsc-2',
      siteUrl: 'https://blog.techvision.io',
      permissionLevel: 'siteOwner',
      totalClicks: 8900,
      totalImpressions: 195000,
      avgCtr: 4.6,
      avgPosition: 9.8,
      lastSynced: '2 hours ago',
      topQueries: [
        {
          query: 'future of autonomous agents 2026',
          clicks: 2800,
          impressions: 42000,
          ctr: 6.7,
          position: 3.1,
          trend: 'up',
        },
        {
          query: 'how to build enterprise ai workflows',
          clicks: 1450,
          impressions: 36000,
          ctr: 4.0,
          position: 7.2,
          trend: 'steady',
        },
      ],
    },
  ],
  ga4Properties: [
    {
      propertyId: 'ga4-4829104',
      displayName: 'Global E-Commerce Store (Web)',
      websiteUrl: 'https://myshop.com',
      totalUsers: 48900,
      totalSessions: 67200,
      bounceRate: 36.4,
      conversions: 1840,
      lastSynced: 'Just now',
      topLandingPages: [
        {
          pagePath: '/products/ergonomic-chair',
          pageTitle: 'Ergonomic Office Chair - Premium Comfort',
          sessions: 24200,
          users: 18100,
          bounceRate: 29.8,
          conversions: 890,
          avgEngagementTimeSec: 142,
        },
        {
          pagePath: '/products/standing-desk',
          pageTitle: 'Adjustable Standing Desks & Workstations',
          sessions: 16400,
          users: 12300,
          bounceRate: 41.2,
          conversions: 420,
          avgEngagementTimeSec: 96,
        },
        {
          pagePath: '/blog/how-to-fix-lower-back-pain-sitting',
          pageTitle: 'Top 7 Ways to Alleviate Back Pain While Sitting at Work',
          sessions: 12100,
          users: 9800,
          bounceRate: 52.8,
          conversions: 180,
          avgEngagementTimeSec: 210,
        },
        {
          pagePath: '/',
          pageTitle: 'Healthy Workspaces Start Here',
          sessions: 14500,
          users: 11200,
          bounceRate: 32.1,
          conversions: 350,
          avgEngagementTimeSec: 115,
        },
      ],
    },
  ],
};

export const INITIAL_CMS_CONNECTIONS: CmsConnection[] = [
  {
    id: 'cms-1',
    platform: 'wordpress',
    siteName: 'Official Store (WordPress / WooCommerce)',
    siteUrl: 'https://myshop.com',
    isConnected: true,
    status: 'active',
    lastPingMs: 142,
    verifiedAt: '2026-10-26T18:00:00Z',
    config: {
      endpoint: 'https://myshop.com/wp-json/wp/v2',
      username: 'admin_webmaster',
      themeVersion: 'Astra Pro v4.6.1 + RankAgent Bridge',
      autoDeployApproved: true,
    },
  },
  {
    id: 'cms-2',
    platform: 'shopify',
    siteName: 'Global Storefront (Shopify Plus)',
    siteUrl: 'https://myshop-direct.myshopify.com',
    isConnected: false,
    status: 'disconnected',
    config: {
      endpoint: 'https://myshop-direct.myshopify.com/admin/api/2026-01',
      accessToken: 'shpat_demo_token_key',
    },
  },
];

export const INITIAL_AUDIT_ISSUES: SeoIssue[] = [
  {
    id: 'iss-1',
    title: 'Missing Canonical Link Element (Duplicate URL Risk)',
    severity: 'critical',
    category: 'Technical SEO',
    url: 'https://myshop.com',
    description: 'No <link rel="canonical"> tag detected in document <head>. Search engines may index duplicate parameter variants (?ref=, ?utm=) causing link equity dilution.',
    recommendation: 'Inject self-referencing canonical tag pointing explicitly to "https://myshop.com".',
    autoFixable: true,
    proposedFix: {
      tag: 'canonical',
      value: 'https://myshop.com',
    },
  },
  {
    id: 'iss-2',
    title: 'Meta Description Sub-optimal Length (53 chars vs 120-160 optimal)',
    severity: 'high',
    category: 'On-Page SEO',
    url: 'https://myshop.com',
    description: 'Current description is "Explore ergonomic office chairs with lumbar support." which is too short (53 chars). It leaves SERP snippet space empty and reduces click-through potential.',
    recommendation: 'Expand description to 148 characters with primary keywords, product guarantees, and a clear call-to-action.',
    autoFixable: true,
    proposedFix: {
      tag: 'meta_description',
      value: 'Shop premium ergonomic office chairs & standing desks engineered for all-day spine relief. Free express shipping, 30-day trials & 5-year warranty.',
    },
  },
  {
    id: 'iss-3',
    title: 'Missing OpenGraph Image (og:image) for Social SERP Sharing',
    severity: 'medium',
    category: 'Social SEO',
    url: 'https://myshop.com',
    description: 'No <meta property="og:image"> tag was found. When shared on social networks, Slack, or Google Discover, no preview banner will be rendered.',
    recommendation: 'Add high-resolution (1200x630px) WebP banner with clear brand logo and hero image.',
    autoFixable: true,
    proposedFix: {
      tag: 'og_image',
      value: 'https://myshop.com/cdn/assets/ergostore-hero-preview.webp',
    },
  },
  {
    id: 'iss-4',
    title: '3 Image Elements Missing Alt Attributes',
    severity: 'medium',
    category: 'Accessibility & Image SEO',
    url: 'https://myshop.com',
    description: '3 out of 14 images on the landing page lack descriptive alt attributes. Google Image search cannot index these product photos.',
    recommendation: 'Add keyword-rich descriptive alt attributes to product showcase images.',
    autoFixable: true,
    proposedFix: {
      tag: 'image_alt',
      value: 'Ergonomic lumbar support desk chair in midnight slate finish',
    },
  },
  {
    id: 'iss-5',
    title: 'Missing Structured Data (Schema.org / JSON-LD)',
    severity: 'high',
    category: 'Structured Data',
    url: 'https://myshop.com',
    description: 'No Organization, WebSite, or Store JSON-LD schema found. Misses out on Google Knowledge Graph entities and rich search badges.',
    recommendation: 'Deploy complete Organization & WebSite JSON-LD entity graph with search action.',
    autoFixable: true,
    proposedFix: {
      tag: 'schema_jsonld',
      value: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'OnlineStore',
        'name': 'ErgoStore',
        'url': 'https://myshop.com',
        'description': 'Leading provider of ergonomic office furniture',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://myshop.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }, null, 2),
    },
  },
];
