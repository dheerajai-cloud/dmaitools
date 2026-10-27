/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHtmlSignals, evaluateSeoSignals } from './seoAuditRules';

test('parseHtmlSignals parses title, meta description, and H1 correctly', () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Best Ergonomic Office Chairs & Standing Desks | ErgoStore</title>
        <meta name="description" content="Explore top-rated ergonomic office chairs engineered for spinal posture and all-day comfort. Free 2-day delivery across USA." />
        <link rel="canonical" href="https://example.com/chairs" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Best Ergonomic Office Chairs" />
        <meta property="og:image" content="https://example.com/og-chair.jpg" />
        <script type="application/ld+json">
          {"@context": "https://schema.org", "@type": "Product", "name": "ErgoPro"}
        </script>
      </head>
      <body>
        <h1>Premium Ergonomic Office Chairs</h1>
        <p>Welcome to our workspace collection.</p>
        <img src="/chair1.jpg" alt="Ergonomic mesh chair with lumbar support" />
        <img src="/chair2.jpg" alt="Executive leather chair" />
      </body>
    </html>
  `;

  const parsed = parseHtmlSignals(sampleHtml);
  assert.equal(parsed.title, 'Best Ergonomic Office Chairs & Standing Desks | ErgoStore');
  assert.equal(parsed.isTitleValid, true);
  assert.equal(parsed.h1Count, 1);
  assert.equal(parsed.isH1Valid, true);
  assert.equal(parsed.hasCanonical, true);
  assert.equal(parsed.hasViewport, true);
  assert.equal(parsed.hasOgTitle, true);
  assert.equal(parsed.hasOgImage, true);
  assert.equal(parsed.totalImages, 2);
  assert.equal(parsed.imagesWithAlt, 2);
  assert.equal(parsed.altCoveragePercent, 100);
  assert.equal(parsed.hasSchema, true);
  assert.deepEqual(parsed.schemaTypes, ['Product']);
  assert.ok(parsed.wordCount && parsed.wordCount > 5);
  assert.ok(parsed.pageSizeKb && parsed.pageSizeKb >= 1);

  const evaluated = evaluateSeoSignals('https://example.com/chairs', parsed);
  assert.equal(evaluated.issues.length, 0);
  assert.equal(evaluated.healthScore, 100);
  assert.equal(evaluated.passedChecksCount, 8);
});

test('evaluateSeoSignals catches missing critical tags and docks health score', () => {
  const badHtml = `
    <html>
      <head></head>
      <body>
        <p>A bare website with no SEO metadata.</p>
        <img src="/test.png" />
      </body>
    </html>
  `;

  const parsed = parseHtmlSignals(badHtml);
  assert.equal(parsed.title, undefined);
  assert.equal(parsed.h1Count, 0);
  assert.equal(parsed.hasCanonical, false);
  assert.equal(parsed.hasViewport, false);

  const evaluated = evaluateSeoSignals('https://badsite.com', parsed);
  assert.ok(evaluated.issues.length >= 4);
  const criticalIssues = evaluated.issues.filter(i => i.severity === 'critical');
  assert.ok(criticalIssues.length >= 3); // Missing title, missing desc, missing h1, missing viewport
  assert.ok(evaluated.healthScore < 60);
});

test('evaluateSeoSignals catches short titles and multiple H1 tags', () => {
  const shortTitleHtml = `
    <html>
      <head>
        <title>Home</title>
        <meta name="description" content="A valid meta description that has enough characters to fulfill the minimum length guidelines easily." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://example.com" />
        <meta property="og:title" content="Home" />
        <meta property="og:image" content="https://example.com/banner.jpg" />
      </head>
      <body>
        <h1>First Header</h1>
        <h1>Second Header</h1>
      </body>
    </html>
  `;

  const parsed = parseHtmlSignals(shortTitleHtml);
  assert.equal(parsed.titleLength, 4);
  assert.equal(parsed.h1Count, 2);

  const evaluated = evaluateSeoSignals('https://example.com', parsed);
  const titleIssue = evaluated.issues.find(i => i.title.includes('Too Short'));
  const h1Issue = evaluated.issues.find(i => i.title.includes('Multiple H1'));
  assert.ok(titleIssue);
  assert.ok(h1Issue);
});
