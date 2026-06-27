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
**PHASE 1 (agent autonome) — ideation -> cibles SVG + CHOREGRAPHIE -> STOP.**
L'agent lit la source de verite du short, ideation Kimi, genere les cibles SVG natives (au RATIO du livrable,
cf. checklist #7), et S'ARRETE. Livrable en UN message : (1) idees Kimi + reco motivee, (2) cibles converties
PNG + UPLOADEES CATBOX (Aziz juge en visuel), (3) la CHOREGRAPHIE de chaque cible (cf. section dediee plus bas),
(4) auto-eval + trous. -> AZIZ TRANCHE LA CIBLE.

**PHASE 1bis (Claude, GRATUIT, sans API) — passe MIX-AND-MATCH + version maison. (acte Aziz 2026-06-27)**
> Le SVG est du CODE editable -> ne JAMAIS jeter les variantes non retenues. Une fois la direction choisie :
> 1. **Mix-and-match** : Claude LIT les SVG de toutes les variantes (meme concept, elements representables),
>    repere les meilleures idees de chacune et les GREFFE (copier le `<g>`) sur la cible retenue. Ex prouve CFA :
>    la variante "verrou" choisie + greffe de la variante "laisse" = vraie chaine a maillons + MAILLON DE RUPTURE
>    identifiable + racines de la piece dans le sol. Des idees qu'on n'avait pas dans la cible de base.
> 2. **Version Claude maison** : Claude ECRIT sa propre version SVG (gratuit, 0 API). Avantage cle : un SVG
>    code par Claude sort deja en GROUPES NOMMES PROPRES (anime par construction) — comble le trou "GPT/Gemini
>    sortent du SVG plat inanimable". Repartition des forces : Gemini/GPT = organique riche (medaille, textures) ;
>    Claude = structure geometrique propre + composition + animabilite. Le MEILLEUR resultat = le MIX des deux.
> 3. Claude convertit (rsvg-convert -w 1920 -h 1080) + upload catbox + presente le COMPARATIF a Aziz.
> -> AZIZ TRANCHE la version finale (souvent la version mixee). Claude corrige les petits defauts puis Phase 2.
> Cout = ~0 (lecture SVG + ecriture + rsvg-convert local). Gain = matiere de decision + animabilite garantie.

**PHASE 2 (agent autonome) — animation A->Z -> render -> STOP.**
A partir de la cible validee : l'agent CONCOIT la choregraphie + couleur + SFX (genere si besoin) +
karaoke + sources, code, REND full HD, upload catbox. + auto-eval poussee (justifie CHAQUE choix).
-> AZIZ + CLAUDE donnent les FINITIONS (ajustements de gout). Claude applique les micro-fixes lui-meme
   (changement cible et bien cerne = Claude edite directement, ne relance pas un agent pour rien).

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
7. ⛔ **LE RATIO CIBLE DU LIVRABLE, EXPLICITEMENT** (16:9 pour les longs/War-Map/mid-form · 9:16 pour les Shorts ·
   1:1 carrousel). Trou prouve 2026-06-27 (CFA) : sans consigne, l'agent a genere les cibles SVG en 9:16 par defaut
   alors que la War-Map est 16:9. REGLE : toujours preciser le ratio + le `viewBox` attendu (ex 16:9 = `0 0 1920 1080`).
   Si l'agent N'EST PAS SUR du ratio -> il POSE LA QUESTION via Claude (jamais deviner) ; Claude tranche sans
   interrompre Aziz. La cible ET le code doivent etre au ratio du livrable des la Phase 1.
8. Commandes exactes : render (`npx remotion render src/index.ts <CompoId> <out.mp4> --scale=1`),
   verif audio (ffprobe + volumedetect), upload catbox. Enregistrer la compo dans Root.tsx.

## ⭐ PHASE 1 = CIBLE **+ CHOREGRAPHIE** (decision Aziz 2026-06-27 — evite les iterations Phase 2)
Quand l'agent envoie ses images-cibles au point de controle, il DOIT joindre, POUR CHAQUE cible (ou juste la cible
deja choisie si Aziz a tranche), la CHOREGRAPHIE D'ANIMATION prevue — pas seulement l'image figee. Le but : qu'Aziz
juge le MOUVEMENT avant le code (le gout d'animation se valide en amont, pas apres render). La choregraphie decrit :
- **La sequence timee** : quel geste sur quel MOT/frame (cale sur l'audio reel), du debut a la fin du segment.
- **La COLORISATION par segment** : quelle couleur arrive QUAND et POURQUOI (couleur = diagnostic/recompense narrative,
  pas deco — cf. trou doctrine #2 ci-dessous). Ce qui reste en encre, ce qui se colore.
- **Le respect de la REGLE 5-6s** (SOUVERAIN-REMOTION-PLAYBOOK) : aucun plan statique > 5-6s sans nouveau geste OU
  plateau de respiration explicite (halo qui respire, ease-out). Pour ~10s = ~2-3 micro-evenements echelonnes ;
  pour ~45s = 4-6 (cf. SVG-MIDFORM-FORMAT densite). Lister les micro-evenements et leur frame.
- **Micro-mouvements vs mouvements explicites** : distinguer l'ambiant continu (oscillation douce, respiration) des
  gestes narratifs forts (tracage, colorisation, rupture). Dire lequel est lequel et quand.
- **Le 1er element visuel AVANT ~1-1.5s** (jamais a 5s), le PLATEAU final (dernier etat qui respire).

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

## CE QUE L'HUMAIN GARDE (ne se delegue pas)
- Validation du SUJET/angle (gate amont) + de la CIBLE (point de controle Phase 1).
- Les FINITIONS de gout : couleur exacte, intention d'un symbole ("le mur reste"), taille/style sous-titres,
  perception audio/emotion. Le jugement final est celui d'Aziz.
- Trancher les ambiguites que l'agent ne peut pas resoudre (registre, raccord entre beats).
