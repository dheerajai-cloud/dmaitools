/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ImplementationReport {
  id: string;
  changeId: string;
  timestamp: string;
  targetSite: string;
  targetUrl: string;
  actionTitle: string;
  actionType: 'meta_title' | 'meta_desc' | 'h1_heading' | 'alt_text' | 'schema_markup' | 'robots_txt' | 'canonical';
  whatWasChanged: string;
  whyItWasChanged: string;
  issuesResolved: string[];
  metricsToMonitor: string[];
  expectedImpact: string;
  appliedBy: string;
  previousValue: string;
  appliedValue: string;
  status: 'applied' | 'rolled_back';
  rollbackTimestamp?: string;
}

export interface WebsiteChangeItem {
  id: string;
  siteId: string;
  url: string;
  title: string;
  category: string;
  actionType: 'meta_title' | 'meta_desc' | 'h1_heading' | 'alt_text' | 'schema_markup' | 'robots_txt' | 'canonical';
  previousValue: string;
  proposedValue: string;
  status: 'pending' | 'applied' | 'rolled_back';
  createdAt: string;
  appliedAt?: string;
  report?: ImplementationReport;
}

export class RollbackManager {
  private changes: Map<string, WebsiteChangeItem> = new Map();

  constructor(initialChanges: WebsiteChangeItem[] = []) {
    for (const c of initialChanges) {
      this.changes.set(c.id, { ...c });
    }
  }

  getChanges(): WebsiteChangeItem[] {
    return Array.from(this.changes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getChange(id: string): WebsiteChangeItem | undefined {
    return this.changes.get(id);
  }

  stageChange(item: Omit<WebsiteChangeItem, 'status' | 'createdAt'>): WebsiteChangeItem {
    const newItem: WebsiteChangeItem = {
      ...item,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.changes.set(newItem.id, newItem);
    return newItem;
  }

  applyChange(id: string, appliedBy: string = 'AI Agent (Approved by User)'): { success: boolean; item?: WebsiteChangeItem; error?: string } {
    const item = this.changes.get(id);
    if (!item) {
      return { success: false, error: 'Change item not found' };
    }
    if (item.status === 'applied') {
      return { success: false, error: 'Change has already been applied' };
    }

    const appliedAt = new Date().toISOString();
    const report: ImplementationReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      changeId: item.id,
      timestamp: appliedAt,
      targetSite: item.siteId,
      targetUrl: item.url,
      actionTitle: item.title,
      actionType: item.actionType,
      whatWasChanged: `Updated ${item.actionType.replace('_', ' ')} from "${item.previousValue || '(empty)'}" to "${item.proposedValue}"`,
      whyItWasChanged: `Resolved critical SEO warning on ${item.url} to optimize search bot indexation, semantic clarity, and CTR.`,
      issuesResolved: [`Fixed ${item.actionType} deficiency on ${item.url}`],
      metricsToMonitor: [
        'Google Search Console: Organic Impressions & CTR for target query',
        'Google Search Console: Indexing & crawl coverage status',
        'Google Analytics 4: Landing page organic sessions & bounce rate',
      ],
      expectedImpact: '+12% to +28% CTR improvement and resolved validation alerts in Search Console.',
      appliedBy,
      previousValue: item.previousValue,
      appliedValue: item.proposedValue,
      status: 'applied',
    };

    const updated: WebsiteChangeItem = {
      ...item,
      status: 'applied',
      appliedAt,
      report,
    };

    this.changes.set(id, updated);
    return { success: true, item: updated };
  }

  rollbackChange(id: string): { success: boolean; item?: WebsiteChangeItem; error?: string } {
    const item = this.changes.get(id);
    if (!item) {
      return { success: false, error: 'Change item not found' };
    }
    if (item.status !== 'applied') {
      return { success: false, error: 'Cannot rollback a change that is not currently applied' };
    }

    const rolledBackAt = new Date().toISOString();
    const updatedReport: ImplementationReport | undefined = item.report
      ? {
          ...item.report,
          status: 'rolled_back',
          rollbackTimestamp: rolledBackAt,
        }
      : undefined;

    const rolledBackItem: WebsiteChangeItem = {
      ...item,
      status: 'rolled_back',
      report: updatedReport,
    };

    this.changes.set(id, rolledBackItem);
    return { success: true, item: rolledBackItem };
  }
}
