# Brief Jury Hybride Pass 1 — Empire du Ghana / "Le sel qui valait son poids en or"

> Vous êtes membre d'un jury créatif de 3 LLMs. Vous évaluez un projet de Short YouTube/TikTok/Instagram (vertical 1080×1920) format Atlas (cartographique, géographique). Le script est VERROUILLÉ. Votre mission : nous aider à construire la vidéo de manière créative AVANT qu'on code.

---

## 1. Contexte produit

- **Format** : Short vertical 1080×1920, ~85 secondes
- **Plateformes** : YouTube Shorts + TikTok + Instagram Reels
- **Voix** : Narratrice GeoAfrique (féminine, didactique chaleureuse, style "Jacques a dit" mais éducatif factuel — pas blagueur)
- **Style visuel cible** : carte d3-geo Afrique de l'Ouest + sépia/or/bordeaux + sprites pixel art PixelLab + inserts SVG + Lottie
- **Audience** : francophonie mondiale + diaspora africaine bilingue, 18-45 ans, intéressée histoire/découverte/contre-récit
- **Tonalité** : factuel sans neutralité froide, chiffres mis en perspective, invitation au savoir

---

## 2. Script intégral VERROUILLÉ (~85s, 6 beats)

### Beat 0 — Hook (5s)
> Au cœur du Sahara, on troquait du sel contre de l'or. Au gramme près.

### Beat 1 — Setup géographique (13s)
> Wagadou. Aujourd'hui, presque personne ne connaît ce nom. Pourtant, du huitième au treizième siècle, cet empire ouest-africain contrôlait la richesse la plus convoitée du monde médiéval. Et il avait un secret.

### Beat 2 — Densité Cesar (19s)
> À Taghaza, au nord, le sel était extrait par blocs de quatre-vingt-dix kilos. À Bambouk, au sud, l'or sortait de la terre par poignées. Entre les deux, le désert. Et au centre exact, Koumbi Saleh. Vingt mille habitants. Une mosquée. Et un roi qui taxait chaque caravane.

### Beat 3 — Climax silent barter (16s)
> Mais le moment qui marque l'histoire, c'est ça. Sur les marchés du sud, les marchands déposaient leur sel. Puis ils s'éloignaient. Les acheteurs venaient. Posaient leur or à côté. Et repartaient sans un mot. Le silent barter. Sel contre or, presque au poids égal.

### Beat 4 — Conséquence (15s)
> Ce système a tenu cinq cents ans. Puis les Almoravides coupèrent les routes du sel en mille soixante-seize. Sécheresse. Effondrement. Et en mille deux cent quarante, un certain Sundiata Keïta détruit Koumbi Saleh. L'empire du Mali venait de naître sur les cendres de Wagadou.

### Beat 5 — CTA antithèse (8s)
> Wagadou. Cinq siècles de commerce mondial. Demande qui contrôlait l'or au Moyen-Âge. On te répondra Florence, Venise. Jamais Wagadou.

---

## 3. Stack technique disponible

### Ce qu'on PEUT faire
- **d3-geo cartes vectorielles** (projection Mercator/Orthographic, Natural Earth 50m, frontières historiques) — pipeline mature validé sur Mansa Moussa V2
- **Sprites PixelLab** (personnages avec walk cycle 4 directions, animations idle/falling/etc.) — validé walk cycle Atlas
- **Lottie via Claude** (icônes géométriques simples : couronne, balance, flèche, sacs, étoile) — validé 2026-05-03 avec format JSON canon Wiggle. Limite : ~10 vertices bezier max, 5 instances simultanées.
- **LightLeaks** WebGL (atmosphère, brève surimpression 8-10 frames)
- **Inserts SVG dataviz** (compteurs, comparaisons, schémas — exemples : InsertBouclierSchema, InsertNombre4000)
- **Gemini** images statiques (illustrations, signatures, panoramas)
- **Mouvements caméra Remotion** (zoom 2.5x→1.8x style Mansa Moussa, pan, dolly, tilt — fluides via interpolate continu)
- **Audio-derived timing** (Forced Alignment ElevenLabs frame-précis sur narration)
- **Karaoke subtitles** word-level (Whisper API)
- **Composants partagés Atlas** : AtlasMercator, AtlasGlobe, AtlasLabel, AtlasCaravane (chemins bezier animés)

### Ce qu'on NE PEUT PAS faire (limites validées)
- Silhouettes humaines réalistes via Lottie (utiliser PixelLab ou Gemini)
- Path morphing Lottie complexe (>10 vertices)
- Photos/illustrations détaillées via Lottie (utiliser Gemini)
- Effets WebGL lourds en headless (peuvent foirer)
- Plus de 5 instances Lottie simultanées dans une scène

---

## 4. État actuel

### VERROUILLÉ (ne pas reproposer de modifier)
- **Script intégral** (audio sera généré tel quel)
- **Format Atlas** (carto-natif, pas Seedance)
- **Style visuel signature** : sépia + or + bordeaux (palette Mansa Moussa V2)
- **Décision silent barter en PixelLab + Lottie + carte** (validé via test technique aujourd'hui)
- **Voix Narratrice GeoAfrique v2** (pas de changement)

### OUVERT (votre travail créatif)
- Découpage scène par scène avec mouvements caméra
- Choix d'icônes Lottie à intégrer
- Pattern visuel récurrent / signature
- Transitions entre scènes
- Choix de quoi faire apparaître à chaque beat (anti-encyclopédie : il faut du rythme)
- Comment représenter visuellement les chiffres (90kg sel, 20 000 hab, 5 siècles, etc.)

---

## 5. Commentaires personnels du réalisateur (Aziz)

### Ce qui me plaît dans le script
- Le hook contre-intuitif "sel = or" est fort, paradoxe immédiat
- Le silent barter est une scène cinématographique inédite sur YouTube (rituel mystérieux)
- La cross-promo Sundiata est discrète et naturelle
- Le CTA Florence/Venise crée une antithèse claire

### Ce qui m'inquiète
- **Encyclopédie qui menace** : Beat 2 a 4 stats en 19s, peut devenir didactique trop dense
- **Rythme** : on doit tenir le viral YouTube/TikTok, pas faire un cours d'histoire — JAMAIS statique, mouvements de caméra fréquents, beaucoup de faits qui apparaissent
- **Beat 4 dense** : 3 événements (Almoravides + Sécheresse + Sundiata 1240) en 15s — risque de perdre le viewer
- **Cohérence visuelle** : on vient de PAUSER Shaka Zulu pour cause de mismatch format/contenu. Empire du Ghana doit montrer que le format Atlas FONCTIONNE quand le sujet s'y prête.

### Référence pattern à suivre
**Mansa Moussa V2 Final** (validé production 2026-05-01, prêt publication) :
- Composition vectorielle d3-geo + Natural Earth
- Inserts dataviz (Pie/Bar/Line) qui ACCOMPAGNENT la narration sans l'interrompre
- Camera moves fluides (zoom progressif, pan)
- Karaoke subtitles or #D4A574
- Cartouches typo serif élégants
- Ratio "vide/plein" maîtrisé (pas saturé)

---

## 6. 5 Questions structurées

### Q1. Approche méthodologique : par où commencer ?
Si tu devais coder cette vidéo, par quoi commencerais-tu et dans quel ordre ? Quelle est la "scène d'ancrage" qui doit être bonne en priorité car elle détermine tout le reste ?

### Q2. Scène la plus risquée (et comment la sécuriser)
Parmi les 6 beats, laquelle te paraît la plus risquée à exécuter techniquement OU narrativement ? Pourquoi ? Comment la sécuriser ?

### Q3. Pattern visuel récurrent / signature
Quel **élément visuel récurrent** devrait revenir tout au long de la vidéo pour créer une signature mémorable propre à cet épisode ? (ex : la couronne d'or sur Mansa Moussa, le pulse rouge sur Shaka). Doit pouvoir être généré avec notre stack.

### Q4. Idée créative concrète qu'on n'aurait pas pensée
Une idée créative concrète, exécutable avec notre stack, qui transformerait un beat ordinaire en moment mémorable. Exemple type : "À Beat 3, faire X qui produit Y effet émotionnel/visuel". Pas de généralités. Précise le beat et l'effet.

### Q5. Sensibilité historique / représentation à éviter
Quels écueils de représentation faut-il éviter sur ce sujet (Empire du Ghana / Sahel médiéval / commerce esclaves potentiel / colorisme / orientalisme inverse) ? Note : on est sur un récit factuel positif d'un empire africain, pas un récit revanchard.

---

## 7. Format de réponse attendu

Markdown structuré, ~600-1200 mots :

```markdown
# Réponse [TON NOM LLM] — Empire du Ghana

## Note globale du brief : X/10

## Q1. Approche méthodologique
[Réponse]

## Q2. Scène la plus risquée
[Réponse]

## Q3. Pattern visuel récurrent
[Réponse]

## Q4. Idée créative concrète
[Réponse]

## Q5. Sensibilité historique
[Réponse]

## Alertes critiques (optionnel)
[Si tu vois un risque qu'on n'a pas mentionné]

## Convergences attendues / divergences (optionnel)
[Si tu penses que les autres LLMs auront un avis différent]
```

Réponds en français. Sois concret, pas généraliste. Pas d'éloges. Pas de "voici une vidéo passionnante". Va droit au sujet.
