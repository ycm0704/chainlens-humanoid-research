import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {CHAIN_NODES,FUNCTIONAL_EDGES,TECH_SOURCES,chainNode,chainRelations,chainCoverage,chainExport} from '../dist/chain-research.mjs';
import {chainViewUI,chainRetrievalDetails} from '../dist/chain-ui.mjs';
import {CHAIN_RETRIEVALS} from '../dist/chain-retrievals.mjs';
import {companyById} from '../dist/catalog.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
test('functional taxonomy separates motors, vision and full-hand products',()=>{
 assert.equal(CHAIN_NODES.length,10);assert.deepEqual(new Set(CHAIN_NODES.map(n=>n.id)),new Set(data.levels.flatMap(l=>l.nodes).map(n=>n.id)));
 assert(!companyById('orbbec').nodes.includes('motor'));assert(companyById('orbbec').nodes.includes('sensor'));
 assert.match(chainNode('hand').gap,/完整手/);assert.equal(chainRelations(data,'hand')[0].stage,'部件应用');
 for(const n of CHAIN_NODES){assert(n.question&&n.role&&n.gap);assert.equal(n.variables.length,3);assert(n.variables.every(v=>v.signal&&v.financial&&v.counter));for(const r of n.routes)if(r.source)assert(TECH_SOURCES[r.source]);}
});
test('functional edges have no company or procurement assertion',()=>{
 for(const edge of FUNCTIONAL_EDGES){assert(CHAIN_NODES.some(n=>n.id===edge.from));assert(CHAIN_NODES.some(n=>n.id===edge.to));assert.equal(edge.type,'functional');assert.equal(edge.company,undefined);assert.match(edge.meaning,/不代表.*供货/);}
});
test('coverage counts company-node relations once; gaps do not create supplier membership',()=>{
 const r=chainRelations(data),c=chainCoverage(data);assert.equal(new Set(r.map(x=>x.id)).size,r.length);assert.equal(c.companies,13);assert.equal(c.relationships,r.length);assert.equal(c.deepFacts,7);assert.equal(c.gaps,2);
 assert(!r.some(x=>x.company==='green'&&x.node==='body'));assert(r.every(x=>x.humanRevenue===false&&x.source.url.startsWith('https://')));
});
test('changed or superseded fact cannot silently fall back to claimed historical income',()=>{
 const changed=structuredClone(data);changed.claims=changed.claims.filter(x=>x.id!=='C01');const r=chainRelations(changed,'reducer').find(x=>x.company==='green');assert.equal(r.claimId,null);assert.match(r.stage,/待重核/);assert(!chainViewUI(changed).includes('data-claim="C01"'));
});
test('financial group disclosure, historical period, scope and sources survive export',()=>{
 const x=chainExport(data,'reducer');assert.match(x,/谐波减速器及金属部件/);assert.match(x,/2024-01-01 — 2024-12-31/);assert.match(x,/1223423697/);assert.match(x,/反向条件/);assert.match(x,/非自动订阅/);
 assert.match(chainViewUI(data,{node:'body'}),/证据缺口/);assert.match(chainViewUI(data,{node:'embodied'}),/仅表述/);
});
test('MCP raw retrieval integrity and review status are retained, independently from confirmed facts',()=>{
 assert.equal(CHAIN_RETRIEVALS.length,3);for(const r of CHAIN_RETRIEVALS){const bytes=fs.readFileSync(new URL('../dist/'+r.raw,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sha256);assert.equal(r.state,'待原文核验');assert.match(chainRetrievalDetails(r.id),/不可信指令/);assert.equal(data.claims.filter(c=>c.source===r.id).length,0);}
 const page=chainViewUI(data,{node:'motor',tab:'sources'});assert.match(page,/iFinD 公告增量核查/);assert.match(page,/隔离/);
});
test('empty depth filter explains missing coverage without losing product profiles',()=>{
 const x=chainViewUI(data,{node:'sensor',filter:'facts'});assert.match(x,/尚无此类深度事实/);assert.equal(chainRelations(data,'sensor')[0].company,'orbbec');
});
