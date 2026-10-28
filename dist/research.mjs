import {safeURL} from './core.mjs?v=humanoid-11';
// Development-time AI drafts; offline replay, not runtime inference.
export const RESEARCH_SAMPLES=[
 {
  "id": "compare",
  "title": "中日减速器公司为何可比？",
  "short": "中日业务对比",
  "summary": "减速器业务存在交集，应用与财年口径仍需拆开。",
  "citations": [
   "C01",
   "C03",
   "C05"
  ],
  "facts": [
   "两家公司均披露减速器与机电一体化产品收入。"
  ],
  "inference": "可比较重合产品的技术与经营驱动；绿的口径含金属部件，HDS覆盖其他下游，且财年、币种、会计准则不同，不能据合并收入排序人形份额。",
  "gaps": [
   "相同型号与应用的收入、ASP及客户结构",
   "同期间、同口径的毛利和产能数据"
  ],
  "watch": "跟踪可比产品、客户与财年差异；补齐数据后再量化横比。",
  "route": "compare"
 },
 {
  "id": "humanoid-revenue",
  "title": "人形机器人概念是否已有真实收入？",
  "short": "人形营收核查",
  "summary": "已有零部件收入与整机研发，尚不能替代人形业务收入。",
  "citations": [
   "C07",
   "C08",
   "C09"
  ],
  "facts": [
   "Tesla披露Bots尚未商业化；HDS有需求展望；绿的样本未单列人形收入。"
  ],
  "inference": "三类证据分别为研发、预期与缺口。不能将研发规划、市场展望或通用零部件收入写成人形机器人确定收入。",
  "gaps": [
   "人形业务独立订单、交付及收入确认",
   "零部件公司与具体整机客户的可核验关系"
  ],
  "watch": "等待正式合同、实际交付及分项营收；证据未升级前保留原等级。",
  "route": "chain"
 },
 {
  "id": "growth",
  "title": "“谐波减速器及金属件”收入增长，距离证明人形放量还缺什么？",
  "short": "增长归因核查",
  "summary": "产品组收入增长不等于人形机器人应用收入增长。",
  "citations": [
   "C01",
   "C10"
  ],
  "facts": [
   "绿的FY2024减速器及金属部件有收入，未核实Tesla直接供货。"
  ],
  "inference": "新增年度收入可验证产品组增长，但不能拆出工业、机床与人形应用的贡献，也不能反推特定客户定点。",
  "gaps": [
   "按应用拆分的收入及增量来源",
   "人形客户、合同与实际交付"
  ],
  "watch": "回放FY2025更正后年报，新增年度产品组观察；未载入原版前不判定更正字段；继续追踪人形应用拆分。",
  "route": "updates"
 },
 {
  "id": "ramp",
  "title": "海外量产预期如何传到零部件收入？",
  "short": "量产兑现路径",
  "summary": "整机交付、供应关系与收入确认是三道独立验证。",
  "citations": [
   "C01",
   "C03",
   "C07",
   "C10"
  ],
  "facts": [
   "样本公司有减速器业务；Tesla在研发Optimus。"
  ],
  "inference": "整机交付若增加，只有技术方案适用且已获定点的供应商才可能受益。当前不确认样本公司为Tesla供应商，不给出确定收入增量。",
  "gaps": [
   "实际整机交付，区别规划产能",
   "定点关系、单机用量、采购份额和确认时点"
  ],
  "watch": "按定点、订单、交付、验收、回款顺序跟踪；技术路线变化时重审。",
  "route": "scenario"
 },
 {
  "id": "cost",
  "title": "关节降本，零部件利润一定改善吗？",
  "short": "关节成本传导",
  "summary": "成本与售价共同变化，放量可能伴随价格竞争。",
  "citations": [
   "C01",
   "C02",
   "C03"
  ],
  "facts": [
   "样本覆盖减速器及机电一体化产品。"
  ],
  "inference": "规模化可能降低单位制造成本；若客户压价更快或良率不足，利润仍可能承压。缺少BOM与合同，暂不输出净利润弹性。",
  "gaps": [
   "BOM、良率、稼动率与产品ASP",
   "客户合同、库存成本和研发费用"
  ],
  "watch": "分别跟踪ASP、单位成本、产品毛利及现金回款。",
  "route": "scenario"
 },
 {
  "id": "policy",
  "title": "产业支持政策能直接变成公司收入吗？",
  "short": "政策落地验证",
  "summary": "试点或补助与客户采购、验收和收入确认并不相同。",
  "citations": [
   "C01",
   "C03"
  ],
  "facts": [
   "减速器产品有既有收入，具体支持政策资格未收录。"
  ],
  "inference": "政策影响是条件性机制推演。先核对政策对象、支付和验收条件，再看采购合同及收入；不能把支持额度当公司营收。",
  "gaps": [
   "具体政策文本、生效与适用资格",
   "合同、验收和支付安排"
  ],
  "watch": "新增政策原文后核查对象，按采购与验收里程碑追踪。",
  "route": "scenario"
 }
];
const HYPOTHESES={compare:['产品功能交集支持定性参照；财务期间与产品范围未对齐前不做量化排名。'],growth:['两个年度产品组范围可比性仍待核查；名称差异不自行消除。','要归因为人形放量，需新增应用拆分或客户合同证据。'],ramp:['海外实际交付增长，且采用相关技术方案。','样本供应商已获定点且能将交付转为确认收入；当前未证实。'],cost:['单位制造成本可能随规模下降，但售价、良率与产品组合也会变化。'],policy:['政策支持能转化为付费采购，且公司满足资格与验收条件；当前未证实。'],'humanoid-revenue':['未来可核验的合同、交付及应用收入拆分能够支持重新判断；当前材料不充分。']};
for(const sample of RESEARCH_SAMPLES)sample.assumptions=HYPOTHESES[sample.id];
export const OFFICIAL_UPDATE={
 "id": "GREEN25_GROUP",
 "company": "green",
 "node": "reducer",
 "concept": "谐波减速器及金属件",
 "grade": "A",
 "text": "FY2025「谐波减速器及金属件」营业收入476,486,798.69元；表中披露同比46.42%。",
 "source": {
  "title": "绿的谐波2025年年度报告（更正后）",
  "publisher": "公司法定披露 · 巨潮资讯",
  "date": "2026-07-10",
  "url": "https://static.cninfo.com.cn/finalpage/2026-07-10/1225418036.PDF"
 },
 "locator": "PDF第37页「主营业务分产品情况」；第185页附注同项为476,486,798.68元，存在0.01元列示差异，保留冲突提示并采用第37页",
 "boundary": "这是FY2024→FY2025跨报告期观察，不代表该收入被更正。2025第37页项目名为“谐波减速器及金属件”，FY2024附注为“谐波减速器及金属部件”；未按人形应用拆分，范围差异仍需核查。",
 "period": "FY2025",
 "quote": "谐波减速器及金属件 476,486,798.69",
 "quoteNote": "第37页表格与换行空白归一化",
 "relationId": "green-product-harmonic-metal",
 "metricKey": "revenue",
 "evidenceCategory": "收入",
 "businessStage": "收入确认",
 "supportDirection": "支持",
 "reviewStatus": "待复核",
 "validity": {
  "conflict": true,
  "superseded": false
 },
 "periodStart": "2025-01-01",
 "periodEnd": "2025-12-31",
 "disclosedName": "谐波减速器及金属件",
 "scope": "原披露产品组；无法拆分人形应用",
 "amount": 476486798.69,
 "currency": "CNY",
 "unit": "元",
 "missingReason": null,
 "sourceVersion": "GD25-corrected-20260710",
 "factVersion": 1,
 "checkedAt": "2026-10-28",
 "ingestedAt": null,
 "reviewer": null,
 "reviewReason": null,
 "gapCheck": null,
 "updateType": "annual",
 "replay": true,
 "supersedes": null
};
export function updateDelta(before=325415663.13,after=476486798.69){if(![before,after].every(Number.isFinite)||before<=0||after<0)throw Error("无效的可比数值");return {before,after,unit:"CNY",percent:(after/before-1)*100};}
export function sampleById(id){return RESEARCH_SAMPLES.find(x=>x.id===id);}
export function dependenciesFor(ids,data,watchNextPeriod=true){return ids.map(id=>{const c=[...data.claims,...(data.archivedClaims||[])].find(x=>x.id===id);return {anchorId:id,relationId:c.relationId,metricKey:c.metricKey,periodStart:c.periodStart,periodEnd:c.periodEnd,watchNextPeriod};});}
export function relatedClaims(ids,data,dependencies=dependenciesFor(ids,data)){return data.claims.filter(c=>dependencies.some(d=>d.relationId===c.relationId&&d.metricKey===c.metricKey&&((d.periodStart===c.periodStart&&d.periodEnd===c.periodEnd)||(d.watchNextPeriod&&c.periodStart>d.periodEnd)))).sort((a,b)=>a.id.localeCompare(b.id));}
export function evidenceSnapshot(ids,data,dependencies){return relatedClaims(ids,data,dependencies).map(c=>({id:c.id,relationId:c.relationId,metricKey:c.metricKey,company:c.company,node:c.node,period:c.period,periodStart:c.periodStart,periodEnd:c.periodEnd,text:c.text,grade:c.grade,source:c.source,locator:c.locator,boundary:c.boundary,amount:c.amount,scope:c.scope,disclosedName:c.disclosedName,evidenceCategory:c.evidenceCategory,businessStage:c.businessStage,supportDirection:c.supportDirection,validity:c.validity,sourceVersion:c.sourceVersion,quote:c.quote||'',sourceMeta:structuredClone(data.sources.find(s=>s.id===c.source))}));}
export function evidenceChanged(record,data){return JSON.stringify(record.snapshot)!==JSON.stringify(evidenceSnapshot(record.citations,data,record.dependencies));}
export function newResearchRecord(sample,data,now=new Date().toISOString()){
 if(!sample||!sample.citations.length||sample.citations.some(id=>![...data.claims,...(data.archivedClaims||[])].some(c=>c.id===id)))throw Error('研究引用不完整');
 const dependencies=dependenciesFor(sample.citations,data,sample.id!=='compare');
 return {id:sample.id,title:sample.title,summary:sample.summary,citations:[...sample.citations],dependencies,assumptions:sample.assumptions.map((text,i)=>({id:sample.id+'-H'+(i+1),text,version:1})),judgment:sample.inference,watch:sample.watch,status:'待复核',version:1,at:now,snapshot:evidenceSnapshot(sample.citations,data,dependencies),revisions:[],review:null};
}
export function reviseResearch(record,{judgment,watch,status,confirmed,decision,reason,reviewer,assumptionsText},data,now=new Date().toISOString()){
 if(confirmed!==true)throw Error('请先核对当前证据并确认');
 if(!['维持原判断','修订判断','暂缓判断'].includes(decision)||!reason?.trim()||!reviewer?.trim())throw Error('需要复核决定、理由与复核人');
 if(!['待复核','跟踪中','已归档'].includes(status)||![judgment,watch].every(v=>typeof v==='string'&&v.trim()&&v.length<=3000))throw Error('请完整填写判断与跟踪指标');
 if(decision==='维持原判断'&&judgment.trim()!==record.judgment)throw Error('维持原判断时应保留原文；修改请选修订判断');
 const assumptions=typeof assumptionsText==='string'?assumptionsText.split('\n').map(x=>x.trim()).filter(Boolean).map((text,i)=>({id:record.id+'-H'+(i+1),text,version:record.assumptions[i]?.text===text?record.assumptions[i].version:(record.assumptions[i]?.version||0)+1})):record.assumptions;if(!assumptions.length||assumptions.length>20||assumptions.some(a=>a.text.length>1000))throw Error('假设需为1–20条，每条最多1000字');
 const previous={at:record.at,version:record.version,judgment:record.judgment,watch:record.watch,status:record.status,snapshot:record.snapshot,dependencies:record.dependencies,assumptions:record.assumptions,review:record.review};
 return {...record,assumptions,judgment:decision==='暂缓判断'?record.judgment:judgment.trim(),watch:watch.trim(),status:decision==='暂缓判断'?'待复核':status,version:record.version+1,at:now,snapshot:evidenceSnapshot(record.citations,data,record.dependencies),review:{decision,reason:reason.trim(),reviewer:reviewer.trim(),at:now},revisions:[...(record.revisions||[]),previous].slice(-10)};
}
export function validateNotebook(x){
 if(!Array.isArray(x)||x.length>50)throw Error('研究台账格式无效');const seen=new Set();
 for(const r of x){if(!r||!sampleById(r.id)||seen.has(r.id))throw Error('未知或重复研究');seen.add(r.id);if(!['待复核','跟踪中','已归档'].includes(r.status)||!Number.isInteger(r.version)||r.version<1||!Array.isArray(r.snapshot)||!Array.isArray(r.revisions)||r.revisions.length>10||!Array.isArray(r.dependencies)||r.dependencies.length!==r.citations.length||!Array.isArray(r.assumptions)||JSON.stringify(r.citations)!==JSON.stringify(sampleById(r.id).citations))throw Error('台账字段无效');for(const k of ['title','summary','judgment','watch','at'])if(typeof r[k]!=='string'||!r[k].trim()||r[k].length>3000)throw Error('台账内容无效');for(const f of r.snapshot)if(!f?.relationId||!f.metricKey||!f.sourceMeta||!safeURL(f.sourceMeta.url))throw Error('证据快照无效');if(JSON.stringify(r).length>100000)throw Error('单条研究超限');}return structuredClone(x);
}
export function researchMarkdown(r,data){const c=sampleById(r.id),pending=evidenceChanged(r,data);let out=`# ${r.title}\n\n版本 v${r.version} · ${r.at}\n状态：${pending?'相关事实变化，待复核；原判断保留':r.status}\n模式：开发阶段AI样例离线回放；非在线生成。\n\n## 研究判断\n${r.judgment}\n\n## 跟踪指标\n${r.watch}\n\n## 已保存假设\n${r.assumptions.map(a=>'['+a.id+' v'+a.version+'] '+a.text).join('\n')}\n\n## 事实版本快照\n`;for(const fact of r.snapshot){const s=fact.sourceMeta;out+=`\n[${fact.id}] ${fact.periodStart} — ${fact.periodEnd} · ${fact.grade}\n披露分类：${fact.disclosedName||'未披露 / 不适用'}\n${fact.text}\n原句：${fact.quote||'缺口记录，无肯定原句'}\n范围：${fact.scope}\n边界：${fact.boundary}\n定位：${fact.locator}\n[${s.title}](${s.url})\n`;}
 if(r.review)out+='\n## 本次复核\n'+r.review.decision+' · '+r.review.reviewer+' · '+r.review.at+'\n'+r.review.reason+'\n';out+='\n## 待验证\n'+c.gaps.map(x=>'- '+x).join('\n')+'\n\n非实时数据，不构成投资建议。\n';return out;}
