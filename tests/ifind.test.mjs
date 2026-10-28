import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {numberCell,markdownRows,financialRows,annualRows,quarterlyRows,chartValue,linePaths,validateSnapshot,loadSnapshot} from '../dist/ifind.mjs';
import {comparisonView,comparisonExport,noticeDetails} from '../dist/ifind-ui.mjs';
const snapshot=JSON.parse(await readFile(new URL('../dist/ifind-snapshot.json',import.meta.url)));
test('iFinD import contains ten companies, two full annual periods, and separate cumulative observations',()=>{
 assert.equal(new Set(snapshot.financials.map(r=>r.company)).size,10);assert.equal(annualRows(snapshot,null,'2024').length,10);assert.equal(annualRows(snapshot).length,10);
 assert(snapshot.financials.some(r=>r.frequency==='year-to-date'));assert(snapshot.financials.every(r=>r.scope==='集团合并'));
});
test('compressed provider numbers preserve raw precision; blank is never zero and losses remain negative',()=>{
 const c=numberCell('5.7071亿');assert.equal(c.value,570710000);assert.equal(c.quantum,10000);assert.equal(c.raw,'5.7071亿');assert(c.approximate);
 assert.equal(numberCell('\t').value,null);assert.equal(numberCell('-62906948.02').value,-62906948.02);assert.equal(numberCell('0').value,0);assert.throws(()=>numberCell('约五亿元'));
 const official=570714025.26;assert(Math.abs(c.value-official)<=c.quantum/2);
});
test('financial parser chooses cumulative revenue rather than adjacent single-quarter columns',async()=>{
 const raw=JSON.parse(await readFile(new URL('../data/ifind/2026-10-28/annual.json',import.meta.url))),rows=financialRows(raw);
 const q=rows.find(r=>r.company==='green'&&r.periodEnd==='2025-09-30');assert(q.values.revenue.value>4e8);assert.equal(q.values.revenue.header,'营业收入（单位：元）');
 assert.throws(()=>markdownRows('|a|a|\n|---|---|\n|1|2|'));assert.throws(()=>markdownRows('|a|b|\n|---|---|\n|1|'));
});
test('quarterly derivation subtracts consecutive cumulative amounts within one year and preserves uncertainty',()=>{
 const q=quarterlyRows(snapshot,'green');assert.equal(q.length,4);assert.equal(q[0].values.revenue.value,98026542);assert(Math.abs(q[3].values.revenue.value-164061075.33)<10000);
 assert.equal(q[3].values.revenue.inputs.length,2);assert.equal(q[3].values.revenue.quantum,20000);assert.equal(q[0].periodStart,'2025-01-01');
 const missing=structuredClone(snapshot);missing.financials=missing.financials.filter(r=>r.periodEnd!=='2025-06-30');const broken=quarterlyRows(missing,'green');assert.equal(broken[1].values.revenue.value,null);assert.equal(broken[2].values.revenue.value,null);assert.notEqual(broken[3].values.revenue.value,null);
});
test('normalization uses own Q1; no missing or zero revenue denominator produces an invented point',()=>{
 const q=quarterlyRows(snapshot,'tuopu');assert.equal(chartValue(q[0],'revenue',q[0]),100);assert(chartValue(q[3],'revenue',q[0])>100);
 assert.equal(quarterlyRows(snapshot,'ubtech')[0].values.revenue.value,null);assert.equal(chartValue(quarterlyRows(snapshot,'hds')[0],'revenue',null),null);
 const row=structuredClone(q[0]);row.values.revenue.value=0;assert.equal(chartValue(row,'profit',row),null);
 assert.equal(linePaths([{i:0,value:1},{i:1,value:null},{i:2,value:-2}],p=>p.i,v=>v).length,2);
});
test('Hong Kong reporting currency is CNY, while Tesla is USD; missing HK quarters are not forward filled',()=>{
 assert.equal(annualRows(snapshot,'ubtech')[0].currency,'CNY');assert.equal(annualRows(snapshot,'tsla')[0].currency,'USD');assert.equal(quarterlyRows(snapshot,'ubtech')[2].values.revenue.value,null);
});
test('all displayed MCP observations have an intact request and content hash',async()=>{
 for(const q of snapshot.requests){const content=await readFile(new URL('../dist/'+q.file,import.meta.url));assert.equal(createHash('sha256').update(content).digest('hex'),q.sha256);const raw=JSON.parse(content);assert.equal(raw.request.query,q.request.query);assert(raw.capturedAt);}
 for(const r of snapshot.financials)assert(snapshot.requests.some(q=>q.id===r.requestId));
});
test('source mismatch is quarantined and ambiguous single-quarter response is not used as financial input',()=>{
 assert.equal(snapshot.quarantine.length,1);assert.equal(snapshot.quarantine[0].requestId,'industry_monthly');assert.match(snapshot.quarantine[0].reason,/产业在线/);assert(!snapshot.financials.some(r=>r.requestId==='quarterly'));
 assert.equal(snapshot.requests.find(q=>q.id==='quarterly').status,'仅保留原始返回');
});
test('announcement summaries retain review status and cannot become original quotes or relationship facts',()=>{
 assert.equal(snapshot.notices.length,7);assert(snapshot.notices.every(n=>n.reviewStatus==='待核对公告原文'&&n.sourceUrl===null));assert(snapshot.notices.some(n=>n.kind==='接口摘要'));
 assert.match(noticeDetails(snapshot,snapshot.notices[0].id),/不自动作为公告原文引句/);assert(!Object.hasOwn(snapshot,'claims'));
});
test('provider read failure preserves an earlier snapshot; malformed response fails closed (fault injection)',async()=>{
 const failed=await loadSnapshot(async()=>{throw Error('offline injected')},snapshot);assert.equal(failed.snapshot,snapshot);assert(failed.stale);assert.match(failed.error,/offline/);
 const bad=await loadSnapshot(async()=>({ok:true,json:async()=>({format:'bad'})}),snapshot);assert.equal(bad.snapshot,snapshot);assert.match(bad.error,/结构/);
 const timeout=await loadSnapshot(async()=>{const e=Error();e.name='AbortError';throw e;},snapshot);assert.match(timeout.error,/超时/);
 const http=await loadSnapshot(async()=>({ok:false,status:503}),null);assert.equal(http.snapshot,null);
});
test('invalid company, currency, source binding and numeric fields reject the candidate snapshot',()=>{
 for(const mutate of [s=>s.financials[0].company='fake',s=>s.financials[0].currency='HKD',s=>s.financials[0].requestId='unknown',s=>s.financials[0].values.revenue.value=Infinity]){const c=structuredClone(snapshot);mutate(c);assert.throws(()=>validateSnapshot(c));}
});
test('financial comparison exposes all companies but does not label group revenue humanoid revenue or rank mismatched periods',()=>{
 const html=comparisonView(snapshot,{pair:['green','hds']});assert.match(html,/2024-04-01 — 2025-03-31/);assert.match(html,/与2025自然年不同期/);assert.match(html,/未获取连续累计值/);assert.match(html,/人形收入或估值排名/);
 assert.equal((html.match(/data-compare-company=/g)||[]).length,10);
 const scope=comparisonView(snapshot,{pair:['tuopu','sanhua'],scope:'humanoid'});assert.match(scope,/尚未核验/);assert(!scope.includes('compare-plot'));
});
test('new-company comparison exports use the chosen companies and retain raw values, period and scope',()=>{
 const text=comparisonExport(snapshot,['sanhua','tuopu']);assert.match(text,/三花智控/);assert.match(text,/拓普集团/);assert.match(text,/310.1174亿/);assert.match(text,/2025-01-01 — 2025-12-31/);assert(!text.includes('Harmonic'));
 assert.match(comparisonExport(snapshot,['green','hds']),/2024-04-01 — 2025-03-31/);
});
test('a malformed financial import never replaces the current snapshot (fault injection)',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'chainlens-ifind-reject-')),path=new URL('../dist/ifind-snapshot.json',import.meta.url),before=await readFile(path,'utf8');
 try{const r=JSON.parse(await readFile(new URL('../data/ifind/2026-10-28/annual.json',import.meta.url)));r.response={content:[{type:'text',text:'not json'}]};await writeFile(join(dir,'annual.json'),JSON.stringify(r));const result=spawnSync(process.execPath,[fileURLToPath(new URL('../scripts/import_ifind.mjs',import.meta.url)),dir],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/保留原有快照/);assert.equal(await readFile(path,'utf8'),before);}
 finally{await rm(dir,{recursive:true,force:true});}
});
