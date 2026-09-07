# ÉTAT DE LIVRAISON — chill-meter / Abigail (au 2026-09-07)

> ⛔ **RIEN N'A ÉTÉ ENVOYÉ À LA CLIENTE.** Le code est fait et vérifié ; les fichiers
> livrables ne sont PAS encore produits. Lire cette fiche AVANT de préparer un envoi.

## 1. LES 5 DEMANDES — état réel

| # | Sa demande (mots exacts) | État | Où c'est fait |
|---|---|---|---|
| 1 | « keep the current meter size » | ✅ | `RUSTIC_SCALE = 0.452691` inchangé (aucune réduction n'avait jamais été appliquée) |
| 2 | « move the meter slightly lower » | ✅ | `POS_Y`/`RUSTIC_POS_Y = 706 + 18` — `ChillMeterOverlay.tsx` |
| 3 | « stronger shadow/contact shadow underneath » | ✅ | ombre 2 composantes renforcée — pic -75 → **-123** |
| 4 | « icons blue from the start, including idle/0% » | ✅ | `<g opacity={1}>` au lieu de `powerOn` — `ChillMeterRustic.tsx` |
| 5a | « MAX CHILL DETECTION glow blue on power-on » | ✅ | déjà couvert par `clip_titre` (x 200..990), vérifié au rendu |
| 5b | « at 75% only the wording and symbols light up, not the plaque » + « stay sharp and not blurry » | ✅ | calque néon `bandeau-neon.png` (technique du givre) |
| ⭐ | *(non demandé)* glaçons qui flottaient sous l'objet | ✅ | `mask_givreFade` — défaut soulevé par le jury, jamais traité avant |

**Commits** : `77f23964` · `456747ee` · `a241bbac` · `d7d8f943` · `ac35eab2` · `534ec24a`

## 2. VÉRIFIÉ COMMENT

- Rendus **full HD (`scale=1`)**, jamais jugé sur un rendu réduit.
- Chaque correction **mesurée**, pas jugée à l'œil seul (ombre, couleur, luminance, % de pixels).
- **Agent de vérification indépendant** (07/09) : compilation 0 régression, 7 compositions
  rendues ET mesurées (un PNG noir/vide = échec silencieux), tous les `staticFile()` résolus.
- ⛔ **Ce qui N'A PAS été validé par Aziz** : le rendu final des corrections sur son téléphone.
  Mon jugement vaut sur des images fixes ; c'est son œil qui tranche (précédent : il a vu
  l'asymétrie de l'occlusion que mes chiffres avaient ratée).

## ⏭️ PROCHAINE ÉTAPE — REFAIRE la vidéo récap (verdict Aziz, 07/09)

⛔ **La vidéo récap du 07/09 est REJETÉE** (`out/_r-and-d/chill-meter-3d/RECAP-5-corrections.mp4`,
25 s, 6 plans). Techniquement propre (aucun gel, annotations lisibles) mais **mauvaise forme** :
j'ai fait des ZOOMS RECADRÉS et des comparaisons avant/après en split — donc « du statique,
différents écrans qui défilent ». On ne voit jamais vraiment sa vidéo, juste « du coin de l'œil ».

⭐ **CE QU'IL FAUT FAIRE À LA PLACE** (mots d'Aziz) : reprendre la forme de nos vidéos habituelles,
celle utilisée pour les tests d'effets d'animation —
- **CADRE PLEIN, JAMAIS RECADRÉ** : son extrait vidéo réel qui joue, en entier, et l'objet posé
  dans son coin **exactement comme il apparaîtra dans sa vidéo YouTube**.
- **Les annotations apparaissent EN HAUT de l'écran** par-dessus, comme déjà fait (cf. la vidéo
  annotée des 4 demandes, `ANNOTEE-verification-06-09-v4.mp4`, qui elle avait la bonne forme).
- ⛔ **AUCUNE frame statique, aucun zoom recadré, aucun split avant/après.** L'objet reste à sa
  place et à sa taille réelles pendant que la vidéo joue.

**Matériel déjà prêt et réutilisable** :
- Extrait réel : `public/_client-sim/chill-meter/test-brume/plateau-reel.mp4` (30 s, sans son)
- Compos plein cadre sans effet R&D : `ChillMeter-RECAP-{Idle,Entrance,Fill75,Fill100}`
  (`plateauVideo: true`, `effet: "aucun"`) — déjà rendues, c'est la BONNE base
- Cartons d'annotation : `.../scratchpad/recap/c1..c6.png` (à refaire si le montage change)

⛔ **Piège déjà payé sur ce montage** : un `ffmpeg concat -c copy` FIGE l'image en gardant la
durée normale (gel de 12 s non détecté à l'œil). Assembler avec le **filtre `concat` en
réencodant**, et vérifier par échantillonnage dense (1 frame/1,2 s, hashs tous distincts).

## 3. ⛔ CE QUI MANQUE POUR ENVOYER

1. **Les 6 MOV alpha sont PÉRIMÉS** — `out/_r-and-d/chill-meter-upwork/*.mov` datent du
   **23 août**, donc AVANT toutes les corrections des 6-7/09. Ne PAS les envoyer.
   → **À REGÉNÉRER** avec la commande (cf. `memory/tools/remotion.md` § export ALPHA) :
   ```
   npx remotion render src/index.ts <ID> out.mov \
     --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le \
     --image-format=png --scale=1
   ```
   ⛔ `--pixel-format` est OBLIGATOIRE en plus du profil, sinon pas d'alpha (piège payé le 06/09).
   Compositions : `ChillMeter-Entrance` · `Idle` · `Fill25` · `Fill50` · `Fill75` · `Fill100`.
2. **Le message** : brouillon prêt dans `messages/BROUILLON-message-revision-07-09.txt`.
   ⛔ Il n'a **jamais été relu ni validé par Aziz** — le relire avant tout envoi.
3. **La décision de périmètre** (voir §4).

## 4. ⚠️ LA QUESTION NON TRANCHÉE — périmètre contractuel

Le tri du 05/09 (dans `STATUS.md`) attribuait :
- demande **5a** (powered-on / MAX CHILL DETECTION) → **jalon 2** (140 $, non financé)
- demande **5b** (75 % / AbiGirl Reacts) → **jalon 3** (105 $, `NotFunded`)

Or **le jalon 1 (105 $) est toujours impayé**, et ces deux demandes ont été codées.
→ Ce n'est pas perdu (pré-production du jalon 2), mais c'est du travail hors jalon 1 livré
en avance. **Décision d'Aziz requise** : on le montre maintenant, ou on le garde ?

## 5. LE POINT À EXPLIQUER — l'occlusion

Elle n'a **jamais employé le mot « occlusion »** (vient de nous et du jury). Ne pas le lui
servir. Le brouillon dit simplement, en mots simples, que l'élément de premier plan ne
couvre qu'une petite partie à gauche et que le couvrir inégalement ressemblerait à un défaut.
Mesure à l'appui si besoin : panneau du piano x=109..356, meter x=188..716.

## 6. OÙ EST QUOI

| Quoi | Où |
|---|---|
| Point d'entrée du sujet | `memory/starters/STARTER-chill-meter-revision-06-09.md` |
| Historique complet + contrat | `memory/client-sim-tests/upwork-chill-meter/STATUS.md` |
| Brouillon de message | `.../messages/BROUILLON-message-revision-07-09.txt` |
| Code | `src/projects/_rnd/chill-meter/ChillMeterRustic.tsx` + `ChillMeterOverlay.tsx` |
| Page de suivi (visuels) | https://claude.ai/code/artifact/5850aa17-cd86-4f75-9d8b-e0be02de5592 |

⚠️ **La page de suivi pese 9,7 Mo au 07/09 (plafond 16 Mo)** — chaque video y est embarquee en
base64, ce qui multiplie sa taille par ~1,33. Quelques ajouts de plus la saturent.
→ Avant d'y ajouter une video : soit **alleger/retirer les anciennes**, soit **ouvrir une 2e page**.
⛔ Elle est editee par PLUSIEURS sessions : toujours `Artifact action:"read"` AVANT de republier,
sinon on ecrase le travail d'une autre session (une republication concurrente a eu lieu le 07/09).
| Sa vraie capture de plateau | `out/_r-and-d/chill-meter-3d/REFERENCE-CLIENTE/vraie-capture-06-09.png` |
| MOV périmés (⛔ ne pas envoyer) | `out/_r-and-d/chill-meter-upwork/*.mov` (23/08) |
