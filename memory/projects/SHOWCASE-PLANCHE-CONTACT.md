# Planche-contact des 53 templates déjà rendus (2026-08-15)

> ## 🗄️ STATUT : ARCHIVE CONSULTABLE — PAS la source de la showcase (décision Aziz, 2026-08-15)
>
> **Rien n'est supprimé** : les 53 MP4 restent dans `out/templates-souverain/`, les 2 planches restent
> en ligne (liens ci-dessous), cette légende reste la clé de lecture. On consulte ce fichier quand on
> cherche « est-ce qu'on avait déjà fait un truc comme ça ? ».
>
> **Ce qui change** : ces templates ne seront PAS le matériau de la vidéo showcase, et l'arbitrage
> d'Aziz (« lesquels tiennent encore ? ») est **annulé** — inutile de parcourir les planches pour ça.
>
> **Pourquoi** (constat d'Aziz, en regardant un gig Fiverr concurrent) : *« voir des templates qui
> défilent sans intention derrière, ne veut rien dire du tout »*. La pratique a mûri vers le sur-mesure
> — chaque vidéo part désormais d'un storyboard original, plus d'un catalogue de templates. Un
> concurrent qui vend 20 effets interchangeables se bat sur le terrain où nous ne sommes plus.
> La showcase se montera donc sur la **production vivante publiée** (Sénégal, Soudan, AES, CFA,
> Gazoduc Actes 1-2) : des scènes complètes où il se passe quelque chose, pas des briques isolées.
>
> Ces renders gardent 2 usages : (1) retrouver une forme déjà explorée, (2) témoigner de l'âge
> « socle mai 2026 » du repo. Voir `SHOWCASE-CAPACITES.md` § inventaire.

> **But** : rendre visible d'un coup d'œil ce qui dort dans `out/templates-souverain/` (53 MP4, 426 Mo,
> rendus mai-juin 2026 et jamais revus depuis). Chaque vignette = 4 s du template, à ~15% de sa durée.
> Règle appliquée : *un décor qu'on n'a pas vu n'est pas un acquis, c'est une dette.*
>
> **Planche VERTICALE (30 templates 9:16)** :
> https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/planche-templates-verticaux-XsHYn5Dnw26xMBmIFcNGHfvmMjEVTy.mp4
>
> **Planche HORIZONTALE (23 templates 16:9)** :
> https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/planche-templates-horizontaux-M8RdDDVBfhcBh6RmHJ9e3mFvtZ5ddt.mp4
>
> ⚠️ **Constat à la 1re lecture** : plusieurs vignettes de la planche horizontale sont **vides ou
> quasi vides** (cadres noirs, portraits en silhouette non remplis) — templates dont l'extrait tombe
> sur un moment sans contenu, ou placeholders jamais alimentés. À écarter ou à re-rendre sur un
> autre timecode avant tout usage en showcase.
>
> ⚠️ Les 2 formats ont été séparés volontairement : mélanger 9:16 et 16:9 dans une grille unique
> donne un résultat bancal. Ne pas les refusionner.
>
> Méthode de régénération : voir `scripts/` — extraits `ffmpeg -ss <15% durée> -t 4`, scale+pad sur
> fond `#0A1B2E`, puis `xstack`. ⛔ Ce build ffmpeg local n'a PAS le filtre `drawtext` (vérifié) :
> les noms ne peuvent pas être incrustés, d'où cette légende numérotée séparée.

---

### PLANCHE VERTICALE 9:16 — 30 templates, grille 6 colonnes

Lecture : de gauche à droite, puis ligne suivante.

 1. (L1C1) **BarRace-v1**
 2. (L1C2) **BurnReveal**
 3. (L1C3) **CoinFlip**
 4. (L1C4) **FillScreen-v3**
 5. (L1C5) **FlagFill-FocusUn-V**
 6. (L1C6) **FlagFill-MultiPays-V**
 7. (L2C1) **GlitchReveal**
 8. (L2C2) **IconGrid**
 9. (L2C3) **IconStat**
10. (L2C4) **NetworkGraph**
11. (L2C5) **OdometerFlip-v3**
12. (L2C6) **OdometerFlip-v4-slot**
13. (L3C1) **ProcessFlow**
14. (L3C2) **PulseNumber-v1**
15. (L3C3) **RadarPing-v3**
16. (L3C4) **RadarScan**
17. (L3C5) **ScaleShock**
18. (L3C6) **ScaleTilt**
19. (L4C1) **ShatterReform**
20. (L4C2) **SplitFlap**
21. (L4C3) **StackedBars-v1**
22. (L4C4) **Timeline**
23. (L4C5) **TimelineFracture**
24. (L4C6) **TypeReveal-v1**
25. (L5C1) **TypeWriter**
26. (L5C2) **WordExplode**
27. (L5C3) **atlas3d-v3**
28. (L5C4) **kraftcard-v3**
29. (L5C5) **smg-v4-cream**
30. (L5C6) **smg-v4-kraft**

---

### PLANCHE HORIZONTALE 16:9 — 23 templates, grille 5 colonnes

Lecture : de gauche à droite, puis ligne suivante.

 1. (L1C1) **CargoVoyage16x9-v1**
 2. (L1C2) **MapboxSatelliteSenegal-v1-16x9**
 3. (L1C3) **PortDechargement16x9-v1**
 4. (L1C4) **ProtoH-Vague3b-Showcase-v1-16x9**
 5. (L1C5) **ProtoI-Vague3c-Showcase-v1-16x9**
 6. (L2C1) **ProtoJ-Vague4-Showcase-v1-16x9**
 7. (L2C2) **ProtoK-Vague5-Showcase-v1-16x9**
 8. (L2C3) **ProtoL-Vague6-Showcase-v1-16x9**
 9. (L2C4) **ProtoM-Vague7-Showcase-v1-16x9**
10. (L2C5) **ProtoN-Vague8-Showcase-v1-16x9**
11. (L3C1) **ProtoO-Vague6Exp-Showcase-v1-16x9**
12. (L3C2) **LoomWeaver-v1**
13. (L3C3) **MetamorphoseFiduciaire-v1**
14. (L3C4) **MosaiqueActeurs-v1**
15. (L3C5) **MosaiqueWax-v1**
16. (L4C1) **OrigamiCarto-v1**
17. (L4C2) **ParallaxeDiorama-v1**
18. (L4C3) **PassationPouvoir-v1**
19. (L4C4) **PortraitEditorial-v1**
20. (L4C5) **PortraitSilhouette-v1**
21. (L5C1) **TrombinoscapeStrategique-v1**
22. (L5C2) **svg-horizontal-16x9-REFERENCE**
23. (L5C3) **svg-personnage-encre-REFERENCE**
