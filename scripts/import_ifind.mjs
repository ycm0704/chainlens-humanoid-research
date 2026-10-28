// Normalize agent-exported MCP responses. This is not a browser-to-MCP transport.
import {readFile,readdir,mkdir,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {FORMAT,unwrap,financialRows,validateSnapshot} from '../dist/ifind.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),input=resolve(process.argv[2]||resolve(root,'data/ifind/2026-10-28'));
const snapshot={format:FORMAT,capturedAt:'',provider:'iFinD MCP',mode:'MCP 实际取数 · 本地快照',financials:[],notices:[],requests:[],quarantine:[]};
const rawFiles=[];
for(const name of (await readdir(input)).filter(n=>n.endsWith('.json')).sort()){
 const raw=await readFile(resolve(input,name),'utf8'),record=JSON.parse(raw),hash=createHash('sha256').update(raw).digest('hex');
 if(record.format!=='chainlens-ifind-raw-v1'||!/^[-a-z_]+$/.test(record.id))throw Error('原始记录格式无效');
 snapshot.capturedAt=[snapshot.capturedAt,record.capturedAt].sort().at(-1);
 const request={id:record.id,tool:record.tool,request:record.request,capturedAt:record.capturedAt,sha256:hash,file:'ifind/raw/'+hash+'.json',status:'已收录',warnings:[]};
 snapshot.requests.push(request);rawFiles.push({file:request.file,raw});
 try{
  if(['annual','annual_more','hk_annual','us_annual'].includes(record.id))snapshot.financials.push(...financialRows(record));
  else if(record.tool==='search_notice'){
   const hits=unwrap(record);if(!Array.isArray(hits))throw Error('公告结果非数组');
   for(const [i,h]of hits.entries())if(h['公告标题'])snapshot.notices.push({id:record.id+':'+i,company:record.id==='notice_tuopu'?'tuopu':'green',title:h['公告标题'],date:h['日期'],snippet:h['公告片段内容'],requestId:record.id,kind:/生成|撰写|摘要/.test(h['公告片段内容'])?'接口摘要':'检索片段',reviewStatus:'待核对公告原文',sourceUrl:null});
   request.warnings.push('接口未返回原文链接；摘要不作为原文引句或确认业务的依据');
  }else if(record.id==='industry_monthly'){
   const metadata=unwrap(record).indicator_description?.[0];
   if(metadata?.['数据来源']!=='国家统计局'||metadata?.['终止日期']!=='20260930')throw Error('请求国家统计局 S005566712；返回产业在线且元数据截至2026-08，表格包含2026-09，来源与期间不一致');
  }else if(record.id==='quarterly'){
   request.status='仅保留原始返回';request.warnings.push('单季度参数统一标为第一季度，与多季度行不一致；图表改由累计字段计算，不采用这批单季字段');
  }
 }catch(e){request.status='已隔离';request.warnings.push(e.message);snapshot.quarantine.push({requestId:record.id,reason:e.message,action:'不进入财务图表或证据评级'});}
}
snapshot.financials.sort((a,b)=>a.company.localeCompare(b.company)||a.periodEnd.localeCompare(b.periodEnd));
if(snapshot.quarantine.some(q=>['annual','annual_more','hk_annual','us_annual'].includes(q.requestId))||!snapshot.financials.length)throw Error('财务候选校验失败，保留原有快照，不发布部分替换');
validateSnapshot(snapshot);
const text=JSON.stringify(snapshot,null,2)+'\n',version=createHash('sha256').update(text).digest('hex');
await mkdir(resolve(root,'dist/ifind/raw'),{recursive:true});await mkdir(resolve(root,'data/ifind/versions'),{recursive:true});
for(const f of rawFiles)await writeFile(resolve(root,'dist',f.file),f.raw);
// Versions are immutable; publishing the new current pointer is atomic.
await writeFile(resolve(root,'data/ifind/versions',version+'.json'),text,{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});
await writeFile(resolve(root,'dist/ifind-snapshot.json.tmp'),text);await rename(resolve(root,'dist/ifind-snapshot.json.tmp'),resolve(root,'dist/ifind-snapshot.json'));
console.log(JSON.stringify({version,companies:new Set(snapshot.financials.map(r=>r.company)).size,annual:snapshot.financials.filter(r=>r.frequency==='annual').length,notices:snapshot.notices.length,quarantined:snapshot.quarantine.length}));
