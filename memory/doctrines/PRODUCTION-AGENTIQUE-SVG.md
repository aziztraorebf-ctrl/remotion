# ⭐⭐ PRODUCTION AGENTIQUE D'UNE SCENE SVG — source de verite (ce qu'un agent fait A->Z)

> Cree 2026-06-24, prouve sur le Beat 3 GGW (un agent frais a produit ~90% de la scene seul).
> SOURCE DE VERITE pour lancer 1, 2 ou 3 agents en PARALLELE qui produisent chacun une scene SVG
> de bout en bout. Chaque agent est lance DEPUIS CE FICHIER. On le met a jour a chaque decouverte.
> Doctrine SVG generale = [[SVG-SCENES-GENERATIVES]] · Etat d'un short concret = ex [[ETAT-GGW-MURAILLE-VERTE]].

## CE QU'UN AGENT A PROUVE POUVOIR FAIRE SEUL (A->Z, sans qu'on dicte)
Prouve Beat 3 GGW : un agent general-purpose, a partir de la doctrine + script + calage audio + cible SVG validee :
- Lance l'IDEATION Kimi multimodal (refs de calibrage), gere le bug provider (retry), FILTRE les idees.
- Genere les IMAGES-CIBLES SVG natives (gemini+gpt), les convertit en PNG, les juge, upload catbox.
- CONCOIT la choregraphie LUI-MEME (quel geste sur quel mot) — pas une fiche dictee.
- Decide la COLORISATION (quelle couleur, quand, pourquoi) avec un vrai jugement narratif (ex : a refuse
  de colorer le soleil pour ne pas dire "ennemi = soleil" ; couleur = diagnostic, pas recompense).
- GENERE ses propres SFX manquants via ElevenLabs (et reutilise les existants quand ils collent — a su
  ne PAS generer un crash de pierre pour une OMBRE qui tombe = comprend la nature de l'objet).
- Code l'animation Remotion (SVG inline, spring, stroke, cross-fade), karaoke, sources, SFX.
- Verifie TS, REND full HD, verifie l'audio, upload catbox.
- AUTO-EVALUE : justifie chaque choix + remonte les trous de doctrine rencontres.
=> Le role humain (Aziz + Claude) se reduit a : valider la CIBLE (1 point de controle) + donner les
   FINITIONS de gout (couleur exacte, "le mur reste", taille sous-titres). Tout le reste est delegable.

## LE FLUX EN 2 PHASES + 1 POINT DE CONTROLE (obligatoire)
**PHASE 1 (agent autonome) — ideation -> cibles SVG -> STOP.**
L'agent lit la source de verite du short, ideation Kimi, genere les cibles SVG natives, et S'ARRETE.
Livrable en UN message : (1) idees Kimi + reco motivee, (2) cibles converties PNG + UPLOADEES CATBOX
(Aziz juge en visuel), (3) auto-eval + trous. -> AZIZ TRANCHE LA CIBLE (+ mix-and-match eventuel).

**PHASE 2 (agent autonome) — animation A->Z -> render -> STOP.**
A partir de la cible validee : l'agent CONCOIT la choregraphie + couleur + SFX (genere si besoin) +
karaoke + sources, code, REND full HD, upload catbox. + auto-eval poussee (justifie CHAQUE choix).
-> AZIZ + CLAUDE donnent les FINITIONS (ajustements de gout). Claude applique les micro-fixes lui-meme
   (changement cible et bien cerne = Claude edite directement, ne relance pas un agent pour rien).

⛔⛔ **LE POINT DE CONTROLE VAUT MEME QUAND LA SCENE SE DESSINE "A LA MAIN" (sans cible LLM) — renforce 2026-06-25 (Aziz, B4 FMNR raté)** :
ne JAMAIS sauter le checkpoint sous pretexte que la scene est codee directement en JSX (pas de SVG genere a montrer).
Ce qui se valide AVANT d'animer, ce n'est pas seulement un fichier SVG, c'est l'IMAGE / LA METAPHORE choisie pour porter
le geste. Avant de coder, l'agent (ou Claude) DECRIT en 1-2 lignes le concept visuel retenu (« comment je montre le geste X »)
+ POURQUOI, et propose 2-3 alternatives si le geste est central — Aziz tranche l'image AVANT l'animation. Sinon on anime une
metaphore faible qu'Aziz ne decouvre qu'au render (cas B4 : « souche-pot + racines-lignes » = ressemblait a un pot de fleurs,
le geste FMNR « prendre soin de ce qui dort » pas rendu — Aziz l'a rejete apres coup, scene a refaire). REGLE : pour le ou les
gestes-CŒUR d'un beat, montrer le CONCEPT D'IMAGE (croquis verbal + alternatives) en checkpoint, pas seulement le SVG. Le
jugement de gout sur l'image se fait avant le code, pas apres le render.

**PARALLELISME** : lancer 2-3 agents Phase 2 en meme temps, un par scene, en WORKTREE ISOLE si plusieurs
touchent des fichiers en parallele. Chacun lance depuis CE fichier + l'ETAT du short. Handoff = fichier disque.

## CE QU'IL FAUT DONNER A L'AGENT (checklist de lancement)
1. La SOURCE DE VERITE du short (registre, 9 acquis, methode) — ex ETAT-GGW-MURAILLE-VERTE.md.
2. Les MODELES = 1-2 beats deja FINAUX du meme short (le niveau a egaler ; "etudie, ne copie pas la scene").
3. L'INTENTION du beat + le texte VO + le DECOUPAGE AUDIO REEL (frames @30, depuis beat-bounds.json +
   filtrage de narration.alignment.json) + le TABLEAU DE MOTS (pour le karaoke).
4. La cible SVG validee (chemin) + le mix-and-match demande.
5. Les refs de calibrage (2-3 frames SVG : "faisabilite du medium, PAS modele a copier").
6. Le PIEGE specifique du beat (ex Beat 3 conceptuel = risque schema -> exiger scene narrative).
7. Commandes exactes : render (`npx remotion render src/index.ts <CompoId> <out.mp4> --scale=1`),
   verif audio (ffprobe + volumedetect), upload catbox. Enregistrer la compo dans Root.tsx.

## TROUS DE DOCTRINE COMBLES (remontes par les agents, gardes a jour)
1. **Groupage des sous-titres** : NE PAS grouper par silence auto (`buildPhrases` sur gap > Xs). Le
   decoupage audio fourni NE correspond PAS toujours aux silences reels (Beat 3 : gap apres "stopper."
   = 0.06s -> 3 phrases collees en un bloc illisible). REGLE : FORCER les frontieres par INDEX de mots,
   sur les segments du script. Pattern : `const PHRASE_BREAKS = [i1, i2, ...]` (index du 1er mot de chaque
   nouvelle phrase) + buildPhrases qui coupe sur ces index. Verifier le decoupage (print) AVANT de rendre.
2. **Couleur pour un beat SANS heros positif** : l'acquis "couleur timee" illustrait la couleur comme
   RECOMPENSE (or, vert climax). Pour un beat de desespoir/erreur, la couleur sert le DIAGNOSTIC : la
   VRAIE CAUSE se colore au moment ou la voix la nomme (Beat 3 : sol craquele -> ocre #b5651d sur "la
   terre meurt sur place"). Ne PAS colorer ce qui n'est pas le sujet (arbre mort, soleil = contresens).
3. **Rendre une OMBRE / structure fantome en encre** : remplissage encre tres pale (fillOpacity ~0.1)
   + contour net. Pour ancrer "c'est l'ombre DE l'arbre" : naissance par balayage (clip-path anime) depuis
   le pied de l'arbre, pas un fade du bloc entier.
4. **Symbole qui MENT et qui RESTE > symbole qui se dissipe** (gout Aziz Beat 3) : un faux remede (le mur)
   qui RESTE visible pendant que le sujet meurt quand meme = plus cinglant ("le mur ne sert a rien") que
   l'illusion qui s'evanouit. Choisir selon l'intention.
5. **Kimi `--max-tokens 8000`** par defaut (4000 coupe les idees FR ; surveiller `finish_reason: length` ;
   bug provider OpenRouter = reponse JSON parasite -> RELANCER l'appel).
6. **⛔ WORKTREE incomplet = render bloque (prouve B5/B6, 2026-06-25)** : avant de lancer des agents Phase 2 en
   worktree, le CHEF prepare l'environnement : (a) `ln -s <repo-principal>/node_modules node_modules` ; (b) copier
   les audios + alignment + beat-bounds (gitignores, absents du worktree) ; (c) le `.env` est dans le repo principal
   (pointer dessus pour la generation SFX) ; (d) Root.tsx importe des fichiers UNTRACKED absents du worktree -> le
   bundle webpack echoue ENTIEREMENT meme pour un beat sans rapport. Les agents ont du ecrire un BFS qui copie les
   .tsx manquants depuis le repo principal. Reco : committer les fichiers Root OU fournir le bootstrap a l'agent.
7. **⭐ PRE-CABLER Root.tsx AVANT de lancer les agents (anti-collision, prouve B5/B6)** : Root.tsx est le SEUL point
   de collision quand 2 agents produisent 2 beats en parallele. Le CHEF ajoute LUI-MEME les imports + lignes
   `<Composition>` (avec id, duree=Nframes, 1080x1920) AVANT de lancer les agents -> chaque agent n'a plus qu'a creer
   son fichier TSX du meme nom, zero edition de Root.tsx, zero collision. (Exception : si un agent doit changer la
   DUREE de sa compo, il touche UNIQUEMENT sa valeur `durationInFrames`.)
8. **SFX generes en worktree = a recopier dans le repo principal** : `public/audio/` est gitignore -> les SFX generes
   par les agents vivent SEULEMENT dans le worktree. A la fin, les copier dans le repo principal (sinon un futur render
   depuis le repo principal les rate). Idem tout audio derive (ex narration coupee `*-cut.mp3`).
9. **FINITION = Claude prend la main en direct (prouve B5/B6)** : apres les renders Phase 2, les retours de gout d'Aziz
   (couleur, composition, narratif) sont appliques par Claude DIRECTEMENT (Edit sur le fichier de l'agent), PAS en
   relancant un agent. L'agent fait le gros oeuvre A->Z ; le chef cisele les finitions ciblees. Reutiliser un composant
   d'un autre beat (TreeTrunk/LeafyCrown de B3 dans B5) = cohérence visuelle gratuite.
10. **⛔ COLORISATION = exiger des SURFACES FERMEES (prouve CFA 2026-06-25, NE PAS REPERDRE)** : pour animer la
   colorisation d'une scene encre (le trait qui se REMPLIT de couleur), le SVG doit contenir un groupe `<g id="couleurs">`
   de FORMES PLEINES FERMEES (`fill="#couleur"`), separe du trait. Par defaut TOUS les modeles (GLM/Gemini/GPT) dessinent
   des CONTOURS (`fill="none"`) = incolorisables. ⚠️ GOTCHA : le modele met souvent un groupe WRAPPER racine qui ENGLOBE
   les couleurs -> a l'extraction, NEUTRALISER les fills couleur du wrapper (sinon couleur dupliquee + non animee).
   Detail complet : [[openrouter-svg]] § COLORISATION TIMEE.

## CE QUE L'HUMAIN GARDE (ne se delegue pas)
- Validation du SUJET/angle (gate amont) + de la CIBLE (point de controle Phase 1).
- Les FINITIONS de gout : couleur exacte, intention d'un symbole ("le mur reste"), taille/style sous-titres,
  perception audio/emotion. Le jugement final est celui d'Aziz.
- Trancher les ambiguites que l'agent ne peut pas resoudre (registre, raccord entre beats).
