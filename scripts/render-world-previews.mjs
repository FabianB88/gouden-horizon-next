const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import {writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const root=process.cwd(),browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-extensions']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});await page.route('**/next-preview-run.html',r=>r.fulfill({contentType:'text/html',body:'<canvas id="preview" width="1920" height="1280"></canvas>'}));await page.goto('http://localhost:8081/next-preview-run.html');
 const outputs=await page.evaluate(async()=>{
  const [{AREAS},{NEXT_SCENES},{nextAssetFiles,drawNextGround,drawNextProp}]=await Promise.all([import('/src/data.js?v=910'),import('/src/world-design.js?v=910'),import('/src/world-render.js?v=910')]);
  const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),assets={};await Promise.all(Object.entries(nextAssetFiles()).map(async([id,file])=>{const img=new Image();img.src=file;await img.decode();assets[id]=img;}));
  const r={ctx,assets,inView:()=>true,ellipse(x,y,rx,ry,color,stroke,w=1){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(color){ctx.fillStyle=color;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w;ctx.stroke();}},line(a,b,color,w=2){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke();}};
  const output=[];for(const a of AREAS){const b=a.tiles?.[0]||{x:0,y:0,...(a.bounds||{width:1920,height:1280})},scale=Math.min(1920/b.width,1280/b.height);ctx.resetTransform();ctx.fillStyle='#182e33';ctx.fillRect(0,0,1920,1280);ctx.save();ctx.scale(scale,scale);drawNextGround(r,{area:a.id},b);for(const p of [...NEXT_SCENES[a.id].props].sort((a,b)=>a.y-b.y))drawNextProp(r,p,{x:-1000,y:-1000});ctx.restore();const thumb=document.createElement('canvas');thumb.width=600;thumb.height=400;thumb.getContext('2d').drawImage(canvas,0,0,600,400);output.push({id:a.id,full:canvas.toDataURL('image/webp',.9).split(',')[1],thumb:thumb.toDataURL('image/webp',.84).split(',')[1]});}return output;
 });
 mkdirSync(resolve(root,'assets/painted/previews'),{recursive:true});for(const o of outputs){writeFileSync(resolve(root,'assets/painted/next-'+o.id+'.webp'),Buffer.from(o.full,'base64'));writeFileSync(resolve(root,'assets/painted/previews/next-'+o.id+'.webp'),Buffer.from(o.thumb,'base64'));}
 // World previews are for area menus; the title screen keeps its original key art.
 console.log('Rendered '+outputs.length+' previews from actual placed world assets.');
}finally{await browser.close();}
