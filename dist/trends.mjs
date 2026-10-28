// Internal observation schema; not an official iFinD field map. Replace the provider
// only after an authorized iFinD connection and indicator definitions are verified.
export const TREND_SOURCES={
 GD24Q:{title:'绿的谐波 2024 年年度报告',url:'https://static.cninfo.com.cn/finalpage/2025-04-30/1223423697.PDF',publishedAt:'2025-04-30',version:'GD24-original',locator:'PDF第8页 · 2024年分季度主要财务数据',status:'公开披露'},
 GD25Q:{title:'绿的谐波 2025 年年度报告（更正后）',url:'https://static.cninfo.com.cn/finalpage/2026-07-10/1225418036.PDF',publishedAt:'2026-07-10',version:'GD25-corrected-20260710',locator:'PDF第8页 · 2025年分季度主要财务数据',status:'历史披露回放'}
};
export const TREND_METRICS=[
 {id:'revenue',name:'营业收入',color:'#bd5b46',short:'收入'},
 {id:'profit',name:'归属于上市公司股东的净利润',color:'#363a40',short:'归母净利润'},
 {id:'cash',name:'经营活动产生的现金流量净额',color:'#b68b3e',short:'经营现金流'}
];
const values=[
 ['2024-Q1',81927118.72,20115815.39,7231393.88],
 ['2024-Q2',90480057.94,16502679.69,-6874889.90],
 ['2024-Q3',103547844.75,22214414.56,49266210.15],
 ['2024-Q4',111456282.43,-2664759.76,-21641252.40],
 ['2025-Q1',98026541.57,20248432.23,17150027.49],
 ['2025-Q2',153385379.12,33167944.12,29646067.91],
 ['2025-Q3',155241029.24,40250972.98,63469396.44],
 ['2025-Q4',164061075.33,30699564.24,41738159.43]
];
export const QUARTERS=values.map(([id,revenue,profit,cash])=>{const year=+id.slice(0,4),q=+id.slice(-1),start=(q-1)*3+1,end=q*3;return {id,label:year+' Q'+q,company:'green',ticker:'688017.SH',scope:'公司合并口径',frequency:'quarter',currency:'CNY',unit:'元',periodStart:`${year}-${String(start).padStart(2,'0')}-01`,periodEnd:`${year}-${String(end).padStart(2,'0')}-${end===3||end===12?'31':'30'}`,source:year===2024?'GD24Q':'GD25Q',values:{revenue,profit,cash},missingReason:null,recordedAt:'2026-10-28',verification:'已核对年报原表',revisionComparison:'未核对原版与更正版的差异，不判断更正字段'};});
export function quartersFor(range='all'){return QUARTERS.filter(q=>range==='all'||q.id.startsWith(range));}
export function quarterChange(id,metric='revenue'){const i=QUARTERS.findIndex(q=>q.id===id);if(i<1)return null;const before=QUARTERS[i-1].values[metric],after=QUARTERS[i].values[metric];return {before,after,delta:after-before,percent:before>0?(after/before-1)*100:null,reason:before<=0?'前期非正值，不计算增长率':null};}
export function lineSegments(rows,metric,{left=55,right=965,top=16,bottom=220,min=-50000000,max=200000000}={}){const segments=[];let current=[];rows.forEach((q,i)=>{const v=q.values[metric];if(v==null||!Number.isFinite(v)){if(current.length)segments.push(current);current=[];return;}current.push({id:q.id,value:v,x:left+i*(right-left)/Math.max(1,rows.length-1),y:bottom-(v-min)/(max-min)*(bottom-top)});});if(current.length)segments.push(current);return segments;}
