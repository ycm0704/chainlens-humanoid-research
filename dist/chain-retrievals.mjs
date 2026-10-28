// Actual MCP retrievals, held out of confirmed relationship facts.
export const CHAIN_RETRIEVALS=[
  {
    "id": "moons",
    "company": "moons",
    "title": "摘要单位与来源质量",
    "note": "片段出现二次总结及生成指令文本，且利润单位表述与另一片段不一致；隔离，不进入已确认事实。",
    "state": "待原文核验",
    "tool": "mcp__ifind__search_notice",
    "query": "鸣志电器 2025年年度报告 无刷无齿槽电机 空心杯电机 灵巧手 人形机器人 产品应用与客户认证 业务进展",
    "capturedAt": "2026-10-28",
    "sha256": "02d7a900678fa991280a3ef0604f384032eeaf3e47df9db9d63939fe79928c66",
    "raw": "chain/raw/02d7a900678fa991280a3ef0604f384032eeaf3e47df9db9d63939fe79928c66.json"
  },
  {
    "id": "sanhua",
    "company": "sanhua",
    "title": "研发与送样的适用期间",
    "note": "部分片段位于2026经营计划，不能当作2025已实现订单；检索摘要待核对年报原文。",
    "state": "待原文核验",
    "tool": "mcp__ifind__search_notice",
    "query": "三花智控 2025年年度报告 机器人机电执行器 旋转执行器 直线执行器 研发 量产 订单 客户身份 是否单独披露机器人收入",
    "capturedAt": "2026-10-28",
    "sha256": "d540211e3dd769aff3ebff3c31c8fc012ebced53ce9e6aadd2ef52089b115d4d",
    "raw": "chain/raw/d540211e3dd769aff3ebff3c31c8fc012ebced53ce9e6aadd2ef52089b115d4d.json"
  },
  {
    "id": "tuopu",
    "company": "tuopu",
    "title": "机器人执行器收入边界",
    "note": "返回包含集团财务及业务摘要，未检索到可核对的机器人执行器独立收入。不能用集团收入或成本替代。",
    "state": "待原文核验",
    "tool": "mcp__ifind__search_notice",
    "query": "拓普集团 2025年年度报告 机器人执行器 分产品营业收入及营业成本 机器人执行器收入金额 当前业务阶段 不要用成本项当营业收入",
    "capturedAt": "2026-10-28",
    "sha256": "95bcd04a6e1bead2c615344d1bb1afc432cfddef96da0294dafc684482ab9077",
    "raw": "chain/raw/95bcd04a6e1bead2c615344d1bb1afc432cfddef96da0294dafc684482ab9077.json"
  }
];
