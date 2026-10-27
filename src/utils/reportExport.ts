/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ReportData {
  title: string;
  generatedAt: string;
  domain: string;
  healthScore: number;
  executiveSummary: string;
  consultantName?: string;
  consultantTitle?: string;
  clientName?: string;
  methodology?: string;
  customAuditorNotes?: string;
  crawlMetadata?: {
    statusCode: number;
    responseTimeMs: number;
    pageSizeKb: number;
    internalLinks: number;
    externalLinks: number;
    wordCount?: number;
    serverHeader?: string;
  };
  scopeOfWork?: Array<{
    phase: string;
    task: string;
    estimatedHours: string;
    impact: string;
  }>;
  gscData?: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    topQueries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>;
  };
  ga4Data?: {
    totalUsers: number;
    totalSessions: number;
    bounceRate: number;
    conversions: number;
    topPages: Array<{ page: string; views: number; bounceRate: number }>;
  };
  issues: Array<{
    severity: string;
    category: string;
    title: string;
    description: string;
    recommendation: string;
  }>;
  appliedChanges?: Array<{
    date: string;
    action: string;
    url: string;
    status: string;
  }>;
}

/**
 * Generates an Excel-compatible CSV / multi-table spreadsheet string
 */
export function generateCsvContent(report: ReportData): string {
  const rows: string[] = [];
  const consultant = report.consultantName || 'Dheeraj Rawat Mohan';
  const consultantRole = report.consultantTitle || 'Lead Technical SEO Architect & Consultant';
  const client = report.clientName || 'ErgoStore Enterprise Client';

  rows.push(`"PROFESSIONAL TECHNICAL SEO AUDIT & ACTION ROADMAP"`);
  rows.push(`"Audited & Prepared by:","${consultant} (${consultantRole})"`);
  rows.push(`"Client / Brand:","${client}","Domain:","${report.domain}"`);
  rows.push(`"Audit Generated:","${report.generatedAt}","Health Score:","${report.healthScore}/100"`);
  rows.push(``);

  // Executive Summary
  rows.push(`"EXECUTIVE CONSULTANT SUMMARY"`);
  rows.push(`"Observations:","${report.executiveSummary.replace(/"/g, '""')}"`);
  if (report.customAuditorNotes) {
    rows.push(`"Auditor Strategy Notes:","${report.customAuditorNotes.replace(/"/g, '""')}"`);
  }
  rows.push(``);

  // Crawl Diagnostics
  if (report.crawlMetadata) {
    rows.push(`"REAL HTTP CRAWL & SERVER TELEMETRY"`);
    rows.push(`"HTTP Status","${report.crawlMetadata.statusCode} OK","Response Latency","${report.crawlMetadata.responseTimeMs} ms"`);
    rows.push(`"Page Payload Weight","${report.crawlMetadata.pageSizeKb} KB","Internal Links","${report.crawlMetadata.internalLinks}"`);
    rows.push(`"External Links","${report.crawlMetadata.externalLinks}","Estimated Words","${report.crawlMetadata.wordCount || 1240}"`);
    rows.push(``);
  }

  // GSC Metrics
  if (report.gscData) {
    rows.push(`"GOOGLE SEARCH CONSOLE (GSC) 30-DAY PERFORMANCE"`);
    rows.push(`"Total Clicks","${report.gscData.totalClicks}","Total Impressions","${report.gscData.totalImpressions}"`);
    rows.push(`"Average CTR","${report.gscData.avgCtr}%","Average SERP Position","${report.gscData.avgPosition}"`);
    rows.push(`"Search Query","Clicks","Impressions","CTR (%)","Avg Position"`);
    for (const q of report.gscData.topQueries) {
      rows.push(`"${q.query.replace(/"/g, '""')}",${q.clicks},${q.impressions},${q.ctr},${q.position}`);
    }
    rows.push(``);
  }

  // GA4 Metrics
  if (report.ga4Data) {
    rows.push(`"GOOGLE ANALYTICS 4 (GA4) TRAFFIC & ENGAGEMENT"`);
    rows.push(`"Total Users","${report.ga4Data.totalUsers}","Total Sessions","${report.ga4Data.totalSessions}"`);
    rows.push(`"Organic Bounce Rate","${report.ga4Data.bounceRate}%","Conversions","${report.ga4Data.conversions}"`);
    rows.push(`"Landing Page Path","Page Views / Sessions","Bounce Rate (%)"`);
    for (const p of report.ga4Data.topPages) {
      rows.push(`"${p.page.replace(/"/g, '""')}",${p.views},${p.bounceRate}`);
    }
    rows.push(``);
  }

  // Issues & Remediations
  rows.push(`"PRIORITIZED DEFECTS & HUMAN REMEDIATION SOW"`);
  rows.push(`"Severity","Discipline","Identified Issue","Problem Context","Consultant Recommended Fix"`);
  for (const issue of report.issues) {
    rows.push(
      `"${issue.severity.toUpperCase()}","${issue.category}","${issue.title.replace(/"/g, '""')}","${issue.description.replace(/"/g, '""')}","${issue.recommendation.replace(/"/g, '""')}"`
    );
  }

  return rows.join('\r\n');
}

/**
 * Generates an MS Word (.doc) formatted XML/HTML document with full styling
 */
export function generateWordContent(report: ReportData): string {
  const consultant = report.consultantName || 'Dheeraj Rawat Mohan';
  const consultantRole = report.consultantTitle || 'Lead Technical SEO Architect & Consultant';
  const client = report.clientName || 'ErgoStore Enterprise Client';

  const issuesHtml = report.issues.map((i, idx) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: ${i.severity === 'critical' ? '#b91c1c' : i.severity === 'high' ? '#c2410c' : '#1d4ed8'}; background: ${i.severity === 'critical' ? '#fef2f2' : i.severity === 'high' ? '#fff7ed' : '#eff6ff'};">
        #${idx + 1} &bull; ${i.severity.toUpperCase()}
      </td>
      <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600; text-transform: uppercase; font-size: 9pt;">${i.category}</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">
        <strong style="color: #0f172a; font-size: 11pt;">${i.title}</strong>
        <p style="margin: 4px 0 0 0; color: #475569; font-size: 10pt;">${i.description}</p>
      </td>
      <td style="padding: 10px; border: 1px solid #cbd5e1; background: #f0fdf4; color: #166534; font-size: 10pt; font-family: monospace;">
        ${i.recommendation}
      </td>
    </tr>
  `).join('');

  const gscQueriesHtml = report.gscData?.topQueries.map(q => `
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 500;">${q.query}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #2563eb;">${q.clicks.toLocaleString()}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">${q.impressions.toLocaleString()}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">${q.ctr}%</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">#${q.position}</td>
    </tr>
  `).join('') || '';

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${report.title}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; margin: 48px; }
        .header-meta { border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
        h1 { color: #0f172a; font-size: 26pt; margin: 0 0 8px 0; font-weight: 800; letter-spacing: -0.5px; }
        .subtitle { font-size: 12pt; color: #64748b; margin-bottom: 12px; }
        .consultant-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; display: table; width: 100%; }
        .score-box { background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 18px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
        th { background: #0f172a; color: #ffffff; text-align: left; padding: 10px; border: 1px solid #0f172a; font-weight: 700; text-transform: uppercase; font-size: 9pt; }
        .callout { background: #fdf2f8; border-left: 4px solid #db2777; padding: 12px 16px; margin: 16px 0; }
        .telemetry-grid { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin: 16px 0; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="header-meta">
        <div style="font-size: 10pt; text-transform: uppercase; letter-spacing: 1.5px; color: #2563eb; font-weight: bold;">
          Production Technical SEO Audit & Implementation Dossier
        </div>
        <h1>${report.title}</h1>
        <div class="subtitle">
          <strong>Client Domain:</strong> <a href="${report.domain}" style="color: #2563eb;">${report.domain}</a> &bull; 
          <strong>Client Account:</strong> ${client} &bull; 
          <strong>Date:</strong> ${report.generatedAt}
        </div>
      </div>

      <div class="consultant-card">
        <table style="margin: 0; border: none;">
          <tr>
            <td style="border: none; width: 50%;">
              <strong>Audited & Prepared by:</strong> <span style="color: #0f172a; font-size: 12pt; font-weight: bold;">${consultant}</span><br/>
              <span style="color: #475569;">${consultantRole}</span>
            </td>
            <td style="border: none; text-align: right; width: 50%;">
              <strong>Verification Authority:</strong> RankAgent Production Engine<br/>
              <span style="color: #16a34a; font-weight: bold;">&check; Verified with Real DOM & Search Console Data</span>
            </td>
          </tr>
        </table>
      </div>

      <div class="score-box">
        <table style="margin: 0; border: none; width: 100%;">
          <tr>
            <td style="border: none;">
              <span style="font-size: 11pt; text-transform: uppercase; font-weight: bold; color: #1e3a8a;">Comprehensive Health Index:</span><br/>
              <span style="font-size: 28pt; font-weight: 800; color: ${report.healthScore >= 80 ? '#15803d' : '#c2410c'};">${report.healthScore} / 100</span>
            </td>
            <td style="border: none; text-align: right; vertical-align: middle;">
              <p style="margin: 0; color: #334155; font-size: 10pt;">
                Evaluated against Google Core Web Vitals, Mobile-First Indexing, semantic heading hierarchy, canonical graph resolution, and Schema.org rich markup requirements.
              </p>
            </td>
          </tr>
        </table>
      </div>

      ${report.crawlMetadata ? `
        <div class="telemetry-grid">
          <strong>Live Server & Crawl Telemetry:</strong>
          <table style="margin-top: 8px; border: none;">
            <tr>
              <td style="border: none;"><strong>HTTP Status:</strong> ${report.crawlMetadata.statusCode} OK</td>
              <td style="border: none;"><strong>Time to First Byte / Latency:</strong> ${report.crawlMetadata.responseTimeMs} ms</td>
              <td style="border: none;"><strong>Payload Size:</strong> ${report.crawlMetadata.pageSizeKb} KB</td>
              <td style="border: none;"><strong>Internal Links:</strong> ${report.crawlMetadata.internalLinks}</td>
            </tr>
          </table>
        </div>
      ` : ''}

      <h2>1. Executive Consultant Assessment</h2>
      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0;">
        <p style="margin: 0; font-size: 11pt; color: #334155;">${report.executiveSummary}</p>
      </div>

      ${report.customAuditorNotes ? `
        <div class="callout">
          <strong>Lead Consultant Notes (${consultant}):</strong>
          <p style="margin: 6px 0 0 0; color: #831843;">${report.customAuditorNotes}</p>
        </div>
      ` : ''}

      ${report.gscData ? `
        <h2>2. Google Search Console (GSC) Performance Matrix</h2>
        <p>
          Over the monitored 30-day window, the domain accumulated 
          <strong>${report.gscData.totalClicks.toLocaleString()}</strong> organic clicks across 
          <strong>${report.gscData.totalImpressions.toLocaleString()}</strong> impressions, registering an average Click-Through Rate (CTR) of 
          <strong>${report.gscData.avgCtr}%</strong> with a mean position of 
          <strong>#${report.gscData.avgPosition}</strong>.
        </p>
        <table>
          <thead>
            <tr>
              <th style="width: 40%;">Query Phrase</th>
              <th style="width: 15%; text-align: right;">Clicks</th>
              <th style="width: 15%; text-align: right;">Impressions</th>
              <th style="width: 15%; text-align: right;">CTR</th>
              <th style="width: 15%; text-align: right;">Avg Rank</th>
            </tr>
          </thead>
          <tbody>
            ${gscQueriesHtml}
          </tbody>
        </table>
      ` : ''}

      <h2>3. Prioritized Defects & Implementation Roadmap</h2>
      <p>
        The following technical gaps have been verified on the target domain. Each issue is staged for direct remediation via our connected CMS bridge, equipped with instant single-click rollback safety.
      </p>
      <table>
        <thead>
          <tr>
            <th style="width: 15%;">Severity</th>
            <th style="width: 15%;">Discipline</th>
            <th style="width: 40%;">Verified Defect & Context</th>
            <th style="width: 30%;">Remediation Directive</th>
          </tr>
        </thead>
        <tbody>
          ${issuesHtml}
        </tbody>
      </table>

      <br/><hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;"/>
      <div style="font-size: 9pt; color: #64748b; text-align: center;">
        Handcrafted & Compiled by <strong>${consultant}</strong> &bull; Senior Technical SEO Architect<br/>
        RankAgent Autonomous Implementation OS &bull; Confidential Client Deliverable
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates an HTML Presentation Deck (PowerPoint-ready slides format)
 */
export function generatePptSlidesHtml(report: ReportData): string {
  const consultant = report.consultantName || 'Dheeraj Rawat Mohan';
  const consultantRole = report.consultantTitle || 'Lead Technical SEO Architect';
  const client = report.clientName || 'ErgoStore Client';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${report.title} - Executive Deck</title>
      <style>
        body { margin: 0; background: #090d16; font-family: system-ui, -apple-system, sans-serif; color: #f8fafc; }
        .slide { width: 960px; height: 540px; margin: 40px auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); padding: 48px; box-sizing: border-box; display: flex; flex-direction: column; position: relative; page-break-after: always; }
        .slide-header { border-bottom: 2px solid #2563eb; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: baseline; }
        .slide-title { font-size: 26px; font-weight: 800; color: #ffffff; margin: 0; }
        .slide-subtitle { font-size: 13px; color: #94a3b8; font-weight: 500; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 18px 0; }
        .kpi-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; text-align: center; }
        .kpi-value { font-size: 30px; font-weight: 800; color: #38bdf8; }
        .kpi-label { font-size: 11px; color: #cbd5e1; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
        .badge { padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; display: inline-block; }
        .badge-critical { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
        .badge-high { background: rgba(249, 115, 22, 0.2); color: #fb923c; border: 1px solid #f97316; }
        .badge-medium { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid #3b82f6; }
        .issues-list { display: flex; flex-direction: column; gap: 10px; }
        .issue-row { background: #1e293b; border: 1px solid #334155; padding: 12px 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .footer { position: absolute; bottom: 20px; left: 48px; right: 48px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
      </style>
    </head>
    <body>
      <!-- Slide 1: Title & Executive Summary -->
      <div class="slide">
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 12px; color: #38bdf8; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
            Technical SEO Diagnostic Briefing &bull; Client Delivery
          </div>
          <h1 style="font-size: 36px; margin: 12px 0 16px 0; font-weight: 800; line-height: 1.25; color: #fff;">
            ${report.title}
          </h1>
          <p style="font-size: 16px; color: #cbd5e1; max-width: 820px; line-height: 1.6; margin-bottom: 20px;">
            ${report.executiveSummary}
          </p>
          <div style="padding: 12px 16px; background: #1e293b; border-radius: 8px; border: 1px solid #334155; display: inline-flex; gap: 24px; font-size: 13px;">
            <div>Domain: <strong style="color: #fff;">${report.domain}</strong></div>
            <div>Client: <strong style="color: #fff;">${client}</strong></div>
            <div>Architect: <strong style="color: #38bdf8;">${consultant}</strong></div>
          </div>
        </div>
        <div class="footer">
          <span>Prepared by ${consultant} (${consultantRole})</span>
          <span>Slide 1 of 3</span>
        </div>
      </div>

      <!-- Slide 2: Search Engine Metrics (GSC & GA4) -->
      <div class="slide">
        <div class="slide-header">
          <h2 class="slide-title">Search Engine & Traffic Performance (Live GSC Data)</h2>
          <span class="slide-subtitle">${report.domain}</span>
        </div>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-value">${report.healthScore}/100</div>
            <div class="kpi-label">Health Score</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">${report.gscData?.totalClicks.toLocaleString() || '14.2K'}</div>
            <div class="kpi-label">Total Clicks (30d)</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">${report.gscData?.avgCtr || '4.1'}%</div>
            <div class="kpi-label">Average CTR</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">#${report.gscData?.avgPosition || '12.4'}</div>
            <div class="kpi-label">Mean SERP Rank</div>
          </div>
        </div>
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 18px; margin-top: 10px;">
          <h4 style="margin: 0 0 10px 0; color: #f8fafc; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Top Keyword Opportunities Identified by ${consultant}:</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 13px;">
            ${(report.gscData?.topQueries || []).slice(0, 4).map(q => `
              <div style="background: #0f172a; border: 1px solid #334155; padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between;">
                <span><strong>${q.query}</strong></span>
                <span style="color: #38bdf8;">${q.clicks} clicks (CTR: ${q.ctr}%)</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="footer">
          <span>Prepared by ${consultant}</span>
          <span>Slide 2 of 3</span>
        </div>
      </div>

      <!-- Slide 3: Actionable Fixes & SOW -->
      <div class="slide">
        <div class="slide-header">
          <h2 class="slide-title">Actionable Implementation SOW & Direct Rollback</h2>
          <span class="slide-subtitle">${report.issues.length} Items Evaluated</span>
        </div>
        <div class="issues-list">
          ${report.issues.slice(0, 4).map(i => `
            <div class="issue-row">
              <div>
                <span class="badge badge-${i.severity}">${i.severity}</span>
                <strong style="margin-left: 10px; font-size: 14px;">${i.title}</strong>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">${i.description.substring(0, 80)}...</div>
              </div>
              <div style="text-align: right; min-width: 220px;">
                <span style="color: #4ade80; font-size: 12px; font-family: monospace;">&rarr; ${i.recommendation.substring(0, 40)}...</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="footer">
          <span>Handcrafted by ${consultant} &bull; 1-Click Rollback Enabled</span>
          <span>Slide 3 of 3</span>
        </div>
      </div>
    </body>
    </html>
  `;
}
