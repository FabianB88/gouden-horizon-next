import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Engine,canStand,inPolygon,findPath,distance} from '../src/engine.js?v=910';
import {sceneryModules,moduleFloor} from '../src/scenery-modules.js?v=910';
import {QUAY_DETAILS,QUAY_DETAIL_ASSETS,QUAY_RIPPLES} from '../src/quay-details.js?v=910';
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
const boat=QUAY_DETAILS.find(p=>p.water),a=QUAY_DETAIL_ASSETS[boat.type];
// Entire boat drawing remains in the canal, including the maximum bob amplitude.
for(let ix=-4;ix<=4;ix++)for(let iy=-4;iy<=4;iy++){
 const x=boat.point[0]+ix/4*boat.width/2,y=boat.point[1]+iy/4*(boat.width*a.size[1]/a.size[0]/2+1);
 assert(!canStand(x*1.75,y*1.75,0,'canal'),'Boat must never overlap walkable paving');
}
for(const [x,y]of QUAY_RIPPLES)for(let i=0;i<16;i++){
 const px=x+Math.cos(i*Math.PI/8)*22.5,py=y+Math.sin(i*Math.PI/8)*7.5;
 assert(!canStand(px*1.75,py*1.75,0,'canal'),'Animated ripples must stay in water');
}
const records=JSON.parse(readFileSync('assets/navigation/walkways-v8103.json','utf8'));assert.equal(findPath.install(records),records.length);
console.log('PASS '+samples+' visible-tile footprint checks, real keyboard route to Inez and back, off-path decoration, boat/ripple water clearance and matching baked navigation.');
