export const NODE_CRITERIA={"sensor":"视觉、力觉、触觉分开研究；3D相机证据不替代力传感器证据，感知不归入电机。","reducer": "按旋转减速功能归类，含谐波与RV技术路线。收入含金属部件时保留口径，不直接归成人形应用收入。", "screw": "将旋转运动转为直线运动的丝杠及传动机构；通用行业供应不证明人形客户订单。", "motor": "电机与驱动提供动力和控制；电机部件不等于完整执行器或灵巧手。", "rotary": "旋转执行器集成电机、减速器和驱控等。广义机电一体化收入仅作相关产品组，不当作纯人形关节。", "linear": "丝杠等直线机构与驱控集成形成直线执行器；研发、试制与交付各用对应证据等级。", "hand": "末端灵巧操作及多自由度控制环节；官网产品应用线索见企业库；本版未收录专属订单与收入的深度证据。", "body": "整机本体与全身控制集成；研发不等于商业化。缺口记录不表示该公司已生产整机。", "embodied": "感知、决策与动作模型等能力；具身智能应用比人形整机更广，不把需求展望视为营收。", "deployment": "真实场景试点、验收与付费使用；意向或展示不等于采购与收入，优必选采购合同作为资料线索收录，合同不代表已完成部署或确认收入。"};
export function scenarioForClaim(c){if(!c||!['A','B'].includes(c.grade))return null;return ['reducer','rotary','screw'].includes(c.node)?'ramp':null;}
export function nodeEvidenceLabel(claims){const positive=claims.filter(c=>['A','B','C'].includes(c.grade)).length;return positive?positive+' 条业务/产品证据':claims.length?'待核查 '+claims.length+' 条':'暂未覆盖公司';}
export const COVERAGE=[
{id:'classification',title:'产业链分类、层级与归属依据',status:'已实现',where:'产业链地图 → 分类口径与覆盖 → 证据卡片',view:'chain',detail:'按零部件 × 执行 × 整机分层；证据卡片解释为什么出现于该环节。上下游未完整覆盖，不虚构供应商。'},
{id:'credibility',title:'从有收入到仅表态 / 无证据的可信度',status:'已实现',where:'证据列表 A–E → 查看证据',view:'chain',detail:'状态针对公司×概念关系。A 不代表细分收入单列，E 不代表公司没有该业务。'},
{id:'comparison',title:'中外可比：为什么能比、哪里不能比',status:'已实现',where:'中外公司对比 → 结论 → 四维矩阵',view:'compare',detail:'产品、场景、客户和会计边界分别说明；不做跨币种收入排名。'},
{id:'transmission',title:'外部变化 → 环节 → 公司业务 → 财务指标',status:'已实现',where:'事件传导 → 三类路径 → 指标与反向条件',view:'scenario',detail:'只有量产需求情景提供通用收入试算。政策和成本情景缺少输入时不输出金额；所有路径为假设。'},
{id:'refresh',title:'持续可更新',status:'有边界',where:'证据更新 → 填表 → 核对 → 保存 / 回滚',view:'updates',detail:'支持本机追加版本、备份与恢复；没有自动抓取、云端共享或定时调度。自动采集与调度未实现。'},
{id:'ai',title:'AI 研究产品的实际运行能力',status:'尚未完成真实调用验证',where:'研究助手 / 页面右上角运行状态',view:'chain',detail:'线上是证据检索与规则整理。服务端模型适配已实现，但无已配置凭证，不能当作线上 AI 推理已完成。'},
{id:'delivery',title:'可操作 Web、源代码仓库与 README',status:'本地部署包；公网待部署',where:'本页下载与源码入口',view:'delivery',detail:'按用户要求提供独立部署包及可克隆Git镜像，新公网URL尚待发布。'},
{id:'records',title:'60–180 秒视频、AI 记录、测试与数字溯源',status:'材料已提供',where:'本页演示视频、验证文档和来源说明',view:'delivery',detail:'96 秒截图编排演示。测试区分真实浏览器操作、规则测试与 mock；不宣称在线模型准确率。'}
];
