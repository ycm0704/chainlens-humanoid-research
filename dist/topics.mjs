export const TOPICS=[
 {id:'ramp',label:'量产兑现',question:'人形机器人量产预期，如何传到零部件收入？',conclusion:'整机放量只是起点，客户定点与交付才连接零部件收入。',boundary:'未核实样本公司与Tesla的供货关系；量产规划不作为订单。',claims:['C01','C03','C07','C10'],scenario:'ramp',sample:'ramp',company:'green',chart:'share',nodes:['reducer','rotary','linear','body','deployment'],impacts:{C01:'已有通用产品收入；人形业务占比与客户待验证。',C03:'已有减速器业务；具体人形订单尚需披露。',C07:'Optimus仍处研发与商业化探索阶段。',C10:'同处产业链，不代表已获Tesla定点。'}},
 {id:'cost',label:'关节降本',question:'关节降本，零部件公司的利润一定改善吗？',conclusion:'规模化可能降低成本，利润仍取决于售价、良率和产品组合。',boundary:'没有BOM与客户合同，不量化降本收益或净利润弹性。',claims:['C01','C02','C03','C04','C06'],scenario:'cost',sample:'cost',company:'green',chart:'share',nodes:['reducer','screw','motor','rotary','linear'],impacts:{C01:'关注ASP与单位成本能否同步改善。',C02:'产品组收入不等于人形关节收入。',C03:'产品组合及稼动率会影响成本。',C04:'小批量供应不代表人形应用放量。',C06:'研发能力仍需订单与量产验证。'}},
 {id:'policy',label:'政策落地',question:'产业支持政策，能直接变成机器人公司收入吗？',conclusion:'政策先作用于试点与采购，收入仍需合同、交付和验收。',boundary:'当前展示条件性机制，未接入实时政策或补助资格。',claims:['C01','C03'],scenario:'policy',sample:'policy',company:'green',chart:'path',nodes:['reducer','rotary','body','deployment'],impacts:{C01:'核查适用对象与真实采购订单。',C03:'海外公司适用资格不可直接类推。'}},
 {id:'growth',label:'收入更新',question:'绿的谐波“谐波减速器及金属件”收入增长，距离证明人形放量还缺什么？',conclusion:'产品组增长已有披露，人形应用贡献仍需独立拆分。',boundary:'FY2025更正后年报为更新候选；总产品组增长不作为人形增长。',claims:['C01','C10'],scenario:null,sample:'growth',company:'green',chart:'growth',nodes:['reducer','rotary','body'],impacts:{C01:'产品组名称分别保留；跨年范围及应用贡献仍待核查。',C10:'收入增长也不能反推Tesla供货关系。'}},
 {id:'humanoid',label:'概念核验',question:'人形机器人概念，哪些已有独立收入证据？',conclusion:'零部件商业化、整机研发与需求展望，需要分别判断。',boundary:'当前样本未提供可直接横比的人形业务收入；缺口不等于零收入。',claims:['C07','C08','C09'],scenario:null,sample:'humanoid-revenue',company:'green',chart:'grade',nodes:['body','embodied','deployment'],impacts:{C07:'研发证据，未商业化的披露不能写成确定收入。',C08:'市场展望缺少订单与财务贡献证据。',C09:'需补充人形应用分项收入，不能用集团收入替代。'}}
];
export function topicById(id){return TOPICS.find(t=>t.id===id);}
export function matchTopic(q){
 const foreign=/tesla|特斯拉|hds|harmonic|6324|tsla/i.test(q),green=/绿的|leaderdrive|688017/i.test(q);
 if(/量产/.test(q)&&/预期|传到|传导/.test(q)&&!foreign&&!green)return 'ramp';
 if(/降本/.test(q)&&/利润|关节/.test(q)&&!foreign&&!green)return 'cost';
 if(/政策/.test(q)&&/收入|采购|落地/.test(q)&&!foreign&&!green)return 'policy';
 if(/减速器/.test(q)&&/收入增长|增长/.test(q)&&!foreign)return 'growth';
 if(/人形/.test(q)&&/概念|哪些|独立收入/.test(q)&&!foreign&&!green)return 'humanoid';
 return null;
}
export function topicClaims(topic,data){const all=[...data.claims,...(data.archivedClaims||[])],anchors=all.filter(c=>topic.claims.includes(c.id));return data.claims.filter(c=>anchors.some(a=>a.relationId===c.relationId&&a.metricKey===c.metricKey));}
export function shareSeries(id){
 if(id==='green'){const a=325415663.13/387411303.84*100,b=52593288.84/387411303.84*100;return {source:'GD24',period:'2024-01-01 — 2024-12-31',company:'绿的谐波',rows:[{name:'谐波减速器及金属部件',value:a,kind:'accent',claim:'C01'},{name:'机电一体化产品',value:b,kind:'dark',claim:'C02'},{name:'其他业务',value:100-a-b,kind:'muted',computed:true}]};}
 if(id==='hds')return {source:'HD25',period:'2024-04-01 — 2025-03-31',company:'Harmonic Drive',rows:[{name:'精密减速器',value:76,kind:'accent',claim:'C03'},{name:'机电一体化产品',value:24,kind:'dark',claim:'C05'}]};
 return null;
}
export function topicMetrics(t,data){
 if(t.id==='ramp'||t.id==='cost')return [{label:'谐波减速器及金属部件收入',value:'3.25',unit:'亿元',note:'绿的 · 2024-01-01 — 2024-12-31',claim:'C01'},{label:'占合并收入 · 计算值',value:'84.00',unit:'%',note:'通用产品组 · 非人形专属',claim:'C01'},{label:'人形应用收入占比',value:'尚未拆分',note:'不可用通用产品收入代替',claim:'C09'},{label:t.id==='ramp'?'Tesla 供货关系':'利润影响金额',value:t.id==='ramp'?'待核实':'参数待补',note:t.id==='ramp'?'无可核验客户定点证据':'ASP / 良率 / 成本结构',claim:t.id==='ramp'?'C10':null}];
 if(t.id==='growth')return [{label:'谐波减速器及金属件',value:'4.76',unit:'亿元',note:'回放候选 · 2025-01-01 — 2025-12-31'},{label:'谐波减速器及金属部件',value:'3.25',unit:'亿元',note:'2024-01-01 — 2024-12-31',claim:'C01'},{label:'按所列数值计算增幅',value:'+46.42',unit:'%',note:'非人形机器人收入增幅'},{label:'人形应用增量贡献',value:'仍待拆分',note:'需按应用或客户进一步核查'}];
 if(t.id==='humanoid')return [{label:'Tesla Optimus',value:'C 级',note:'研发证据 · FY2025',claim:'C07'},{label:'HDS 人形需求展望',value:'D 级',note:'市场预期 · 非订单',claim:'C08'},{label:'绿的人形独立收入',value:'未获拆分',note:'E 级 · 非零收入断言',claim:'C09'},{label:'验证下一步',value:'合同与交付',note:'定点 / 验收 / 分项收入'}];
 return [{label:'假设变化',value:'产业支持增加',note:'非当前政策新闻'},{label:'传导中间环节',value:'试点与采购',note:'支持额度不是公司营收'},{label:'政策适用资格',value:'待核查',note:'对象 / 生效 / 支付条件'},{label:'财务观察',value:'订单到回款',note:'验收与收入确认分别核对'}];
}
