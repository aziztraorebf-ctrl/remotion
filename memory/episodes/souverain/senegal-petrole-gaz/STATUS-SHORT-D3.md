# STATUS — Senegal Petrole & Gaz — Short vertical D3.js (9:16, SVG pur)

Mis a jour : 2026-07-17 — ✅✅ SHORT COMPLET TERMINE + VALIDE + PROMU PRET-PUBLICATION

## ETAT : ✅ TERMINE

Derive de la video longue (`senegal-petrole-gaz`, PRET-PUBLICATION), registre inspire du
Short AES 90s. Projet : `src/projects/souverain/senegal-petrole-gaz-short-d3/`.

⭐ **LIVRABLE FINAL** : `out/PRET-PUBLICATION/senegal-petrole-gaz-short-d3-FINAL.mp4` (112.96s, full HD
1080x1920, narration + musique AES + SFX complets). Composition assemblee = `SenegalShortD3-COMPLET`
(`ShortComplet.tsx`, 3387f). NEXT = programmer la publication (TryPost Shorts+IG+FB, cf. tools/trypost.md).

| Beat | Fichier | Etat |
|---|---|---|
| Beat 1 Hook | Scene1Hook.tsx | ✅ VALIDE. Fissure devancee (BREAK -24f) + etalee (retour Aziz final) |
| Beat 2 Paradoxe | Scene2Paradoxe.tsx | ✅ VALIDE. `beat2-FINAL.mp4`. Anneaux gisements navy+or epais + remplissage 60% hachures densifiees/ralenti (fixes finaux) |
| Beat 3 Comparaison (climax) | Scene3Comparaison.tsx | ✅ VALIDE. `beat3-FINAL.mp4`. Coffre CIRCULAIRE door-swing sur les 3 pays |
| Beat 4 (FONSIS, dette 132%) | Scene4Dette.tsx | ✅ VALIDE. `beat4-FINAL.mp4`. Baril FONSIS (couleurs SN + cadenas) -> calebasse monte |
| Beat 5 (CTA, calque AES) | Scene5Cta.tsx | ✅ VALIDE. `beat5-FINAL.mp4`. Calebasse deborde -> cartouche CTA + fondu sortie |
| ASSEMBLAGE COMPLET | ShortComplet.tsx | ✅ VALIDE + PROMU. `SenegalShortD3-COMPLET`, 5 beats + audio complet |

### AUDIO (dans ShortComplet.tsx)
- Narration : `public/souverain/senegal-petrole-gaz-short-d3/audio/narration-v1.mp3` (109.9s).
- Musique : AES `_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3` vol 0.12, fondu sortie.
- SFX (vol >=0.50, regle projet) : ping cartes/gisements, tick count-up 60%, pop drapeaux, VERROU coffre
  (`ui/vault-lock.mp3` genere ElevenLabs, Norvege+Botswana), baril-fill + stamp (FONSIS), drain (debordement),
  TYPEWRITER (`ui/typewriter.mp3` genere ElevenLabs, pont Beat 3), 3 node-appear (accroches CTA).
  ⛔ SFX snap a 17s RETIRE (indesirable). inkdraw sur cartes RETIRE -> ping discret (retours Aziz).
- Fin rallongee a 112.96s (+3s apres "lien en description") + fondu doux video/musique.

### ⚠️ CONTINUITE CALEBASSE Beat 4 <-> Beat 5 (architecture cle)
La calebasse-dette est un composant PARTAGE `CalebasseDettePartagee.tsx` pilote par TEMPS ABSOLU de
narration (`tAbs`), PAS par frame locale. Raison : elle vit a cheval sur Beat 4 (monte de 82.4s) ET
Beat 5 (deborde ~100.8-101.4s, juste avant le cartouche CTA a 101.7s). Meme formule dans les 2 beats
=> continuite EXACTE au raccord (verifie par calcul : 78% fin Beat 4 -> 84% debut Beat 5, zero saut).
Constantes de calage dans `CalebasseDettePartagee.tsx` : CALEB_START=82.4, CALEB_FULL=100.8.
⚠️ A L'ASSEMBLAGE : les 5 beats mis bout-a-bout doivent respecter le calage temporel absolu (chaque
Scene garde son T_OFFSET) pour que la calebasse reste continue. Gap narratif 96.74->97.88s (1.14s)
entre fin Beat 4 et debut Beat 5 a gerer selon le calage audio final.

### Assets Beat 4-5 (reutilisables)
- Baril FONSIS : `BarilJaugeIcon` partage + `Cadenas` (local Scene4Dette, geometrie verifiee calcul).
- Calebasse-dette : `CalebasseDettePartagee.tsx` (SOURCE DE VERITE, pilotee tAbs). Proto obsolete
  `ProtoCalebasseDette.tsx` (compo `SenegalShortD3-ProtoCalebasseDette`) — a supprimer au menage.

Les 3 pays verifies avec le composant circulaire (Congo ouvert vide, Botswana diamants, Botswana
verrouille). Render complet Beat 3 fait, valide Aziz, promu `beat3-FINAL.mp4` puis integre a
l'assemblage complet promu PRET-PUBLICATION (cf. en-tete).

⭐ LECON DE SESSION GRAVEE EN MEMOIRE : le coffre a pris 5 essais sur 2 sessions a cause d'un
anti-pattern (deviner le transform d'animation + corriger au render). Nouveau feedback
`feedback_animer-objet-mecanique-svg-verifier-par-calcul` (memory de navigation + pointeur dans
SVG-FAISABILITE-AMONT.md) : tout objet SVG mecanique anime (porte/couvercle/bras) = MODELISER +
verifier PAR CALCUL avant le render, escalade a 2 essais rates. Mecanique retenue = door-swing
circulaire : porte = disque `scale(sx,1)` autour d'un bord fixe (Y invariant -> zero debordement),
PAS `rotate()` sur un rectangle.

---

## HISTORIQUE — les 5 retouches coffre Beat 3 (codees 2026-07-16, ✅ VALIDEES Aziz + integrees a l'assemblage promu)

> Section conservee pour la valeur pedagogique (methode rig-first + door-swing). Toutes ces retouches
> ont ete VUES ET VALIDEES par Aziz, puis le coffre a ete refait en circulaire (cf. LEÇON GRAVEE plus
> haut) et integre au Short final promu. Rien a faire ici — PROCHAINE ACTION reelle = publication (en-tete).

Les 5 points demandes par Aziz sur le v4 ont tous ete codes dans `CoffreFortAnime`
(Scene3Comparaison.tsx) :

1. **Porte qui flottait** -> corrige : nouveau SVG rig-first (point 2) avec pivot natif exact,
   plus de decalage geometrique entre battant et corps.
2. **Coffre regenere via GPT-5.6 Sol RIG-FIRST** : hierarchie reellement imbriquee
   `corps > porte > cadran` (verifiee en XML), pivots exacts fournis par le modele
   (`DOOR_PIVOT_X=-96`, `DIAL_PIVOT_X=98` en repere local porte). Fichiers de preuve :
   `out/_rnd/senegal-short-d3-coffre/coffre-sol.svg` + `coffre-sol-raw.json` + `coffre-sol.png`.
   Sous-probleme decouvert et corrige en cours de route : le bras de levier reel du pivot Sol
   (~288u) est bien plus long que l'ancien `HINGE_X` approxime -> a grande amplitude d'ouverture
   (-100deg), la porte projetait tres loin du corps et se lisait comme un **second coffre
   fantome grise** (bug reel, pas un artefact de rendu -- verifie par calcul geometrique). Fix :
   amplitude reduite a -78deg + un `scale(doorPerspScaleX,1)` centre sur la charniere qui simule
   un raccourci en perspective (porte qui pivote "vers le spectateur" plutot que de glisser a
   plat), + `vectorEffect="non-scaling-stroke"` sur chaque element trace de la porte pour que les
   traits ne s'ecrasent pas sous le scaleX. Un 2e bug de timing a suivi : `fCloseStart` (debut de
   fermeture) etait cale a `fVerdictIcon+30`, avant la fin du fade-in de la porte (`doorOp` fini a
   `local=36`) -> la porte apparaissait semi-transparente (opacity~0.4) et se lisait a tort comme
   "grise/desaturee" alors que c'etait juste un blend navy+parchemin en cours de fondu. Fix :
   `fCloseStart = fVerdictIcon+46` (laisse la porte finir son fade-in avant de se refermer).
3. **Contenu interieur** : diamants Botswana regeneres via GLM-5.2 (vrais diamants facettes,
   eparpilles, tailles variees -- remplace les pentagones plats). Norvege : lingots d'or +
   pieces empiles (tranche par Aziz en session : lingots/pieces d'or, pas de baril ni billets).
   1er jet GLM des lingots juge casse (3 lingots fusionnes en un tas illisible, chevauchement) ->
   reconstruit a la main avec un espacement plus genereux (`lingots-fix.svg`), valide visuellement
   avant integration. Fichiers preuve : `out/_rnd/senegal-short-d3-coffre/diamants-lingots-raw.json`,
   `lingots-fix.svg/png`, `diamants.png`.
   Congo-Brazzaville : PAS de contenu affiche (coherent avec le recit "sans coffre verrouille,
   cet argent s'evapore" -- la porte reste ouverte en permanence mais vide, jamais tranche
   autrement).
4. **Taille reduite ~25%** : `coffreScaleGlobal` 1.55 -> 1.16.
5. **Rythme d'apparition ralenti** : `bodyDrawT` 26->46 frames, `popSpring` stiffness 140->80,
   apparition de la porte decalee en consequence (26->36 frames locales au lieu de 8->16).

**Verifie par render (stills + mini-video)** : porte ouverte + lingots (Norvege), porte fermee
verrouillee (Norvege), porte ouverte + diamants (Botswana) -- les 3 etats rendent correctement,
plus de fantome, couleurs navy/or coherentes. **PAS encore vu par Aziz** -- prochaine etape :
visionnage + validation, puis render complet du Beat 3 si accepte.

Tout le reste du Beat 3 (carte agrandie, drapeau flag-fill, titre z-order, karaoke 3 mots,
texte final typewriter +50%) reste valide par Aziz sur le v4, NE PAS retoucher sans raison.

### Lecon methodologique (a retenir pour tout futur SVG rig-first avec pivot excentre)

Un pivot de rotation geometriquement correct (verifie en XML, hierarchie bien imbriquee) ne
suffit PAS a garantir un resultat visuellement lisible : si le bras de levier est long relativement
a la taille de l'objet, une grande amplitude de rotation 2D pure projette l'element loin de son
point d'ancrage visuel (lu comme un objet independant), tandis qu'une petite amplitude le fait
se superposer platement a l'objet parent. Le fix generalisable : simuler la 3e dimension via un
`scale` non-uniforme centre sur le pivot (raccourci en perspective) plutot que de choisir entre
"trop loin" et "superpose plat" en 2D pur -- et compenser systematiquement les strokes avec
`vectorEffect="non-scaling-stroke"` pour que l'epaisseur de trait reste correcte sous ce scale.

---

## LECONS DE LA SESSION PRECEDENTE (2026-07-16, avant reprise)

- **Gemini review sans storyboard = signal non fiable sur CE beat** : 3 runs independants (v1/
  v2/v3) ont reclame la meme palette sepia/terracotta fantome (`#5a4528`/`#b06a2c`/`#ece3cb`)
  qui n'existe nulle part dans le projet. Cause : ce beat n'a pas de storyboard de reference
  (code directement depuis script+whisper-words). Ne pas relancer `visual_review.py --model
  gemini` sur ce beat sans storyboard tant que ce n'est pas corrige -- ou accepter d'emblee
  que le score sera non pertinent et juger sur override trace + jugement Aziz direct.
- **`scripts/visual_review.py` gotcha reseau** : un appel Gemini est reste bloque 9m28s --
  `lsof -p <pid>` a revele une connexion TCP en `SYN_SENT` sur IPv6 (jamais etablie), pas un
  calcul lent. Le script n'a pas d'option force-IPv4 (contrairement a yt-dlp qui l'a deja).
  A corriger si ca se reproduit : ajouter un fallback IPv4 dans `visual_review.py`.
- **SVG plat vs rig-first** : l'icone coffre-fort generee par GPT-5.6 Sol au tour precedent
  (`icons-coffre-gptsol.json`, maintenant INUTILISEE) etait un dessin plat sans groupes
  separes -- impossible a animer proprement (porte qui pivote). Toujours demander la
  contrainte de rig EXPLICITEMENT dans le prompt de generation, jamais apres coup.
- **Geometrie Norvege** : le path Natural Earth brut inclut le Svalbard (iles a ~78-80N,
  tres loin du continent 58-71N) qui casse le cadrage. `norwayPath.ts` a ete regenere en
  filtrant sur le polygone principal + polygones proches (voisinage geographique), methode
  reproductible si on doit regenerer une geometrie de pays fragmente a l'avenir.
