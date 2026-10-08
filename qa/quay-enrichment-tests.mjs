import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Engine,canStand,inPolygon,findPath,distance} from '../src/engine.js?v=905';
import {sceneryModules,moduleFloor} from '../src/scenery-modules.js?v=905';
import {QUAY_DETAILS,QUAY_DETAIL_ASSETS} from '../src/quay-details.js?v=905';
const tiles=sceneryModules('canal'),surfaces=tiles.map(moduleFloor);
assert.equal(tiles.length,6);assert(tiles.every(t=>t.floor));
let samples=0;
for(let i=1;i<tiles.length;i++){
 const a=tiles[i-1],b=tiles[i],steps=Math.ceil(distance(a,b)/2);
 for(let n=0;n<=steps;n++){
  const x=a.x+(b.x-a.x)*n/steps,y=a.y+(b.y-a.y)*n/steps;
  assert(canStand(x,y,18,'canal'));
  for(let j=0;j<16;j++){const px=x+Math.cos(j*Math.PI/8)*18,py=y+Math.sin(j*Math.PI/8)*18;assert(surfaces.some(poly=>inPolygon(px,py,poly)),'The visible new tiles must support the whole hero, including joins');samples++;}
 }
}
const g=new Engine('tide',357);g.state.world.enemies=[];g.state.world.hazards=[];
const start={x:g.state.player.x,y:g.state.player.y};
for(const route of [tiles.toReversed(),tiles])for(const target of route){
 let frames=0;while(distance(g.state.player,target)>5&&frames++<400){const p=g.state.player,angle=Math.round(Math.atan2((target.y-p.y)/.78,target.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(angle)),y:Math.round(Math.sin(angle))});}
 assert(frames<400,'Keyboard movement stalled at '+target.id);
 if(target===tiles[0])assert.equal(g.nearbyMerchant()?.id,'workshop');
}
assert(distance(g.state.player,start)<10);
for(const p of QUAY_DETAILS){
 assert(!canStand(p.point[0]*1.75,p.point[1]*1.75,0,'canal'),p.id+' must stay off the promenade');
 const a=QUAY_DETAIL_ASSETS[p.type];assert(readFileSync(a.file).length>0);
}
const records=JSON.parse(readFileSync('assets/navigation/walkways-v8103.json','utf8'));assert.equal(findPath.install(records),records.length);
console.log('PASS '+samples+' visible-tile footprint checks, real keyboard route to Inez and back, off-path decoration and matching baked navigation.');
