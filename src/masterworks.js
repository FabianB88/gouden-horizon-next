// Saving rewards keep their IDs and upgrades in existing saves. Effects scale
// with the wearer, so a favourite early purchase remains useful later.
export const MASTERWORK_EFFECTS={
 'master-echo':{slot:'weapon',name:'Drievoudige echo',text:'Elke derde spreuk vuurt een extra ijslans af voor 65% spreukschade door drie doelen. Herlaadt in 1 seconde.'},
 'master-shell':{slot:'suit',name:'Veldmantel',text:'Ontwijken geeft 3 seconden een schild van 22% van je maximale leven. Herlaadt in 7 seconden.'},
 'master-flow':{slot:'relic',name:'Manastroom',text:'Elke derde directe treffer herstelt 18 mana en verkort spreukherladen met 1 seconde. Herlaadt in 3 seconden; dubbele exemplaren stapelen niet.'},
 'master-step':{slot:'boots',name:'Vorststap',text:'Ontwijken veroorzaakt een vorstgolf: 40 + 3 per niveau schade en 3 seconden vertraging binnen 170. Herlaadt in 4 seconden.'},
 'master-burst':{slot:'gloves',name:'Kernbreuk',text:'Elke vierde directe treffer veroorzaakt een explosie voor 80% trefferschade binnen 160. Herlaadt in 3 seconden; geen kettingprocs.'},
 'master-reserve':{slot:'belt',name:'Laatste reserve',text:'Na schade onder 35% leven herstel je 25% van je maximale leven en 35 mana. Herlaadt in 35 seconden; voorkomt geen dodelijke treffer.'},
 'master-crown':{slot:'head',name:'Wachterskroon',text:'Na schade krijg je 3 seconden een schild van 18% van je maximale leven en 15 mana. Herlaadt in 10 seconden.'}
};
export function upgradeMasterwork(item){
 const bonus={'unique-filter':'master-shell','unique-crystal':'master-echo','horizon-diadem':'master-crown'}[item?.investment];
 if(bonus){item.masterEffect=bonus;item.masterworkVersion=1;return item;}
 if(!item?.investment||!(/^(canal|heat|grove|horizon|deep|tower)-(focus|coat|lens|boots|gloves|belt)$/.test(item.investment)||/^head-\d$/.test(item.investment)))return item;
 const effect=Object.keys(MASTERWORK_EFFECTS).find(id=>MASTERWORK_EFFECTS[id].slot===item.slot);
 if(effect){item.effect=effect;item.masterworkVersion=1;}
 return item;
}
const MASTERWORK_TRIGGERS={'master-echo':'cast','master-shell':'dash','master-flow':'hit','master-step':'dash','master-burst':'hit','master-reserve':'hurt','master-crown':'hurt'};
export function triggerMasterwork(g,id,trigger,data,cool){
 if(MASTERWORK_TRIGGERS[id]!==trigger)return false;
 const s=g.state,p=s.player,stats=g.stats(),range=(e,r)=>!e.dead&&!e.hidden&&Math.hypot(e.x-p.x,(e.y-p.y)*1.15)<r;
 if(id==='master-echo'&&trigger==='cast'){
  p.masterEchoCount=(p.masterEchoCount||0)+1;if(p.masterEchoCount%3)return false;
  cool[id]=1;const d=p.aim;s.projectiles.push({id:++g.idCounter,team:'player',type:'frost',element:'frost',uniqueSecondary:true,x:p.x+d.x*32,y:p.y-18+d.y*24,vx:d.x*1050,vy:d.y*1050/1.15,damage:data.damage*.65,radius:12,pierce:3,life:1.1,age:0,trail:[],hitIds:[]});return true;
 }
 if(id==='master-shell'&&trigger==='dash'){cool[id]=7;p.ward=Math.max(p.ward||0,stats.maxHp*.22);p.wardTime=Math.max(p.wardTime||0,3);return true;}
 if(id==='master-flow'&&trigger==='hit'&&!data.secondary){
  p.masterFlowCount=(p.masterFlowCount||0)+1;if(p.masterFlowCount%3)return false;
  cool[id]=3;p.mana=Math.min(stats.maxMana,p.mana+18);for(const key of Object.keys(p.spellCd))p.spellCd[key]=Math.max(0,p.spellCd[key]-1);return true;
 }
 if(id==='master-step'&&trigger==='dash'){
  cool[id]=4;g.effect('nova',p.x,p.y,{radius:170,color:'#b9efff',element:'frost',life:.6});
  for(const e of s.world.enemies.filter(e=>range(e,170))){g.hitEnemy(e,40+p.level*3,'frost',true);e.slow=Math.max(e.slow||0,3);}return true;
 }
 if(id==='master-burst'&&trigger==='hit'&&!data.secondary){
  p.masterBurstCount=(p.masterBurstCount||0)+1;if(p.masterBurstCount%4)return false;
  // Arm before secondary damage: neither this hit nor a kill can re-enter it.
  cool[id]=3;const point=data.enemy;g.effect('eruption',point.x,point.y,{radius:160,color:'#ffdb9b',life:.65});
  for(const e of s.world.enemies.filter(e=>!e.dead&&!e.hidden&&Math.hypot(e.x-point.x,(e.y-point.y)*1.15)<160))g.hitEnemy(e,data.damage*.8,'ember',true);return true;
 }
 if(id==='master-reserve'&&trigger==='hurt'&&p.hp>0&&p.hp<stats.maxHp*.35){cool[id]=35;p.hp=Math.min(stats.maxHp,p.hp+stats.maxHp*.25);p.mana=Math.min(stats.maxMana,p.mana+35);g.effect('nova',p.x,p.y,{radius:90,color:'#b9e9bd',life:.5});return true;}
 if(id==='master-crown'&&trigger==='hurt'&&p.hp>0){cool[id]=10;p.ward=Math.max(p.ward||0,stats.maxHp*.18);p.wardTime=Math.max(p.wardTime||0,3);p.mana=Math.min(stats.maxMana,p.mana+15);return true;}
 return false;
}
