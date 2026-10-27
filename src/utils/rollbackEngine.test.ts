/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { RollbackManager } from './rollbackEngine';

test('RollbackManager stages, applies, generates report, and rolls back cleanly', () => {
  const manager = new RollbackManager();

  // 1. Stage change
  const staged = manager.stageChange({
    id: 'change-1',
    siteId: 'https://myshop.com',
    url: 'https://myshop.com/products/desk',
    title: 'Optimize Product Meta Title',
    category: 'On-Page SEO',
    actionType: 'meta_title',
    previousValue: 'Desk - Buy Online',
    proposedValue: 'Ergonomic Standing Desk | Solid Oak Adjustable Workstation',
  });

  assert.equal(staged.status, 'pending');
  assert.equal(manager.getChanges().length, 1);

  // 2. Apply change
  const applyRes = manager.applyChange('change-1', 'Admin Dheeraj');
  assert.equal(applyRes.success, true);
  assert.equal(applyRes.item?.status, 'applied');
  assert.ok(applyRes.item?.report);
  assert.equal(applyRes.item?.report?.appliedValue, 'Ergonomic Standing Desk | Solid Oak Adjustable Workstation');
  assert.equal(applyRes.item?.report?.status, 'applied');

  // 3. Rollback change
  const rollbackRes = manager.rollbackChange('change-1');
  assert.equal(rollbackRes.success, true);
  assert.equal(rollbackRes.item?.status, 'rolled_back');
  assert.equal(rollbackRes.item?.report?.status, 'rolled_back');
  assert.ok(rollbackRes.item?.report?.rollbackTimestamp);
});

test('RollbackManager handles invalid transitions gracefully', () => {
  const manager = new RollbackManager();
  const applyNonExistent = manager.applyChange('invalid-id');
  assert.equal(applyNonExistent.success, false);

  manager.stageChange({
    id: 'change-2',
    siteId: 'https://myshop.com',
    url: 'https://myshop.com/about',
    title: 'Add Schema',
    category: 'Technical',
    actionType: 'schema_markup',
    previousValue: '',
    proposedValue: '{"@type": "AboutPage"}',
  });

  // Cannot rollback pending change
  const rollbackPending = manager.rollbackChange('change-2');
  assert.equal(rollbackPending.success, false);
});
