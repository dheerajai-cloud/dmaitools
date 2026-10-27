/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MetaTagCheckResult {
  title?: string;
  titleLength: number;
  isTitleValid: boolean;
  metaDescription?: string;
  descriptionLength: number;
  isDescriptionValid: boolean;
  h1Count: number;
  isH1Valid: boolean;
  canonicalUrl?: string;
  hasCanonical: boolean;
  hasViewport: boolean;
  hasOgTitle: boolean;
  hasOgImage: boolean;
  totalImages: number;
  imagesWithAlt: number;
  altCoveragePercent: number;
  hasSchema: boolean;
  schemaTypes: string[];
  h2Count?: number;
  h3Count?: number;
  internalLinksCount?: number;
  externalLinksCount?: number;
  pageSizeKb?: number;
  wordCount?: number;
  scriptsCount?: number;
  stylesheetsCount?: number;
}

export interface SeoIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'opportunity';
  category: 'technical' | 'content' | 'indexing' | 'performance' | 'schema';
  title: string;
  description: string;
  affectedUrl: string;
  currentValue?: string;
  recommendedValue: string;
  impactScore: number; // 1-10
  effortScore: 'easy' | 'moderate' | 'complex';
  canAutoFix: boolean;
  fixActionType?: 'meta_title' | 'meta_desc' | 'h1_heading' | 'alt_text' | 'schema_markup' | 'robots_txt' | 'canonical';
}

/**
 * Analyzes parsed HTML signals and identifies issues
 */
export function evaluateSeoSignals(url: string, signals: MetaTagCheckResult): {
  healthScore: number;
  issues: SeoIssue[];
  passedChecksCount: number;
  totalChecksCount: number;
} {
  const issues: SeoIssue[] = [];
  let passedChecks = 0;
  const totalChecks = 8;

  // 1. Title tag check
  if (!signals.title || signals.title.trim().length === 0) {
    issues.push({
      id: `issue-title-missing-${Date.now()}`,
      severity: 'critical',
      category: 'content',
      title: 'Missing Page Title Tag',
      description: 'The page has no <title> tag, which is essential for search engines and user click-through rate.',
      affectedUrl: url,
      currentValue: '',
      recommendedValue: 'Add a descriptive 50-60 character title including primary keyword and brand name.',
      impactScore: 10,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'meta_title',
    });
  } else if (signals.titleLength < 30) {
    issues.push({
      id: `issue-title-short-${Date.now()}`,
      severity: 'medium',
      category: 'content',
      title: 'Page Title is Too Short',
      description: `Title is only ${signals.titleLength} characters. Optimal length is between 40-60 characters.`,
      affectedUrl: url,
      currentValue: signals.title,
      recommendedValue: `${signals.title} | Premium Solutions & Official Guide`,
      impactScore: 6,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'meta_title',
    });
  } else if (signals.titleLength > 65) {
    issues.push({
      id: `issue-title-long-${Date.now()}`,
      severity: 'medium',
      category: 'content',
      title: 'Page Title Exceeds Recommended Length',
      description: `Title is ${signals.titleLength} characters and will be truncated in Google search results.`,
      affectedUrl: url,
      currentValue: signals.title,
      recommendedValue: signals.title.substring(0, 58) + '...',
      impactScore: 5,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'meta_title',
    });
  } else {
    passedChecks++;
  }

  // 2. Meta description check
  if (!signals.metaDescription || signals.metaDescription.trim().length === 0) {
    issues.push({
      id: `issue-desc-missing-${Date.now()}`,
      severity: 'critical',
      category: 'content',
      title: 'Missing Meta Description',
      description: 'Search engines may generate arbitrary text snippets from page content if meta description is missing.',
      affectedUrl: url,
      currentValue: '',
      recommendedValue: 'Generate a compelling 140-160 character meta description with a clear call to action.',
      impactScore: 8,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'meta_desc',
    });
  } else if (signals.descriptionLength < 70) {
    issues.push({
      id: `issue-desc-short-${Date.now()}`,
      severity: 'low',
      category: 'content',
      title: 'Meta Description Under-Optimized',
      description: `Meta description is only ${signals.descriptionLength} characters. Target 130-160 characters to maximize SERP real estate.`,
      affectedUrl: url,
      currentValue: signals.metaDescription,
      recommendedValue: `${signals.metaDescription} Explore our comprehensive features, benefits, and get started today.`,
      impactScore: 4,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'meta_desc',
    });
  } else {
    passedChecks++;
  }

  // 3. H1 Headings check
  if (signals.h1Count === 0) {
    issues.push({
      id: `issue-h1-none-${Date.now()}`,
      severity: 'critical',
      category: 'technical',
      title: 'Missing Primary H1 Heading',
      description: 'The page lacks a main <h1> heading, which signals top-level content topic to search crawlers.',
      affectedUrl: url,
      currentValue: '0 <h1> tags found',
      recommendedValue: 'Add one clear <h1> heading at the top of the content area.',
      impactScore: 9,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'h1_heading',
    });
  } else if (signals.h1Count > 1) {
    issues.push({
      id: `issue-h1-multiple-${Date.now()}`,
      severity: 'medium',
      category: 'technical',
      title: 'Multiple H1 Headings Detected',
      description: `Found ${signals.h1Count} <h1> tags. Best practice is to have exactly one distinct primary H1 per page.`,
      affectedUrl: url,
      currentValue: `${signals.h1Count} <h1> tags`,
      recommendedValue: 'Keep the main page topic as H1 and convert secondary section headers to H2 or H3.',
      impactScore: 5,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'h1_heading',
    });
  } else {
    passedChecks++;
  }

  // 4. Canonical Tag check
  if (!signals.hasCanonical) {
    issues.push({
      id: `issue-canonical-missing-${Date.now()}`,
      severity: 'high',
      category: 'indexing',
      title: 'Missing Canonical Tag (<link rel="canonical">)',
      description: 'Without a self-referencing canonical URL, parameterized or duplicate URLs can split link equity.',
      affectedUrl: url,
      currentValue: 'None',
      recommendedValue: `<link rel="canonical" href="${url}" />`,
      impactScore: 7,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'canonical',
    });
  } else {
    passedChecks++;
  }

  // 5. Mobile Viewport Check
  if (!signals.hasViewport) {
    issues.push({
      id: `issue-viewport-missing-${Date.now()}`,
      severity: 'critical',
      category: 'technical',
      title: 'Missing Mobile Viewport Meta Tag',
      description: 'Pages without <meta name="viewport"> fail Google Mobile-Friendly checks and suffer mobile ranking penalties.',
      affectedUrl: url,
      currentValue: 'None',
      recommendedValue: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      impactScore: 10,
      effortScore: 'easy',
      canAutoFix: true,
    });
  } else {
    passedChecks++;
  }

  // 6. OpenGraph Check
  if (!signals.hasOgTitle || !signals.hasOgImage) {
    issues.push({
      id: `issue-og-missing-${Date.now()}`,
      severity: 'medium',
      category: 'technical',
      title: 'Incomplete Open Graph Social Metadata',
      description: 'Missing og:title or og:image results in broken preview cards when shared on social networks and messaging apps.',
      affectedUrl: url,
      recommendedValue: 'Inject og:title, og:description, and high-resolution og:image tags.',
      impactScore: 5,
      effortScore: 'easy',
      canAutoFix: true,
    });
  } else {
    passedChecks++;
  }

  // 7. Image ALT Tag Check
  if (signals.totalImages > 0 && signals.altCoveragePercent < 80) {
    issues.push({
      id: `issue-alt-missing-${Date.now()}`,
      severity: 'high',
      category: 'content',
      title: 'Images Missing Alt Text Attributes',
      description: `Only ${signals.altCoveragePercent}% of images have descriptive alt attributes (${signals.imagesWithAlt}/${signals.totalImages}).`,
      affectedUrl: url,
      currentValue: `${signals.totalImages - signals.imagesWithAlt} images without alt text`,
      recommendedValue: 'Generate accessibility-friendly, context-rich alt text for all content images.',
      impactScore: 7,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'alt_text',
    });
  } else {
    passedChecks++;
  }

  // 8. Schema Markup Check
  if (!signals.hasSchema) {
    issues.push({
      id: `issue-schema-none-${Date.now()}`,
      severity: 'medium',
      category: 'schema',
      title: 'No Structured Data (JSON-LD) Detected',
      description: 'Missing Schema.org structured data misses opportunities for rich snippets (FAQs, Products, Breadcrumbs) in Google SERP.',
      affectedUrl: url,
      currentValue: 'No Schema.org markup',
      recommendedValue: 'Inject WebSite and Organization JSON-LD markup with breadcrumb structure.',
      impactScore: 6,
      effortScore: 'easy',
      canAutoFix: true,
      fixActionType: 'schema_markup',
    });
  } else {
    passedChecks++;
  }

  // Calculate health score: 100 base minus deductions by severity
  let deduction = 0;
  for (const issue of issues) {
    if (issue.severity === 'critical') deduction += 15;
    else if (issue.severity === 'high') deduction += 10;
    else if (issue.severity === 'medium') deduction += 5;
    else if (issue.severity === 'low') deduction += 2;
  }

  const healthScore = Math.max(10, Math.min(100, 100 - deduction));

  return {
    healthScore,
    issues,
    passedChecksCount: passedChecks,
    totalChecksCount: totalChecks,
  };
}

/**
 * Extracts signals from an HTML string using lightweight string / regex methods
 */
export function parseHtmlSignals(html: string): MetaTagCheckResult {
  // 1. Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : undefined;
  const titleLength = title ? title.length : 0;
  const isTitleValid = titleLength >= 30 && titleLength <= 65;

  // 2. Meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const metaDescription = descMatch ? descMatch[1].trim() : undefined;
  const descriptionLength = metaDescription ? metaDescription.length : 0;
  const isDescriptionValid = descriptionLength >= 70 && descriptionLength <= 165;

  // 3. H1 count
  const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  const h1Count = h1Matches ? h1Matches.length : 0;
  const isH1Valid = h1Count === 1;

  // 4. Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i)
    || html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : undefined;
  const hasCanonical = !!canonicalUrl;

  // 5. Viewport
  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);

  // 6. OpenGraph
  const hasOgTitle = /<meta[^>]*property=["']og:title["']/i.test(html);
  const hasOgImage = /<meta[^>]*property=["']og:image["']/i.test(html);

  // 7. Images
  const imgTags = html.match(/<img[^>]+>/gi) || [];
  const totalImages = imgTags.length;
  let imagesWithAlt = 0;
  for (const img of imgTags) {
    if (/alt=["'][^"']+["']/i.test(img)) {
      imagesWithAlt++;
    }
  }
  const altCoveragePercent = totalImages === 0 ? 100 : Math.round((imagesWithAlt / totalImages) * 100);

  // 8. Schema JSON-LD
  const hasSchema = /<script[^>]*type=["']application\/ld\+json["']/i.test(html);
  const schemaTypes: string[] = [];
  if (hasSchema) {
    const jsonMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed['@type']) {
          schemaTypes.push(String(parsed['@type']));
        }
      } catch {
        // ignore parse error in raw script snippet
      }
    }
  }

  // 9. Heading hierarchy
  const h2Count = (html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>[\s\S]*?<\/h3>/gi) || []).length;

  // 10. Links & text metrics
  const aTags = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || [];
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  for (const a of aTags) {
    if (/href=["']https?:\/\//i.test(a)) {
      externalLinksCount++;
    } else if (/href=["'](\/|#|\.)/i.test(a)) {
      internalLinksCount++;
    }
  }

  const strippedText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = strippedText ? strippedText.split(' ').length : 0;
  const scriptsCount = (html.match(/<script/gi) || []).length;
  const stylesheetsCount = (html.match(/<link[^>]*rel=["']stylesheet["']/gi) || []).length;
  const pageSizeKb = Math.max(1, Math.round(html.length / 1024));

  return {
    title,
    titleLength,
    isTitleValid,
    metaDescription,
    descriptionLength,
    isDescriptionValid,
    h1Count,
    isH1Valid,
    canonicalUrl,
    hasCanonical,
    hasViewport,
    hasOgTitle,
    hasOgImage,
    totalImages,
    imagesWithAlt,
    altCoveragePercent,
    hasSchema,
    schemaTypes,
    h2Count,
    h3Count,
    internalLinksCount,
    externalLinksCount,
    pageSizeKb,
    wordCount,
    scriptsCount,
    stylesheetsCount,
  };
}
