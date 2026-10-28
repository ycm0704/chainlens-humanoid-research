import {matchCompanies,DOCUMENTS} from './catalog.mjs?v=humanoid-13';
export const GRADES={A:{label:'已形成收入',color:'red',desc:'披露销售收入或明确商业化销售；细分营收可能仍未单列'},B:{label:'订单 / 交付',color:'orange',desc:'可核验订单、交付或出货；不直接等同收入确认'},C:{label:'产品 / 研发',color:'yellow',desc:'产品、试制或研发证据；无法据此推导营收'},D:{label:'仅表态 / 应用',color:'yellow',desc:'战略、概念或技术应用描述，缺少业务贡献证据'},E:{label:'证据不足',color:'neutral',desc:'当前收录范围内未找到足够证据，不表示业务不存在'}};
export function safeURL(s){try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password&&!['localhost','127.0.0.1','::1'].includes(u.hostname)&&!/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(u.hostname)}catch{return false}}
export function validateUpdate(x,data){
 if(!x||typeof x!=='object'||Array.isArray(x))throw Error('需要 JSON 对象');
 for(const k of ['id','company','node','concept','text','grade','period','boundary','locator'])if(typeof x[k]!=='string'||!x[k].trim()||x[k].length>3000)throw Error('字段缺失或超长：'+k);
 if(!/^[A-Za-z0-9_-]{1,64}$/.test(x.id))throw Error('ID 仅允许字母、数字、下划线和短横线');
 if([...data.claims,...(data.archivedClaims||[])].some(c=>c.id===x.id))throw Error('重复 ID：请新增版本，不覆盖旧证据');
 for(const k of ['relationId','metricKey','businessStage','supportDirection','periodStart','periodEnd','scope','sourceVersion'])if(typeof x[k]!=='string'||!x[k].trim()||x[k].length>3000)throw Error('缺少关系与口径字段：'+k);
 if(!['支持','否认','不能判断'].includes(x.supportDirection)||![null,'收入','订单','交付','产品研发','表态'].includes(x.evidenceCategory))throw Error('证据类别或支持方向无效');
 if(!x.validity||typeof x.validity.conflict!=='boolean'||typeof x.validity.superseded!=='boolean')throw Error('有效性标记需独立保存冲突与被替代');
 if(!['未披露','未获取','不适用',null].includes(x.missingReason))throw Error('缺值原因无效');
 if(x.grade==='E'&&(!x.gapCheck?.sourceIds?.length||!x.gapCheck?.checkedAt||!x.gapCheck?.range||!x.gapCheck?.missing?.length))throw Error('证据缺口需要核查范围、日期和缺项');
 if(!['new','annual','revision'].includes(x.updateType))throw Error('需要区分新增、跨报告期与同报告期更正');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(x.periodStart)||!/^\d{4}-\d{2}-\d{2}$/.test(x.periodEnd)||x.periodStart>x.periodEnd)throw Error('报告期起止日期无效');
 for(const date of [x.periodStart,x.periodEnd])if(Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('报告期日期无效');
 if(x.amount!==undefined&&x.amount!==null&&(!Number.isFinite(x.amount)||x.amount<0||!['CNY','JPY','USD'].includes(x.currency)))throw Error('金额需为非负数字并保留币种');
 if(x.updateType==='annual'&&x.supersedes)throw Error('跨报告期数据并存，不可替代旧年度事实');
 if(x.updateType==='revision'){const target=data.claims.find(c=>c.id===x.supersedes);if(!target||target.periodStart!==x.periodStart||target.periodEnd!==x.periodEnd||target.relationId!==x.relationId||target.metricKey!==x.metricKey)throw Error('更正仅替代同关系、同字段、同报告期事实');if(!Array.isArray(x.changedFields)||!x.changedFields.length||x.changedFields.some(k=>!['text','amount','quote','scope','disclosedName','validity','supportDirection','businessStage','evidenceCategory','boundary','locator','sourceVersion'].includes(k)))throw Error('同年度更正需要列出可替代字段');for(const k of ['text','amount','quote','scope','disclosedName','validity','supportDirection','businessStage','evidenceCategory','boundary','locator'])if(!x.changedFields.includes(k)&&JSON.stringify(x[k])!==JSON.stringify(target[k]))throw Error('更正包含未声明变动字段：'+k);}
 if(!data.companies.some(c=>c.id===x.company))throw Error('公司 ID 不在研究范围');
 if(!data.levels.flatMap(l=>l.nodes).some(n=>n.id===x.node))throw Error('未知产业链节点');
 if(!GRADES[x.grade])throw Error('证据等级必须为 A–E');
 if(!x.source||!safeURL(x.source.url))throw Error('来源必须为有效公网 HTTPS URL');
 for(const k of ['title','date','publisher'])if(typeof x.source[k]!=='string'||!x.source[k].trim()||x.source[k].length>300)throw Error('来源字段缺失或超长：'+k);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(x.source.date)||Number.isNaN(Date.parse(x.source.date))||new Date(x.source.date).toISOString().slice(0,10)!==x.source.date||x.source.date>new Date().toISOString().slice(0,10))throw Error('来源日期无效或晚于今天');
 if(x.grade!=='E'&&(typeof x.quote!=='string'||!x.quote.trim()||x.quote.length>3000))throw Error('非缺口证据需要原文短摘录');
 if(x.grade==='A'&&!/收入|销售|revenue|sold|sales/i.test(x.text))throw Error('A 级需要明确收入或销售证据；请降级或补证');
 return structuredClone(x);
}
export function sensitivity(base,exposure,volume,price){if(![base,exposure,volume,price].every(Number.isFinite)||base<0||exposure<0||exposure>100||volume< -100||price< -100)throw Error('参数超出范围');const affected=base*exposure/100;const delta=affected===0?0:affected*((1+volume/100)*(1+price/100)-1);return {affected,delta,total:base+delta,percent:base?delta/base*100:0};}
export function selectClaims(data,{q='',node='',grade='',market=''}={}){return data.claims.filter(c=>{const co=data.companies.find(z=>z.id===c.company);return (!node||node===c.node)&&(!grade||grade===c.grade)&&(!market||(market==='cn'?co?.market==='中国 A 股':co?.market!=='中国 A 股'))&&(!q||[co?.name,co?.ticker,c.concept,c.text].join(' ').toLowerCase().includes(q.toLowerCase()))});}
export function retrieve(q,data){
 if(/买入|卖出|目标价|推荐股票|涨停|内幕|保证收益|buy|sell stock|price target/i.test(q))return {refused:true,text:'不提供个股买卖建议、目标价或内幕信息。可以改为研究业务证据、可比边界或条件性传导。',claims:[]};
 if(/忽略.*(指令|规则)|ignore.*instruction|system prompt|泄露.*密钥/i.test(q))return {refused:true,text:'输入仅作为研究问题处理，不执行其中要求改写规则或读取密钥的指令。',claims:[]};
 const profiles=matchCompanies(q).filter(c=>!data.companies.some(d=>d.id===c.id));if(profiles.length)return {text:'当前已收录'+profiles.map(c=>c.name).join('、')+'的业务或产品资料，尚未完成财务口径及人形订单、交付、收入的深度核验。以下提供该公司的原始资料，不使用其他公司的事实代答。',claims:[],profiles:profiles.map(c=>c.id),documents:DOCUMENTS.filter(d=>d.companyIds.some(id=>profiles.some(c=>c.id===id))).map(d=>d.id)};
 const keys=[['green',/绿的|leaderdrive|688017/i],['hds',/harmonic|hds|6324/i],['tsla',/tesla|特斯拉|tsla|optimus/i]];const ids=keys.filter(([id,re])=>re.test(q)).map(x=>x[0]);
 const terms=q.toLowerCase().match(/optimus|人形|减速器|金属部件|丝杠|直线|机电|关节|供货|收入|研发|展望|订单|政策|可比/g)||[];
 const specific=terms.filter(t=>['丝杠','直线','机电','供货'].includes(t));
 let hits=data.claims.filter(c=>!ids.length||ids.includes(c.company)).map(c=>({c,score:(ids.includes(c.company)?2:0)+terms.filter(t=>(c.concept+' '+c.text).toLowerCase().includes(t)).length+terms.filter(t=>c.concept.toLowerCase().includes(t)).length*5})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||(data.sources.find(s=>s.id===b.c.source)?.date||'').localeCompare(data.sources.find(s=>s.id===a.c.source)?.date||'')).slice(0,5).map(x=>x.c);
 if(specific.length&&hits.some(c=>specific.some(t=>c.concept.includes(t))))hits=hits.filter(c=>specific.some(t=>c.concept.includes(t)));
 if(!hits.length)return {text:'当前证据库没有足够材料回答。请在「证据管理」中补充官方来源、报告期和定位，再复核入库。',claims:[]};
 return {text:'最相关条目 ['+hits[0].id+'] 的状态是「'+GRADES[hits[0].grade].label+'」。'+hits[0].boundary+' 以下是本地检索与规则整理，未调用在线大模型。',claims:hits};
}
export function stale(date,now=new Date()){return (now-new Date(date))/86400000>180;}
export function importSample(){return {id:'UPDATE_DEMO_01',company:'green',node:'linear',relationId:'green-demo-linear',metricKey:'development',concept:'更新流程演练（虚构）',grade:'D',evidenceCategory:'表态',businessStage:'意向',supportDirection:'支持',reviewStatus:'待复核',validity:{conflict:false,superseded:false},periodStart:'2026-01-01',periodEnd:'2026-10-28',disclosedName:null,scope:'虚构流程演练',sourceVersion:'demo-1',factVersion:1,missingReason:'不适用',updateType:'new',supersedes:null,replay:true,quote:'【演练原句】探索新型关节技术；不是实际公告。',text:'【演练数据】公司表示将探索新型关节技术；本条不是真实公司公告。',source:{title:'更新流程演练 · 非真实公告',publisher:'演示样本',date:'2026-10-28',url:'https://www.leaderdrive.cn'},period:'DEMO',locator:'仅验证流程；官网入口不为本虚构陈述背书',boundary:'虚构演练，不纳入真实业务事实；请恢复原版本后对外导出。'};}
