import {AREA_BY_ID,worldBounds} from './data.js?v=905';
import {SCENE_ART,SCENE_DETAIL_ASSETS} from './scene-art-data.js?v=908';

export {SCENE_ART,SCENE_DETAIL_ASSETS};
export const ART_PALETTES={
 garden:{light:[1.16,1.18,1.02],mote:'#f1e6a0',shape:'petal',shade:'#20372b35'},
 coast:{light:[1.09,1.16,1.1],mote:'#c9f0ed',shape:'dust',shade:'#133b403a'},
 sun:{light:[1.19,1.12,.95],mote:'#f2d6a0',shape:'dust',shade:'#49342130'},
 grove:{light:[.82,1.02,.92],mote:'#abdccc',shape:'spore',shade:'#102f3245'},
 storm:{light:[.92,1.04,1.15],mote:'#d9ebf6',shape:'dust',shade:'#192b4740'},
 metro:{light:[.78,.94,1.07],mote:'#a8d5df',shape:'dust',shade:'#10293640'},
 ember:{light:[1.17,1.03,.89],mote:'#f6b671',shape:'ember',shade:'#452a2438'},
};
const LIGHTS={cyan:'#8cdedb',gold:'#ffce81',pink:'#efb4d5',ember:'#ffac65'};
const geometries=new Map();
const geometry=(id,section=0)=>{const key=id+':'+section;if(!geometries.has(key))geometries.set(key,AREA_BY_ID[id].tiles?.[section]||{x:0,y:0,...worldBounds(id)});return geometries.get(key);};
export function placeSceneDetail(id,p){
 const section=p.section||0,t=geometry(id,section),scale=t.width/1536,a=SCENE_DETAIL_ASSETS[p.asset];
 return {...p,id:id+'-'+section+'-'+p.asset+'-'+p.point.join('-'),area:id,section,palette:SCENE_ART[id].palette,x:t.x+p.point[0]*scale,y:p.point[1]*scale,width:p.width*scale,height:p.width*scale*a.size[1]/a.size[0],rx:p.width*scale*a.rx,ry:p.width*scale*a.ry,sceneDetail:true};
}
const pieces=Object.fromEntries(Object.entries(SCENE_ART).map(([id,s])=>[id,[...s.pieces,...s.extensions||[]].map(p=>placeSceneDetail(id,p))]));
const sections=Object.fromEntries(Object.entries(pieces).flatMap(([id,items])=>[0,1].map(section=>[id+':'+section,items.filter(p=>p.section===section)])));
export const sceneDetails=(id,section=null)=>section===null?(pieces[id]||[]):(sections[id+':'+section]||[]);
export const sceneDetailFiles=()=>Object.fromEntries(Object.entries(SCENE_DETAIL_ASSETS).map(([id,a])=>['scene-detail-'+id,a.file]));
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
function glowTexture(color){
 const image=canvas(128,128),c=image.getContext('2d'),g=c.createRadialGradient(64,64,2,64,64,62);
 g.addColorStop(0,color+'b0');g.addColorStop(.3,color+'55');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(0,0,128,128);return image;
}
export function prepareSceneArt(r){
 const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 r.sceneArtPrepared=new Map();r.sceneArtShadows=new Map();r.sceneArtBytes=0;
 for(const group of Object.values(pieces))for(const p of group){
  const key=p.asset+':'+p.palette;if(r.sceneArtPrepared.has(key))continue;
  const a=SCENE_DETAIL_ASSETS[p.asset],limit=mobile?(a.mobileMaxSize||256):(a.maxSize||384),scale=Math.min(1,limit/Math.max(...a.size)),w=Math.min(limit,Math.ceil(a.size[0]*scale)),h=Math.min(limit,Math.ceil(a.size[1]*scale)),image=canvas(w,h),c=image.getContext('2d',{willReadFrequently:true});
  c.drawImage(r.assets['scene-detail-'+p.asset],...a.crop,0,0,w,h);
  const pixels=c.getImageData(0,0,w,h),data=pixels.data,tint=a.light||ART_PALETTES[p.palette].light;
  for(let i=0;i<data.length;i+=4){if(data[i+3]<12)data[i+3]=0;for(let channel=0;channel<3;channel++)data[i+channel]*=tint[channel];if(a.groundFeather){const edge=Math.min(1,(h-1-Math.floor(i/4/w))/(h*a.groundFeather));data[i+3]*=edge*edge*(3-2*edge);}}
  c.putImageData(pixels,0,0);r.sceneArtPrepared.set(key,image);r.sceneArtBytes+=w*h*4;
  if(a.castShadow){
   const shadow=canvas(w,h),sc=shadow.getContext('2d');sc.drawImage(image,0,0);sc.globalCompositeOperation='source-in';sc.fillStyle='#193124';sc.fillRect(0,0,w,h);
   const softened=canvas(w,h),soft=softened.getContext('2d');soft.filter='blur(3px)';soft.drawImage(shadow,0,0);r.sceneArtShadows.set(key,softened);r.sceneArtBytes+=w*h*4;
  }
 }
 // Keep only the cropped, sized variants after startup; decoded sources can go.
 for(const id of Object.keys(SCENE_DETAIL_ASSETS))delete r.assets['scene-detail-'+id];
 r.artLights=new Map(Object.entries(LIGHTS).map(([id,color])=>[id,glowTexture(color)]));
 r.artShadow=glowTexture('#10242b');
 r.artMotes=new Map();
 for(const [id,p]of Object.entries(ART_PALETTES)){
  const image=canvas(24,24),c=image.getContext('2d');c.fillStyle=p.mote;
  if(p.shape==='petal'){c.beginPath();c.ellipse(12,12,3.5,1.5,-.6,0,Math.PI*2);c.fill();}
  else if(p.shape==='ember'){c.beginPath();c.ellipse(12,12,1.5,3,-.2,0,Math.PI*2);c.fill();}
  else{c.beginPath();c.arc(12,12,p.shape==='spore'?2.2:1.4,0,Math.PI*2);c.fill();}
  r.artMotes.set(id,image);
 }
 r.artReducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
 // Fixed textures are prepared before Start, including the low-health variant.
 r.artVignettes=new Map();
 for(const [id,p]of [...Object.entries(ART_PALETTES),['danger',{shade:'#70140e88'}]]){
  const image=canvas(256,256),c=image.getContext('2d'),g=c.createRadialGradient(128,116,65,128,116,187);
  g.addColorStop(0,'#00000000');g.addColorStop(1,p.shade);c.fillStyle=g;c.fillRect(0,0,256,256);r.artVignettes.set(id,image);
 }
}
export function drawSceneVignette(r,s){
 const image=r.artVignettes?.get(s.player.hp<30?'danger':SCENE_ART[s.area]?.palette);
 if(image)r.ctx.drawImage(image,0,0,r.width,r.height);
}
export const CONTACT_SHADOW_FILLS=new Set(['rgba(14,35,39,.45)','rgba(20,27,25,.45)','#18333455','#16353155','#102a3655','#14322f50','#152b3455','#17352c55','#092c3455','#13222170']);
export function drawArtContact(r,x,y,rx,ry,alpha=.55){
 if(!r.artShadow)return false;const c=r.ctx,incoming=c.globalAlpha;c.save();
 c.globalAlpha*=alpha*.3;c.drawImage(r.artShadow,x-rx*.9,y-ry*.9,rx*2.7,ry*2.2);
 c.globalAlpha=incoming*alpha;c.drawImage(r.artShadow,x-rx*1.25,y-ry*1.25,rx*2.5,ry*2.5);c.restore();return true;
}
function light(r,x,y,radius,color,alpha){
 const image=r.artLights?.get(color);if(!image||!r.inView(x,y,radius,radius*.5,radius*.5))return;
 const c=r.ctx;c.save();c.globalAlpha*=alpha;c.drawImage(image,x-radius,y-radius*.46,radius*2,radius*.92);c.restore();
}
export function drawSceneGround(r,s){
 const profile=SCENE_ART[s.area];if(!profile)return;
 const section=r.bounds?.index||0,t=geometry(s.area,section),scale=t.width/1536;
 for(const p of sceneDetails(s.area,section)){
  const a=SCENE_DETAIL_ASSETS[p.asset];if(a.glow)light(r,p.x,p.y,p.width*1.35,a.glow,.22);
 }
 if(section===0)for(const [x,y,radius,color]of profile.lights||[])light(r,t.x+x*scale,y*scale,radius*scale,color,.2);
 // Spell illumination follows the projectile on the floor, beneath warnings.
 if(r.settings?.quality!=='low'&&r.visualLoad<30)for(let i=0;i<Math.min(s.projectiles.length,12);i++){
  const bolt=s.projectiles[i];
  if(bolt.team!=='player'||!r.inView(bolt.x,bolt.y,80))continue;
  const color=['ember','solar','prism'].includes(bolt.type)?'gold':['volt','storm','gravity'].includes(bolt.type)?'pink':'cyan';
  light(r,bolt.x,bolt.y+12,30+(bolt.radius||8)*2,color,.18);
 }
}
export function drawSceneDetail(r,p){
 const image=r.sceneArtPrepared?.get(p.asset+':'+p.palette);if(!image||!r.inView(p.x,p.y,p.width,p.height+20,30))return;
 const a=SCENE_DETAIL_ASSETS[p.asset];if((p.mount||a.mount)==='ground')drawArtContact(r,p.x,p.y,p.rx,p.ry,a.contactOpacity||.3);
 const shadow=r.sceneArtShadows?.get(p.asset+':'+p.palette);
 if(shadow){const c=r.ctx,scale=geometry(p.area,p.section).width/1536;c.save();c.globalAlpha*=.18;c.translate(p.x+scale*2,p.y+scale*3);if(p.flip)c.scale(-1,1);c.drawImage(shadow,-p.width*a.anchor[0],-p.height*a.anchor[1],p.width,p.height);c.restore();}
 if(p.flip){r.ctx.save();r.ctx.translate(p.x,p.y);r.ctx.scale(-1,1);r.ctx.drawImage(image,-p.width*a.anchor[0],-p.height*a.anchor[1],p.width,p.height);r.ctx.restore();}
 else r.ctx.drawImage(image,p.x-p.width*a.anchor[0],p.y-p.height*a.anchor[1],p.width,p.height);
}
export function drawSceneAtmosphere(r,s,time){
 const profile=SCENE_ART[s.area];if(!profile||!r.artMotes||r.artReducedMotion||r.settings?.quality==='low')return;
 const image=r.artMotes.get(profile.palette),b=r.bounds,c=r.ctx,count=r.visualLoad>30?5:14;
 const ember=profile.palette==='ember',speed=ember?9:3;c.save();
 for(let i=0;i<count;i++){
  const x=b.x+(i*379.13+Math.sin(time*.15+i)*14)%b.width,y=((i*193.7-time*speed)%b.height+b.height)%b.height;
  if(!r.inView(x,y,15))continue;c.globalAlpha=(ember?.34:.23)*(1+Math.sin(time*.4+i)*.25);c.drawImage(image,x-12,y-12,24,24);
 }
 c.restore();
}
