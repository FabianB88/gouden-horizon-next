import {WORLD_ASSETS} from './world-assets.js?v=910';
import {WORLD_ANCHORS} from './world-anchors.js?v=910';
import {NEXT_ROOMS} from './world-interiors.js?v=910';
import {SECTION_ENTRIES} from './section-content.js?v=910';

// This scene description owns both visible placement and physical ground bases.
// No collision is inherited from an illustration that is no longer displayed.
export const NEXT_SCENES={};
export const GROUND_FILES=Object.fromEntries(['limestone','cobble','earth','basalt','sand','timber'].map(id=>[id,'assets/world-next/ground-'+id+'.webp']));
const garden=/forest|glass$|saltwood|groenkloof|lanternwood|rain-garden|rooftops/;
const coast=/canal|delta|brine|sluice|deepwater|harbor|skybridge/;
const desert=/kilometer|dunes|vault|mirrors/;
const industry=/heat|cooling|condensers|tower|rail|metro/;
const themes={
 garden:{ground:'earth',road:'limestone',edge:'#253c32',accent:'#a9c686',props:['mature-oak','willow-tree','flowering-shrub','fern','moss-rock','glow-mushrooms','fallen-log','tree-stump'],buildings:['greenhouse-building','workshop-building']},
 coast:{ground:'cobble',road:'limestone',edge:'#143e48',accent:'#b6d9d2',props:['willow-tree','reed-clump','storage-barrel','gh_prop_kanaalbolder','lifebuoy-post','fish-crates','mooring-rope','handcart'],buildings:['canal-house-building','cafe-building']},
 desert:{ground:'sand',road:'cobble',edge:'#554633',accent:'#d9bb79',props:['dead-tree','rock-stack','crystal-cluster','field-tent','unlit-firepit','broken-arch','solar-beacon'],buildings:['apothecary-building','workshop-building']},
 industry:{ground:'basalt',road:'limestone',edge:'#233c41',accent:'#c5b48b',props:['transformer','cooling-fan','generator','pressure-valve','cable-reel','tram-signal','gh_prop_regenwatertank','sluice-control'],buildings:['metro-entrance-building','workshop-building']},
 city:{ground:'cobble',road:'limestone',edge:'#263c3c',accent:'#d6bd85',props:['lamp','bench','planter','fountain','street-clock','bike-rack','market-canopy','hand-waterpump'],buildings:['canal-house-building','cafe-building','apothecary-building','workshop-building']},
 interior:{ground:'timber',road:'timber',edge:'#182e33',accent:'#d5b47c',props:[],buildings:[]}
};
export const segmentDistance=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);};
function prop(id,x,y,width,key){
 const asset=WORLD_ASSETS[id],height=width*asset.size[1]/asset.size[0],vegetation=/fern|grass|flower-patch|reed|mushrooms|rope|rug/.test(id),building=asset.category==='building',tree=/tree|oak/.test(id),broad=/bench|crate|fountain|counter|bed$|armchair|table|generator|transformer|rock-stack|moss-rock/.test(id);
 const rx=vegetation?0:width*(building?.37:tree?.08:broad?.43:.27),ry=vegetation?0:building?height*.15:width*(tree?.04:broad?.20:.12);
 return {id:key,asset:id,x,y,width,height,rx,ry,contactY:building?-height*.1:0};
}
function contacts(props){return props.flatMap(p=>!p.rx?[]:p.asset==='broken-arch'?[-1,1].map(side=>({id:p.id+'-leg-'+side,x:p.x+side*p.width*.29,y:p.y,rx:p.width*.09,ry:p.width*.06,height:p.height,worldProp:true})): [{...p,y:p.y+p.contactY,worldProp:true}]);}
export function installNextWorld(areas,world,outdoor){
 for(const area of areas){
  const type=area.interior?'interior':garden.test(area.id)?'garden':industry.test(area.id)?'industry':desert.test(area.id)?'desert':coast.test(area.id)?'coast':'city',theme=themes[type];
  const pieces=area.tiles||[{x:0,y:0,...(area.bounds||world)}],anchor=WORLD_ANCHORS[area.id]||{spawn:{x:490,y:815},points:[]};
  const scene=NEXT_SCENES[area.id]={theme,type,pieces:[],props:[],solids:[],gate:null};
  area.nav=[];
  for(const [index,b]of pieces.entries()){
   const localPoints=anchor.points.filter(p=>p.x>b.x&&p.x<b.x+b.width),southClear=Math.max(anchor.spawn.y,...localPoints.map(p=>p.y));
   const southMargin=type==='coast'?Math.max(24,Math.min(150,b.height-southClear-100)):24;
   const rect={x:b.x+24,y:area.interior?106:24,width:b.width-48,height:b.height-(area.interior?130:24+southMargin)};
   area.nav.push([[rect.x,rect.y],[rect.x+rect.width,rect.y],[rect.x+rect.width,rect.y+rect.height],[rect.x,rect.y+rect.height]].map(([x,y])=>[x/world.width,y/world.height]));
   const points=anchor.points.filter(p=>p.x>b.x+24&&p.x<b.x+b.width-24),arrival=SECTION_ENTRIES[area.id]?.arrival,spawn=index?{x:b.x+(arrival?.[0]||240)*b.width/1536,y:(arrival?.[1]||500)*b.height/1024}:anchor.spawn,center={x:b.x+b.width*.5,y:b.height*.55};
   // Broad, drawn avenues reserve a real clear approach to each service/objective.
   const connect=(a,b)=>{const bend={x:b.x,y:a.y};return [{a,b:bend},{a:bend,b}];};
   let lanes=[...connect(spawn,center),...points.flatMap(p=>connect(center,p))];
   const region=outdoor[area.id];if(region&&index===1){
    const gate={x:(1536+(region.door[0][0]+region.door[1][0])/2)*region.scale,y:(region.door[0][1]+region.door[1][1])/2*region.scale},left={x:gate.x-180,y:gate.y+35},right={x:gate.x+180,y:gate.y-35};
    lanes=[{a:spawn,b:left},{a:left,b:gate},{a:gate,b:right},{a:right,b:center},...points.map(p=>({a:p.x<gate.x?left:center,b:p}))];
   }
   scene.pieces.push({...rect,index,lanes,center});
   const protectedPoints=[spawn,center,...points,...(!index&&area.spawn?[{x:area.spawn[0]*world.width,y:area.spawn[1]*world.height}]:[])];
   const vacant=p=>protectedPoints.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>p.width*.5+95)&&lanes.every(l=>segmentDistance(p,l.a,l.b)>p.rx+112)&&scene.props.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>(p.width+q.width)*.43);
   let n=0;
   if(!area.interior){
    const hub=area.safe||area.safeExplore||['canal','highway','forest','skybridge','metro-refuge','cooling-refuge'].includes(area.id);
    if(hub)for(const [j,[u,v]]of [[.13,.27],[.33,.27],[.53,.25],[.76,.27],[.87,.68],[.15,.82],[.43,.82],[.68,.82]].entries()){
     const p=prop(theme.buildings[(j+index)%theme.buildings.length],b.x+b.width*u,b.height*v,390,area.id+'-house-'+index+'-'+j);if(vacant(p))scene.props.push(p);
    }
    for(let row=0;row<5;row++)for(let col=0;col<8;col++){
     const hash=col*17+row*29+area.id.length*7+index*11,id=theme.props[hash%theme.props.length],width=/oak|willow|dead-tree/.test(id)?235:/transformer|generator|broken-arch/.test(id)?170:100+hash%45;
     const p=prop(id,b.x+95+col*(b.width-190)/7+(hash%81)-40,150+row*(b.height-250)/4+(hash%61)-30,width,area.id+'-'+index+'-'+n++);if(vacant(p)&&p.x+p.width*.45<rect.x+rect.width&&p.y+p.ry<rect.y+rect.height-15)scene.props.push(p);
    }
    if(['city','coast','industry'].includes(type))for(let x=b.x+180;x<b.x+b.width-100;x+=400)for(const sign of [-1,1]){const p=prop('lamp',x,center.y+sign*130,46,area.id+'-lamp-'+index+'-'+x+'-'+sign);if(vacant(p))scene.props.push(p);}
   }
  }
  if(area.interior){const room=NEXT_ROOMS[area.id];for(const [i,id]of room.furniture.entries()){const x=i%2?1080:320,y=260+Math.floor(i/2)*240;scene.props.push(prop(id,x,y,id==='woven-rug'?220:190,area.id+'-furniture-'+i));}scene.resident={x:700,y:420,name:room.resident};}
  scene.solids=contacts(scene.props);
  const region=outdoor[area.id];if(region){
   // A visible fence defines the locked garden, with exactly one usable aperture.
   const scale=region.scale,base=1536*scale,x=region.door[0][0],top={x:base+x*scale,y:24},a={x:base+region.door[0][0]*scale,y:region.door[0][1]*scale},b={x:base+region.door[1][0]*scale,y:region.door[1][1]*scale},bottom={x:b.x,y:pieces[1].height-24};
   scene.gate={a,b,top,bottom};
   region.wild=[[[x,0],region.door[0],region.door[1],[region.door[1][0],1024],[1536,1024],[1536,0]]];
   for(const [i,[start,end]]of [[top,a],[b,bottom]].entries()){
    const count=Math.ceil(Math.hypot(end.x-start.x,end.y-start.y)/18);
    for(let j=0;j<=count;j++)scene.solids.push({id:'fence-'+i+'-'+j,x:start.x+(end.x-start.x)*j/count,y:start.y+(end.y-start.y)*j/count,rx:9,ry:9,height:70,fence:true});
   }
   // Keep the doorway apron clear of independent objects.
   scene.props=scene.props.filter(p=>segmentDistance(p,a,b)>p.width*.65+85&&segmentDistance(p,top,a)>p.width*.5+24&&segmentDistance(p,b,bottom)>p.width*.5+24);
   scene.solids=[...contacts(scene.props),...scene.solids.filter(p=>p.fence)];
  }
  area.file='next-'+area.id+'.webp';
 }
 for(const [id,room]of Object.entries(NEXT_ROOMS)){
  const scene=NEXT_SCENES[room.parent],house=scene.props.find(p=>WORLD_ASSETS[p.asset].category==='building'&&p.x<(scene.pieces[1]?.x||Infinity));
  if(house)scene.door={x:house.x,y:house.y+house.ry+48,to:id,name:room.name,house:house.id};
 }
}
