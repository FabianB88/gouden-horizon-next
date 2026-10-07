import {NEXT_SCENES,GROUND_FILES} from './world-design.js?v=901';
import {WORLD_ASSETS} from './world-assets.js?v=901';
import {translate} from './localization.js?v=901';

export function nextAssetFiles(){const used=new Set(Object.values(NEXT_SCENES).flatMap(s=>s.props.map(p=>p.asset)));return {...Object.fromEntries(Object.entries(GROUND_FILES).map(([id,file])=>['ground-'+id,file])),...Object.fromEntries(Object.entries(WORLD_ASSETS).filter(([id])=>used.has(id)).map(([id,a])=>['world-'+id,a.file]))};}
function material(renderer,id){renderer.nextPatterns||=new Map();if(!renderer.nextPatterns.has(id)){const image=renderer.assets['ground-'+id],pattern=renderer.ctx.createPattern(image,'repeat');pattern.setTransform(new DOMMatrix().scale(492/image.width));renderer.nextPatterns.set(id,pattern);}return renderer.nextPatterns.get(id);}
export function drawNextGround(renderer,s,bounds){
 const scene=NEXT_SCENES[s.area],c=renderer.ctx,piece=scene.pieces[bounds.index||0],theme=scene.theme;
 c.fillStyle=theme.edge;c.fillRect(bounds.x,0,bounds.width,bounds.height);
 if(scene.type==='coast'){
  const water=c.createLinearGradient(0,piece.y+piece.height,0,bounds.height);water.addColorStop(0,'#315c63');water.addColorStop(1,'#153c49');c.fillStyle=water;c.fillRect(bounds.x,piece.y+piece.height,bounds.width,bounds.height-piece.height-piece.y);
  c.strokeStyle='#8fc6bf40';c.lineWidth=1.5;for(let y=piece.y+piece.height+20;y<bounds.height;y+=23)for(let x=bounds.x+10;x<bounds.x+bounds.width;x+=91){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+20,y-5,x+45,y);c.stroke();}
 }
 c.fillStyle=material(renderer,theme.ground);c.fillRect(piece.x,piece.y,piece.width,piece.height);
 if(['city','coast'].includes(scene.type))for(const prop of scene.props){if(!/willow|oak/.test(prop.asset)||prop.x<piece.x||prop.x>piece.x+piece.width)continue;c.save();c.beginPath();c.ellipse(prop.x,prop.y,prop.width*.48,prop.width*.23,0,0,Math.PI*2);c.clip();c.fillStyle=material(renderer,'earth');c.fillRect(prop.x-prop.width*.5,prop.y-prop.width*.25,prop.width,prop.width*.5);c.restore();}
 // The curb is drawn at the exact outer edge of the walkable rectangle.
 c.strokeStyle='#d2c3a280';c.lineWidth=3;c.strokeRect(piece.x,piece.y,piece.width,piece.height);
 c.save();c.beginPath();c.rect(piece.x,piece.y,piece.width,piece.height);c.clip();
 c.lineCap='round';c.lineJoin='round';
 const avenue=()=>{c.beginPath();for(const {a,b}of piece.lanes){c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);}c.stroke();};
 const roadWidth=scene.type==='garden'?132:172;
 c.strokeStyle='#c9c2a866';c.lineWidth=roadWidth+10;avenue();
 c.strokeStyle=material(renderer,theme.road);c.lineWidth=roadWidth;avenue();
 for(const p of [piece.center,...piece.lanes.slice(1).map(l=>l.b)]){c.beginPath();c.ellipse(p.x,p.y,92,64,0,0,Math.PI*2);c.fillStyle=material(renderer,theme.road);c.fill();}
 c.restore();
 if(scene.gate){const g=scene.gate;drawFence(renderer,g.top,g.a);drawFence(renderer,g.b,g.bottom);}
 if(scene.type==='interior'){
  // Separate room walls frame the same clear timber floor used by navigation.
  c.fillStyle='#d1c8ab';c.fillRect(24,24,bounds.width-48,70);c.fillStyle='#555d4d';c.fillRect(24,94,bounds.width-48,12);c.fillRect(24,24,14,bounds.height-48);c.fillRect(bounds.width-38,24,14,bounds.height-48);
  c.strokeStyle='#9a8d6c';c.lineWidth=2;for(let x=50;x<bounds.width-30;x+=110){c.strokeRect(x,34,90,48);}
 }
}
function drawFence(r,a,b){const c=r.ctx,steps=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/45);c.save();for(let n=0;n<steps;n++){const p={x:a.x+(b.x-a.x)*n/steps,y:a.y+(b.y-a.y)*n/steps},q={x:a.x+(b.x-a.x)*(n+1)/steps,y:a.y+(b.y-a.y)*(n+1)/steps};if(!r.inView(p.x,p.y,70,100,30))continue;r.line(p,q,'#152a2c66',18);for(const h of [22,51]){r.line({x:p.x,y:p.y-h},{x:q.x,y:q.y-h},'#463e2d',8);r.line({x:p.x,y:p.y-h-2},{x:q.x,y:q.y-h-2},'#b0a178',2);}r.line(p,{x:p.x,y:p.y-68},'#4c4d3d',11);r.ellipse(p.x,p.y-69,7,4,'#d3ba7f');}c.restore();}
export function drawNextGate(r,s){const g=NEXT_SCENES[s.area]?.gate;if(!g)return;const o=s.world.outdoor,c=r.ctx,open=o?.open?Math.min(1,(s.time-(o.openedAt??s.time-1))/.65):0;r.ellipse(g.a.x,g.a.y,13,8,'#a99970');r.ellipse(g.b.x,g.b.y,13,8,'#a99970');if(open<1){c.save();c.globalAlpha*=1-open;drawFence(r,{x:g.a.x,y:g.a.y-open*90},{x:g.b.x,y:g.b.y-open*90});c.restore();}if(!o?.open&&Math.hypot(s.player.x-(g.a.x+g.b.x)/2,s.player.y-(g.a.y+g.b.y)/2)<250)r.text('F · '+translate('Open poort'),(g.a.x+g.b.x)/2,(g.a.y+g.b.y)/2+35,'#f5d99d',14);}
export function drawNextProp(r,p,player){const a=WORLD_ASSETS[p.asset],image=r.assets['world-'+p.asset];if(!image)return;const c=r.ctx,x=p.x-p.width*a.anchor[0],y=p.y-p.height*a.anchor[1];if(!r.inView(p.x,p.y,p.width*.6,p.height,Math.max(60,p.height*(1-a.anchor[1]))))return;c.save();if(p.rx){r.ellipse(p.x+9,p.y+4,p.rx*1.15,p.ry*1.1,'#152a2b40');}if(player.y<p.y&&player.y>y-20&&Math.abs(player.x-p.x)<p.width*.4)c.globalAlpha=.42;c.drawImage(image,x,y,p.width,p.height);c.restore();}
export function drawNextMini(ctx,s,bounds,w,h){const scene=NEXT_SCENES[s.area],piece=scene.pieces[bounds.index||0],sx=w/bounds.width,sy=h/bounds.height;ctx.fillStyle=scene.theme.edge;ctx.fillRect(0,0,w,h);ctx.save();ctx.scale(sx,sy);ctx.translate(-bounds.x,0);ctx.fillStyle=scene.type==='garden'?'#49614b':scene.type==='desert'?'#9a865d':'#737d74';ctx.fillRect(piece.x,piece.y,piece.width,piece.height);ctx.lineWidth=140;ctx.lineCap='round';ctx.strokeStyle='#b2ad91';ctx.beginPath();for(const {a,b}of piece.lanes){ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}ctx.stroke();ctx.restore();}
export function drawNextEntrance(r,s){const door=NEXT_SCENES[s.area]?.door;if(!door)return;r.ellipse(door.x,door.y,31,17,'#193c3e88','#e6c780',2);r.text('↥',door.x,door.y+3,'#ffe6ad',24,false);if(Math.hypot(s.player.x-door.x,s.player.y-door.y)<260)r.text('F · '+door.name,door.x,door.y+42,'#ffe8b2',14);}
export function drawNextResident(r,s){const resident=NEXT_SCENES[s.area]?.resident;if(!resident)return;const id=s.area==='quay-home'?'tess':s.area==='city-workshop'?'orin':'seya';r.ellipse(resident.x,resident.y,23,10,'#142d3455');r.sprite(r.assets['npc-'+id],r.outdoorNPCCrop[id],resident.x,resident.y,137);r.text(resident.name,resident.x,resident.y-151,'#f2ddae',14);if(Math.hypot(s.player.x-resident.x,s.player.y-resident.y)<220)r.text('F · '+translate('Spreek'),resident.x,resident.y+28,'#f2ddae',13);}
