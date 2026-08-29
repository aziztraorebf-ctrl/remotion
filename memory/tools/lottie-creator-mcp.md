# MCP LottieFiles Creator — installation, gotchas, ce qu'il apporte

> Installé et **validé en direct le 2026-08-26** (`read_scene` répond, `create_shape` et
> `set_fill` exécutés sur la scène d'Aziz). Paquet `@lottiefiles/creator-mcp` (MIT, v0.2.1).
> ⚠️ **Aucun plan payant requis** — contrairement à ce qu'on supposait.

## Installation
Dans `.mcp.json` du projet (gitignoré) :
```json
"lottiefiles-creator": {
  "type": "stdio", "command": "npx",
  "args": ["-y", "@lottiefiles/creator-mcp@latest"]
}
```
Puis **redémarrer Claude Code**, ouvrir `creator.lottiefiles.com` et **activer MCP dans Creator**
(un onglet ouvert ne suffit PAS). Confirmation côté navigateur : « Local MCP bridge connected ».

## ⛔⛔ LE GOTCHA QUI COÛTE 20 MINUTES : le port 3847 est UNIQUE
Le serveur ouvre un WebSocket sur `127.0.0.1:3847`. **Une seule instance peut le tenir.**
Or **chaque session Claude Code lance son propre serveur** — donc avec 2 sessions ouvertes :
- la 1re prend le port et reçoit la connexion du navigateur,
- la 2de démarre, échoue à prendre le port, **et ne réessaie jamais**.
Résultat : le navigateur affiche « connected », l'autre session voit
« No Creator tab is connected », et **rien dans la config n'est en cause**.

**Diagnostic en 2 commandes** :
```bash
lsof -nP -iTCP:3847                    # qui tient le port + connexion navigateur ?
ps -eo pid,ppid,command | grep creator-mcp   # comparer le PARENT au PID de sa propre session
```
Sa propre session : `ps -o ppid= -p $$` puis remonter la chaîne jusqu'à `claude`.

**Remède** : arrêter le serveur MCP de l'AUTRE session (pas la session elle-même), puis arrêter
LE SIEN — Claude Code le relance aussitôt, il prend le port libre, et le navigateur **se
reconnecte tout seul**. ⚠️ Tuer un processus d'une autre session est refusé par le garde-fou :
demander l'accord d'Aziz d'abord (fait le 08-26).

## ⛔⛔ LES 4 GOTCHAS D'USAGE (mesurés 2026-08-28, chaîne logo client)

1. ⭐⭐ **L'import CRÉE une scène-composant et BASCULE l'active.** `read_scene` seul ne dit PAS
   dans quelle scène on se trouve → **toujours `list_scenes` AVANT toute écriture**.
   Corollaires : (a) ne jamais conclure à un écrasement du travail d'Aziz sans avoir listé les
   scènes — **fausse alerte vécue** ; (b) la scène d'accueil ne porte qu'**UN calque de
   RÉFÉRENCE** vers le composant : ⛔ ne PAS le lire comme un aplatissement, il faut
   `switch_scene` vers le composant pour voir les 15 calques ; (c) « Layer not found » vient de
   la même cause (on cherche dans la mauvaise scène).

2. ⛔ **`import_asset` LOTTIE exige une URL PUBLIQUE.** `127.0.0.1` et `localhost` sont refusés
   (« Invalid URL ») — ce n'est pas le fichier qui est en cause. Passer par
   `scripts/tools/upload-to-blob.py`.
   ⚠️ Et `import_asset` **SVG inline arrive APLATI en 1 seul calque** : ce n'est pas une voie de
   livraison. Le Lottie, lui, arrive déplié. ⭐ L'intérêt de notre chaîne est donc confirmé **par
   la négative** — la voie facile perd ce qu'on sait préserver.

3. ⛔ **« N of M layers are hidden » sur une scène ANIMÉE = FAUX POSITIF.** Creator lit la
   **frame 0**, où les calques sont volontairement à opacité 0 — c'est le DÉBUT de l'animation.
   Un outil qui juge une scène animée sur sa 1re image la déclare vide. **Ne pas corriger ce qui
   n'est pas cassé.**
   Même famille : `visual_bounds` ne se rafraîchit pas après une clé de `scale` (bornes calculées
   sur l'ancienne échelle, `center_layer` renvoie `target_reached: false` alors que la valeur EST
   écrite). Artefact de lecture — ⛔ ne pas re-doser à l'aveugle dessus.

4. ⚠️ **Un gros fichier ne passe pas.** 505 calques / 433 Ko → `import_asset` **timeout à 70 s**,
   alors que le pont est vivant et le fichier servi intégralement. La limite est le traitement
   côté Creator, pas le transport.

## ⭐⭐ FAUT-IL PAYER L'ABONNEMENT ? — NON (mesuré 2026-08-28, 1 export dépensé sur 5)

Fichier importé puis **réexporté en Lottie JSON**, puis comparé au nôtre :

| | Notre fichier | Retour de Creator |
|---|---|---|
| Noms de calques | 8 | **8, identiques, même ordre** |
| Clés du geste | 4, suspension 8 f | **4, suspension 8 f** |
| Ratio chute/montée | 0,44 | **0,44** |
| Poids | 13,2 Ko | 44,9 Ko |

**RIEN n'est perdu, RIEN n'est gagné.** Les 44,9 Ko ne sont pas du contenu en plus : Creator
réécrit le JSON en clair avec tous les défauts explicites. Seul ajout réel : `meta.g`.
⛔ **NE PAS dépenser d'export pour livrer** — le fichier local est équivalent et 3,4× plus léger.
⛔ **Les 293 $/an ne se justifient pas** : ils achètent l'« Optimized JSON » (44,48 Ko sur leur
propre exemple) alors que notre BRUT fait 13,2 Ko.
⚠️ Seul cas où l'export sert : récupérer une modif faite **DANS** Creator. Règle retenue :
demander la modif à Claude (portée dans le code), le fichier local reste la source unique.
⭐ **Aziz a eu raison d'insister pour tester** : je recommandais de ne pas dépenser l'export sur
une SUPPOSITION que j'avais moi-même signalée comme non prouvée.

## Ce que ça apporte VRAIMENT (110 outils)
- ⭐⭐ **`read_scene`** — dimensions, fps, durée, TOUS les calques, sélection, ordre de rendu,
  bornes visuelles, débordements, `occlusion` (calque caché derrière un autre). **Supprime les
  allers-retours par screenshot** : les 3 défauts trouvés par Aziz les 25-26/08 (flamme figée,
  courbe lourde, calques illisibles) auraient été inspectables directement.
- ⭐⭐⭐ **`set_fill` = LA RÉFÉRENCE DES DÉGRADÉS** (notre blocage n°1). Sa doc donne ce que la
  spec ne disait pas clairement :
  · chaque stop porte `offset` (0-1), `color` {r,g,b 0-255} **et `opacity` (0-1)** — c'est
    exactement ce que notre convertisseur ignorait (courbe rendue 4× trop opaque, cf.
    `CE-QUI-PASSE-EN-LOTTIE.md`) ;
  · `start`/`end` sont des **COORDONNÉES PIXEL en espace local du calque, PAS des ratios 0-1**.
    Une forme de taille {W,H} va de (-W/2,-H/2) à (+W/2,+H/2). Omettre start/end laisse l'outil
    calculer des défauts sensés (linéaire haut→bas, radial centre→bord) ;
  · `GRADIENT_RADIAL` accepte en plus `highlightAngle` et `highlightLength`.
  ✅ **Testé en direct** : radial 3 arrêts (opacité 1 → 0,45 → 0) et linéaire reproduisant
  l'aire du Gazoduc (0,30 → 0,02) acceptés sans erreur.
- **Texte** : `create_text`, `set_text_style`, `split_text`, `measure_text_units`, `list_fonts`.
  ✅ **Bloqueur LEVÉ le 26/08** par cette voie : poser dans Creator → lire la structure → porter.
  Ce que `measure_text_units` a donné et que la spec ne disait pas : `line_height` = la taille de
  police par défaut, `tracking` est un nombre simple (4 = léger), justification **2 = centre**,
  et l'origine est la **LIGNE DE BASE**. ⛔ `list_fonts` : **17 familles, toutes PRESET** — ni
  Georgia (412 usages chez nous) ni Arial ni Cinzel. C'est ce relevé qui a tranché « vectoriser
  par défaut ».
- **Effets qu'on ne savait pas faire** : `apply_bounce` (physique), `apply_squash`,
  `add_drop_shadow`, `add_blur`, `create_mask`, `set_matte`, `vectorize_image`.
- **Organisation** : `group_layers`, `reorder_layer`, `align_layers`, `stagger_layers`.
  ⭐ **`set_layer_time` + `timeline_offset` = la primitive de CASCADE NATIVE** — sa propre doc la
  dit « moins chère et correcte » face à un décalage d'opacités fait à la main (ce qu'on fait
  dans `animate_scene.py`). Doublon avec notre code maison, à évaluer au prochain usage.

## ⛔ Ce qu'il n'apporte PAS
- **AUCUN outil d'export.** Vérifié : zéro. Récupérer le `.json` final reste **manuel** (Aziz
  exporte). Le MCP construit et modifie DANS Creator ; il ne sort rien.
- **Il ne remplace pas notre chaîne.** Nos outils travaillent EN AMONT (extraction Remotion →
  conversion → transcription) ; le MCP travaille DANS Creator. Deux moitiés complémentaires.
- **Il exige un humain devant l'écran** (onglet ouvert + MCP activé) → jamais d'autonomie.
- La doc officielle **déconseille de faire générer les illustrations par l'IA** et recommande
  d'importer des SVG existants — exactement notre position.

## Prochain usage prévu
✅ **La cible précédente est ATTEINTE** (porter les dégradés radiaux : `svg2lottie_scene.py` émet
un vrai `gf`, l'aéroport est passé de 57,74 % à 11,58 %). Même méthode appliquée au **texte** le
26/08, également fermé.

⏭️ **Prochaine cible : les MASQUES** — le dernier gros refus, et le mur de la scène « Front Ouvert »
(6 masques) retenue au banc d'essai. Lire dans Creator la structure produite par `create_mask` /
`set_matte`, puis la porter. ⭐ Un contournement existe déjà pour un cas : un masque à dégradé
horizontal se reproduit par **empilement de copies** (`vivifier.py::fondu_de_bord`) — vérifier
si le principe se généralise avant de porter le masque natif.
