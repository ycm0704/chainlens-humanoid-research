"""Build platform-neutral source and offline Git downloads; no credentials or Sites identity."""
from pathlib import Path
import zipfile,shutil,tempfile,subprocess
root=Path(__file__).resolve().parents[1];out=root/'dist/deliverables';out.mkdir(parents=True,exist_ok=True)
files=['README.md','部署说明.md','docs/AI使用与验证记录.md','docs/测试说明.md','docs/数据与口径.md','docs/要求覆盖与UX核查.md','docs/产品设计与面试讲解.md','docs/规则回归结果.json','docs/AI样例记录.json','docs/验证结果.json','docs/ChainLens-demo-96s.mp4']
for name in files:shutil.copy2(root/name,out/Path(name).name)
def include(p,media=False):
 rel=p.relative_to(root)
 return p.is_file() and not any(x in rel.parts for x in ['.git','.openai','.vercel','.netlify','__pycache__','artifacts','deliverables','node_modules']) and not (p.suffix in ['.mp4','.pyc','.bundle'] or p.name.startswith('.env')) and (media or 'screenshots' not in rel.parts)
with zipfile.ZipFile(out/'ChainLens-source.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(root.rglob('*')):
  if include(p,True):z.write(p,Path('chainlens')/p.relative_to(root))
with tempfile.TemporaryDirectory(prefix='chainlens-humanoid-git-') as temp:
 mirror=Path(temp)/'chainlens';mirror.mkdir()
 for p in sorted(root.rglob('*')):
  if not include(p):continue
  dest=mirror/p.relative_to(root);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
 def git(*args):return subprocess.run(['git',*args],cwd=mirror,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True).stdout.strip()
 git('init','-b','main');git('add','--all');git('-c','user.name=ChainLens','-c','user.email=chainlens@example.invalid','commit','-m','Humanoid robotics research workbench: evidence, scoped updates and audit')
 git('bundle','create',str(out/'ChainLens-review.bundle'),'--all');sha=git('rev-parse','HEAD')
 (out/'source-provenance.json').write_text(__import__('json').dumps({'type':'offline-review-repository','commit':sha,'remotePush':False,'mediaIncluded':False},indent=2)+'\n')
print('Robot source ZIP and offline Git repository prepared')
