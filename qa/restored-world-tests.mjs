import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {Engine,canStand,findPath} from '../src/engine.js?v=909';
import {AREAS,AREA_BY_ID} from '../src/data.js?v=909';
const baseline='e72fe66863057c6d77b5cabf63df291052cebb78';
const normalize=s=>s.replace(/\?v=\d+/g,'?v=CACHE').replace(/\r\n/g,'\n');
const originalBase=s=>normalize(s).replace(/^\s*prism:\{name:'Prismaboog'.*$/gm,'').replace(/^SPELLS\.(?:volt|cryo)=.*$/gm,'').replace(/^import \{installQuayStairs\}.*\n/m,'').replace(/^installQuayStairs\(AREA_BY_ID.canal,WORLD\);\n/m,'').replace(/^import \{QUAY_DOCK_PROPS,QUAY_STAIR_OBSTACLES\}.*\n/m,'').replace(/^ARENA_LAYOUTS.canal=\[\.\.\.QUAY_DOCK_PROPS.filter\(p=>p.rx>0\),\.\.\.QUAY_STAIR_OBSTACLES\];\n/m,'');
for(const file of ['src/data.js','src/area-sections.js','src/arena-layouts.js','src/visuals.js','src/ui-artwork.js']){
 assert.equal(originalBase(readFileSync(file,'utf8')),originalBase(execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'})),file+' must preserve the original world underneath local additions');
}
assert.equal(execFileSync('git',['diff','--name-only','--diff-filter=DM',baseline,'--','assets/painted','assets/gouden-horizon-key-art.webp'],{encoding:'utf8'}).trim(),'','Original artwork must remain intact');
assert.equal(AREAS.length,44);
const render=readFileSync('src/render.js','utf8');
assert(!render.includes('drawNextGround')&&!render.includes('world-design.js'));
assert(render.includes('downloadMaps(mapFiles')&&render.includes('this.maps.preload('));
const baked=JSON.parse(readFileSync('assets/navigation/walkways-v8103.json','utf8'));
assert.equal(findPath.install(baked),baked.length,'All baked routes must match the restored floors');
for(const [room,parent] of Object.entries({'quay-home':'canal','city-workshop':'highway','forest-herbalist':'forest'})){
 const g=new Engine('tide',749),payload=JSON.parse(g.serialize());
 Object.assign(payload.state,{area:room,mode:'modal',pending:{type:'archive'},lastSafeArea:room});
 payload.state.areas[room]=structuredClone(payload.state.areas.canal);
 Object.assign(payload.state.player,{hp:61,scrap:987});
 Object.assign(payload.state.checkpoint,{area:room,zone:2});
 const restored=Engine.restore(JSON.stringify(payload));
 assert.equal(restored.state.area,parent);assert.equal(restored.state.checkpoint.area,parent);
 assert.equal(restored.state.player.hp,61);assert.equal(restored.state.player.scrap,987);
 assert(canStand(restored.state.player.x,restored.state.player.y,18,parent));
 assert.equal(restored.state.lastSafeArea,parent);assert.equal(restored.state.mode,'playing');
}
assert.equal(AREA_BY_ID.canal.file,'canal-route-wandering-v86.webp');
console.log('PASS original artwork and world definitions restored, '+baked.length+' navigation records matched, all 3 former room saves retain progress.');
