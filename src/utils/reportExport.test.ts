/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCsvContent, generateWordContent, generatePptSlidesHtml, ReportData } from './reportExport';

const sampleReport: ReportData = {
  title: 'Full Technical SEO Audit & Query Analysis',
  generatedAt: '2026-10-26T18:00:00Z',
  domain: 'https://example-shop.com',
  healthScore: 88,
  executiveSummary: 'Identified 3 high-impact ranking opportunities and 2 missing canonical tags.',
  gscData: {
    totalClicks: 24500,
    totalImpressions: 480000,
    avgCtr: 5.1,
    avgPosition: 8.4,
    topQueries: [
      { query: 'ergonomic chair office', clicks: 4200, impressions: 51000, ctr: 8.2, position: 2.1 },
      { query: 'standing desk converter', clicks: 3100, impressions: 45000, ctr: 6.8, position: 3.5 },
    ],
  },
  ga4Data: {
    totalUsers: 34000,
    totalSessions: 49000,
    bounceRate: 38.2,
    conversions: 1420,
    topPages: [
      { page: '/products/chairs', views: 18000, bounceRate: 32.1 },
    ],
  },
  issues: [
    {
      severity: 'critical',
      category: 'technical',
      title: 'Missing Canonical Tag',
      description: 'The root category has no canonical URL defined.',
      recommendation: 'Add self-referencing canonical tag.',
    },
  ],
};

test('generateCsvContent outputs valid CSV rows with escaped fields', () => {
  const csv = generateCsvContent(sampleReport);
  assert.ok(csv.includes('TECHNICAL SEO AUDIT'));
  assert.ok(csv.includes('Dheeraj Rawat Mohan'));
  assert.ok(csv.includes('https://example-shop.com'));
  assert.ok(csv.includes('ergonomic chair office'));
  assert.ok(csv.includes('Missing Canonical Tag'));
});

test('generateWordContent formats complete HTML document with tables and styles', () => {
  const wordDoc = generateWordContent(sampleReport);
  assert.ok(wordDoc.includes('urn:schemas-microsoft-com:office:word'));
  assert.ok(wordDoc.includes('Dheeraj Rawat Mohan'));
  assert.ok(wordDoc.includes('Comprehensive Health Index:'));
  assert.ok(wordDoc.includes('88 / 100'));
  assert.ok(wordDoc.includes('Missing Canonical Tag'));
});

test('generatePptSlidesHtml creates multi-slide deck with KPI cards', () => {
  const pptHtml = generatePptSlidesHtml(sampleReport);
  assert.ok(pptHtml.includes('class="slide"'));
  assert.ok(pptHtml.includes('Dheeraj'));
  assert.ok(pptHtml.includes('Slide 1 of 3'));
  assert.ok(pptHtml.includes('Slide 2 of 3'));
  assert.ok(pptHtml.includes('Slide 3 of 3'));
  assert.ok(pptHtml.includes('24,500'));
});
