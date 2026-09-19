"""Check public URLs only. Does not sign in, scrape accounts, or bypass access controls."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request,urlopen
from urllib.parse import urlencode,urlparse
from urllib.error import HTTPError,URLError
import json,time,re,html
p=Path(__file__).parent
d=json.loads((p/'ai-tools-data.json').read_text())
def get(url):
 try:
  with urlopen(Request(url,headers={'User-Agent':'AIAtlas-LinkCheck/1.0'}),timeout=20) as r:
   return {'status':r.status,'finalUrl':r.url,'body':r.read(600000).decode('utf-8','replace')}
 except HTTPError as e:return {'status':e.code,'error':str(e)}
 except Exception as e:return {'status':None,'error':str(e)}
def one(t):
 url=t['video'];r=get('https://www.youtube.com/oembed?'+urlencode({'url':url,'format':'json'}))
 out={'name':t['name'],'url':url,'status':r['status']}
 if r['status']==200:
  try:
   j=json.loads(r['body']);out.update(title=j.get('title'),author=j.get('author_name'),authorUrl=j.get('author_url'),result='metadata_available')
  except Exception:out.update(result='unexpected_response')
 else:out.update(result='unverified',error=r.get('error'))
 return out
def tutorial(t):
 r=get(t['tutorial'])
 title=re.search(r'<title[^>]*>(.*?)</title>',r.get('body',''),re.S|re.I)
 return {'name':t['name'],'url':t['tutorial'],'status':r['status'],
         'finalUrl':r.get('finalUrl'),'title':html.unescape(title.group(1).strip()) if title else None,
         'result':'page_available' if r['status']==200 else 'unverified'}
if __name__=='__main__':
 rows=[t for t in d['tools'] if t.get('video')]
 with ThreadPoolExecutor(max_workers=6) as pool:out=list(pool.map(one,rows))
 with ThreadPoolExecutor(max_workers=4) as pool:pages=list(pool.map(tutorial,[t for t in d['tools'] if t.get('tutorial')]))
 (p/'link-check-report.json').write_text(json.dumps({'checkedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'method':'YouTube public oEmbed metadata and tutorial HTTP GET with page-title inspection; not full video playback. HTTP success does not verify instructional accuracy or region-specific playback.','videos':out,'tutorials':pages},ensure_ascii=False,indent=2)+'\n')
 for x in out:print(x['name'],x['status'],x.get('title',x.get('error','')))
 print('Verified metadata:',sum(x['result']=='metadata_available' for x in out),'of',len(out))
 for x in pages:print('Tutorial:',x['name'],x['status'],x['title'])
