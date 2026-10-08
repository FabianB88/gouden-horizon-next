// Art direction in original painting pixels. No gameplay or collision geometry.
export const SCENE_DETAIL_ASSETS={"cable-reel":{"file":"assets/scene-details/cable-reel.webp","size":[322,378],"crop":[109,57,322,378],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"cooling-fan":{"file":"assets/scene-details/cooling-fan.webp","size":[382,396],"crop":[71,34,382,396],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"crystal-cluster":{"file":"assets/scene-details/crystal-cluster.webp","size":[352,456],"crop":[76,30,352,456],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08,"glow":"cyan"},"fern":{"file":"assets/quay-details/fern.webp","size":[445,410],"crop":[11,48,445,410],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"flower-patch":{"file":"assets/quay-details/flower-patch.webp","size":[346,359],"crop":[69,87,346,359],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"generator":{"file":"assets/scene-details/generator.webp","size":[436,413],"crop":[42,14,436,413],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"glow-mushrooms":{"file":"assets/scene-details/glow-mushrooms.webp","size":[390,362],"crop":[74,35,390,362],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08,"glow":"cyan"},"grass-clump":{"file":"assets/scene-details/grass-clump.webp","size":[298,279],"crop":[97,31,298,279],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"handcart":{"file":"assets/scene-details/handcart.webp","size":[444,343],"crop":[45,23,444,343],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"hanging-herbs":{"file":"assets/scene-details/hanging-herbs.webp","size":[399,441],"crop":[57,31,399,441],"anchor":[0.5,0.5],"mount":"wall","rx":0.17,"ry":0.08},"potion-shelf":{"file":"assets/scene-details/potion-shelf.webp","size":[245,455],"crop":[52,36,245,455],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"pressure-valve":{"file":"assets/scene-details/pressure-valve.webp","size":[408,471],"crop":[63,12,408,471],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"reed-clump":{"file":"assets/quay-details/reed-clump.webp","size":[312,449],"crop":[90,18,312,449],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"rock-stack":{"file":"assets/scene-details/rock-stack.webp","size":[387,266],"crop":[66,34,387,266],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"sluice-control":{"file":"assets/scene-details/sluice-control.webp","size":[253,456],"crop":[135,25,253,456],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"solar-beacon":{"file":"assets/scene-details/solar-beacon.webp","size":[202,471],"crop":[136,21,202,471],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08,"glow":"gold"},"storage-barrel":{"file":"assets/quay-details/barrel.webp","size":[289,391],"crop":[111,56,289,391],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"tool-rack":{"file":"assets/scene-details/tool-rack.webp","size":[262,454],"crop":[103,28,262,454],"anchor":[0.5,0.89],"mount":"ground","rx":0.17,"ry":0.08},"wall-lamp":{"file":"assets/scene-details/wall-lamp.webp","size":[298,416],"crop":[128,47,298,416],"anchor":[0.5,0.5],"mount":"wall","rx":0.17,"ry":0.08,"glow":"gold"},"wall-map":{"file":"assets/scene-details/wall-map.webp","size":[358,360],"crop":[81,11,358,360],"anchor":[0.5,0.5],"mount":"wall","rx":0.17,"ry":0.08}};
export const SCENE_ART={
 "canal": {
  "palette": "garden",
  "pieces": [],
  "extensions": [
   {
    "asset": "hanging-herbs",
    "point": [
     1172,
     268
    ],
    "width": 41,
    "section": 1
   }
  ],
  "lights": [
   [
    239,
    818,
    35,
    "gold"
   ],
   [
    1439,
    315,
    32,
    "gold"
   ],
   [
    942,
    638,
    32,
    "gold"
   ]
  ]
 },
 "ring": {
  "palette": "coast",
  "pieces": [
   {
    "asset": "flower-patch",
    "point": [
     427,
     167
    ],
    "width": 30
   }
  ]
 },
 "rooftops": {
  "palette": "garden",
  "pieces": [
   {
    "asset": "hanging-herbs",
    "point": [
     169,
     708
    ],
    "width": 37
   }
  ]
 },
 "highway": {
  "palette": "sun",
  "pieces": [
   {
    "asset": "handcart",
    "point": [
     1365,
     466
    ],
    "width": 72
   }
  ],
  "extensions": [
   {
    "asset": "storage-barrel",
    "point": [
     1175,
     317
    ],
    "width": 36,
    "section": 1
   },
   {
    "asset": "flower-patch",
    "point": [
     341,
     846
    ],
    "width": 31,
    "section": 1
   }
  ]
 },
 "kilometer": {
  "palette": "ember",
  "pieces": [
   {
    "asset": "pressure-valve",
    "point": [
     125,
     672
    ],
    "width": 47,
    "mount": "wall"
   },
   {
    "asset": "generator",
    "point": [
     1195,
     185
    ],
    "width": 62
   }
  ]
 },
 "forest": {
  "palette": "garden",
  "pieces": [
   {
    "asset": "fern",
    "point": [
     392,
     261
    ],
    "width": 37
   }
  ],
  "extensions": [
   {
    "asset": "fern",
    "point": [
     391,
     246
    ],
    "width": 40,
    "section": 1
   },
   {
    "asset": "glow-mushrooms",
    "point": [
     1227,
     342
    ],
    "width": 34,
    "section": 1
   },
   {
    "asset": "flower-patch",
    "point": [
     720,
     877
    ],
    "width": 34,
    "section": 1
   }
  ]
 },
 "saltwood": {
  "palette": "grove",
  "pieces": [
   {
    "asset": "glow-mushrooms",
    "point": [
     319,
     208
    ],
    "width": 33
   },
   {
    "asset": "fern",
    "point": [
     1274,
     736
    ],
    "width": 37
   }
  ]
 },
 "vault": {
  "palette": "garden",
  "pieces": [
   {
    "asset": "hanging-herbs",
    "point": [
     252,
     347
    ],
    "width": 37
   },
   {
    "asset": "potion-shelf",
    "point": [
     1355,
     432
    ],
    "width": 47
   }
  ]
 },
 "skybridge": {
  "palette": "storm",
  "pieces": [],
  "extensions": []
 },
 "aurelia": {
  "palette": "storm",
  "pieces": [],
  "lights": [
   [
    207,
    529,
    72,
    "cyan"
   ],
   [
    1350,
    542,
    80,
    "cyan"
   ],
   [
    600,
    180,
    67,
    "gold"
   ],
   [
    1156,
    837,
    68,
    "gold"
   ]
  ]
 },
 "delta": {
  "palette": "coast",
  "pieces": [
   {
    "asset": "reed-clump",
    "point": [
     235,
     859
    ],
    "width": 49
   },
   {
    "asset": "reed-clump",
    "point": [
     1186,
     914
    ],
    "width": 45
   }
  ]
 },
 "mirrors": {
  "palette": "ember",
  "pieces": [
   {
    "asset": "rock-stack",
    "point": [
     198,
     819
    ],
    "width": 58
   },
   {
    "asset": "solar-beacon",
    "point": [
     1266,
     173
    ],
    "width": 36
   },
   {
    "asset": "cable-reel",
    "point": [
     252,
     245
    ],
    "width": 41
   }
  ]
 },
 "glass": {
  "palette": "garden",
  "pieces": [
   {
    "asset": "fern",
    "point": [
     285,
     216
    ],
    "width": 38
   },
   {
    "asset": "hanging-herbs",
    "point": [
     1196,
     178
    ],
    "width": 40
   }
  ]
 },
 "harbor": {
  "palette": "storm",
  "pieces": []
 },
 "brine": {
  "palette": "sun",
  "pieces": []
 },
 "clouds": {
  "palette": "storm",
  "pieces": [
   {
    "asset": "solar-beacon",
    "point": [
     1276,
     812
    ],
    "width": 32
   }
  ]
 },
 "salvage": {
  "palette": "coast",
  "pieces": [
   {
    "asset": "generator",
    "point": [
     1302,
     287
    ],
    "width": 59
   }
  ]
 },
 "depot": {
  "palette": "sun",
  "pieces": []
 },
 "bounty-spore": {
  "palette": "grove",
  "pieces": []
 },
 "bounty-solar": {
  "palette": "ember",
  "pieces": []
 },
 "trial-tide": {
  "palette": "coast",
  "pieces": [
   {
    "asset": "sluice-control",
    "point": [
     248,
     190
    ],
    "width": 39
   }
  ]
 },
 "trial-glass": {
  "palette": "ember",
  "pieces": []
 },
 "trial-null": {
  "palette": "storm",
  "pieces": [
   {
    "asset": "solar-beacon",
    "point": [
     280,
     210
    ],
    "width": 33
   }
  ]
 },
 "workshop-v6": {
  "palette": "sun",
  "pieces": []
 },
 "adventure-metro": {
  "palette": "metro",
  "pieces": []
 },
 "adventure-caravan": {
  "palette": "sun",
  "pieces": [
   {
    "asset": "storage-barrel",
    "point": [
     313,
     224
    ],
    "width": 35
   },
   {
    "asset": "grass-clump",
    "point": [
     246,
     825
    ],
    "width": 30
   }
  ]
 },
 "adventure-bio": {
  "palette": "grove",
  "pieces": [
   {
    "asset": "potion-shelf",
    "point": [
     327,
     200
    ],
    "width": 49
   },
   {
    "asset": "hanging-herbs",
    "point": [
     227,
     788
    ],
    "width": 42
   }
  ]
 },
 "adventure-radar": {
  "palette": "storm",
  "pieces": []
 },
 "groenkloof": {
  "palette": "garden",
  "pieces": []
 },
 "glass-dunes": {
  "palette": "sun",
  "pieces": [
   {
    "asset": "rock-stack",
    "point": [
     360,
     216
    ],
    "width": 57
   }
  ],
  "lights": [
   [
    1040,
    650,
    50,
    "gold"
   ]
  ]
 },
 "metro-refuge": {
  "palette": "metro",
  "pieces": [
   {
    "asset": "wall-map",
    "point": [
     988,
     156
    ],
    "width": 51
   }
  ],
  "lights": [
   [
    321,
    672,
    55,
    "gold"
   ],
   [
    1314,
    419,
    55,
    "cyan"
   ],
   [
    716,
    175,
    42,
    "cyan"
   ]
  ]
 },
 "sluice": {
  "palette": "metro",
  "pieces": [
   {
    "asset": "wall-lamp",
    "point": [
     1307,
     319
    ],
    "width": 23
   }
  ]
 },
 "railworks": {
  "palette": "metro",
  "pieces": [
   {
    "asset": "wall-lamp",
    "point": [
     1307,
     319
    ],
    "width": 23
   }
  ]
 },
 "deepwater": {
  "palette": "metro",
  "pieces": [
   {
    "asset": "wall-lamp",
    "point": [
     1264,
     192
    ],
    "width": 24
   },
   {
    "asset": "pressure-valve",
    "point": [
     1271,
     844
    ],
    "width": 42,
    "mount": "wall"
   }
  ]
 },
 "cooling-refuge": {
  "palette": "ember",
  "pieces": [],
  "extensions": [],
  "lights": [
   [
    1205,
    434,
    55,
    "ember"
   ],
   [
    263,
    595,
    50,
    "gold"
   ]
  ]
 },
 "heatworks": {
  "palette": "ember",
  "pieces": [
   {
    "asset": "pressure-valve",
    "point": [
     287,
     878
    ],
    "width": 47,
    "mount": "wall"
   },
   {
    "asset": "cooling-fan",
    "point": [
     1308,
     493
    ],
    "width": 62,
    "mount": "wall"
   }
  ]
 },
 "condensers": {
  "palette": "ember",
  "pieces": [
   {
    "asset": "pressure-valve",
    "point": [
     287,
     878
    ],
    "width": 47,
    "mount": "wall"
   },
   {
    "asset": "cooling-fan",
    "point": [
     1308,
     493
    ],
    "width": 62,
    "mount": "wall"
   }
  ]
 },
 "tower": {
  "palette": "ember",
  "pieces": [
   {
    "asset": "pressure-valve",
    "point": [
     287,
     878
    ],
    "width": 47,
    "mount": "wall"
   },
   {
    "asset": "cooling-fan",
    "point": [
     1308,
     493
    ],
    "width": 62,
    "mount": "wall"
   }
  ]
 },
 "lanternwood": {
  "palette": "garden",
  "pieces": [],
  "lights": [
   [
    260,
    489,
    52,
    "gold"
   ],
   [
    1194,
    529,
    53,
    "gold"
   ],
   [
    670,
    795,
    55,
    "pink"
   ]
  ]
 },
 "crystalfalls": {
  "palette": "storm",
  "pieces": [
   {
    "asset": "crystal-cluster",
    "point": [
     264,
     267
    ],
    "width": 39
   }
  ]
 },
 "coppercrown": {
  "palette": "ember",
  "pieces": [
   {
    "asset": "grass-clump",
    "point": [
     287,
     845
    ],
    "width": 35
   }
  ]
 },
 "rain-garden": {
  "palette": "garden",
  "pieces": [
   {
    "asset": "flower-patch",
    "point": [
     371,
     289
    ],
    "width": 31
   },
   {
    "asset": "fern",
    "point": [
     1259,
     454
    ],
    "width": 40
   },
   {
    "asset": "hanging-herbs",
    "point": [
     1285,
     810
    ],
    "width": 42
   }
  ]
 },
 "quiet-apartments": {
  "palette": "sun",
  "pieces": [
   {
    "asset": "fern",
    "point": [
     318,
     827
    ],
    "width": 35
   }
  ]
 },
 "hidden-atelier": {
  "palette": "sun",
  "pieces": [
   {
    "asset": "tool-rack",
    "point": [
     315,
     275
    ],
    "width": 55,
    "mount": "wall"
   },
   {
    "asset": "wall-map",
    "point": [
     1222,
     273
    ],
    "width": 47
   },
   {
    "asset": "hanging-herbs",
    "point": [
     299,
     809
    ],
    "width": 39
   }
  ]
 }
};
