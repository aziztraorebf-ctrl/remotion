# ⛔⛔ PÉRIMÉ (2026-08-15) — NE PAS UTILISER CE STARTER

> **L'Acte 3 a été GELÉ par Aziz le 2026-08-15.** Ce starter fait reprendre l'Acte 3 : le suivre
> irait à l'encontre de la décision. La priorité est désormais l'**Acte 4** (mouvement A fait,
> B et C à produire), puis l'Acte 5.
>
> **Aller à** : `memory/NEXT-ACTION.md` § « GAZODUC ACTE 4 — REPRENDRE ICI ».
> Raison du gel + ce qui reste à faire sur l'Acte 3 quand on y reviendra :
> `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md` § « ACTE 3 — GELÉ EN WIP ».
>
> (Conservé pour trace : le contenu ci-dessous reste exact sur l'ÉTAT de l'Acte 3 au 2026-08-14,
> seule sa consigne « reprendre l'Acte 3 » est caduque.)

---

# STARTER — Gazoduc Acte 3 (suite) + Actes 4 et 5

> Écrit le 2026-08-14 en fin de session. Commit de référence : `9e302fb2` sur
> `feat/gazoduc-acte1-hook-globe`. Coller le bloc ci-dessous en début de session.

---

## Prompt à coller

```
On reprend le Gazoduc (AAGP vs TSGP), Acte 3 Segment A.

Avant toute réponse technique, lis dans cet ordre :
1. memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md — section "OÙ ON EN EST (2026-08-14)"
2. memory/episodes/souverain/gazoduc-aagp-tsgp/BREAKDOWN-SEGMENT-A-STORYBOARD-FUSION.md —
   sections "VERDICT AZIZ SUR LE V3 CODÉ" et "V4/V5 libre créative"
3. Les images du storyboard V5 (c'est LA source, pas le code hérité) :
   memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/gazoduc-carte-storyboard-ref/
   v5-gpt-libre/beat{3,4}-*-libre.png
4. Les breakdowns correspondants :
   memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-v5-json/beat{3,4}-breakdown.json

Première chose à faire : me montrer le render `suite-v12` (22.2s→74.2s) — Beat 2 et Beat 3 ont été
refaits en fin de session dernière mais je ne les ai pas encore validés. Si le fichier local a été
purgé, le re-rendre : npx remotion render D3-Gazoduc-Acte3-CarteTSGP <out> --frames=667-2226
puis muxer l'audio (ffmpeg -ss 22.2333 -t 52 -i public/souverain/gazoduc-aagp-tsgp/audio/narration-p3.mp3)
et uploader avant de me le présenter.

Ensuite, dans l'ordre :
- Beat 3 : compléter le panneau (moitié droite vide) avec le robinet Algérie→vanne←Nigeria et la
  banque barrée, comme sur beat3-financement-libre.png panneau 02.
- Beat 4 : le recoder depuis beat4-paradoxe-libre.png. C'est encore du code v3 rejeté. Le paradoxe
  doit être la divergence visuelle pure du MÊME tracé (Maroc doré stable vs Algérie qui vire au
  rouge avec icônes bouclier), intégré sur la carte, sans cut vers un fichier séparé.
```

---

## Contraintes non négociables sur ce chantier

- **Ne jamais repartir du code v3** pour un beat non encore refait — il a été explicitement rejeté
  (widgets de bord, inserts réduits à des icônes posées, quasi-immobilité). La source est le
  storyboard V5 + son breakdown.
- **Aucun widget en coin/bord d'écran.** Tout insert est soit ancré géographiquement, soit centré
  et superposé à une carte assombrie. Un insert se superpose à la carte, il ne la pousse jamais.
- **Aucun texte flottant sans support visuel** (panneau, pastille, chip).
- **Rien de statique plus de 5s.** Vérifier par mesure, pas à l'œil (voir protocole plus bas).
- **Maximum 2-3 pays labellisés** par écran.

## Protocole de vérification (celui qui a fait la différence cette session)

Avant de présenter un render :
```bash
# 1. anti-gel + immobilité : % de pixels modifiés entre frames espacées + plus longue série sous seuil
ffmpeg -y -i <video>.mp4 -vf fps=2 <dir>/h%03d.png
# puis comparer les frames consécutives (PIL/numpy) : viser min > 1%, aucune série < 0.5%

# 2. pour un mouvement caméra suspect : mesurer la VITESSE frame à frame en Node (hors render),
#    avant de retoucher la moindre valeur. Une vitesse qui tombe à 0.000 = bug de structure
#    d'interpolation (easeInOut par segment), pas un problème de dosage.
```

## Briques à réutiliser (vérifiées présentes sur la branche)

- Caméra continue : `GazoducActe2AAGP.tsx` L220-278 (scène jumelle validée) et le prototype
  `src/projects/_rnd/d3-16x9/ProtoGazoducA2CameraVsVoisins.tsx` (`ProtoA2CameraContinue`).
- Intégration d'un clip vidéo dans un cadre SVG sur la carte :
  `src/projects/_rnd/svg-scenes/GazoducH3IntegrationTestReal.tsx` (validé, sert déjà au Beat 2).
- Clip H3 pelleteuse : `public/_rnd/minimax-h3-tests/gazoduc-pelleteuse/pelleteuse-1080p-v1.mp4`
  (5.13s, 30fps — à jouer en `Loop`).
- Vacillement organique : `deathFlicker` dans `GazoducActe3InsertSecurite.tsx` (pour le Beat 4).

## Après l'Acte 3 : ce qui reste pour finir la vidéo

Ni l'Acte 4 ni l'Acte 5 n'existent (aucun fichier, aucune composition — vérifié).

- **Acte 4 — Conséquences** : les 2 gazoducs siphonneraient 70% de la production nigériane, ils ne
  sont pas complémentaires. Objectifs opposés (Maroc = devenir le passage obligé / Algérie =
  protéger son monopole). Calendrier : l'Europe se presse alors que sa demande baissera d'ici 2030.
  ⭐ Le plan identifie les **70% comme un pic de rupture de forme** (carte → insert physique pur) —
  c'est un climax de rythme, à ne pas traiter comme un beat ordinaire.
- **Acte 5 — Implication** : la facture du consommateur européen, **le robinet géant avec mains
  stylisées** (`PLAN-ACTES2-5.md` ligne 118), chute sur « d'autres ont déjà commencé à CREUSER ».
- ⚠️ Vérifier l'audio avant de supposer qu'il manque : `narration.mp3` (516s) couvre probablement
  les 5 parties, alors que seuls `narration-p2` et `narration-p3` existent en fichiers séparés.
