from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[1]
out=root/'artifacts/demo-frames';out.mkdir(parents=True,exist_ok=True)
font='/System/Library/Fonts/STHeiti Medium.ttc'
scenes=[
('01-home.png','01 / 产品组增长，能证明人形业务放量吗？','保留FY2024与FY2025披露项目原名；产品组增长不等于人形收入增长。',0),
('11-chain.png','02 / 从功能链找到真实业务','3家公司；8项业务或预期关系、2项缺口。结构入口不冒充供应商覆盖。',0),
('02-evidence.png','03 / 事实与出处一起看','研究分类、披露分类、原句、阶段和支持方向分开；每项结论可追溯。',330),
('03-compare.png','04 / 中日可比，也有边界','HDS覆盖2024-04至2025-03；与自然年度不同。产品与财务口径不齐则不排名。',290),
('10-scenario.png','05 / 量产如何传到财务指标','假设交付增长，仍需验证客户定点；路径标注推断、待验证与反向条件。',0),
('04-study.png','06 / 把判断保存为研究记录','开发阶段AI样例明确离线回放；研究保存事实版本、跟踪项与假设。',0),
('05-candidate.png','07 / 历史披露回放，先复核再入库','跨年度观察与同年度更正分开；更正版的存在不证明收入被更正。',0),
('06-review-pending.png','08 / 只提醒相关事实变化','同关系、同字段和适用期间的变化提示待复核；原判断不会自动失效。',0),
('07-maintain.png','09 / 新证据也可以支持维持原判断','本次选择维持判断：产品组增长已有证据，人形应用贡献仍需拆分。',0),
('08-export.png','10 / 复核留理由，生成新版本','简报保留原句、期间、来源和复核决定；旧版仍在，支持导出。',0),
('09-restore.png','11 / 恢复版本，也保留后续历史','恢复产生新的操作记录，保留先前入库、署名和理由；刷新后仍在。',320),
('12-delivery.png','12 / 独立交付，后续可转成公网URL','源码、Git镜像、部署包、测试与AI记录齐备；新公网地址和在线模型待接入。',0)]
W,H=1600,1080
for i,(file,title,cap,top) in enumerate(scenes):
 canvas=Image.new('RGB',(W,H),'#fff');dr=ImageDraw.Draw(canvas)
 dr.rectangle((0,0,W,74),fill='#242424')
 dr.text((30,20),'链证  CHAINLENS  /  人形机器人研究台',font=ImageFont.truetype(font,23),fill='#fff')
 dr.text((W-355,25),'真实界面截图编排 · 96秒',font=ImageFont.truetype(font,17),fill='#d4d4d4')
 shot=Image.open(root/'docs/screenshots'/file).convert('RGB')
 if shot.height/shot.width>0.9:
  height=min(shot.height-top,round(shot.width*0.60));shot=shot.crop((0,top,shot.width,top+height))
 shot.thumbnail((1552,872),Image.Resampling.LANCZOS)
 canvas.paste(shot,((W-shot.width)//2,83+(872-shot.height)//2))
 dr.rectangle((0,975,W,H),fill='#f7f7f7')
 dr.text((32,987),title,font=ImageFont.truetype(font,22),fill='#272727')
 dr.text((32,1024),cap,font=ImageFont.truetype(font,18),fill='#626262')
 dr.rectangle((0,H-5,int(W*(i+1)/12),H),fill='#b88c3b')
 canvas.save(out/f'{i:02d}.png')
print('12 robot demonstration frames ready')
