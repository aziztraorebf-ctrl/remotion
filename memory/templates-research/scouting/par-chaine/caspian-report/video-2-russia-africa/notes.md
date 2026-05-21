# Russia secretly in war in Africa

URL : https://www.youtube.com/watch?v=ydH39HjuFZs
Durée : 14:40 (880s)
Date upload : 2023-06-25

## Palette
- Couleurs dominantes : `#cfe6ee` bleu pâle océan / `#f4ede0` ivoire papier / `#a8231f` rouge carmin (zones conflit + Wagner) / `#1d4ed8` bleu Russie pour highlights pays / `#5db27a` vert herbe pour zones "alliés" / accents jaune `#facc15` pour villes capitales.
- Ratio approx : 30% ivoire-papier, 25% bleu pâle océan, 15% rouge carmin (overlay conflits), 10% verts (alliés), 20% footage stock désaturé/teinté.
- Mood : carte d'état-major militaire, plus dramatique que v1 ; les zones conflit "saignent" sur la carte propre. Stock footage teinté rouge/sépia.
- Reproductibilité Remotion : haute — palette identique v1 + ajout couches "conflict overlay" rouge.

## Typographie
- Familles inférées : identique v1 (sans-serif condensed bold ALL CAPS pour pays + sans-serif humanist mixed pour villes). Ajout d'une typo Old English / blackletter ponctuelle pour intertitres dramatiques (mais peu utilisé ici).
- Hiérarchie headline/caption : pays 70-90px ALL CAPS, villes 18px, "PRO-RUSSIA" sur les cartouches leader = condensed 24px sur fond drapeau.
- Animations texte : labels pays toujours pop-in léger ; les cartouches "leader pin" arrivent avec scale-up depuis 0.6 + petit bounce spring.
- Reproductibilité Remotion : haute — `spring()` natif Remotion pour le bounce.

## Mouvement caméra
- Patterns dominants : ken-burns constant + zoom-target sur pays mentionné. Plus de "trajectoire d'arc" ici (France→Niger en arc dashed) que dans v1.
- Durée moyenne des plans : 2-4s, plus rapide que v1 (sujet plus tendu).
- Spécificités globe/satellite : aucun globe 3D ; tout en vue plate. Mais pulses concentriques (sonar) sur points stratégiques (frame 005) — animation pure 2D.
- Reproductibilité Mapbox : haute. Pulses = `<svg circle>` Remotion en overlay, pas besoin Mapbox.

## Transitions
- Entre scènes : cut sec + fade-noir 200ms ; quelques whip-blur quand on change de pays.
- Entre échelles (espace→pays→ville) : `flyTo` zoom 3→7 sur 1-1.5s, label pays présent permanent puis fade.
- Entre data et carte : transitions vers stock-footage teinté rouge (drone, soldats Wagner) en cut sec ; retour carte = wipe rapide.
- Reproductibilité : haute. Le stock-footage teinté est plus délicat (Souverain V5 n'utilise pas live-action), mais on peut le remplacer par photo Gemini i2i traitée.

## Frames sélectionnées (8)
- `frame-001-conflict-zones-pulses.jpg` : Afrique entière, 5 zones conflits avec pulses concentriques rouge + bandes hachurées Sahel. Vue d'ensemble macro = pattern "where things are happening".
- `frame-005-wagner-pulses-hatching.jpg` : zoom Sahel + 2 logos Wagner (cercles noirs) + pulses radiaux rouges + hachures rouges. Logos comme acteurs sur la carte.
- `frame-010-social-mockup-twitter.jpg` : mockup post Twitter/Facebook avec photo soldat Wagner + sous-titre "Without Russia we wouldn't be a state". Pattern "preuve sociale = source citée visuellement".
- `frame-020-leader-pin-pro-russia.jpg` : portrait rond Goïta + label "PRO-RUSSIA" + drapeau russe rond, le tout posé sur le Mali en vert. Template "leader-pin" = vol idéal.
- `frame-050-stock-action-tinted.jpg` : footage manifestation teinté rouge/violet saturé. Si on évite live-action, on peut reproduire avec Gemini i2i + overlay couleur multiply.
- `frame-070-wagner-watermark-stock.jpg` : footage soldat + watermark logo Wagner posé en overlay au centre. Pattern "branding = personnage géopolitique".
- `frame-110-leader-pin-pro-turkey.jpg` : carte méditerranée + portrait + drapeau Turquie + label "PRO-TURKEY" sur la Libye. Confirme que le template leader-pin est récurrent (= signature Caspian).
- `frame-130-arc-france-niger.jpg` : arc dashed line France→Niger reliant 2 pays surlignés (vert/violet). Template "trajectoire géopolitique entre 2 acteurs".

## Verdict vidéo
🟢

## Top 3 idées à voler pour Souverain
1. **Leader-pin sur carte (frames 020 + 110)** : composant `<LeaderPin lng lat portrait flagISO label="PRO-RUSSIA" />` qui projette via Mapbox `project()`, scale-up spring, drapeau rond généré côté React. Or Africain V5 utilise déjà des country highlights — le leader-pin ajoute la dimension humaine sans casser le code visuel.
2. **Pulses sonar sur points stratégiques (frame 001/005)** : SVG circle avec `r` interpolé 0→80px et opacity 1→0, en boucle 1.5s. Marque visuellement les "zones d'activité" (mines, ports, capitales) sur la carte. Très pertinent Template C "satellite dramatique".
3. **Arc trajectoire dashed entre 2 pays (frame 130)** : Mapbox `arc.js` ou simple SVG `path d="M ... Q ..."` projeté avec `strokeDasharray` animé via `dashoffset`. Pattern essentiel pour Souverain : "argent qui sort du pays vers métropole" — exactement le mood ledger.
