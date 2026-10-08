// Small additions anchored to the original painting, in its native pixels.
// Water/planting details never supply walkable floor or invisible obstacles.
import {QUAY_DOCK_PROPS} from './quay-stairs.js?v=905';
export const QUAY_DETAIL_ASSETS={
 lilies:{file:'assets/quay-details/water-lilies.webp',size:[512,368],anchor:[.5,.5]},
 reeds:{file:'assets/quay-details/reed-clump.webp',size:[512,495],anchor:[.5,.92]},
 flowers:{file:'assets/quay-details/flower-patch.webp',size:[477,512],anchor:[.5,.9]},
 barrel:{file:'assets/quay-details/barrel.webp',size:[289,391],crop:[111,56,289,391],anchor:[.5,.91]},
 fish:{file:'assets/quay-details/fish.webp',size:[358,389],crop:[81,71,358,389],anchor:[.5,.89]},
 rope:{file:'assets/quay-details/rope.webp',size:[448,265],crop:[34,42,448,265],anchor:[.5,.5]},
};
export const QUAY_DETAILS=[
 {id:'bridge-lilies',type:'lilies',point:[630,690],width:38},
 {id:'dock-lilies',type:'lilies',point:[544,744],width:31},
 {id:'canal-lilies',type:'lilies',point:[718,774],width:35},
 {id:'bank-reeds',type:'reeds',point:[587,837],width:27},
 {id:'bridge-flowers',type:'flowers',point:[282,536],width:25},
];
export const quayDetailFiles=()=>Object.fromEntries(Object.entries(QUAY_DETAIL_ASSETS).map(([id,a])=>['quay-detail-'+id,a.file]));
export function drawQuayDetails(renderer,state){
 if(state.area!=='canal'||state.player.x>=2688)return;
 for(const p of QUAY_DETAILS){
  const a=QUAY_DETAIL_ASSETS[p.type],image=renderer.assets['quay-detail-'+p.type],x=p.point[0]*1.75,y=p.point[1]*1.75,w=p.width*1.75,h=w*a.size[1]/a.size[0];
  if(image&&renderer.inView(x,y,w,h+15,20))renderer.ctx.drawImage(image,x-a.anchor[0]*w,y-a.anchor[1]*h,w,h);
 }
 for(const p of QUAY_DOCK_PROPS)if(!p.rx)drawQuayProp(renderer,p);
}
export function drawQuayProp(renderer,p){const a=QUAY_DETAIL_ASSETS[p.type],image=renderer.assets['quay-detail-'+p.type],w=p.width*1.75,h=w*a.size[1]/a.size[0];if(!image||!renderer.inView(p.x,p.y,w,h+20,20))return;renderer.ctx.drawImage(image,...a.crop,p.x-a.anchor[0]*w,p.y-a.anchor[1]*h,w,h);}
