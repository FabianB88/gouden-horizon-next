import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {AREAS,AREA_BY_ID} from '../src/data.js?v=910';
import {canStand,findPath} from '../src/engine.js?v=910';
import {arenaObstacles} from '../src/arena-layouts.js?v=910';
import {SCENE_ART,SCENE_DETAIL_ASSETS,ART_PALETTES,sceneDetails} from '../src/scene-art.js?v=910';
let contacts=0,placements=0;
assert.equal(Object.keys(SCENE_ART).length,44);
for(const area of AREAS){
 assert(SCENE_ART[area.id]&&ART_PALETTES[SCENE_ART[area.id].palette]);
 assert(!arenaObstacles(area.id).some(p=>p.sceneDetail),'Art must never create a new invisible collider');
 for(const p of sceneDetails(area.id)){
  placements++;const a=SCENE_DETAIL_ASSETS[p.asset],t=area.tiles?.[p.section];
  assert(a&&p.width>0&&p.height>0);
  if(t)assert(p.x>=t.x&&p.x<=t.x+t.width,'Extension art uses its own painting origin');
  for(let i=0;i<9;i++){
   const angle=i*Math.PI/4,rx=i<8?p.rx:0,ry=i<8?p.ry:0;
   assert(!canStand(p.x+Math.cos(angle)*rx,p.y+Math.sin(angle)*ry,0,area.id),p.id+' covers a visible walking route');contacts++;
  }
  if(a.maxSize)for(let ix=-8;ix<=8;ix++)for(let iy=-8;iy<=8;iy++){
   const x=ix/8,y=iy/8;if(x*x+y*y>1)continue;
   assert(!canStand(p.x+x*p.rx,p.y+y*p.ry,0,area.id),p.id+' overlaps a route inside its larger contact footprint');contacts++;
  }
 }
 for(const section of area.tiles?[0,1]:[0])assert.equal(sceneDetails(area.id,section),sceneDetails(area.id,section),'No scene arrays are rebuilt during a frame');
}
const catalog=JSON.parse(readFileSync('assets/scene-details/catalog.json','utf8'));
for(const a of catalog.assets)assert.equal(createHash('sha256').update(readFileSync(a.file)).digest('hex'),a.sha256,'Preserve the original asset bytes');
const baked=JSON.parse(readFileSync('assets/navigation/walkways-v8103.json','utf8'));assert.equal(findPath.install(baked),24,'Art must preserve every baked route fingerprint');
console.log('PASS all44 area profiles, '+placements+' placements, '+contacts+' off-path ground-contact samples, original asset provenance and all24 matching navigation records.');
