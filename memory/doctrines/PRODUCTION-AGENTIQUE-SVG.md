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

## CE QUE L'HUMAIN GARDE (ne se delegue pas)
- Validation du SUJET/angle (gate amont) + de la CIBLE (point de controle Phase 1).
- Les FINITIONS de gout : couleur exacte, intention d'un symbole ("le mur reste"), taille/style sous-titres,
  perception audio/emotion. Le jugement final est celui d'Aziz.
- Trancher les ambiguites que l'agent ne peut pas resoudre (registre, raccord entre beats).
