# DA-BRIEF UPSTREAM — War-Map Sahel, Partie 2 (LE BLOCAGE) — review du PLAN avant code

## SOCLE VERROUILLÉ (ne pas remettre en cause)
War-Map Long 16:9, identité parchemin Atlas. **100% CARTE, ZÉRO plein écran** (doctrine verrouillée Aziz) :
les moments forts se font PAR la carte (caméra pull-back/push-in, board clearing, pulses, vide d'opacité,
assombrissement) — JAMAIS par une coupe hors-carte. Carte permanente, caméra qui glisse sans coupe.
Palette parchemin (land #F5EFD6, encre #2A1C0E, rouge-violence #8B3A3A, bleu-ONU pour MINUSMA).
État CONTINU (jetons/taches persistent). Partie 2 = couche `<Partie2Blocage ctx>` par-dessus la carte.

## CE QUE RACONTE LA PARTIE 2 — "LE BLOCAGE" (f2940 → ~f5640)
L'intervention française (Serval puis Barkhane, 2013) s'installe avec force, l'ONU déploie la MINUSMA,
la présence étrangère est massive et pré-positionnée tout autour... et DIX ANS plus tard, c'est l'INVERSE :
le jihadisme a gagné du terrain. Les forces tenaient les VILLES mais pas les CAMPAGNES. La violence
déborde vers le Burkina (40% du territoire), puis le Niger bascule, et la CEDEAO menace.

### DIRECTION VALIDÉE AZIZ (à servir, pas à rediscuter)
- **Sentiment dominant = CONTRASTE "effort massif / échec"** : MONTRER la présence FR imposante qui
  s'installe (bases, MINUSMA, convergence) PUIS le rouge qui reprend du terrain MALGRÉ tout. Le paradoxe :
  beaucoup de moyens déployés, résultat inverse. Tension visuelle forte.
- **Beat 2.4 "dix ans plus tard, l'inverse" (cœur de l'échec)** = TROIS éléments simultanés : timeline qui
  défile vite 2013→2022 + rouge qui s'étend autour des bases + **bases FR qui s'éteignent une à une**
  (perdent éclat/couleur) = échec par usure ET par extinction de la présence.

### BEATS (triggers RÉELS recalés sur narration-v5-alignment.json @30fps)
- 2.1 Serval/Barkhane — f3196/f3268 — bases FR séquence (Gao/Ménaka/Tessalit), étoiles militaires, repère "2013".
- 2.2 présence FR pré-positionnée — f3419/f3443 — OVERLAY GeoConvergence (forces convergent vers Mali).
  C'est la SEULE idée abstraite sans équivalent cartographique → overlay AUTORISÉ (doctrine). Voix minimale.
- 2.3 MINUSMA — f3660 — board clearing léger ; points MINUSMA (Kidal/Tombouctou/Mopti) teinte bleu-ONU.
- 2.4 échec 10 ans — f3887 — timeline 2013→2022 + expansion rouge autour des bases + bases s'éteignent 1 à 1.
- 2.5 villes vs campagnes — f4384/f4421 — villes = points tenus (bleu/clair) ; rouge progresse dans le rural.
- 2.6 Burkina déborde — f4955/f4976 — rouge franchit la frontière Mali→Burkina, repère "2015", "40%".
- (fin) Niger bascule f5380/f5395 + CEDEAO f5639 — Niamey bascule, anneau CEDEAO menace (pont vers Partie 3).

## CE QU'ON DEMANDE (signal PROSPECTIF, pas verdict)
Vous reviewez un PLAN avant code. Concentrez-vous sur :
1. La grammaire "effort massif / échec" est-elle la plus lisible ? Risque de confusion (qui gagne ?) ?
2. Comment distinguer visuellement présence FR (bleu/ordre) vs jihadisme (rouge/désordre) sans cliché ?
3. Le beat 2.4 (3 éléments simultanés) — risque de surcharge ? Comment hiérarchiser timeline/rouge/extinction ?
4. La transition P1→P2 (de la soustraction abstraite vers des objets-bases sur carte) — comment rester cohérent ?
5. Un piège à éviter pour ne PAS tomber dans le pro-FR ou anti-FR involontaire (rester analytique).

## INTERDITS
- Pas de plein écran, pas de coupe hors-carte, pas de data-viz qui remplace la carte.
- Pas de drapeaux animés tape-à-l'œil, pas de particules/glow/néon TikTok, pas de flammes.
- Pas de changement de palette parchemin. Pas de jugement moral explicite (analytique, pas militant).

## LIBERTÉ CADRÉE
Vous POUVEZ suggérer : meilleure métaphore du blocage, hiérarchie du beat 2.4, façon de rendre l'extinction
des bases, distinction chromatique présence/menace, repères temporels. Tout dans la grammaire carte/parchemin.
