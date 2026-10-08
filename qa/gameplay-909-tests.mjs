import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine,canStand,clearLine,distance,findPath} from '../src/engine.js';
import {STORY_ORDER} from '../src/story.js';
import {OUTDOOR_REGIONS,outdoorPoint} from '../src/outdoor-content.js';
import {INVESTMENTS} from '../src/markets.js';
import {MASTERWORK_EFFECTS,upgradeMasterwork} from '../src/masterworks.js';
import {legendaryCast,legendaryDash,legendaryHit,updateLegendary,effectText} from '../src/legendary.js';
import {translate,setLanguage} from '../src/localization.js';
import {SPELLS} from '../src/data.js';
import {CoopSession} from '../src/coop-session.js';
let count=0;const test=(name,fn)=>{fn();console.log('PASS '+name);count++;};
function forest(){const g=new Engine('tide',909);g.state.cores=[0,1];g.state.storyPassed=STORY_ORDER.slice(0,8);assert(g.enterArea('forest'));assert(!g.testModeEnabled());assert(g.switchAreaSection(1));Object.assign(g.state.player,{level:15,nextXp:1e9});return g;}
const native=points=>points.map(p=>outdoorPoint('forest',p));
function walk(g,targets){const p=g.state.player;for(const end of targets){assert(clearLine(p,end,g.state.area,18),'painted leg has a gap '+JSON.stringify(end));const from={x:p.x,y:p.y},steps=Math.ceil(distance(from,end)/18);for(let i=1;i<=steps;i++){const goal={x:from.x+(end.x-from.x)*i/steps,y:from.y+(end.y-from.y)*i/steps};let frames=0;while(distance(p,goal)>5&&frames++<200){const a=Math.round(Math.atan2((goal.y-p.y)/.78,goal.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(a)),y:Math.round(Math.sin(a))});}assert(frames<200,'keyboard stalled');assert(canStand(p.x,p.y,18,g.state.area));}assert(distance(p,end)<7);}}
test('Seya: actual arrival, painted paths, physical gate and all THREE F pickups, including the porch',()=>{
 const g=forest(),w=g.state.world,p=g.state.player;
 walk(g,native([[285,534],[380,551],[400,505],[365,480]]));assert.equal(g.interaction().type,'outdoorNPC');assert(g.interact());g.closeModal();
 assert(g.storyText().includes('Berg drie kiemmonsters'));assert(g.nextWaypoint().x>2688);
 walk(g,native([[365,448],[400,440],[455,460]]));assert.equal(g.interaction().type,'outdoorDoor');assert(g.interact());
 // Keep the real spawned creatures, but stop their attacks while testing routes.
 for(const e of w.enemies){e.stun=1e6;e.wet=0;}
 walk(g,native([[465,442],[475,425],[493,409],[530,405],[570,405],[627,381],[674,372]]));
 const guard=w.enemies.find(e=>e.outdoor);Object.assign(guard,outdoorPoint('forest',[690,390]));assert.equal(g.interaction().type,'outdoorGuard');assert(!g.inspectOutdoorPoint('moonseed'));
 for(const e of [...w.enemies])g.hitEnemy(e,1e6,'physical',true);
 assert.equal(g.interaction().type,'outdoorPoint');assert(g.interact());assert.deepEqual(w.outdoor.done,['moonseed']);
 const saved=Engine.restore(g.serialize());assert.deepEqual(saved.state.world.outdoor.done,['moonseed']);assert.deepEqual(saved.state.checkpoint.areas.forest.outdoor.done,['moonseed']);
 walk(g,native([[697,394],[719,424],[750,455],[775,468],[800,515],[835,573],[905,548],[977,522],[1043,515],[1075,500],[1125,456],[1190,400],[1195,383],[1158,336],[1110,305],[1070,280],[1040,263],[1020,240],[1097,198]]));
 assert.equal(g.interaction().entity.id,'crystalseed');assert(g.interact());
 walk(g,native([[1020,240],[1040,263],[1070,280],[1110,305],[1158,336],[1195,383],[1190,400],[1125,456],[1075,500],[1043,515],[977,522],[905,548],[835,573],[916,620],[990,652],[1058,691],[1060,709],[1030,738],[1000,767],[1058,806],[1075,832],[1130,809],[1172,789],[1220,784],[1262,766],[1272,744]]));
 const cash=p.scrap;assert.equal(g.interaction().entity.id,'amberseed');assert(g.interact());g.updateOutdoorProgress();assert.equal(w.outdoor.done.length,3);assert(w.outdoor.rewarded);assert.equal(p.scrap-cash,140);assert.equal(w.loot.filter(l=>l.outdoorReward).length,1);assert(!g.inspectOutdoorPoint('amberseed'));g.updateOutdoorProgress();assert.equal(p.scrap-cash,140);
 assert(g.switchAreaSection(0));assert(g.switchAreaSection(1));const reload=Engine.restore(g.serialize());assert(reload.state.world.outdoor.rewarded);assert.equal(reload.state.world.outdoor.done.length,3);
});
test('The complete width of the new porch approach is walkable, while the greenhouse and water stay solid',()=>{
 for(const [a,b]of [[[1075,815],[1130,797]],[[1130,797],[1180,785]],[[1180,785],[1220,784]]])for(let i=0;i<=100;i++)for(const off of [-12,0,12]){const p=outdoorPoint('forest',[a[0]+(b[0]-a[0])*i/100,a[1]+(b[1]-a[1])*i/100+off]);assert(canStand(p.x,p.y,18,'forest'));}
 for(const q of [[1095,732],[1260,840],[850,780],[1390,600]]){const p=outdoorPoint('forest',q);assert(!canStand(p.x,p.y,18,'forest'));}
});
test('Post-Aurelia station return works through an actual forest gate, atlas, reload and repeated round trips without admin',()=>{
 let g=new Engine();assert(!g.canSelectDestination('metro-refuge'));assert(!g.portalDefinitions('forest').some(p=>p.to==='metro-refuge'));
 // Simulate earned Aurelia completion, but deliberately omit earlier visits:
 // this is the old-save case that must not depend on recommendedArea().
 g.state.completed=true;g.state.cores=[0,1,2,3];g.state.storyPassed=STORY_ORDER.slice(0,16);assert(g.enterArea('metro-refuge'));assert(g.selectDestination('forest'));assert.equal(g.state.area,'forest');
 const gate=g.state.world.portals.find(p=>p.to==='metro-refuge');assert(gate&&!gate.locked);assert(canStand(gate.x,gate.y,18,'forest'));
 const route=g.findWalkingPath(g.state.player,gate,18);assert(route.length);walk(g,route);assert.equal(g.interaction().entity.to,'metro-refuge');assert(g.interact());assert.equal(g.state.area,'metro-refuge');
 for(let i=0;i<3;i++){assert(g.selectDestination('forest'));g=Engine.restore(g.serialize());assert(g.canSelectDestination('metro-refuge'));assert(g.selectDestination('metro-refuge'));assert.equal(g.state.area,'metro-refuge');}
 assert(g.selectDestination('skybridge'));const skyGate=g.state.world.portals.find(p=>p.to==='metro-refuge');assert(skyGate&&!skyGate.locked&&canStand(skyGate.x,skyGate.y,18,'skybridge'));
 const old=new Engine();old.state.completed=true;assert(old.enterArea('forest'));assert(!old.state.visited.includes('metro-refuge'));assert(old.selectDestination('metro-refuge'));assert.equal(old.state.area,'metro-refuge');
});
function arena(){const g=new Engine('tide',909);assert(g.enterArea('ring'));g.state.world.enemies=[];g.state.world.hazards=[];Object.assign(g.state.player,{x:700,y:640,level:12,invincible:0,mana:110,nextXp:1e9});g.state.player.stats.crit=-.07;g.state.player.skills.push('prism','volt','cryo');return g;}
function dummy(g,x=900,y=640){const e=g.makeEnemy('turret',x,y);e.hp=e.maxHp=10000;g.state.world.enemies.push(e);return e;}
function gear(g,slot){const spec=INVESTMENTS[2].find(i=>i.slot===slot);g.state.player.equipment[slot]=upgradeMasterwork({investment:slot==='head'?'head-2':spec.id,slot,stats:{},uid:991,rarity:'epic'});}
test('All 42 saving pieces have working, translated effects; purchased gear and forge bonuses migrate without restocking',()=>{
 for(let zone=0;zone<6;zone++){const g=new Engine();g.state.completed=true;g.state.storyPassed=[...STORY_ORDER];g.enterArea(['canal','highway','forest','skybridge','metro-refuge','cooling-refuge'][zone]);for(const item of g.state.world.shop.stock.filter(i=>i.investment&&!i.investment.startsWith('unique-'))){assert(MASTERWORK_EFFECTS[item.effect]);assert(item.text.includes('◆'));}}
 const g=new Engine(),p=g.state.player,item=g.state.world.shop.stock.find(i=>i.investment==='canal-focus'),m=g.state.world.camp.services.find(m=>m.id==='smith');Object.assign(p,{x:m.x,y:m.y,level:20,scrap:9999});assert(g.buyItem(item.uid));item.enhance=2;item.stats.power+=.12;item.mark='favorite';delete item.effect;delete item.masterworkVersion;
 const money=p.scrap,stats={...item.stats},r=Engine.restore(g.serialize()),bought=r.state.player.inventory.find(i=>i.uid===item.uid);assert.equal(bought.effect,'master-echo');assert.equal(bought.enhance,2);assert.equal(bought.mark,'favorite');assert.deepEqual(bought.stats,stats);assert.equal(r.state.player.scrap,money);assert(!r.state.world.shop.stock.some(i=>i.investment==='canal-focus'));r.retry();assert(!r.state.world.shop.stock.some(i=>i.investment==='canal-focus'));
 setLanguage('en');for(const e of Object.values(MASTERWORK_EFFECTS))assert(!/\b(?:je|schade|leven|herlaadt|seconden|spreukschade)\b/i.test(translate(e.text)));for(const id of ['prism','volt','cryo'])assert(!translate(SPELLS[id].description).includes('schade'));setLanguage('nl');
});
test('Saving weapon echoes the third cast, pierces three foes, scales damage and respects its cooldown',()=>{
 const g=arena(),p=g.state.player;gear(g,'weapon');for(let i=0;i<2;i++)legendaryCast(g,'tide',100);assert.equal(g.state.projectiles.length,0);legendaryCast(g,'tide',100);assert.equal(g.state.projectiles.length,1);assert.equal(g.state.projectiles[0].damage,65);for(let i=0;i<8;i++)legendaryCast(g,'tide',100);assert.equal(g.state.projectiles.length,1);
 const enemies=[850,1000,1150,1300].map(x=>dummy(g,x));for(let i=0;i<100;i++)g.updateProjectiles(1/60);assert(enemies.slice(0,3).every(e=>e.hp<10000));assert.equal(enemies[3].hp,10000);
});
test('Expensive unique purchases retain their original power and gain an extra saving ability, including existing gear',()=>{
 const g=arena(),p=g.state.player;p.equipment.weapon=upgradeMasterwork({investment:'unique-crystal',slot:'weapon',effect:'crystal',stats:{},uid:991,rarity:'legendary'});assert.equal(p.equipment.weapon.effect,'crystal');assert.equal(p.equipment.weapon.masterEffect,'master-echo');assert(effectText(p.equipment.weapon).includes('ijssplinters'));assert(effectText(p.equipment.weapon).includes('65%'));
 for(let i=0;i<3;i++)legendaryCast(g,'frost',100);assert.equal(g.state.projectiles.length,1);p.equipment.suit=upgradeMasterwork({investment:'unique-filter',slot:'suit',effect:'filter',stats:{},uid:992});legendaryDash(g);assert(g.hasUnique('filter'));assert(p.ward>0);
 const saved=Engine.restore(g.serialize());assert.equal(saved.state.player.equipment.weapon.masterEffect,'master-echo');assert.equal(saved.state.player.equipment.weapon.effect,'crystal');
});
test('Saving dash shield absorbs actual damage; frost boots damage and slow enemies without repeated procs',()=>{
 const g=arena(),p=g.state.player;gear(g,'suit');gear(g,'boots');const e=dummy(g,780);legendaryDash(g);assert.equal(p.ward,g.stats().maxHp*.22);assert(e.hp<10000&&e.slow===3);const hp=e.hp;legendaryDash(g);assert.equal(e.hp,hp);p.invincible=0;const before=p.hp;g.hurtPlayer(10);assert.equal(p.hp,before);updateLegendary(p,7);assert.equal(p.ward,0);legendaryDash(g);assert(e.hp<hp);
});
test('Saving relic refunds mana and cooldowns once, even with two copies; secondary hits do not charge it',()=>{
 const g=arena(),p=g.state.player;gear(g,'relic');p.equipment.relic2={...p.equipment.relic,uid:992};p.mana=0;p.spellCd.cryo=4;const e=dummy(g);for(let i=0;i<8;i++)legendaryHit(g,e,100,'storm',true);assert.equal(p.mana,0);for(let i=0;i<2;i++)legendaryHit(g,e,100,'storm',false);assert.equal(p.mana,0,'duplicate relics must not advance the counter twice');legendaryHit(g,e,100,'storm',false);assert.equal(p.mana,18);assert.equal(p.spellCd.cryo,3);for(let i=0;i<9;i++)legendaryHit(g,e,100,'storm',false);assert.equal(p.mana,18);
});
test('Saving gloves explode on the fourth direct hit with bounded secondary damage',()=>{
 const g=arena();gear(g,'gloves');const a=dummy(g,900),b=dummy(g,950);for(let i=0;i<3;i++)legendaryHit(g,a,100,'tide',false);assert.equal(b.hp,10000);legendaryHit(g,a,100,'tide',false);assert.equal(b.hp,9920);assert.equal(g.state.player.masterBurstCount,4);legendaryHit(g,a,100,'tide',false);assert.equal(b.hp,9920);
});
test('Saving belt rescues a living low-health hero once but cannot resurrect; crown gives a timed shield and mana',()=>{
 const g=arena(),p=g.state.player;gear(g,'belt');p.hp=40;p.mana=0;g.hurtPlayer(10);assert.equal(p.hp,55);assert.equal(p.mana,35);p.invincible=0;p.hp=20;g.hurtPlayer(10);assert.equal(p.hp,10);p.invincible=0;g.hurtPlayer(1000);assert.equal(g.state.mode,'dead');
 const h=arena();gear(h,'head');h.state.player.mana=0;h.hurtPlayer(10);assert.equal(h.state.player.mana,15);assert.equal(h.state.player.ward,18);assert.equal(h.state.player.wardTime,3);
});
test('Prismabow hits five distinct targets with a final explosion and also bursts against one boss-sized target',()=>{
 const g=arena(),enemies=[850,1020,1190,1360,1530].map(x=>dummy(g,x));assert(g.cast('prism',{x:1600,y:640}));for(let i=0;i<120;i++)g.updateProjectiles(1/60);assert(enemies.every(e=>e.hp<10000));assert.equal(enemies[0].hp,9900);assert(Math.abs(enemies[4].hp-(10000-100*.92**4*1.5))<1e-6);
 const h=arena(),solo=dummy(h);assert(h.cast('prism',{x:1100,y:640}));for(let i=0;i<100;i++)h.updateProjectiles(1/60);assert.equal(solo.hp,9850);
});
test('Thunderlance pierces exactly four, makes dry targets conductive and gains the wet combo on a follow-up',()=>{
 const g=arena(),enemies=[850,1000,1150,1300,1450].map(x=>dummy(g,x));assert(g.cast('volt',{x:1600,y:640}));for(let i=0;i<100;i++)g.updateProjectiles(1/60);assert(enemies.slice(0,4).every(e=>e.hp===9860&&e.wet===3));assert.equal(enemies[4].hp,10000);const hp=enemies[0].hp;g.hitEnemy(enemies[0],140,'storm');assert(Math.abs(hp-enemies[0].hp-238)<1e-6);
});
test('Wintercrown freezes dry enemies and deals an opening blast plus three strong pulses without a huge-frame loss',()=>{
 const g=arena(),e=dummy(g,1000);assert(g.cast('cryo',{x:1000,y:640}));g.updateFields(.29);assert.equal(e.hp,10000);g.updateFields(.02);assert.equal(e.hp,9820);assert.equal(e.frozen,.9);g.updateFields(1.7);assert.equal(e.hp,9685);assert.equal(g.state.fields[0].echoes,3);
});
test('Prepared forest routes match the updated floor rather than stale grids',()=>{const records=JSON.parse(fs.readFileSync('assets/navigation/walkways-v8103.json'));assert.equal(findPath.install(records),records.length);});
test('The final F pickup in LAN pays both heroes on the shared progress tick, once each',()=>{
 const s=new CoopSession(909),a=s.join({token:'a',name:'A'}),b=s.join({token:'b',name:'B'});s.ready(a.id);s.ready(b.id);s.rpc(a.id,'unlockTestMode',['fabian1']);s.rpc(a.id,'testTravel',['forest']);s.rpc(b.id,'acceptTravel',[]);const g=s.engine,w=g.state.world;w.outdoor.open=true;w.outdoor.done=['moonseed','crystalseed'];for(const e of w.enemies)e.dead=true;
 Object.assign(a.player,outdoorPoint('forest',[1272,744]));assert(s.rpc(a.id,'interact',[]));const coins=[a.player.scrap,b.player.scrap];s.tick(1/60);assert.equal(a.player.scrap-coins[0],140);assert.equal(b.player.scrap-coins[1],140);assert.equal(w.loot.filter(l=>l.outdoorReward).length,2);s.tick(1/60);assert.equal(a.player.scrap-coins[0],140);
});
console.log(`\n${count} gameplay regression checks passed.`);
