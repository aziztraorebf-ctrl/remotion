Un id de composition "propre" dans Root.tsx (ex `<Composition id="SoudanActe3" component={SoudanActe3}>`,
sans suffixe) N'IMPLIQUE PAS que c'est la version ACTIVE/actuelle — Root.tsx n'est jamais nettoye des vieux
ids apres un refactor (ex passage Mapbox -> Globe D3). Le vrai fichier actif peut porter un id moins
evident (`D3-SoudanActe3-Section1Globe`, `D3-SoudanActe3-GlobeInsert`).

**Pourquoi** : 2 agents differents (meme session, 2026-07-22) se sont trompes sur ce point pour l'Acte
3/4/5 du mid-form Soudan — le 1er a edite les fichiers `warmap/soudan-acteN/SoudanActeN.tsx` (id propre)
en les croyant actifs, un 2e (re-timing) a fait la meme erreur en se re-fiant a l'id propre de Root.tsx
malgre un brief explicite le contredisant. Root.tsx contient des dizaines de compositions de test/proto
`D3-*` a cote des ids "de production" herites — rien dans le nommage ne signale lequel est perime.

**Comment trancher avec certitude (dans cet ordre, le plus rapide d'abord)** :
1. `npx remotion still src/index.ts <id-propre> out.png --frame=N` — si ca CRASH avec
   `Error: Failed to initialize WebGL` / `mapbox-gl.js`, c'est un composant Mapbox WebGL headless
   (souvent le VIEUX registre perime dans ce projet, ou en tout cas necessite `render-mapbox.sh`
   specifiquement, jamais `npx remotion render` brut).
2. Extraire une frame du VRAI mp4 livre (`out/episodes/.../a{N}.mp4`) et comparer visuellement : globe
   D3 orthographique (courbure de sphere, halo atmospherique sur les bords) vs carte Mapbox plate
   rectangulaire — signature visuelle nette, aucune ambiguite possible.
3. Lire `memory/episodes/<projet>/STATUS.md` en entier pour la mention explicite "PROMU FINAL" /
   "PERIME" par acte (source de verite narrative, mais a confirmer par 1 ou 2 ci-dessus si le doute
   persiste — STATUS.md peut aussi etre partiellement perime, cf [[feedback_relire-lecon-avant-geste-similaire]]).

**How to apply** : des qu'un agent (ou moi) s'apprete a modifier/re-render un fichier "acte"/"scene" dans
un projet qui a connu un refactor de moteur (Mapbox->D3, ou toute migration similaire), NE JAMAIS se fier
au nom de composition seul. Verifier par render-still + comparaison visuelle AVANT tout edit, surtout si
le fichier vit dans un dossier "propre" (`warmap/`) plutot qu'un dossier explicitement marque proto/rnd
(`_rnd/d3-16x9/`) — c'est contre-intuitif mais ici c'est le dossier _rnd/ qui contient le code ACTIF.
