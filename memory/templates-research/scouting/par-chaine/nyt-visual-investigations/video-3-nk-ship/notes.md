# NYT Visual Investigations — Mysterious Ship North Korea Oil

URL : https://youtube.com/watch?v=hDTCHdcPYTQ
Durée analysée : ~12 frames échantillonnées (1/8s)

## Axe 1 — Palette  🟢

| Bloc | HEX inférés | Mood | Ratio |
|------|-------------|------|-------|
| Fond noir diagrammes | `#000000` `#0a0a0a` | Investigation / ledger | ~25% scènes diagrammes |
| Bleu vif vecteurs | `#3aa8b8` `#1c8da0` | Entité 1 (navire) | accents diagramme |
| Orange vecteurs | `#e88a3a` `#d97a2a` | Entité 2 (navire) | accents |
| Rouge/magenta vecteurs | `#e54a5a` `#d63d52` | Entité 3 (navire) | accents |
| Footage doré-ambre | `#a88a4a` `#c4a06a` `#f0d49a` | Coucher de soleil port, archive | ~50% |
| Skyline bleu acier | `#7a8a9a` `#4a5a70` | Pyongyang/Taiwan drone | ~20% |

**Palette signature ledger** : noir + 3-4 vecteurs colorés saturés. Très proche de ce qu'on cherche en Template A (Or Africain) **mais sans l'or** — c'est plus froid, plus "info-graphique investigation".

## Axe 2 — Assets / Figures d'animation  🟢🟢

- **Diagramme entités/relations sur fond noir pur** : 3 silhouettes navires stylisées (vector flat) + labels ALL CAPS sans-serif blanc + lignes dashed grises connectant à un nœud central encadré (`WINSON SHIPPING` dans un rectangle stroke gris)
- **Flèches dashed avec tête fléchée** : 1px gris, indiquant flux d'argent/marchandise entre entités
- **Vector ships** : silhouettes simplifiées 2D (pas de détail), couleurs unies, identifiables par couleur (bleu = Ever Grandeur, orange = Diamond 8, rouge = Superstar). Style "infographic newsroom"
- **Bandeau source noir** : `WINSON GROUP PROMOTIONAL VIDEO` top-left, sans-serif blanc 16px, fond noir 60% opacity sur footage attribué
- **Cadre vertical flottant** : footage témoin smartphone 9:16 sur fond noir 16:9 (identique pattern V1)
- **Footage drone ports** : telephoto compression (couches de navires dans la brume), couleur "magic hour"
- **Archival NK propaganda** : intégré tel quel, leader avec jumelles (humour macabre subtil)
- **Filigrane "T" NYT** bottom-right permanent

## Axe 3 — Mouvements caméra  🟢

- **Pop-in séquentiel diagramme** : entité 1 apparaît, puis 2, puis 3, puis lignes connectent (cadence ~0.6s par élément)
- **Push-in lent telephoto port** sur navires (drone hover) : ~3-5% zoom sur 4-6s
- **Coupe sèche** entre diagramme noir et footage couleur : contraste maximal
- **Hold long** sur diagramme final (compose entière reste visible 3-4s pour lecture)
- **Pan vertical drone** sur skyline (descente très lente ~0.3%/sec)

## Reproductible Souverain ?

✅✅ **Diagramme entités/lignes dashed sur noir** : 100% reproductible Remotion. SVG paths + labels + spring animations. Pattern signature.
✅ Vector ships couleurs codées : Recraft/Gemini génèrent, ou on dessine SVG simple
✅ Bandeau "SOURCE: X" : composant simple
🟡 Telephoto drone port : footage stock + Gemini i2i pour adapter ambiance
🔴 Vrai footage propagande NK : pas pertinent pour Souverain de toute façon

## Top observations backlog

1. **Diagramme entités/relations sur noir pur** = LE pattern Souverain manquant. Idéal pour visualiser "qui possède quoi" (sociétés écran, contrats miniers, chaîne de propriété). Frame 05 = référence absolue.
2. **Vecteurs codés couleur par entité** = grammaire visuelle qui survit au mute. Bleu/orange/rouge identifient sans relire.
3. **Cadence pop-in 0.6s entre éléments diagramme** = timing à reproduire (assez lent pour lecture, assez vif pour rester investigation)
