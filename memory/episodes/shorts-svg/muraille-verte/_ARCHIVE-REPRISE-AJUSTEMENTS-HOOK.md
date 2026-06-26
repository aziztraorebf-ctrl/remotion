> ⛔⛔ ARCHIVE — NE PAS UTILISER POUR AGIR (archivee 2026-06-24). Le hook (Beat 1) est FINAL, le Beat 2 aussi.
> Ce fichier decrivait le hook "en cours" + des pistes abandonnees (d3-geo, vue de coupe, image-cible wuar68 rejetee).
> SOURCE DE VERITE ACTUELLE = [[ETAT-GGW-MURAILLE-VERTE]]. Conserve uniquement pour l'historique des 8 acquis methode.

# (ARCHIVE) REPRISE — HOOK Grande Muraille Verte (etat au 2026-06-23)

## ⭐⭐ ETAT ACTUEL (session 2026-06-22->23) — HOOK VIVANT PROUVE + METHODE COMPLETE
> Le hook a ete REFAIT entierement sur une nouvelle direction prouvee. La version d3-geo/carte est ABANDONNEE pour le hook
> (carte geo-realiste s'effondre en SVG). Nouvelle base = SCENE NARRATIVE ENCRE animee avec pilotage couleur.

**HOOK VIVANT v4 (dernier) : https://files.catbox.moe/uwp4gq.mp4** — `src/projects/_rnd/svg-scenes/GgwHookEncreVivant.tsx`
(compo `RND-GgwHookEncreVivant`, 1080x1920, 210f). Scene "le mur fier ecrase par l'immensite" :
dunes ecrasantes + soleil + 2 lignes d'arbres + pelle. REGISTRE = ENCRE narrative. SEQUENCE COULEUR TIMEE :
pelle coloree d'emblee -> arbres se construisent un a un (avant-plan->horizon) + virent au VERT -> soleil s'embrase (or+glow+rayons) ;
le DESERT reste en encre. Arbres = 4 vrais arbres GPT-5.5 (`ggwTreesGpt.ts` : acacia parasol/rond/jeune/arbuste), varies par profondeur.

**METHODE GRAVEE cette session (8 acquis majeurs)** — detail : `memory/doctrines/SVG-FAISABILITE-AMONT.md` +
`memory/doctrines/templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md` :
1. CAUSE RACINE ecart esthetique : on visait l'INFAISABLE (gravure-musee wuar68 = milliers de hachures). 
2. CALIBRER l'image-cible au NIVEAU SVG faisable (partir d'une frame de proto qui marche). Prouve par render.
3. IMAGE-CIBLE = SVG NATIF de Gemini 3.1 Pro + GPT-5.5 (pas de raster intermediaire) -> ecart nul par construction.
   Verif modeles : PAS de gpt-5.5-image (le bon = gpt-5.4-image-2) ; 3.1-pro = vision/SVG (pas de raster), 3.1-flash-image = raster.
4. SCENE NARRATIVE > SCHEMA ANNOTE (decouverte Aziz) : penser MOMENT + 4-5 objets-heros qui RACONTENT (cf piece Senegal),
   pas coupe/blueprint annotee. Donner une REF narrative (pas une planche). 
5. ENCRE = MEILLEUR CANEVAS pour le PILOTAGE COULEUR SEMANTIQUE (monde mort en encre, vie en couleur timee). chaud-medaille = deja colore = moins de munition.
6. "CHAQUE TRAIT du LLM = un ARBRE" (idee Aziz) : reutiliser les hachures que le LLM a plantees comme POSITIONS d'arbres (zero devinette, fidele a sa compo).
7. VRAIS ARBRES : generer 4 arbres SVG via LLM (GPT-5.5 GAGNE : acacia parasol structure) -> raffiner/varier/coloriser en code.
8. CONTROLE TOTAL element par element (ajouter/supprimer/coloriser/animer) = l'avantage SVG vs video IA. Efface hachures, garde arbres.

**OUTILS CREES** : `scripts/tools/svg-scene-libre.py` (SVG natif depuis brief + style-ref) · `svg-from-image-target.py` (test ecart) ·
`svg-ideation-vues.py` (idees de vues par LLM) · `gemini-gen-image-ref.py` · `svg-faisabilite-brief.py`.
**REFS** : `public/_shared/refs/svg-registres/` (1 image par registre + REF narrative piece) · protos sauvegardes `out/_r-and-d/svg-scenes-refs/` (+5).
**BIBLIOTHEQUE prompts-cibles par registre** : `memory/doctrines/templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md` (regle Aziz : 1 prompt+ref par registre, pas un prompt unique).

**▶ RESTE (prochaine session)** :
- POLISH hook : soleil qui pulse plus fort · ombres arbres · SFX time (vent + pousse). 
- AUDIO GeoAfrique : lock script v1 (`SCRIPT-PILOTE-v1.md`, scan TTS "echoue"/"plantes-revenus") -> narration ElevenLabs -> mesure ffprobe -> CALER le timing du hook (le se-dessine) sur la voix.
- BEATS 2-6 : appliquer la meme methode (scene narrative + image-cible=SVG natif + colorisation timee). Beat 4 (demi-lune) = on a deja `DemiLuneEncreColorisee` + le proto arbre-hachure.
- Trancher : garde-t-on ENCRE pour tout le short (raccord + canevas couleur) ou A/B avec un 2e registre ?

---

## (HISTORIQUE) Ajustements initiaux du hook — 2026-06-22 (traites cette session)
> Les 3 ecarts ci-dessous ont mene a la refonte ci-dessus. Reference cible initiale = `https://files.catbox.moe/wuar68.png`.
> ⚠️ LECON : wuar68 (gravure-musee) etait une cible INFAISABLE en SVG -> remplacee par le calibrage niveau-SVG (acquis 2).

## ⚠️ ECART 1 — ESTHETIQUE : l'encre de l'agent = APLAT PLAT, pas GRAVURE
L'agent a produit du vectoriel PROPRE (frontieres nettes, arbres aplats verts sur parchemin). C'est lisible/elegant MAIS
ce N'EST PAS le registre encre de la reference `wuar68.png` (panneau ENCRE droite) qui est une VRAIE GRAVURE / PLANCHE DE
NATURALISTE :
- trait d'encre ORGANIQUE, vivant, legerement irregulier (plume sur parchemin)
- HACHURES (sol, ombres) + LIGNES DE CONSTRUCTION techniques (pointilles, cotes) = rendu "carnet d'explorateur/botaniste"
- arbre DETAILLE grave (nervures feuilles, fibres racines), CHARGE de matiere au bon sens ("document d'etude")
- vs l'agent = "infographie propre" plate. Difference = gravure-naturaliste VS aplat-vectoriel.
POURQUOI l'agent a diverge : il n'avait PAS `wuar68.png` sous les yeux (erreur de brief Claude). Le registre `encre` du
generateur produit du trait propre, pas le niveau de hachure/gravure de cette ref precise.
-> PROCHAINE SESSION : redonner `wuar68.png` (panneau encre) comme IMAGE-CIBLE explicite. Pousser le registre encre vers la
   GRAVURE : hachures sur le sol/les pays, trait vivant, lignes de construction techniques, arbres graves (pas aplats).
   (Idem affiner braise vers sa ref si besoin.) NB : la ref est en vue de FACE/coupe, nous on est en top-down/iso — les
   PRINCIPES (hachure, trait grave, lignes de construction) s'appliquent quand meme.

## ⭐⭐ ECART 2 (le PLUS IMPORTANT) — MOUVEMENT : exploiter "le SVG SE DESSINE bit-by-bit, pilote par la VOIX"
Vision Aziz : la vraie PUISSANCE du SVG (vs une video IA) = chaque partie est MODULABLE et peut se DESSINER trait par trait,
synchronise a la voix. Dans la version de l'agent, la carte s'affiche d'un coup + arbres apparaissent en bloc. C'est sous-
exploite. Ce qu'on VEUT (et qui PROUVE qu'on fait du SVG) :
- la CARTE qui SE TRACE (frontieres se dessinent a l'encre, "la main qui dessine") pendant que la voix parle -> stroke-dasharray anime.
- les HACHURES du sol qui se REMPLISSENT progressivement.
- chaque ARBRE qui SE CONSTRUIT (tronc -> branches -> feuilles) sur un mot.
- les COTES / annotations techniques qui s'INSCRIVENT une par une.
Technique = `stroke-dasharray`=longueur + `stroke-dashoffset` anime L->0 (= la main qui trace), deja dans la doctrine
[[SVG-SCENES-GENERATIVES]] (grammaire "SE CONSTRUIT" / fleches tracees) mais PAS applique au hook. C'est CA notre signature.

## ORDRE PROUVE pour la prochaine session (audio-derived devenu instrument)
1. GENERER L'AUDIO (narration GeoAfrique du script v1 — lock TTS d'abord) + les SFX.
2. PUIS caler l'apparition de CHAQUE element (carte qui se trace, arbres qui se construisent, cotes qui s'inscrivent) SUR la voix,
   bit-by-bit. Tests d'apparition "doucement mais surement". C'est la ou on exploite la modularite totale (fond/arbres/carte separes).
3. Affiner l'esthetique gravure (ecart 1) en parallele.

## ETAT (rappel) — tout commite, rien perdu
- 5 commits branche `feat/shorts-svg-muraille-verte` (60a52e4, dd853f8, 684e2e7, ad5f416, effd1ae).
- Hook braise anime : `GgwD3GeoMap.tsx` (+SFX `GgwD3GeoMapSFX`). Hook encre : `GgwD3GeoMapEncre.tsx` (+SFX `GgwD3GeoMapEncreSFX`).
- Carte = `public/_shared/geo-data/ggw/ggw-countries.geojson` (11 pays). Arbres = `geminiTrees.ts` (Gemini reutilises).
- Rendus actuels (a DEPASSER) : encre+SFX 9e2vw4 · braise+SFX voafm4. Cible esthetique = wuar68.png (encre).
- ✅ TEST AGENT VIERGE REUSSI : l'agent a reproduit le hook encre du 1er coup = doctrine reproductible. Trous remontes :
  (a) pas de SFX "fletrissement organique" dedie ; (b) `loop` audio fonctionne en render headless (a graver) ; (c) l'agent
  avait besoin de l'IMAGE-CIBLE precise (wuar68) pour viser la bonne esthetique — sans elle il fait du propre-plat.

## ⭐⭐ ECART 3 (idee Aziz, peut-etre LE plus puissant) — REVENIR A LA VUE DE FACE / COUPE
Aziz : la vue comme dans `REF-3-registres-vue-face.png` (= wuar68, sauvegarde dans cet episode + `public/_rnd/ref-3-registres-vue-face.png`)
est peut-etre PLUS PUISSANTE que le top-down. RAISON (analyse Claude, d'accord) : notre angle est SOUTERRAIN.
- Top-down (carte) montre OU (geo, impersonnel, plan large). Vue de COUPE montre CE QUI SE PASSE + le DESSOUS du sol.
- Notre coeur = "la solution etait SOUS le sable" (racines dormantes, eau qui s'infiltre, nappe +17m). SEULE la coupe montre ca.
- Coupe = 2 etages animables separement (ciel/surface + sous-sol) + gros plan incarne (espoir) vs carte = plan large froid.
ARBITRAGE PROPOSE (ne pas choisir, ENCHAINER) : carte top-down = le HOOK (ampleur : 8000km, 11 pays, ca rate) ->
vue de COUPE = le COEUR (B3 malentendu, B4 demi-lune, B5 racine qui repart + nappe +17m). 2 vues, 2 roles.
ADAPTATION SCRIPT -> COUPE (idees) :
- "arbres assoiffes dans un sol mort" = arbre de face qui fane, racines courtes, sol sec craquele en coupe.
- "le desert ne s'arrete pas avec un mur" = barrer l'image fausse -> sol qui se degrade PAR EN DESSOUS.
- "cuvette qui capte la pluie" = la DEMI-LUNE EN COUPE (DEJA PROUVEE : DemiLuneEncreColorisee/BraiseAnimee).
- ⭐ "reveille des racines deja vivantes sous le sable" = le SOUS-SOL s'illumine, racines grises -> vert/or. Plan que SEULE la coupe permet.
- "la nappe remonte de 17 metres" = jauge VERTICALE dans le sous-sol, l'eau qui monte. Lisible uniquement en coupe.
ℹ️ ON A DEJA cette vue = `DemiLuneEncreColorisee.tsx` / `DemiLuneBraiseAnimee.tsx` (beat 4). RESTE = la pousser au niveau
   GRAVURE-naturaliste (ecart 1) + lui appliquer le TRACE progressif (ecart 2). La vue "se dessine bit-by-bit" marche ENCORE
   MIEUX en coupe (planche d'etude : ciel -> ligne de sol -> arbre qui monte / racines qui descendent -> eau -> cotes, au rythme de la voix).

## RESTE APRES LE HOOK
Storyboard v2 (vision Aziz : B2 mort stylisee, B3 image-fausse-barree, B4 demi-lune verticale native, portraits Rinaudo/
Sawadogo N&B, B5 demultiplication, B6 outro boucle) + produire beats 2-6 dans le(s) registre(s) retenu(s) + assemblage 2 versions.
