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
- **Texte** : `create_text`, `set_text_style`, `split_text`, `measure_text_units`, `list_fonts`
  — notre bloqueur le plus fréquent (83 scènes sur 172).
- **Effets qu'on ne savait pas faire** : `apply_bounce` (physique), `apply_squash`,
  `add_drop_shadow`, `add_blur`, `create_mask`, `set_matte`, `vectorize_image`.
- **Organisation** : `group_layers`, `reorder_layer`, `align_layers`, `stagger_layers`.

## ⛔ Ce qu'il n'apporte PAS
- **AUCUN outil d'export.** Vérifié : zéro. Récupérer le `.json` final reste **manuel** (Aziz
  exporte). Le MCP construit et modifie DANS Creator ; il ne sort rien.
- **Il ne remplace pas notre chaîne.** Nos outils travaillent EN AMONT (extraction Remotion →
  conversion → transcription) ; le MCP travaille DANS Creator. Deux moitiés complémentaires.
- **Il exige un humain devant l'écran** (onglet ouvert + MCP activé) → jamais d'autonomie.
- La doc officielle **déconseille de faire générer les illustrations par l'IA** et recommande
  d'importer des SVG existants — exactement notre position.

## Prochain usage prévu
Poser un dégradé radial dans Creator, **lire la structure produite**, et la porter dans
`svg2lottie_scene.py` — pour que l'aéroport (57,74 % d'écart, 11 dégradés radiaux) devienne
livrable **sans que Creator soit ouvert**.
