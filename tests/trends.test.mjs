import test from 'node:test';
import assert from 'node:assert/strict';
import {QUARTERS,TREND_SOURCES,TREND_METRICS,quartersFor,quarterChange,lineSegments} from '../dist/trends.mjs';
test('quarter observations reconcile to disclosed annual revenue and retain the exact quarterly scope',()=>{
 for(const [year,total] of [['2024',387411303.84],['2025',570714025.26]]){
  const rows=quartersFor(year);assert.equal(rows.length,4);
  assert(Math.abs(rows.reduce((s,q)=>s+q.values.revenue,0)-total)<.001);
  for(const q of rows){assert.equal(q.scope,'公司合并口径');assert.equal(q.currency,'CNY');assert.equal(q.unit,'元');assert.equal(q.frequency,'quarter');assert(q.periodStart<q.periodEnd);assert.equal(q.periodStart.slice(0,4),year);assert.equal(q.periodEnd.slice(0,4),year);const s=TREND_SOURCES[q.source];assert.match(s.url,/^https:\/\/static.cninfo.com.cn\//);assert.match(s.locator,/第8页/);assert(q.recordedAt);assert.match(q.revisionComparison,/不判断更正字段/);}
 }
 assert.equal(QUARTERS.length,8);assert.equal(TREND_METRICS.length,3);
});
test('changes are computed across chronological adjacent quarters, never fabricated for the first observation',()=>{
 assert.equal(quarterChange('2024-Q1'),null);assert.equal(quarterChange('unknown'),null);
 const q=quarterChange('2025-Q1');assert(Math.abs(q.delta-(98026541.57-111456282.43))<.001);assert(q.percent<0);
 assert.equal(quarterChange('2025-Q1','profit').percent,null);
 assert.match(quarterChange('2025-Q1','profit').reason,/非正值/);
 assert.equal(quarterChange('2025-Q4').percent.toFixed(2),'5.68');
});
test('chart retains negative cash flow and breaks missing data instead of interpolating a fabricated point',()=>{
 const rows=structuredClone(QUARTERS);rows[3].values.cash=null;
 const segments=lineSegments(rows,'cash');assert.equal(segments.length,2);assert.equal(segments.flat().length,7);
 assert(!segments.flat().some(p=>p.id==='2024-Q4'));
 const negative=lineSegments(QUARTERS,'cash').flat().find(p=>p.id==='2024-Q4');
 const zeroY=220-5e7/2.5e8*204;assert(negative.y>zeroY);
 assert.deepEqual(lineSegments([], 'revenue'),[]);
});
