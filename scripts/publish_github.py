from pathlib import Path
import shutil,subprocess,json,sys
root=Path(__file__).resolve().parents[1]; stage=root/'artifacts/publish-source';web=root/'artifacts/publish-web'
def run(args,cwd=None):return subprocess.run(args,cwd=cwd,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True).stdout.strip()
def copy_tree(src,dest,source=False):
 for p in src.rglob('*'):
  if not p.is_file():continue
  rel=p.relative_to(src)
  if any(x in rel.parts for x in ['.git','.openai','.netlify','.vercel','node_modules','artifacts','__pycache__','链证_光储历史材料']) or p.name.startswith('.env') or p.suffix=='.pyc':continue
  if source and p.suffix in ['.mp4','.bundle','.zip']:continue
  d=dest/rel;d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,d)
def git(args,cwd):return run(['git',*args],cwd)
for path,branch in [(stage,'main'),(web,'gh-pages')]:
 path.mkdir(parents=True,exist_ok=True)
 if not (path/'.git').exists():
  git(['init','-b',branch],path);git(['config','user.name','ChainLens'],path);git(['config','user.email','chainlens@example.invalid'],path);git(['config','credential.https://github.com.helper','!gh auth git-credential'],path)
copy_tree(root,stage,True);copy_tree(root/'dist',web)
for path in [stage,web]:
 git(['add','--all'],path)
 if git(['status','--porcelain'],path):git(['commit','-m','Deliver humanoid research workbench with traceable iFinD visualizations'],path)
repo='ycm0704/chainlens-humanoid-research'
if '--create' in sys.argv:
 print(run(['gh','repo','create',repo,'--public','--description','Humanoid robotics research with evidence, cross-market analysis and iFinD snapshots','--source',str(stage),'--push']),flush=True)
 git(['remote','add','origin','https://github.com/'+repo+'.git'],web)
else:git(['push','origin','main'],stage)
git(['push','origin','gh-pages'],web)
if '--create' in sys.argv:
 payload=root/'artifacts/pages-request.json';payload.write_text(json.dumps({'source':{'branch':'gh-pages','path':'/'}}))
 print(run(['gh','api','--method','POST','repos/'+repo+'/pages','--input',str(payload)]),flush=True)
print('https://ycm0704.github.io/chainlens-humanoid-research/',flush=True)
