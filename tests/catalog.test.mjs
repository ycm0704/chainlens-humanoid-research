import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {CATALOG,DOCUMENTS,FUNDS,companyById,filterCompanies,filterDocuments,matchCompanies} from '../dist/catalog.mjs';
import {retrieve,safeURL} from '../dist/core.mjs';
const base=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
test('broader company universe retains primary sources without adding unverified revenue or supplier facts',()=>{
 assert.equal(CATALOG.length,13);assert.equal(new Set(CATALOG.map(c=>c.id)).size,CATALOG.length);assert.equal(CATALOG.filter(c=>c.deep).length,3);
 for(const c of CATALOG){assert(safeURL(c.source));assert(c.sourceTitle&&c.description&&c.basis);assert(c.nodes.every(id=>base.levels.flatMap(l=>l.nodes).some(n=>n.id===id)));if(!c.deep){assert.equal(c.revenue,undefined);assert.equal(c.grade,undefined);}if(c.date)assert(c.date<='2026-10-28');}
 assert.equal(base.companies.length,3);assert.equal(base.claims.length,10);
});
test('company name, code, market, industry and depth filters compose',()=>{
 assert.deepEqual(filterCompanies({q:'三花'}).map(c=>c.id),['sanhua']);assert.deepEqual(filterCompanies({q:'6481'}).map(c=>c.id),['thk']);
 assert(filterCompanies({node:'reducer',market:'日本'}).every(c=>c.market==='日本'&&c.nodes.includes('reducer')));
 assert.equal(filterCompanies({deep:'deep'}).length,3);assert.equal(filterCompanies({q:'no-such-company'}).length,0);
});
test('known extended companies never receive another company’s financial evidence',()=>{
 for(const q of ['三花人形收入','拓普减速器收入增长','鸣志与人形机器人关系','THK和绿的谐波可比吗','优必选已确认收入吗','纳博特斯克机器人订单']){const r=retrieve(q,base);assert.equal(r.claims.length,0);assert(r.profiles.length>0);assert(!r.profiles.includes('green'));}
 const advice=retrieve('推荐股票 三花智控 买入',base);assert(advice.refused);assert.equal(advice.claims.length,0);
 assert(matchCompanies('三花智控').some(c=>c.id==='sanhua'));
});
test('source library separates filings from published research and preserves dates and limited access',()=>{
 assert.equal(filterDocuments({kind:'公告'}).length,6);assert.equal(filterDocuments({kind:'研报'}).length,2);
 assert.deepEqual(filterDocuments({company:'ubtech'}).map(d=>d.id),['D_UB25']);
 for(const d of DOCUMENTS){assert(safeURL(d.url));assert(d.locator&&d.scope&&d.publisher&&d.date);assert(d.companyIds.every(id=>companyById(id)));if(d.kind==='研报')assert(d.research);}
 const d=DOCUMENTS.find(d=>d.id==='D_UB25');assert.equal(d.date,'2025-04-27');assert.equal(d.extraction.stage,'正式订单');assert.equal(d.extraction.amount,null);assert.equal(d.extraction.missingReason,'未披露');assert.match(d.extraction.delivery,/未确认/);assert.match(d.extraction.revenue,/未确认/);
});
test('fund holdings are a dated partial snapshot, never live flow or full portfolio',()=>{
 const f=FUNDS.find(f=>f.id==='robotcn');assert.equal(f.asOf,'2025-06-30');assert.equal(f.holdings.length,2);assert(f.holdings.every(h=>companyById(h.company)&&h.weight>0&&h.weight<100));assert.match(f.holdingsScope,/非完整持仓/);assert.match(f.holdingsScope,/基金资产净值/);
 assert.deepEqual(f.holdings.map(h=>h.weight),[9.93,3.51]);const global=FUNDS.find(f=>f.id==='botz');assert.equal(global.asOf,null);assert.equal(global.holdings.length,0);assert.equal(global.flow,undefined);
});
