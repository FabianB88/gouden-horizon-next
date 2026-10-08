import assert from 'node:assert/strict';
import {Engine,canStand,findPath,clearLine} from '../src/engine.js?v=910';
import {AREAS,AREA_BY_ID} from '../src/data.js?v=910';
import {NEXT_SCENES} from '../src/world-design.js?v=910';
import {WORLD_ANCHORS} from '../src/world-anchors.js?v=910';
import {NEXT_ROOMS} from '../src/world-interiors.js?v=910';
import {sectionArrival} from '../src/area-sections.js?v=910';
import {setLanguage} from '../src/localization.js?v=910';
import {readFileSync} from 'node:fs';
let samples=0,anchors=0;
const failures=[];
for(const a of AREAS){const scene=NEXT_SCENES[a.id];assert(scene,a.id+' modular scene');
 for(const [index,piece]of scene.pieces.entries()){
  const arrival=index?sectionArrival(a.id,index):WORLD_ANCHORS[a.id]?.spawn||{x:700,y:800};
  if(!canStand(arrival.x,arrival.y,18,a.id))failures.push(a.id+' blocked arrival '+JSON.stringify(arrival));
  for(const lane of piece.lanes){const steps=Math.max(1,Math.ceil(Math.hypot(lane.a.x-lane.b.x,lane.a.y-lane.b.y)/12));for(let i=0;i<=steps;i++){const x=lane.a.x+(lane.b.x-lane.a.x)*i/steps,y=lane.a.y+(lane.b.y-lane.a.y)*i/steps;samples++;if(!canStand(x,y,18,a.id)){failures.push(a.id+' drawn lane blocked at '+Math.round(x)+','+Math.round(y));break;}}}
 }
 for(const p of WORLD_ANCHORS[a.id]?.points||[]){anchors++;if(!canStand(p.x,p.y,18,a.id))failures.push(a.id+' interaction anchor blocked '+p.id);}
}
assert.deepEqual(failures,[]);
for(const [id,room]of Object.entries(NEXT_ROOMS)){
 const g=new Engine();g.unlockTestMode('fabian1');assert(g.testTravel(room.parent));const door=NEXT_SCENES[room.parent].door;assert.equal(door.to,id);assert(canStand(door.x,door.y,18,room.parent));Object.assign(g.state.player,door);assert.equal(g.interaction().type,'nextDoor');assert(g.interact());assert.equal(g.state.area,id);assert.equal(g.state.lastSafeArea,room.parent);
 const parentCamp=JSON.stringify(g.state.areas[room.parent].camp);
 Object.assign(g.state.player,NEXT_SCENES[id].resident);setLanguage('en');assert(g.interact());assert.equal(g.state.pending.body,room.en);g.state.mode='playing';g.state.pending=null;Object.assign(g.state.player,{x:700,y:860});assert(g.interact());assert.equal(g.state.area,room.parent);assert.equal(g.state.player.x,door.x);assert.equal(g.state.player.y,door.y);assert.equal(JSON.stringify(g.state.world.camp),parentCamp,'returning from a house does not relocate the parent trading post');
}
setLanguage('nl');
for(const id of ['forest','skybridge','cooling-refuge']){
 const g=new Engine();g.unlockTestMode('fabian1');g.testTravel(id);g.state.world.outdoor.open=true;const gate=NEXT_SCENES[id].gate,mid={x:(gate.a.x+gate.b.x)/2,y:(gate.a.y+gate.b.y)/2};const from={x:mid.x-65,y:mid.y+12},to={x:mid.x+65,y:mid.y-12};assert(clearLine(from,to,id,18),id+' visible opening');Object.assign(g.state.player,from);for(let i=0;i<100;i++)g.moveEntity(g.state.player,1,-.185);assert(g.state.player.x>mid.x,id+' actual movement crosses the opening');g.state.world.outdoor.open=false;assert(g.outdoorGateBlocks(mid.x,mid.y,18),id+' closed gate');
}
const baked=JSON.parse(readFileSync(new URL('../assets/navigation/walkways-v8103.json',import.meta.url),'utf8'));
assert.equal(findPath.install(baked),baked.length,'every shipped navigation fingerprint matches the scene');
let detours=0;
for(const a of AREAS){for(const obstacle of NEXT_SCENES[a.id].solids.filter(p=>!p.fence)){
 const from={x:obstacle.x-obstacle.rx-60,y:obstacle.y},to={x:obstacle.x+obstacle.rx+60,y:obstacle.y};if(!canStand(from.x,from.y,18,a.id)||!canStand(to.x,to.y,18,a.id))continue;const route=findPath(from,to,a.id,18);assert(route.length,a.id+' route around visible '+obstacle.id);let previous=from;for(const point of route){assert(clearLine(previous,point,a.id,18),a.id+' baked edge clearance');previous=point;}detours++;break;
}}
console.log(JSON.stringify({areas:AREAS.length,drawnRouteSamples:samples,interactionAnchors:anchors,interiors:3,gateCrossings:3,bakedGrids:baked.length,checkedDetours:detours}));

