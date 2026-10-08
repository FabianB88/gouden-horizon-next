// Separate ground and prop sprites. Placement uses native painting units;
// drawing and collision both project the same dimensions into world units.
import {MODULE_ASSETS as SHARED_ASSETS} from './scenery-catalog.js?v=904';
export const MODULE_ASSETS={...SHARED_ASSETS,'quay-paving':{
 id:'quay-paving',file:'assets/quay-details/stone.webp',size:[474,300],crop:[27,108,474,300],anchor:[.5,.5],category:'floor',footprint:{shape:'diamond'},edgeFeather:.16,matchPainting:'canal',
}};
const pavingHeight=120*MODULE_ASSETS.paving.size[1]/MODULE_ASSETS.paving.size[0];
export const MODULE_LAYOUTS={canal:{scale:1.75,offset:0,pieces:
 // A short repaved connector fits the existing promenade, from Inez to spawn.
 // Adjacent diamonds overlap slightly; these exact pieces supply navigation.
 Array.from({length:6},(_,i)=>({id:'inez-paving-'+i,type:'quay-paving',point:[214+i*36,556+i*36*214/400],width:76}))
},forest:{scale:1.75,offset:1536,pieces:[
 {id:'serre-floor-a',type:'paving',point:[305,505],width:120},
 {id:'serre-floor-b',type:'paving',point:[365,505+pavingHeight/2],width:120},
 {id:'serre-planter',type:'planter',point:[180,420],width:62},
 {id:'serre-lamp',type:'lamp',point:[590,630],height:95}
]}};
export function placeSceneryModule(p,{scale=1,offset=0}={}){
 const asset=MODULE_ASSETS[p.type];if(!asset)throw Error('Unknown scenery asset: '+p.type);
 const size=p.width||p.height? p : asset.defaultPlacement;
 const width=(size.width||size.height*asset.size[0]/asset.size[1])*scale,height=width*asset.size[1]/asset.size[0],floor=asset.category==='floor';
 return {...p,x:(offset+p.point[0])*scale,y:p.point[1]*scale,width,height,rx:floor?0:asset.footprint.rx*width,ry:floor?0:asset.footprint.ry*width,asset,floor,sceneModule:true,paintedOnly:true};
}
const pieces=Object.fromEntries(Object.entries(MODULE_LAYOUTS).map(([area,{scale,offset,pieces}])=>[area,pieces.map(p=>placeSceneryModule(p,{scale,offset}))]));
export const sceneryModules=area=>pieces[area]||[];
export function moduleFloor(piece){return [[-piece.width/2,0],[0,-piece.height/2],[piece.width/2,0],[0,piece.height/2]].map(([dx,dy])=>({x:piece.x+dx,y:piece.y+dy}));}
export function installModuleFloors(areas,world){for(const [id,items]of Object.entries(pieces))for(const piece of items)if(piece.floor)areas[id].nav.push(moduleFloor(piece).map(p=>[p.x/world.width,p.y/world.height]));}
function preparedFloor(renderer,piece,image){
 if(!piece.asset.crop)return image;
 const key=piece.asset.matchPainting?piece.id:piece.type;
 renderer.floorDetails||=new Map();if(renderer.floorDetails.has(key))return renderer.floorDetails.get(key);
 const [sx,sy,w,h]=piece.asset.crop,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(image,sx,sy,w,h,0,0,w,h);const pixels=ctx.getImageData(0,0,w,h),data=pixels.data,paint=renderer.assets[piece.asset.matchPainting];let tint=[1,1,1];
 if(paint){
  const sample=document.createElement('canvas');sample.width=sample.height=10;const sc=sample.getContext('2d',{willReadFrequently:true});sc.drawImage(paint,piece.point[0]-5,piece.point[1]-5,10,10,0,0,10,10);const p=sc.getImageData(0,0,10,10).data,target=[0,0,0],source=[0,0,0];let count=0;
  for(let i=0;i<p.length;i+=4)for(let c=0;c<3;c++)target[c]+=p[i+c]/100;
  for(let i=0;i<data.length;i+=4)if(data[i+3]>200){for(let c=0;c<3;c++)source[c]+=data[i+c];count++;}
  tint=target.map((v,c)=>Math.max(.7,Math.min(1.8,v/(source[c]/Math.max(1,count))*.96)));
 }
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(x+y*w)*4,inside=1-Math.abs((x+.5-w/2)/(w/2))-Math.abs((y+.5-h/2)/(h/2));data[i+3]*=Math.max(0,Math.min(1,inside/piece.asset.edgeFeather));for(let c=0;c<3;c++)data[i+c]*=tint[c];}
 ctx.putImageData(pixels,0,0);renderer.floorDetails.set(key,canvas);return canvas;
}
export function prepareSceneryFloors(renderer){for(const items of Object.values(pieces))for(const piece of items)if(piece.floor&&piece.asset.crop)preparedFloor(renderer,piece,renderer.assets['module-'+piece.type]);}
export function drawSceneryModule(renderer,piece){const image=renderer.assets['module-'+piece.type];if(!image||!renderer.inView(piece.x,piece.y,piece.width,piece.height+20,40))return;renderer.ctx.drawImage(preparedFloor(renderer,piece,image),piece.x-piece.asset.anchor[0]*piece.width,piece.y-piece.asset.anchor[1]*piece.height,piece.width,piece.height);}
