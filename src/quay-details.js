// Small additions anchored to the original painting, in its native pixels.
// Water/planting details never supply walkable floor or invisible obstacles.
import {QUAY_DOCK_PROPS} from './quay-stairs.js?v=909';
export const QUAY_DETAIL_ASSETS={
 lilies:{file:'assets/quay-details/water-lilies.webp',size:[512,368],anchor:[.5,.5]},
 reeds:{file:'assets/quay-details/reed-clump.webp',size:[512,495],anchor:[.5,.92]},
 flowers:{file:'assets/quay-details/flower-patch.webp',size:[477,512],anchor:[.5,.9]},
 barrel:{file:'assets/quay-details/barrel.webp',size:[289,391],crop:[111,56,289,391],anchor:[.5,.91]},
 fish:{file:'assets/quay-details/fish.webp',size:[358,389],crop:[81,71,358,389],anchor:[.5,.89]},
 boat:{file:'assets/quay-details/rowing-boat.webp',size:[437,311],crop:[65,23,437,311],anchor:[.5,.5],light:[1.07,1.1,1.05]},
 shrub:{file:'assets/quay-details/flowering-shrub.webp',size:[397,273],crop:[55,76,397,273],anchor:[.5,.9],light:[1.4,1.4,1.08]},
 fern:{file:'assets/quay-details/fern.webp',size:[445,410],crop:[11,48,445,410],anchor:[.5,.86],light:[1.35,1.24,.95]},
 rope:{file:'assets/quay-details/rope.webp',size:[448,265],crop:[34,42,448,265],anchor:[.5,.5]},
};
export const QUAY_DETAILS=[
 {id:'bridge-lilies',type:'lilies',point:[630,690],width:38},
 {id:'dock-lilies',type:'lilies',point:[544,744],width:31},
 {id:'canal-lilies',type:'lilies',point:[718,774],width:35},
 {id:'bank-reeds',type:'reeds',point:[587,837],width:27},
 {id:'canal-rowboat',type:'boat',point:[520,382],width:68,water:true},
 {id:'bridge-fern',type:'fern',point:[588,615],width:24},
 {id:'west-bank-fern',type:'fern',point:[475,500],width:23},
 {id:'east-quay-shrub',type:'shrub',point:[993,711],width:30},
 {id:'greenhouse-shrub',type:'shrub',point:[1316,833],width:27},
 {id:'bridge-flowers',type:'flowers',point:[282,536],width:25},
];
export const quayDetailFiles=()=>Object.fromEntries(Object.entries(QUAY_DETAIL_ASSETS).map(([id,a])=>['quay-detail-'+id,a.file]));
// Fixed water anchors keep animation away from paving, actors and navigation.
export const QUAY_RIPPLES=[[510,430],[548,425],[550,330],[625,330],[610,380],[700,680],[715,730],[740,815],[620,780],[1070,800],[1140,825],[1190,490]];
export function prepareQuayDetails(renderer){
 // Cutouts and sunlit colour are computed once, never during a gameplay frame.
 renderer.quayCutouts=new Map();
 for(const [id,a]of Object.entries(QUAY_DETAIL_ASSETS))if(a.light){
  const tile=document.createElement('canvas');tile.width=a.size[0];tile.height=a.size[1];
  const c=tile.getContext('2d',{willReadFrequently:true});c.drawImage(renderer.assets['quay-detail-'+id],...a.crop,0,0,...a.size);
  const pixels=c.getImageData(0,0,...a.size),data=pixels.data;
  for(let i=0;i<data.length;i+=4)for(let channel=0;channel<3;channel++)data[i+channel]*=a.light[channel];
  c.putImageData(pixels,0,0);renderer.quayCutouts.set(id,tile);
 }
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=64;
 const c=canvas.getContext('2d');c.strokeStyle='#d3f4d6';c.lineWidth=1.5;
 c.beginPath();c.ellipse(64,32,54,20,-.15,.05,Math.PI*.86);c.stroke();
 c.beginPath();c.ellipse(64,32,43,15,-.15,Math.PI*1.05,Math.PI*1.85);c.stroke();
 renderer.quayRipple=canvas;
 renderer.calmQuay=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
}
export function drawQuayDetails(renderer,state){
 if(state.area!=='canal'||state.player.x>=2688)return;
 const c=renderer.ctx,calm=renderer.calmQuay||renderer.settings?.quality==='low',time=state.time;
 if(!calm&&renderer.quayRipple){
  c.save();
  for(let i=0;i<QUAY_RIPPLES.length;i++){
   const [px,py]=QUAY_RIPPLES[i],x=px*1.75,y=py*1.75;
   if(!renderer.inView(x,y,55,30,30))continue;
   const phase=(time*.17+i*.381)%1,w=(20+phase*25)*1.75;
   c.globalAlpha=.16*Math.sin(phase*Math.PI);c.drawImage(renderer.quayRipple,x-w/2,y-w/6,w,w/3);
  }
  c.restore();
 }
 for(const p of QUAY_DETAILS){
  const a=QUAY_DETAIL_ASSETS[p.type],image=renderer.assets['quay-detail-'+p.type],x=p.point[0]*1.75,y=p.point[1]*1.75+(p.water&&!calm?Math.sin(time*.85)*1.2:0),w=p.width*1.75,h=w*a.size[1]/a.size[0];
  if(!image||!renderer.inView(x,y,w,h+15,20))continue;
  if(p.water){c.save();c.globalAlpha=.17;c.fillStyle='#073a37';c.beginPath();c.ellipse(x+2,y+h*.22,w*.41,h*.23,.2,0,Math.PI*2);c.fill();c.restore();}
  const destination=[x-a.anchor[0]*w,y-a.anchor[1]*h,w,h];
  const prepared=renderer.quayCutouts?.get(p.type);
  if(prepared)c.drawImage(prepared,...destination);else if(a.crop)c.drawImage(image,...a.crop,...destination);else c.drawImage(image,...destination);
 }
 for(const p of QUAY_DOCK_PROPS)if(!p.rx)drawQuayProp(renderer,p);
}
export function drawQuayProp(renderer,p){const a=QUAY_DETAIL_ASSETS[p.type],image=renderer.assets['quay-detail-'+p.type],w=p.width*1.75,h=w*a.size[1]/a.size[0];if(!image||!renderer.inView(p.x,p.y,w,h+20,20))return;renderer.ctx.drawImage(image,...a.crop,p.x-a.anchor[0]*w,p.y-a.anchor[1]*h,w,h);}
