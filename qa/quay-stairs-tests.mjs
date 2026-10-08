import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Engine,canStand,distance,clearLine,findPath} from '../src/engine.js?v=909';
// Independent traces of the painted treads, not a pathfinder's chosen detour.
const routes={
 'eastern court':[[880,530],[878,511],[875,498],[872,483],[868,469],[864,453],[864,433],[890,418]],
 'upper eastern stairs':[[1357,302],[1352,284],[1347,270],[1340,255],[1333,240],[1326,225],[1319,210],[1310,190]],
 'dock stairs':[[816,738],[830,730],[847,711],[862,692],[878,674],[889,654],[895,635]],
};
const records=JSON.parse(readFileSync('assets/navigation/walkways-v8103.json','utf8'));assert.equal(findPath.install(records),records.length);
const treadBands={'eastern court':[465,505],'upper eastern stairs':[220,280],'dock stairs':[665,725]};
let samples=0;
for(const [name,native]of Object.entries(routes)){
 const points=native.map(([x,y])=>({x:x*1.75,y:y*1.75}));
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],d=distance(a,b),steps=Math.ceil(d/2),nx=-(b.y-a.y)/d,ny=(b.x-a.x)/d;
  for(let n=0;n<=steps;n++)for(const offset of [-8,0,8]){const x=a.x+(b.x-a.x)*n/steps+nx*offset,y=a.y+(b.y-a.y)*n/steps+ny*offset;assert(canStand(x,y,18,'canal'),name+' has a blocked tread or landing at '+[x/1.75,y/1.75]);samples++;}
 }
 for(const route of [points,points.toReversed()]){
  const g=new Engine('tide',704),p=g.state.player;g.state.world.enemies=[];g.state.world.hazards=[];Object.assign(p,route[0],{velocity:{x:0,y:0}});
  const clickPath=g.findWalkingPath(p,route.at(-1));assert(clickPath.length,name+' has no click route');
  let previous=p;
  for(const next of clickPath){
   const steps=Math.ceil(distance(previous,next)/3);
   for(let n=0;n<=steps;n++){
    const x=previous.x+(next.x-previous.x)*n/steps,y=previous.y+(next.y-previous.y)*n/steps;
    const nearest=Math.min(...points.slice(1).map((b,i)=>{const a=points[i],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a.x-t*dx,y-a.y-t*dy);}));
    const [lo,hi]=treadBands[name];assert(nearest<(y/1.75>=lo&&y/1.75<=hi?27:60),name+' click route left the painted treads at '+[x/1.75,y/1.75]);assert(canStand(x,y,18,'canal'));
   }
   previous=next;
  }
  for(const target of route.slice(1)){
   const a={x:p.x,y:p.y};assert(clearLine(a,target,'canal',18));let frames=0;
   while(distance(p,target)>4&&frames++<350){const angle=Math.round(Math.atan2((target.y-p.y)/.78,target.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(angle)),y:Math.round(Math.sin(angle))});const dx=target.x-a.x,dy=target.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));assert(Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<9,name+' left the actual treads');}
   assert(frames<350,name+' stalled while walking');
  }
 }
 console.log('PASS painted treads, landings, keyboard and baked click routes both ways: '+name);
}
for(const [x,y]of [[800,790],[670,600],[1200,570],[904,479]])assert(!canStand(x*1.75,y*1.75,18,'canal'),'Canal water and the stair planter must remain blocked');
console.log('PASS '+samples+' tread-width samples and water boundaries.');
