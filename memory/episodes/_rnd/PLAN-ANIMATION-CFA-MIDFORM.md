# Plan d'animation — TEST mid-form SVG "franc CFA" (R&D 2026-06-25)

> But : passer du PROOF-OF-CONCEPT (apparitions fade) a la VRAIE animation (tracage, colorisation timee,
> flux qui coule, gestes). 3 beats x ~15s = ~45s, 16:9. SVG generes par GLM-5.2, animes par frame (zero CSS).
> Voix : vraie narration TTS. SFX : REUTILISER l'existant (`public/_shared/sfx/`).
> Doctrine appliquee : encre = canevas pour COULEUR SEMANTIQUE TIMEE (pas aplat plat) · tracage stroke-dashoffset ·
> objet inerte = apparait/illumine sur place (pas de glissement) · SEUL ce qui se deplace vraiment glisse.

## Principe transversal (la vraie animation, pas l'apparition)
- **Tracage** : les traits structurants se DESSINENT (stroke-dasharray/offset 1->0), comme une main qui dessine.
- **Colorisation timee** : un trait/forme passe de l'encre neutre -> couleur SEMANTIQUE au moment ou la voix le nomme.
- **Geste** : un mouvement PORTEUR de sens (le cadenas claque, la main compte, la fleche fuit) — pas un drift decoratif.
- **Echelonnement** : chaque element arrive a SON beat narratif, cale sur la voix. Le monde se CONSTRUIT.

---

## BEAT 1 — BLUEPRINT (le mecanisme) ~15s · fond navy #0d1b3a · accents cyan #7fd4ff / or #c8a951
Voix : "14 pays africains partagent une monnaie : le franc CFA. Sa regle centrale : une parite fixe avec l'euro,
garantie par Paris. Les pays deposaient une partie de leurs reserves sur un compte, a Paris."

| t (s) | Geste ANIME (pas fade) | Technique | SFX |
|---|---|---|---|
| 0-1 | cartouche + grille se TRACENT (lignes qui filent) | dashoffset sur grille | (silence/drone) `warmap/tension-drone` loop bas |
| 1-3 | les 14 hexagones s'allument UN PAR UN (cellule par cellule, gauche->droite) | stagger opacity+scale par cellule | `ui/node-appear` x sobre (1 ping groupe) |
| 3-5 | la piece CFA EMERGE de la zone (monte + s'illumine or) | spring scale 0->1 + glow or | `ui/plate-pop` |
| 5-8 | le LIEN de parite se TRACE CFA->EUR, puis le CADENAS CLAQUE (ferme) | dashoffset lien + spring "claque" sur cadenas | `warmap/cedeao-snap` (le claquement = verrou) |
| 8-9 | le taux 655.957:1 APPARAIT (compteur qui se fixe) | fade + leger settle | `data/*` blip si dispo |
| 9-13 | la fleche de DEPOT se TRACE de la zone -> compte Paris (courbe qui file vers le coffre) | dashoffset courbe + pointe a l'arrivee | `warmap/arrow-whoosh` |
| 13-15 | le compte Paris s'ILLUMINE (recoit) + cotes/labels nets | glow + fade labels | `camera/sfx-map-ping` discret |

Intention : FROID, mecanique, precis. Le spectateur VOIT le mecanisme se monter piece par piece.

---

## BEAT 2 — ENCRE (le marche, la vie) ~15s · parchemin #e8dcc0 · COLORISATION TIMEE
Voix : "Sur un marche de Dakar, ca ne se voit pas. On compte ses billets — une monnaie stable, previsible.
C'est l'argument qu'on entend partout : le CFA protege de l'inflation."

⭐ CLE = exploiter l'ENCRE : la scene se DESSINE au trait noir, PUIS la couleur semantique se REMPLIT (timee).
Pas d'aplat plat fige : le trait existe d'abord (gravure), la couleur arrive comme une aquarelle posee.

| t (s) | Geste ANIME | Technique | SFX |
|---|---|---|---|
| 0-2 | l'auvent + l'etal se TRACENT (la main dessine la structure) | dashoffset sur etal/auvent | `warmap/ink-spread` (encre qui se pose) |
| 2-4 | le soleil + l'ambiance arriere se dessinent, hachures legeres | dashoffset/fade doux | `nature/birds-ambient` loop tres bas (vie) |
| 4-7 | les PRODUITS se dessinent puis se COLORISENT : tomates -> rouge/orange doux, riz -> beige chaud | trace puis fill-color interpole (timee, par groupe) | `nature/growth-pop` x2 sobres |
| 7-8 | la balance se trace + oscille legerement (vivante) | dashoffset + petite rotation sin | (rien) |
| 8-12 | les MAINS se tracent et se tendent ; un BILLET passe de main en main (vrai geste de comptage) | trace mains + translate billet main->main, leger | `ui/blip-bubble` ou doux (echange) |
| 12-15 | la scene RESPIRE (chaleur), legere pulsation lumineuse globale ; le billet se pose | scale breath + glow chaud | (laisser respirer) |

Intention : CHAUD, humain, vivant. Contraste fort avec le froid du beat 1. La COULEUR qui arrive = le rechauffement.

---

## BEAT 3 — FLUX (ou va l'argent) ~15s · bleu nuit #0b1526 · orange #d6552e
Voix : "Mais suivez l'argent. Une partie de la richesse circule vers l'exterieur — la decision se prend ailleurs.
La question n'est plus technique. Elle est politique."

| t (s) | Geste ANIME | Technique | SFX |
|---|---|---|---|
| 0-2 | la zone CFA REVIENT (meme hexagone que beat 1 = continuite), se trace | dashoffset hexagone | `camera/sfx-whip-pan` (transition entree) |
| 2-3 | "Mais suivez l'argent" — un POINT de richesse pulse dans la zone | pulse | (suspense) |
| 3-8 | les 3 GROSSES FLECHES COULENT vers l'exterieur (se tracent + FLUX CONTINU qui s'ecoule apres) | dashoffset PUIS particules/pointilles qui defilent le long (flux vivant) | `sfx-cost-recovery-drain` (la richesse qui s'ecoule = parfait) |
| 8-11 | la DECISION EXTERNE (batiment institutionnel) s'illumine + RECOIT | glow + arrivee flux | `warmap/boom-coup` doux (le pouvoir externe) |
| 11-13 | labels "SOUMIS - PAS SOUVERAIN", "DECISION EXTERNE" se tracent | fade/trace | (rien) |
| 13-15 | la QUESTION "A QUI APPARTIENT UNE MONNAIE ?" S'IMPOSE (settle + soulignement qui se trace) | spring scale + dashoffset souligne | `warmap/liptako-gong` (le punch final) |

Intention : TENSION qui monte, le flux qui FUIT visiblement, fermeture sur la question = cliffhanger conceptuel.

---

## Musique de fond
- Une nappe discrete et continue sur les 45s (tension sourde montante). Reutiliser `warmap/tension-drone` (loop, vol bas
  ~0.18) OU `sfx-music` si plus adapte. Volume sous la voix.

## Transitions entre beats
- Whip/swoosh court (`camera/sfx-whip-pan-1`) + cross-fade fond. Le changement de couleur de fond MARQUE le beat.

## Voix (TTS reel)
- Scanner les REGLES TTS FR (participes "e/ee" en fin de groupe, "ont+voyelle", nombres en lettres : "655.957" ->
  "six cent cinquante-cinq virgule neuf cent cinquante-sept" ou reformuler ; "14 pays" -> "quatorze pays").
- Voix Souverain : `z3gESu49naEZW8Af2Upm` (GeoAfrique V2).
- Caler le timing des animations sur les VRAIS timestamps de la voix (mots-cles).

## Ordre de production (autonome)
1. Generer la voix TTS des 3 beats (1 fichier ou 3), mesurer la duree reelle (ffprobe).
2. Recaler les timings du plan sur la voix mesuree.
3. Coder les vraies animations (tracage/colorisation/flux/gestes) beat par beat.
4. Mixer SFX (reutilises) + voix + nappe.
5. Render full HD + verifier (frames + ecoute) + presenter.
