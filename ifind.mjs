// Provider observations are separate from reviewed relationship evidence.
export const FORMAT='chainlens-ifind-v1';
export const CODE_IDS={'688017.SH':'green','002050.SZ':'sanhua','603728.SH':'moons','002472.SZ':'shuanghuan','601689.SH':'tuopu','002896.SZ':'zhongda','688322.SH':'orbbec','300124.SZ':'inovance','9880.HK':'ubtech','09880.HK':'ubtech','TSLA.O':'tsla'};
export const FIELDS={revenue:'营业收入',profit:'归属于母公司所有者的净利润',cash:'经营活动产生的现金流量净额'};
export function numberCell(input){
 const raw=String(input??'').trim();
 if(!raw||/^(--?|N\/A|null|未披露)$/i.test(raw))return {raw,value:null,quantum:null,missingReason:'未获取'};
 const m=raw.replaceAll(',','').match(/^(-?\d+(?:\.\d+)?)(亿|万)?$/);
 if(!m)throw Error('无法识别的数字：'+raw);
 const power=m[2]==='亿'?8:m[2]==='万'?4:0,decimals=(m[1].split('.')[1]||'').length;
 return {raw,value:Number(m[1]+'e'+power),quantum:10**(power-decimals),approximate:!!m[2],missingReason:null};
}
export function unwrap(record){
 const block=record.response?.content?.find(x=>x.type==='text');
 if(!block||record.response.isError)throw Error('MCP 返回错误或无文本');
 const out=JSON.parse(block.text);if(out.code!==1)throw Error(out.msg||'MCP 查询失败');
 return typeof out.data==='string'?JSON.parse(out.data):out.data;
}
export function markdownRows(answer){
 const lines=String(answer||'').split('\n').filter(x=>x.trim().startsWith('|'));
 if(lines.length<2)throw Error('缺少表格');
 const split=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
 const heads=split(lines[0]);if(new Set(heads).size!==heads.length)throw Error('重复列名');
 return lines.slice(2).map(s=>{const cells=split(s);if(cells.length!==heads.length)throw Error('表格列数不一致');return Object.fromEntries(heads.map((h,i)=>[h,cells[i]]));});
}
export function isoDate(s){const x=String(s).replaceAll('-','');if(!/^\d{8}$/.test(x))throw Error('日期无效');const v=x.slice(0,4)+'-'+x.slice(4,6)+'-'+x.slice(6);if(new Date(v).toISOString().slice(0,10)!==v)throw Error('日期无效');return v;}
function field(row,names){return Object.keys(row).find(k=>names.some(n=>k===n+'（单位：元）'));}
export function financialRows(record){
 const body=unwrap(record),rows=markdownRows(body.answer),out=[];
 for(const r of rows){const company=CODE_IDS[r['证券代码']];if(!company)throw Error('未知证券代码 '+r['证券代码']);
  const end=isoDate(r['日期']),year=end.slice(0,4),currency=record.request.market==='A股'?'CNY':r['记账本位币']==='人民币'?'CNY':r['记账本位币']==='美元'?'USD':null;
  if(!currency)continue; // Do not invent currency for blank HK interim rows.
  const values={};for(const [metric,names]of Object.entries({revenue:['营业收入','总营业收入'],profit:['归属于母公司所有者的净利润','归属于母公司股东的净利润'],cash:['经营活动产生的现金流量净额']})){
   const header=field(r,names);values[metric]={...numberCell(header?r[header]:null),header:header||null};
  }
  out.push({id:record.id+':'+company+':'+end,company,ticker:r['证券代码'],name:r['证券简称'],periodStart:year+'-01-01',periodEnd:end,frequency:end.endsWith('12-31')?'annual':'year-to-date',currency,unit:'元',scope:'集团合并',provider:'iFinD MCP',requestId:record.id,values,reviewStatus:'接口观察值 · 未作逐项原文复核'});
 }
 return out;
}
export function annualRows(snapshot,company,year='2025'){return (snapshot?.financials||[]).filter(r=>r.frequency==='annual'&&(!company||r.company===company)&&r.periodEnd.startsWith(year));}
export function quarterlyRows(snapshot,company,year='2025'){
 const rows=(snapshot?.financials||[]).filter(r=>r.company===company&&r.periodEnd.startsWith(year)),ends=['03-31','06-30','09-30','12-31'];
 return ends.map((end,i)=>{
  const current=rows.find(r=>r.periodEnd===year+'-'+end),previous=i?rows.find(r=>r.periodEnd===year+'-'+ends[i-1]):null;
  const values={};for(const key of Object.keys(FIELDS)){const a=current?.values[key],b=previous?.values[key];const valid=a?.value!=null&&(!i||b?.value!=null)&&(!i||current.currency===previous.currency);
   values[key]={value:valid?a.value-(i?b.value:0):null,quantum:valid?a.quantum+(i?b.quantum:0):null,approximate:!!(a?.approximate||b?.approximate),inputs:[current,previous].filter(Boolean).map(r=>({id:r.id,requestId:r.requestId,raw:r.values[key].raw,header:r.values[key].header})),missingReason:valid?null:'未获取连续累计值'};
  }
  return {company,label:year+' Q'+(i+1),periodStart:year+'-'+['01-01','04-01','07-01','10-01'][i],periodEnd:year+'-'+end,currency:current?.currency||null,scope:'集团合并 · 单季度',values,formula:i?'本期累计值 − 上季累计值':'第一季度累计值',requestId:current?.requestId||null};
 });
}
export function chartValue(row,metric,first){
 const v=row.values.revenue.value;if(v==null)return null;
 if(metric==='revenue'){const base=first?.values.revenue.value;return base>0?v/base*100:null;}
 const val=row.values[metric]?.value;return v>0&&val!=null?val/v*100:null;
}
export function linePaths(points,x,y){const out=[];let part=[];for(const p of points){if(p.value==null){if(part.length)out.push(part);part=[];}else part.push([x(p),y(p.value)]);}if(part.length)out.push(part);return out.map(a=>a.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(2)).join(',')).join(' '));}
export function validateSnapshot(s){
 if(s?.format!==FORMAT||!Array.isArray(s.financials)||!Array.isArray(s.requests)||!Array.isArray(s.notices)||!Array.isArray(s.quarantine)||!s.capturedAt)throw Error('iFinD 快照结构无效');
 if(!Number.isFinite(Date.parse(s.capturedAt))||s.financials.length>5000||s.requests.length>100)throw Error('iFinD 快照日期或规模无效');
 const requests=new Set();for(const q of s.requests){if(requests.has(q.id)||!/^[-a-z_]+$/.test(q.id)||!/^[a-f0-9]{64}$/.test(q.sha256)||q.file!=='ifind/raw/'+q.sha256+'.json'||!Array.isArray(q.warnings)||typeof q.request?.query!=='string')throw Error('iFinD 查询来源无效');requests.add(q.id);}
 const ids=new Set();for(const r of s.financials){if(ids.has(r.id)||!Object.values(CODE_IDS).includes(r.company)||!['CNY','USD'].includes(r.currency)||!s.requests.some(q=>q.id===r.requestId))throw Error('快照来源、公司或币种无效');ids.add(r.id);isoDate(r.periodStart);isoDate(r.periodEnd);for(const key of Object.keys(FIELDS)){const c=r.values?.[key];if(!c||(c.value!==null&&!Number.isFinite(c.value))||(c.value!==null&&!(c.quantum>0)))throw Error('快照数值无效');}}
 for(const n of s.notices)if(!Object.values(CODE_IDS).includes(n.company)||!requests.has(n.requestId)||typeof n.title!=='string'||typeof n.snippet!=='string')throw Error('公告来源无效');
 return s;
}
export async function loadSnapshot(fetcher=fetch,previous=null){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
 try{const response=await fetcher('./ifind-snapshot.json',{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('HTTP '+response.status);return {snapshot:validateSnapshot(await response.json()),error:null,stale:false};}
 catch(e){return {snapshot:previous,error:e.name==='AbortError'?'iFinD 快照读取超时':e.message,stale:!!previous};}finally{clearTimeout(timer);}
}
