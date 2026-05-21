# Caspian Report — Résumé scout

URL chaîne : https://youtube.com/@CaspianReport
Vidéos analysées : 3
Date scout : 2026-05-08

## Verdict global chaîne : 🟢

## Signature visuelle (cross-vidéos)
Caspian Report a une identité visuelle extrêmement consistante : carte du monde plate "atlas vintage papier ivoire + océan bleu pâle" avec ken-burns lent permanent comme matrice de fond, sur laquelle ils empilent des couches narratives (choropleths colorés, hachures diagonales, leader-pins ronds, pulses sonar, arcs dashed France→Niger). Typo unique : sans-serif condensed bold ALL CAPS pour les pays + sans-serif humanist mixed pour les villes — différenciation par taille et casse, jamais par 2 familles concurrentes. Stock footage live-action coupé en bursts 1-2s entre les cartes, souvent teinté rouge/sépia pour homogénéiser. Pattern récurrent fort : "leader-pin" (portrait rond + drapeau + label PRO-X) et "news headline serif rouge sur noir charbon" pour citer sources.

## Différenciation vs Or Africain V5
Or Africain V5 = noir + or + ledger financier + tons chauds, mood "preuve écrite, autorité économique posée". Caspian = ivoire-papier + bleu pâle + accents rouge/orange + mood "carte d'état-major, géopolitique en cours". Différencié **fortement** : aucune palette, aucune typo, aucune métaphore ne se chevauchent. Caspian inspire un Template C clairement distinct (atlas vintage + tons chauds + grain papier) plutôt qu'une variation de l'existant. **Risque identifié** : Caspian utilise les hachures diagonales (Sahel belt, Wagner zones) — Souverain Or Africain V5 emploie déjà des éléments hachurés. À arbitrer en dissection : soit on s'approprie le pattern hachures, soit on évite pour Template C.

## Top 5 idées à voler (consolidé sur les 3 vidéos)
1. **Leader-pin sur carte (v2 frames 020/110)** : portrait rond + drapeau rond + label "PRO-X" projeté via Mapbox project(). Composant `<LeaderPin>` réutilisable — apporte la dimension humaine sur la carte sans rompre le code cartographique. Coût Remotion : ~30 min.
2. **Tableau ressources scroll + highlight jaune glissant (v3 frame 005)** : `<ResourcesScrollTable>` sur fond chalkboard noir avec bandeau jaune qui descend item par item. Variation directe du ledger Or Africain pour Template C — chiffres macro, dépendances industrielles. Coût Remotion : ~45 min.
3. **News headline serif rouge sur noir charbon (v3 frames 060/080)** : `<NewsClipping source headline date>` Playfair Display rouge `#a63232` + sans-serif subtitle. Template "preuve" qui sert directement la rigueur Fact-Sheet Souverain v2 (cite sources institutionnelles à l'écran). Coût Remotion : ~20 min.
4. **Choropleth animé pays-par-pays + stagger icônes ressources (v1 frame 003 + v3 frame 100)** : Mapbox `fill-color` par ISO + `symbol` layer avec icônes custom (diamond/oil-rig/gold-bar) animées via stagger 50-80ms `useCurrentFrame`. Climax visuel "richesse géologique" peak 80 icônes en 3s. Coût Mapbox : ~1h R&D (DEM optionnel pour effet topo).
5. **Pulses sonar concentriques sur points stratégiques (v2 frame 005)** : SVG `<circle>` avec r interpolé 0→80px et opacity 1→0 en boucle 1.5s sur capitales/mines/ports. Hyper signature Template C "satellite dramatique". Coût Remotion : ~15 min, déjà dans le périmètre.

## Pertinence Template C "satellite tramé dramatique"
Caspian Report inspire **fortement** Template C, mais avec un ajustement : leur signature n'est pas "satellite" (vue 3D depuis l'espace) mais "atlas vintage à plat avec grain papier". Pour Template C version Souverain, recommandation = combiner la **palette ivoire-papier + bleu pâle + accents chauds** de Caspian avec un **grain texture overlay** (déjà au catalogue mapbox-effets-et-tests à tester) et **conserver les pulses + leader-pins + arcs dashed** comme vocabulaire d'animation. Le tilt 3D Mapbox (frame v3-040) + le DEM hillshade donnent l'effet "satellite dramatique" si on tient à cette dimension verticale. La vraie pépite Template C : `pitch:45` + texture papier + ken-burns lent + leader-pins. Reproductibilité globale : haute.

## Recommandation
Pour la dissection (Jour 2) : **retenir** intégralement.
Pourquoi : 3/3 vidéos ont une qualité signal/bruit excellente, 5+ patterns concrets directement transposables Remotion+Mapbox, différenciation forte vs Or Africain, et la chaîne couvre exactement notre territoire (Afrique géopo). Les coûts d'implémentation restent raisonnables (~3h cumulées pour les 5 idées principales).
