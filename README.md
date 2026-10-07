# Gouden Horizon Next · 9.0

Een aparte, speelbare editie van Gouden Horizon, met een wereld opgebouwd uit herbruikbare afbeeldingen en materiaalvloeren. De bestaande `FabianB88/gouden-horizon`-site blijft een zelfstandig spel.

- Alle 47 gebieden gebruiken de nieuwe opbouw, inclusief drie rustige huisinterieurs met een bewoner.
- Zes nieuwe vloermaterialen en scherpe afzonderlijke gebouwen, bomen en objecten vervangen de vergrote gebiedsschilderingen. Grondmaterialen herhalen op vaste schaal; objecten worden in verhouding getekend.
- De scene beschrijft zowel de zichtbare objecten als hun grondcontact. Oude geschilderde obstakels worden niet meer gebruikt. Getekende routes houden een brede vrije doorgang; de zijwijkhekken hebben een echte opening.
- De 24 hoofdhoofdstukken, optionele wijken, RPG-systemen, moeilijkheid en respawnkeuze blijven beschikbaar. De drie nieuwe huizen zijn optioneel en verplaatsen geen hoofdmissie.
- Nederlands en Engels. Nieuwe voortgang, instellingen en records gebruiken uitsluitend `gouden-horizon-next-*`-opslag. Er wordt geen voortgang uit de bestaande game overschreven of automatisch overgenomen.
- Alle gebruikte spelbeelden worden vóór Start geladen en gedecodeerd. Telefoons krijgen kleinere gedecodeerde wereldbeelden met dezelfde schaal. Alle 58 navigatiegrids worden vooraf voorbereid; verbindingen worden pas uitgewerkt wanneer een route ze nodig heeft.

## Lokaal en publiceren

`npm start` serveert deze map. `npm run site:build` maakt de statische game in `dist/`. Deze bronmap kan ook rechtstreeks via GitHub Pages worden gepubliceerd vanaf `main` en `/`.

Publiceer deze editie uitsluitend in **FabianB88/gouden-horizon-next**. Gebruik de bestaande Gouden Horizon-repository niet als remote.

## Wereld en assets

`src/world-design.js` is de centrale sceneopbouw: materialen, paden, vrije benaderingen, objecten, voetafdrukken en hekken. `src/world-assets.js` beschrijft de afzonderlijke afbeeldingen; `src/world-render.js` tekent ze met diezelfde afmetingen. Bomen en gebouwen sorteren op diepte; een object voor de speler wordt transparant. `src/world-interiors.js` bevat de huizen en hun bewoners.

De complete, nog niet gebruikte assetbank blijft lokaal buiten deze repository. De game laadt alleen de gekozen wereldafbeeldingen. De zes nieuwe materialen zijn gemaakt met de ingebouwde ImageGen; de prompts staan in `qa/next-art-prompts.json`. De kleine gebiedsvoorbeelden zijn gerenderd uit de echte scenes en worden uitsluitend in menu's gebruikt.

## Controle

`npm test` controleert de nieuwe routes en alle interactieplekken, huizen en poorten, hoofdverhaal, balans, taal, wijkwissels, respawn en renderbudget. `qa/next-browser-result*.json` bevat gerichte desktop- en mobiele browsercontroles. Dit is geen volledige handmatige campagne-playthrough of meting op een echte Android-telefoon.

De oude releasegeschiedenis staat in `qa/legacy-release-notes.md`. `test:legacy` bewaart de oorspronkelijke uitgebreide suite, inclusief geometrie- en beeldfixtures van de oude schilderingen; die fixtures zijn geen contract voor deze nieuwe wereldopbouw.
