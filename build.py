"""Build the portable dashboard from its editable JSON data. No dependencies."""
from pathlib import Path
import json
p=Path(__file__).resolve().parent
raw=(p/'ai-tools-data.json').read_text(encoding='utf-8')
data=json.loads(raw)
assert len({t['id'] for t in data['tools']})==len(data['tools']), 'Duplicate tool IDs'
assert len({t['name'] for t in data['tools']})==len(data['tools']), 'Duplicate names'
html=(p/'template.html').read_text(encoding='utf-8').replace('__DATA__',raw.replace('</','<\\/'))
for name in ['index.html','AI-Tools-Dashboard.html']:
 (p/name).write_text(html,encoding='utf-8')
print(f"Built {len(data['tools'])} entries into index.html and AI-Tools-Dashboard.html")
