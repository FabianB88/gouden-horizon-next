// Native coordinates of the original 1536px Getijdenkade painting.
// Keep stairs, landings and dock edges together; never scale by both map tiles.
export const QUAY_ART_SCALE=1.75;
export const QUAY_STAIRWAYS=[
 {id:'east-court',route:[[880,530],[878,511],[875,498],[872,483],[868,469],[864,453],[864,433],[890,418]],floor:[[850,429],[876,407],[912,411],[905,440],[884,453],[894,468],[900,488],[889,510],[900,548],[861,548],[859,519],[844,503],[851,479],[848,457]]},
 {id:'upper-east',route:[[1357,302],[1352,284],[1347,270],[1340,255],[1333,240],[1326,225],[1319,210],[1310,190]],floor:[[1289,181],[1326,177],[1347,204],[1357,230],[1374,245],[1390,259],[1380,292],[1378,317],[1331,322],[1320,291],[1305,272],[1290,247],[1287,215]]},
 {id:'east-dock',route:[[816,738],[830,730],[847,711],[862,692],[878,674],[889,654],[895,635]],floor:[[798,739],[817,709],[837,691],[858,673],[874,649],[877,617],[911,615],[917,642],[909,666],[891,695],[863,721],[844,742],[831,768]]},
];
// The painted planter beside the court stairs has a visible solid base.
// Its contact keeps click routes on the treads instead of cutting the corner.
export const QUAY_STAIR_OBSTACLES=[{id:'east-stair-planter',x:904*QUAY_ART_SCALE,y:479*QUAY_ART_SCALE,rx:13*QUAY_ART_SCALE,ry:15*QUAY_ART_SCALE,height:90,paintedOnly:true}];
export const QUAY_DOCK_FLOOR=[[772,718],[798,707],[825,716],[855,730],[888,750],[871,776],[833,765],[799,746]];
export const QUAY_DOCK_PROPS=[
 {id:'dock-barrel',type:'barrel',point:[784,729],width:22,rx:8,ry:5},
 {id:'dock-fish',type:'fish',point:[866,749],width:28,rx:10,ry:5.5},
 {id:'dock-rope',type:'rope',point:[838,754],width:23,rx:0,ry:0},
].map(p=>({...p,x:p.point[0]*QUAY_ART_SCALE,y:p.point[1]*QUAY_ART_SCALE,rx:p.rx*QUAY_ART_SCALE,ry:p.ry*QUAY_ART_SCALE,height:p.width*QUAY_ART_SCALE*1.5,paintedOnly:true,quayProp:true}));
export function installQuayStairs(area,world){for(const floor of [...QUAY_STAIRWAYS.map(s=>s.floor),QUAY_DOCK_FLOOR])area.nav.push(floor.map(([x,y])=>[x*QUAY_ART_SCALE/world.width,y*QUAY_ART_SCALE/world.height]));}
