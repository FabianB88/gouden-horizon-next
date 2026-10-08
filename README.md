# Gouden Horizon Next

Een aparte ontwikkelversie van Gouden Horizon. De bestaande `FabianB88/gouden-horizon`-game blijft onaangetast.

De oorspronkelijke geschilderde wereld en beginillustratie zijn hersteld. De vervangen wereld met generieke materiaalvloeren en losse objecten is op verzoek teruggetrokken: toekomstige verbeteringen moeten de bestaande sfeer, compositie, gebouwen en routes behouden en gericht verrijken.

De 24 hoofdhoofdstukken, optionele wijken, Nederlands/Engels, RPG-systemen en terugkeer na sterven blijven beschikbaar. Next gebruikt eigen opslag onder `gouden-horizon-next-*`, zodat voortgang van de bestaande game gescheiden blijft. Voortgang uit de tijdelijke modulaire versie blijft bruikbaar; opgeslagen posities in de drie prototypehuizen keren terug naar het bijbehorende tussengebied.

Alle kaarten worden voor de start gedownload. Op desktop worden alle kaarten vooraf gedecodeerd; mobiel bewaart de downloads en bereidt kaarten per gebied voor om geheugen te sparen. De snellere voorbereiding van karaktervarianten blijft behouden.

## Lokaal en publiceren

`npm start` serveert deze map. `npm run site:build` maakt `dist/`. GitHub Pages publiceert `main` vanaf `/`.

Publiceer uitsluitend in **FabianB88/gouden-horizon-next**. Gebruik nooit de bestaande Gouden Horizon-repository als remote.

## Bewaarde assets en prototype

De volledige assetbank staat lokaal buiten deze repository. De geselecteerde exports en zes met ingebouwde ImageGen gemaakte vloermaterialen blijven in `assets/world-next/`; prompts staan in `qa/next-art-prompts.json`.

De modulaire prototypebestanden `src/world-*.js` blijven bewaard voor hergebruik en worden niet door de actieve game geladen. De drie nieuwe prototypehuizen zijn niet actief. De oude `qa/next-*.json`-rapporten en `qa/next-world-tests.mjs` horen bij dat teruggetrokken prototype en beschrijven niet de huidige wereld.

`npm test` controleert het herstel van artwork en geometrie, wijkwissels, respawn, verhaal, taal en renderbudget. `test:legacy` bevat de volledige oorspronkelijke controles. Aanvullende assets mogen pas worden ingepast na controle van het daadwerkelijke beeld en de route erlangs.
