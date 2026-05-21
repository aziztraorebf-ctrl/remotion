# Brief Jury AI Hybride — Atlas Shaka Zulu (Vision créative pré-construction)

> Ce brief est envoyé en parallèle à **GPT-5 (OpenAI), Grok-4.1-fast (xAI), Gemini-3-flash (Google)**.
> Kimi K2.5 (Moonshot) a déjà donné son avis sur les 5 inserts existants (intégré dans la synthèse finale).
> Objectif : recueillir des visions créatives diversifiées AVANT de continuer la construction visuelle.

---

## 1. CONTEXTE PRODUIT

**Format** : Atlas YouTube Short — 1080x1920 portrait, 30fps, 150.32s (2min30)
**Pilier chaîne** : Atlas (figures historiques africaines + cartographie animée)
**Référence stylistique** : épisode précédent Mansa Moussa V2 (validé, publié)
**Voix** : Narratrice GeoAfrique v2 ElevenLabs (féminine, expressive, rythme ouest-africain)
**Audience** : francophonie mondiale + diaspora bilingue
**Tonalité** : narration documentaire dense (formule César), pas de pathos cheap, sources académiques affichées

---

## 2. SCRIPT INTÉGRAL avec timestamps Forced Alignment

```
[HOOK 0.12s → 4.86s]
"Il est né paria. Il est mort roi d'un empire de deux cent cinquante mille âmes."

[S1 SETUP GEO 5.56s → 21.76s]
"KwaZulu-Natal. Un clan. Les Zulus. Mille cinq cents personnes.
Un fils que son père refuse de reconnaître.
Banni à six ans. Banni à quinze ans.
Deux fois chassé. Deux fois debout.
Son nom : Shaka."

[S2 INNOVATIONS MILITAIRES 22.75s → 72.36s]
Sous-découpé en 4 actes :
- A1 Iklwa (22.75 → 37.68): "Quand Dingiswayo lui donne un régiment, Shaka réinvente la guerre. Première innovation : il supprime la lance longue. Il forge l'iklwa, courte, mortelle au corps à corps. L'ennemi doit se battre."
- A2 Bouclier (37.68 → 49.78): "Deuxième : le bouclier devient une arme. Accrocher le bouclier adverse, tourner le poignet, l'ennemi expose son flanc. Un seul mouvement. Fatal."
- A3 Cornes (49.78 → 63.30): "Troisième : la formation des cornes de buffle. Un centre qui fixe et épuise. Deux flancs qui encerclent par derrière. L'ennemi est cerné avant de comprendre ce qui arrive."
- A4 Gqokli + Synthèse (63.30 → 72.36): "À Gqokli Hill, en mil huit cent dix-huit, quatre-vingt-dix pour cent de pertes chez l'ennemi. Pas une victoire. Une destruction totale."

[S3 EXPANSION 73.16s → 93.46s]
"Chaque tribu conquise fournit ses guerriers, loyaux à Shaka seul.
Mille cinq cents guerriers en mil huit cent seize. Cinquante mille en mil huit cent vingt-huit.
Vingt pour cent de sa population porte les armes. En Europe, cinq pour cent.
Un seul homme. Trente mille kilomètres carrés."

[S4 SPIRALE NANDI 94.24s → 139.64s]
"Mais rien de tout cela ne peut se comprendre sans Nandi. Sa mère. La seule qui l'avait défendu.
Quand tous le rejetaient, Nandi était là.
Octobre mil huit cent vingt-sept. Nandi meurt.
Shaka décrète un deuil national. Toute naissance est proscrite pendant un an. Tout champ reste sans culture.
Selon les chroniques, James Stuart Archive, quatre mille Zulus périssent. Pour n'avoir pas pleuré assez fort.
Ses demi-frères Dingane et Mhlangana comprennent. L'homme qui a tout bâti est en train de tout détruire.
Le vingt-deux septembre mil huit cent vingt-huit, ils l'assassinent."

[S5 CTA 140.49s → 150.23s]
"L'empire Zulu survit cinquante ans après sa mort. Quand on parle de génie militaire, on cite Napoléon. On cite Alexandre. Qui cite Shaka ? Abonne-toi. Il y en a d'autres comme lui."
```

---

## 3. STACK TECHNIQUE — ce qu'on PEUT et NE PEUT PAS faire

**Maîtrisé** :
- Remotion 4.0.452 (React + TypeScript)
- SVG natif animé : path, circle, rect, text, gradient, pattern, filter (turbulence, blur, drop-shadow, displacement)
- spring() + interpolate() + useCurrentFrame()
- d3-geo + Natural Earth (cartes vectorielles) + Historical Basemaps (frontières historiques)
- ElevenLabs (audio + Forced Alignment) + Whisper (sous-titres karaoke)
- Gemini 3 Pro (illustrations parchemin) + Seedance (clips video courts 5-15s)
- PixelLab MCP (sprites pixel art : characters + map_objects)
- fal.ai Minimax (musique générative)

**Hors stack** :
- Pas d'After Effects, GEOlayers 3, Google Earth Studio
- Pas de Three.js / WebGL custom / 3D vraie
- Pas de Lottie
- Pas de génération vidéo AI longue (>15s instable)
- Pas d'images statiques qu'on fait juste pivoter (règle Aziz validée)

**Préférences Aziz validées** :
- Inserts conçus en Remotion pur (SVG dataviz), pas images PixelLab/Gemini qui tournent
- "Vivant partout" : chaque élément bouge, pas de freeze
- Pas de particules flottantes (sauf poussière combat)
- Cartes : style "design 2D moderne" (pas obligatoirement vieille carte parchemin)
- Inserts = pattern interrupts, accompagnent la narration sans l'interrompre

---

## 4. ÉTAT ACTUEL — ce qui est VERROUILLÉ vs OUVERT

### VERROUILLÉ (ne pas remettre en cause)
- Audio narration v5 (150.32s, validé Aziz, ne sera pas regénéré)
- Structure 6 segments + S2 sous-découpé en 4 actes
- Palette : or #C8A84B / bordeaux #8B1A1A / parchemin #F5E6C8 / noir #0D0D0D
- Voix narratrice GeoAfrique v2 ElevenLabs
- Format portrait 1080x1920 (Atlas Short)
- Pipeline Mansa Moussa comme référence stylistique
- Inserts S2 (iklwa, bouclier, cornes, 4000, 1500) déjà refait en SVG Remotion pur (vague 1B)

### OUVERT (vous pouvez proposer)
- Animations Remotion (spring configs, séquencement, transitions)
- Choix de cartes : d3-geo simple vs enrichie (parallaxe, pattern, masques)
- Idées créatives nouvelles dans nos contraintes
- Pattern visuel récurrent qui crée une "signature" Shaka Zulu
- Optimisation pédagogique (ordre des révélations, hiérarchie information)

---

## 5. CE QUI INQUIÈTE / PLAÎT À AZIZ (commentaires personnels du réalisateur)

**Ce qui plaît :**
- Le compteur "4 000" sanglant avec spring lourd (impact viscéral)
- La cascade S5 Napoléon → Alexandre → Shaka? (hiérarchie visuelle)
- La structure S2 4 actes (iklwa / bouclier / cornes / synthèse)
- Le grain documentaire des cartouches sources Mansa Moussa V2

**Ce qui inquiète :**
- Risque de répétition visuelle sur 150s (trop de "compteur + cartouche")
- Manque de carte d3-geo réelle (S1, S3 ont des gradients fake en attendant)
- Comment rendre la **carte vivante** (pas juste fond statique)
- S4 (mort Nandi) trop "compteur sang" et pas assez "spirale tragique" intime
- Hook 5s : pas assez impactant pour un Short qui doit retenir l'attention en 3 secondes

---

## 6. RÉFÉRENCE PHILOSOPHIE — pattern Mansa Moussa V2

Inserts dataviz validés sur Mansa Moussa :
- Pie Chart "L'or en circulation 50%" : titre serif → arc qui se dessine → split animé → labels → cartouche source "IBN BATTUTA · AL-UMARI"
- Bar Chart "Expéditions les plus coûteuses" : barres animées proportionnelles → labels chiffrés tonnes → highlight Mansa Moussa
- Line Chart "Évolution du prix de l'or" : courbe qui se dessine → marker événement → cartouche source

Caractéristiques systématiques :
- Apparition séquentielle (jamais tout en même temps)
- Cartouche bas avec source académique (style "IBN BATTUTA · AL-UMARI · 1338")
- Typographie : Cormorant Garamond serif pour titres, sans-serif pour labels
- Spring damping 14-18, stiffness 80-200
- Filtres SVG (glow, shadow) sur éléments importants

---

## 7. VOS 5 QUESTIONS — réponse précise attendue sur CHACUNE

**IMPORTANT : on attend de la créativité dans nos contraintes, pas une simple validation. Soyez audacieux mais réaliste sur le stack.**

### Q1 — Approche méthodologique
Si tu devais construire CETTE vidéo (script + timestamps verrouillés, stack Remotion), par où tu commencerais et pourquoi ?
Quelle scène d'abord ? Quel composant prototyper en premier ? Quelle dépendance critique identifier ?

### Q2 — Scène la plus risquée
Quelle est selon toi la scène la plus risquée narrativement (rétention + clarté + impact émotionnel) ?
Pourquoi ? Comment la sécuriser DANS NOS CONTRAINTES ?

### Q3 — Pattern visuel récurrent (signature)
Sur 150s en 6 segments, quel pattern visuel récurrent suggères-tu pour créer une signature Shaka Zulu ?
Exemples valides : un effet de transition entre segments, un élément visuel qui réapparaît, une typographie spécifique aux moments clés, etc.
Sois précis sur la technique Remotion.

### Q4 — Idée créative concrète qu'on n'aurait pas pensée
Une seule idée, mais qu'on n'aurait pas pensée nous-mêmes. Faisable dans le stack.
Format : Idée en 1 phrase + Comment dans Remotion (technique précise) + Impact narratif + Coût estimé (heures dev).

### Q5 — Sensibilité historique / représentation
Y a-t-il un point de représentation à éviter sur ce sujet (Shaka Zulu, violence politique, mort de 4000 personnes par dictat royal, demi-frères assassinent leur frère) ?
Comment éviter le piège du "tribalisme exotique" ou de la "violence spectaculaire" ?

---

## 8. FORMAT DE RÉPONSE ATTENDU

Pour chaque question Q1-Q5, structure ta réponse en :

```
## Q[N] — [titre de ta réponse]

### Idée principale
[1-2 phrases qui résument]

### Comment dans notre stack
[Technique précise : composants Remotion, fonctions d3-geo, paramètres spring, etc.]

### Impact narratif/émotionnel
[Court — pourquoi ça marche]

### Coût production estimé
[Heures de dev, asset count, appels API si pertinent]

### Variantes (optionnel, max 2)
[Si tu vois 2-3 chemins, liste-les brièvement]
```

À la fin, un **VERDICT GLOBAL** :
- Une note /10 sur "potentiel narratif de ce projet" (dis-nous franchement si tu trouves le projet ambitieux ou faible)
- 3 idées qu'on doit absolument intégrer (priorité haute)
- 2 idées intéressantes mais optionnelles (priorité moyenne)
- 1 alerte critique si tu en vois une (sensibilité, faiblesse narrative, risque rétention)

Sois critique. On préfère "voici ce qui ne va pas" à "tout est parfait". Réponse en français.
