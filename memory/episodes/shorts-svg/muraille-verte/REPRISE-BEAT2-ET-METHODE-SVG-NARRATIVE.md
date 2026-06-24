# ⭐ REPRISE — Beat 2 GGW + methode SVG narrative (POINT D'ENTREE, etat 2026-06-23 fin de session)

> ⛔ LIRE CECI EN PREMIER pour reprendre le chantier Short SVG Grande Muraille Verte. Tout est ici.
> Branche git : **`feat/shorts-svg-muraille-verte`** (voir section GIT en bas pour l'acces exact).
> Complement : [[REPRISE-AJUSTEMENTS-HOOK]] (detail du hook Beat 1, deja FINAL).

## OU ON EN EST (1 phrase)
Le **Beat 1 (hook) est FINAL et commite**. On a passe la session a debloquer la PRODUCTION DE SCENES NARRATIVES SVG
(4 echecs -> cause racine trouvee -> outil neuf qui marche). **Le Beat 2 a son image-cible prete, reste a le CODER.**

## ⭐⭐⭐ LA DECOUVERTE DE LA SESSION (ne pas re-tomber dedans)
Toute scene B2 derivait vers le SCHEMA TECHNIQUE (plan de coupe, cotes, grille). CAUSE RACINE : l'ancien outil
`svg-scene-libre.py` IMPOSAIT "lignes de construction + cotes" dans son prompt -> il forcait la planche d'ingenieur.
=> **TOUJOURS utiliser `scripts/tools/svg-scene-narrative.py`** (cree cette session) pour une scene qui RACONTE.
`svg-scene-libre.py` est DEPRECATED (garde seulement pour un vrai schema technique avec cotes).

## ⭐⭐ CE QUI EST PROUVE (acquis, ne plus questionner)
1. Le registre ENCRE tient la narration variee (c'etait l'OUTIL le probleme, pas le registre).
2. **Trait d'encre PUR** (brun-noir sur creme, ZERO aplat colore) produit de belles scenes lisibles.
3. **ZERO figure humaine/animale** (regle Aziz) : raconter par les OBJETS et les TRACES (esprit "pelle plantee").
4. Generer GPT + Gemini, juger scene par scene (pas de gagnant absolu : Gemini souvent plus riche, mais GPT a ete plus
   LISIBLE sur B2). Joindre 2 refs : `--narrative-ref` (une scene qui raconte) + `--style-ref` (le look/trait).
5. **Colorisation/animation = MARCHE** : on injecte le SVG encre dans Remotion et on l'anime. Test foyer prouve que ce qui
   fait VRAIMENT vivre une scene = l'ATMOSPHERE GLOBALE (lumiere qui change, crepuscule, ciel qui se teinte) > un element
   hyper-realiste. Showcase crepuscule : https://files.catbox.moe/frfpka.mp4 (le feu coince sous la marmite = moins bon).
6. **Whiteboard** (draw-on/draw-off, stroke-dashoffset) = MARCHE pour les TRANSITIONS/un geste-cle. PAS pour dessiner toute
   une scene en 5s (calage audio ingerable). Accent, pas defaut. Test : https://files.catbox.moe/q0gbay.mp4.

## ▶ PROCHAINE SESSION — PLAN DE MATCH (decide par Aziz)
**TACHE 1 (prioritaire) : CODER le Beat 2 "la ligne de mort au cordeau"** en contexte frais.
- Image-cible prete : `memory/episodes/shorts-svg/muraille-verte/cibles-svg/B2-cordeau-{gemini,gpt}.svg`
  (Aziz a retenu GEMINI mais GPT plus lisible -> RE-JUGER les 2 au demarrage). Groupes nommes : corde, piquet_g/d,
  arbre_1..5 separes, dune, racines, sol, outils.
- Scene = corde tendue entre 2 piquets (l'idee rigide) + 4-5 arbres alignes dont 3-4 morts + 1 survivant + dune qui
  avance + racines courtes + outils abandonnes (l'humain sans l'humain). Faire mourir les arbres un a un, coloriser le survivant.
- Audio B2 existe : `public/audio/ggw-muraille-verte/narration-beat2.mp3` (19.04s). Alignment global dispo. Caler dessus.
- ⭐ IDEE AZIZ : ne PAS forcer la continuite. Une scene qui assume un SAUT (coupure franche) > prolonger le meme monde.
  A tester comme concept ("ca ne marche pas en continu -> on fait un saut"). Plus de marge creative.

**TACHE 2 : foyer = candidat TEMPLATE** (`enc-foyer-gemini`, catbox u5q06r). Pousser comme template reutilisable.

**TACHE 3 : graver la doctrine** une fois B2 valide (PAS avant) dans `templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md`
(la regle scene-narrative + whiteboard y sont deja). + MIX-AND-MATCH GPT<->Gemini (copier un <g id> d'un SVG a l'autre, prouve).

**TACHE 4 (session dediee separee) : CHANTIER ANTI-FOUILLIS SVG**. Le systeme reste gros : 6 outils SVG (narrative=bon,
ideation-vues=bon, libre=deprecated, faisabilite-brief/from-image-target/llm-gen-svg/rnd-svg-scene-gen=a evaluer/elaguer)
+ ~30 compos R&D dans svg-scenes/ (autres registres : Cfa/Creuset/DemiLune/EtatMajor/Mine/Offshore/Ville - portfolio, NE PAS
purger sans verifier). Ce qu'on a deja nettoye cette session : 14 fichiers R&D du HOOK ggw + 15 compos mortes de Root. Reste
a auditer les AUTRES outils/compos + degonfler MEMORY.md (deborde : 35.6KB / limite 24.4KB -> deplacer le detail dans les fichiers pointes).

## ETAT FICHIERS (ce qui est VIVANT apres le menage)
- Compos GGW vivantes dans Root.tsx : `RND-GgwHookEncreVivant` (hook FINAL), `RND-WhiteboardTest`, `RND-FoyerColorTest` (tests).
- Hook : `src/projects/_rnd/svg-scenes/GgwHookEncreVivant.tsx` (+ `ggwTreesGpt.ts` = les vrais arbres, REUTILISER).
- Tests : `WhiteboardTest.tsx` · `FoyerColorTest.tsx` (+ `foyerSvg.ts` = le SVG foyer en module, SANS rect de fond).
- Outil a utiliser : `scripts/tools/svg-scene-narrative.py` (+ `svg-ideation-vues.py` pour faire proposer le LLM).
- Refs de style : `public/_shared/refs/svg-registres/REF-STYLE_encre-pur-trait.png` (trait encre nu) +
  `REF-NARRATIVE_encre-hook-propre.png` (niveau de narration). LES JOINDRE aux generations.

## GIT — ACCES POUR UNE AUTRE INSTANCE (IMPORTANT)
- Branche = **`feat/shorts-svg-muraille-verte`**. Commits session : 499333e (Beat 1 FINAL), e27fc67 (outil narrative),
  b5bf48e (tests+cibles), a52b5d4 (cette note), 4b65659 (menage SVG).
- ⚠️ On a travaille en WORKTREE `/tmp/ggw-worktree` car le repo principal `/Users/clawdbot/Workspace/remotion` etait sur
  la branche Senegal (session parallele). Pour reprendre : soit `git checkout feat/shorts-svg-muraille-verte` dans le repo
  principal (si la session Senegal est finie/committee), soit recreer un worktree : `git worktree add /tmp/ggw-wt feat/shorts-svg-muraille-verte`.
  Le worktree n'a PAS node_modules -> pour RENDER, copier les fichiers test dans le repo principal, render, NETTOYER apres.
- ⚠️ Erreurs TS PRE-EXISTANTES sur la branche (imports Beat0AccrocheV7 / _demos/Kinetic* / decode-castile / mapbox) =
  fichiers untracked de la session Senegal, PAS notre fait. N'empechent pas de rendre les compos GGW. Ne pas s'en alarmer.
- Audio (`public/audio/ggw-muraille-verte/`) = LOCAL non-committe (gitignore). Regenerable. narration-beat1..6 + sfx existent.

## RENDUS DE REFERENCE (catbox)
- Hook Beat 1 FINAL (voix+SFX) : mhksjd · Whiteboard : q0gbay · Crepuscule showcase : frfpka.
- Portfolio encre PUR (sans humain) : marche(lxc33g) puits(gje9ql ⭐) foyer(u5q06r ⭐). Image-cible B2 : gpt(5i03h3) gemini(kikdsg).
