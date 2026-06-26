# STARTER — Scènes 6 & 7 Sénégal V3 (prochaine session)

> Rédigé 2026-06-25. Lire README.md d'abord (source de vérité des 8 scènes).

## ÉTAT AU DÉPART

Scènes 0→5 FINALES. Audio couvert : 0→344.5s (~70%).
Reste : scènes 6 + 7 = ~148s (344.5→492s).

## SCÈNE 6 — "Bilan : de zéro à exportateur" (~344.5→420s, ~75s)

**Sujet** : chiffres mai 2026 (Sangomar 3M barils, GTA 11e cargaison, cap 100k b/j) +
garde-fous réels (FONSIS, ITIE, loi contenu local) + fragilités (dette, contrats opaques,
Yakaar en suspens) + conclusion "le moment d'écrire les règles, c'est maintenant".

**Forme décidée** : Remotion data-viz (comme scènes 3 et 4). Beat14 V1 = référence à extraire.
**Registre** : navy + grille or + BebasNeue. Continuité 100%.

**Point d'entrée audio** : ~344.5s dans `narration-v3-VALIDEE.mp3`
("Voilà où en est le Sénégal. En à peine dix mois...")

**Idées de forme** : 2 colonnes — GARDE-FOUS (or, qui tiennent) vs FRAGILITÉS (rouge, qui menacent).
Ou bascule chiffres-production → balance garde-fous/fragilités. À storyboarder avant de coder.

---

## SCÈNE 7 BONUS — "La machine tourne, le pouvoir se fissure + pont AES" (~420→492s, ~72s)

**Sujet** : retour hook (limogeage Sonko par Faye, Sonko élu Assemblée même semaine) →
fracture politique au-dessus de la richesse pétrolière → pont vers la prochaine vidéo AES
(Mali/Burkina/Niger) + CTA abonnement.

**Forme** : à définir. Probablement Remotion simple (texte fort + quelques éléments visuels).
Pas de carte (pas de geo). Peut-être SVG génératif (fracture politique = abstrait, symbolique).

**Point d'entrée audio** : ~420s dans `narration-v3-VALIDEE.mp3`
("Revenons à ce qu'on disait tout au début...")

---

## PLAN MULTI-AGENTIQUE (recommandé)

Les 2 scènes sont INDÉPENDANTES → lancer en parallèle :

```
Agent A (worktree isolation) → Scène 6 (data-viz Remotion)
  Brief : PRODUCTION-AGENTIQUE-REMOTION.md + audio 344.5→420s + forme 2-colonnes
  Output : SceneBilanV3.tsx + scene6-bilan-FINAL.mp4

Agent B (worktree isolation) → Scène 7 BONUS (Remotion ou SVG)
  Brief : audio 420→492s + contexte fracture Faye/Sonko + pont AES + CTA
  Output : SceneBonusV3.tsx + scene7-bonus-FINAL.mp4
```

**Doctrines agents** :
- `memory/doctrines/PRODUCTION-AGENTIQUE-REMOTION.md` (prouvé sc.4)
- `memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md` (état + registre V3)
- `out/episodes/senegal-petrole-gaz/_ASSEMBLAGE-V3.md` (renders FINAUX pour continuité)

**Gotchas à inclure dans les briefs** :
- Audio : `public/souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3` (gitignored → cp dans worktree)
- `.env` : passer `--env-file=/absolute/path/.env` (pas copiable dans worktree)
- Render : `--gl=angle` obligatoire
- Gate upload : `review.json` + `review-override.md` tous les deux requis (plus récents que mp4)

---

## ASSEMBLAGE FINAL (après scènes 6+7)

Concaténer les 7 parties finales dans une compo `SenegalV3Complet` :
`scene0 → scene1-intro-coin → scene-gisements → scene2 → scene3 → scene4 → scene5 → scene6 → scene7`
+ musique globale music-A-ambient sur tout + mix final → `out/PRET-PUBLICATION/senegal-petrole-gaz-V3-FINAL.mp4`.

Durée totale visée : ~8min12 (492s).
