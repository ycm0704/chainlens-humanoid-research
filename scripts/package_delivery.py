"""Portable static deployment and complete candidate handoff; hard 30MB limit."""
from pathlib import Path
import zipfile,json,hashlib,datetime,subprocess,tempfile,shutil
root=Path(__file__).resolve().parents[1];dest=root.parent
static=dest/'ChainLens_人形机器人_静态网站部署包.zip'
full=dest/'ChainLens_人形机器人_完整交付包.zip'
with zipfile.ZipFile(static,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted((root/'dist').rglob('*')):
  if p.is_file():z.write(p,p.relative_to(root/'dist'))
with zipfile.ZipFile(full,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(root.rglob('*')):
  rel=p.relative_to(root)
  if not p.is_file() or any(x in rel.parts for x in ['.git','.openai','.vercel','.netlify','node_modules','__pycache__','artifacts']) or p.name.startswith('.env') or p.suffix=='.pyc':continue
  z.write(p,Path('chainlens')/rel)
for pack in [static,full]:
 if pack.stat().st_size>=30*1024*1024:raise RuntimeError(str(pack)+' exceeds 30MB')
 with zipfile.ZipFile(pack) as z:
  if z.testzip():raise RuntimeError('ZIP integrity failed')
with tempfile.TemporaryDirectory(prefix='chainlens-clone-check-') as temp:
 checkout=Path(temp)/'review'
 subprocess.run(['git','clone',str(root/'dist/deliverables/ChainLens-review.bundle'),str(checkout)],check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 for name in ['dist/app.mjs','dist/data.json','dist/core.mjs','dist/evidence.mjs','dist/research.mjs','dist/topics.mjs']:
  if (checkout/name).read_bytes()!=(root/name).read_bytes():raise RuntimeError('Git mirror mismatch: '+name)
manifest={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'industry':'人形机器人','publicURL':None,'hosting':'portable static; not yet deployed','ai':'offline samples; no live model','sourceGitMirror':'dist/deliverables/ChainLens-review.bundle','packages':[{'file':p.name,'bytes':p.stat().st_size,'MiB':round(p.stat().st_size/1024**2,2),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [static,full]],'checks':{'zipIntegrity':True,'offlineGitClone':True,'coreFilesMatch':True,'originalPDFsIncluded':False,'credentialsIncluded':False,'video':'96s H264 screenshot sequence'}}
(dest/'ChainLens_人形机器人_交付清单.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest,ensure_ascii=False,indent=2))
