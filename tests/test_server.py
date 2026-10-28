import unittest,importlib.util,threading,json,urllib.request,urllib.error
from pathlib import Path
spec=importlib.util.spec_from_file_location('app',Path(__file__).resolve().parents[1]/'server/app.py');app=importlib.util.module_from_spec(spec);spec.loader.exec_module(app)
class Tests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.server=app.ThreadingHTTPServer(('127.0.0.1',0),app.Handler);cls.url='http://127.0.0.1:'+str(cls.server.server_port);threading.Thread(target=cls.server.serve_forever,daemon=True).start()
 @classmethod
 def tearDownClass(cls):cls.server.shutdown();cls.server.server_close()
 def post(self,x,**headers):
  req=urllib.request.Request(self.url+'/api/research',data=json.dumps(x).encode(),headers={'Content-Type':'application/json',**headers})
  try:
   with urllib.request.urlopen(req) as r:return r.status,json.load(r)
  except urllib.error.HTTPError as e:return e.code,json.load(e)
 def test_status(self):
  with urllib.request.urlopen(self.url+'/api/status') as r:self.assertEqual(r.status,200)
 def test_advice(self):self.assertEqual(self.post({'question':'推荐股票','evidence':[{'id':'C01'}]})[0],422)
 def test_untrusted_evidence(self):self.assertEqual(self.post({'question':'研究','evidence':[{'id':'FAKE'}]})[0],422)
 def test_invalid_body(self):self.assertEqual(self.post({'question':{},'evidence':[]})[0],400)
 def test_origin(self):self.assertEqual(self.post({'question':'收入','evidence':[{'id':'C01'}]},Origin='https://evil.example')[0],403)
 def test_invalid_citations(self):
  with self.assertRaises(ValueError):app.check_output({'text':'虚构 [BAD]','citations':['BAD']},['C01'])
 def test_missing_inline_citation(self):
  with self.assertRaises(ValueError):app.check_output({'text':'没有引用','citations':['C01']},['C01'])
 def test_valid_output(self):self.assertEqual(app.check_output({'text':'研究 [C01]','citations':['C01']},['C01'])['mode'],'AI')
 def test_missing_key(self):
  from unittest.mock import patch
  with patch.dict(app.os.environ,{},clear=True):self.assertEqual(self.post({'question':'绿的收入','evidence':[{'id':'C01'}]})[0],503)
 def test_upstream_timeout(self):
  from unittest.mock import patch
  with patch.dict(app.os.environ,{'OPENAI_API_KEY':'test-only','OPENAI_MODEL':'test-only'}),patch.object(app,'call_model',side_effect=TimeoutError()):self.assertEqual(self.post({'question':'绿的收入','evidence':[{'id':'C01'}]})[0],504)
 def test_malformed_model_output(self):
  from unittest.mock import patch
  with patch.dict(app.os.environ,{'OPENAI_API_KEY':'test-only','OPENAI_MODEL':'test-only'}),patch.object(app,'call_model',side_effect=ValueError()):self.assertEqual(self.post({'question':'绿的收入','evidence':[{'id':'C01'}]})[0],502)
if __name__=='__main__':unittest.main(verbosity=2)
