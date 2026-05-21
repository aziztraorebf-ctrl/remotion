# Africa Eye — The Money Stone (Ghana child miners)

- Source : https://youtube.com/watch?v=nIBZ6QunLzc
- Durée : 7m18 (438s) — 16:9 doc verité
- Vues : 192k
- Date : ~2017

## PALETTE — verdict 🟡

- Footage terrain Ghana mine artisanale : tons terre rouge-brune `#5C3A28` / `#8B5A3E`, vert jungle `#3F5A2E`
- Forte saturation vs videos 1-2 : doc filmé pro, pas UGC. Look "BBC documentary cinéma"
- Carton titre frame 002 : noir profond `#0A0A0A` avec or/blanc cassé `#F5E8C8` au centre (gemme allumée par lumière). Capitales sans-serif blanches `#FFFFFF` typo lourde, kerning resserré
- Sous-titres : barre noire 70% opacity, texte blanc, sans-serif standard, padding bottom ~80px
- Skin tones préservés non poussés (différent des warmer tones BBC News classique)
- Pas de rouge BBC d'annotation visible dans les frames échantillonnées : ce doc est davantage cinéma vérité que OSINT

## ASSETS — verdict 🟡

- Carton titre type-only "THE MONEY STONE" : 3 mots empilés center, ~120px height par mot. Direct portable
- Logo BBC coin haut-gauche systématique
- Sous-titres anglais position basse standard (`y ≈ 950px` sur 720)
- AUCUN overlay map/satellite dans les frames échantillonnées (mais le doc en contient probablement, juste pas dans nos 7 timecodes — Money Stone est plus immersif que méthodologique)
- Pas de network graph, pas de timeline, pas d'annotation OSINT
- Caméra épaule + macro sur visages/mains : assets =  les visages eux-mêmes

## CAMÉRA — verdict 🔴

(Pour Souverain. Ce n'est pas mauvais — c'est juste **non reproductible** : caméra terrain humaine.)

- Caméra épaule terrain : shaky natural, suivi de personnages dans tunnels
- Macro lent sur visages d'interview (frame 004, 006) : push-in pull-out subtle
- Pas de transitions techniques signature
- Pas de match-cut OSINT
- C'est de la production caméra réelle, donc **0% reproductible** pour notre stack Remotion + Mapbox + Gemini

## APPLICABILITÉ SOUVERAIN

- Carton titre type-only au centre noir = composant Remotion trivial, à intégrer comme intertitre Souverain (séparation actes)
- Verdict global : **video 3 confirme que Africa Eye fait DEUX choses** : (a) OSINT methodologique reproductible (videos 1-2) + (b) doc vérité terrain non-reproductible (video 3)
- Pour Template E "OSINT investigation", **on retient SEULEMENT le mode (a)**. Le mode (b) est le territoire des films Vice/Al Jazeera/National Geographic, pas notre stack
- À conserver de cette video : la **palette terre saturée** comme référence pour traiter du footage source africain en post (LUT)
- Frame 002 (carton titre) = directement clonable
