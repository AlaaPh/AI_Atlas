const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/AI-Tools-Dashboard.html','utf8');
const DATA=JSON.parse(html.match(/<script id="dataset" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const script=html.match(/<script>\n([\s\S]*?)<\/script>/)[1];
const els={};function el(id){return els[id]??=( {value:id==='display'?'cards':'',innerHTML:'',textContent:'',add(){},addEventListener(){},classList:{toggle(){}},focus(){},showModal(){this.open=true},close(){this.open=false}});}
const sandbox={document:{querySelector:s=>el(s.slice(1)),getElementById:id=>id==='dataset'?{textContent:JSON.stringify(DATA)}:el(id),querySelectorAll:()=>[],addEventListener(){},activeElement:{focus(){}}},localStorage:{getItem:()=>null,setItem(){}},Option:function(){},console,Set,Blob,URL,setTimeout};
vm.createContext(sandbox);vm.runInContext(script,sandbox);
function run(s){return vm.runInContext(s,sandbox);}
const total=DATA.tools.length;assert(total>=94);assert.equal(new Set(DATA.tools.map(t=>t.id)).size,total);assert.equal(run('filters().length'),DATA.tools.filter(t=>t.phd).length);run('mode="all"');
assert.equal(run('filters().length'),total);
el('search').value='Qwen3.8';assert.equal(run('filters()[0].name'),'Qwen3.8-27B');assert.equal(run('filters().length'),1);
run('clear();mode="free-local"');assert(run('filters().every(t=>t.local&&free(t))'));
el('openness').value='Open-source software';assert(run('filters().every(t=>t.openness==="Open-source software")'));
run('clear();mode="all"');el('cost').value='Paid / trial';assert(run('filters().every(t=>t.cost==="Paid / trial")'));
run('clear();mode="favorites";saved.add("Qwen3.8-27B")');assert.equal(run('filters().length'),1);
run('mode="all"');el('display').value='table';run('render()');assert.equal((el('results').innerHTML.match(/<tr>/g)||[]).length,total+1);
el('search').value='no-such-tool-xyz';run('render()');assert(el('results').innerHTML.includes('No matching'));
run('openDetail("0")');assert(el('detailBody').innerHTML.includes('ChatGPT'));assert(el('detail').open);
run('tier="Workstation";renderRanks()');assert.equal((el('ranks').innerHTML.match(/rank-row/g)||[]).length,4);assert(el('ranks').innerHTML.indexOf('Qwen3.8')<el('ranks').innerHTML.indexOf('Gemma 4'));
for(const t of DATA.tools){for(const k of ['source','website','youtubeSearch'])assert.equal(new URL(t[k]).protocol,'https:');if(t.video)assert(new URL(t.video).hostname==='www.youtube.com');}
const report=JSON.parse(fs.readFileSync(__dirname+'/link-check-report.json','utf8'));
for(const t of DATA.tools){
 assert(t.video||t.tutorial,`${t.name} needs a direct learning resource`);
 const row=(t.video?report.videos:report.tutorials).find(r=>r.name===t.name);
 assert(row&&row.status===200,`${t.name} needs a successful link check`);
 assert.equal(row.url,t.video||t.tutorial);
 if(t.video){assert.equal(row.title,t.videoTitle);assert(t.videoAuthor&&t.videoVerifiedAt);}
 else{assert.equal(new URL(t.tutorial).protocol,'https:');run(`openDetail(${JSON.stringify(t.id)})`);assert(el('detailBody').innerHTML.includes('Read tutorial'));}
}
assert(!/<script[^>]+src=/.test(html));assert(html.includes('@media(max-width:760px)'));console.log('PASS: directory schema, search, combined source/cost/local filters, favorites, table, empty state, first-card dialog, rank order, HTTPS links, embedded offline assets, responsive breakpoint.');
