# Sénégal Pétrole & Gaz — Corrections mineures (post-Acte 1)

> Créé 2026-05-22 après validation Acte 1 V5 → FINAL.
> Mis à jour 2026-05-24 : ajout section fact-check post-production (4 corrections mineures).
> À traiter en fin de production (après validation tous les actes), avant mix final.

---

## Corrections fact-check (2026-05-24) — Labels overlay, PAS de re-génération audio

> Décision Aziz : l'audio ne sera PAS re-généré. Ces 4 points seront corrigés via labels overlay discrets au montage final. Approche standard documentaire (Caspian Report, Vox).

### FC-1 — "8 millions de dollars par jour" (Acte 1, ~0:25)

- **Dans le script** : "Huit millions de dollars par jour."
- **Réalité** : Sangomar produit 100 000 barils/jour. À ~80$/baril = ~8M$/jour est plausible mais pas sourcé officiellement. Le chiffre officiel Woodside est volumétrique (100 000 b/j), pas monétaire.
- **Correction** : Label overlay discret sous le BigStat : `"(estimation au cours de marché — Woodside : 100 000 b/j)"`
- **Timing narration** : ~0:25 dans `narration-v1-clean.mp3`
- **Beat concerné** : Acte 1 / Beat1 — BigStat "8 000 000 $/jour"
- **Priorité** : basse

### FC-2 — "Dette 70% → 132% du PIB" (Acte 3 / Mécanisme 2 / Beat11) ⚠️ PRIORITÉ HAUTE

- **Dans le script audio** : "une dette publique qui équivaut à soixante-dix pour cent de la richesse annuelle du pays"
- **Réalité (chiffre officiel actuel)** : **132%** du PIB — chiffre officiellement reconnu et publié (révision post-audit Cour des comptes + FMI 2025). Ce n'est plus un chiffre contesté, c'est le chiffre officiel.
- **Impact visuel** : Beat11 utilise `LaCalebasse` (graphisme calebasse SVG interne). La calebasse représentant 70% devra être mise à jour à 132% — ce qui implique une **calebasse qui déborde** (niveau > 100%). Animation possible : gouttes qui tombent sur les bords pour signifier l'excès.
- **Correction requise (dans l'ordre)** :
  1. **Re-narration audio** : le mot "soixante-dix" est dit à l'oral — il FAUT re-générer ou splicer ce segment audio. Options :
     - Re-générer uniquement la phrase avec ElevenLabs + force-alignment Whisper pour recaler
     - Splicer : couper la phrase, insérer "cent trente-deux" sur le même tempo
  2. **Visuel** : modifier Beat11 — calebasse niveau 132% (débordement) + animation gouttes qui tombent
  3. **Chiffre affiché** : remplacer "70%" par "132%" dans tous les overlays Beat11
- **Beat concerné** : Beat11 (Beat12 si la dette est aussi mentionnée là)
- **Priorité** : **HAUTE — RE-RENDER obligatoire** (audio + visuel, pas juste un label overlay)

### FC-3 — "Fonds norvégien 1 500 milliards — 280 000 $ par Norvégien" (Acte 3, ~2:50)

- **Dans le script** : "ce fonds vaut mille cinq cents milliards de dollars — soit deux cent quatre-vingts mille dollars par Norvégien"
- **Réalité** : Le fonds vaut aujourd'hui **plus de 2 000 milliards** (~2T$), soit ~390 000 $ par Norvégien (CNBC, jan 2026). Les chiffres du script étaient probablement vrais à la date d'écriture mais dépassés.
- **Correction** : "1 500 milliards" reste techniquement vrai comme minimum historique — aucun label nécessaire si on garde la formulation. OU label : `"(plus de 2 000 milliards $ en 2026 — source : NBIM)"`
- **Timing narration** : ~2:50 dans `narration-v1-clean.mp3`
- **Beat concerné** : Beat10 / SmallMultiplesGrid Norvège
- **Priorité** : basse (valeur historique toujours vraie)

### FC-4 — Beat0 Accroche — Yakaar et dissolution gouvernement (événements distincts)

- **Dans le Beat0** : les deux événements étaient présentés comme simultanés (22 mai 2026)
- **Réalité** :
  - Yakaar : accord signé **22-23 avril 2026** (Sonko annonce retrait Kosmos + transfert PETROSEN)
  - Dissolution gouvernement : **22 mai 2026** (décret n°2026-1128, Diomaye révoque Sonko)
  - Ce sont deux événements distincts séparés d'un mois
- **Correction** : Réécrire le script du Beat0 pour distinguer les deux dates. Ne pas relier comme un seul événement.
- **Impact** : Beat0 doit être recodé de toute façon (refonte visuelle en cours) — corriger dans le nouveau script.
- **Priorité** : haute (correction à intégrer dans la v3 du Beat0, avant audio)

### FC-5 — Botswana "dès 1966" (Acte 3, ~2:55)

- **Dans le script** : "Le Botswana a fait la même chose avec ses diamants dès 1966"
- **Réalité** : Indépendance 1966, diamants découverts 1967, fonds souverain formel (Pula Fund) créé 1993. La phrase est narrativement correcte (même époque = indépendance + premières découvertes) mais techniquement imprécise.
- **Correction** : Aucune — la formulation "dès 1966" désigne l'époque de l'indépendance, pas le fonds. Acceptable en documentaire grand public.
- **Priorité** : nulle

---

---

## Corrections visuelles Beat 1 (Mapbox flyover)

### B1-C1 — Clipping carte pendant le zoom
- **Symptôme** : pendant le flyover Afrique → Sénégal, la carte Mapbox clippe légèrement aux bords à certains niveaux de zoom
- **Cause probable** : tiles non chargées (Mapbox headless charge les tiles progressivement, certaines arrivent en retard)
- **Options** :
  - Réduire la vitesse de zoom (étaler le mouvement sur plus de frames)
  - Ajouter un léger `padding` à la vue initiale pour précharger plus de tiles
  - Ou accepter si imperceptible à la vitesse finale (priorité basse)
- **Priorité** : basse

### B1-C2 — Buffering Mapbox en fond au début du Beat 2
- **Symptôme** : à la transition Beat 1 → Beat 2, la carte Mapbox de Beat 2 montre un micro-buffering (tiles grises/vides au premier frame)
- **Cause probable** : Mapbox prend quelques frames à initialiser dans Beat 2 (style.load asynchrone)
- **Options** :
  - Ajouter un fade-in de 10-15 frames sur le conteneur Mapbox de Beat 2 (`opacity: interpolate(frame, [0, 15], [0, 1])`) pour masquer le chargement
  - Ou ajouter `premountFor` si Remotion le supporte pour les compositions imbriquées
- **Priorité** : moyenne (visible au cut)

---

## Backlog — Short YouTube 90s (après assemblage final)

> Décision 2026-05-25 : produire un Short ~90s pour diriger vers la version longue au moment de la publication.

**Effort estimé** : ~80% du travail déjà fait (assets, charte, composants Remotion). Reste : script (~120 mots), voix-off ElevenLabs (15min), composition assemblage (1-2h).

**Structure validée (5 séquences)** :

| Segment | Durée | Source | Contenu |
|---------|-------|--------|---------|
| Hook choc | 0-8s | Beat0 intégral | AVRIL + flip + Yakaar + GOUVERNEMENT DISSOUS |
| Le pétrole arrive | 8-22s | Acte 1 condensé | Flyover Sangomar + BigStat 100k b/j + première cargaison |
| Les règles du jeu | 22-42s | Beat11 + Beat12 | Calebasse dette + Cost Recovery — le cœur explicatif |
| Yakaar, partie ouverte | 42-58s | Beat13 condensé | Carte + bascule Europe→Chine + "?" géant |
| Phrase clé | 58-75s | Acte 4 | "Les décisions des 5 prochaines années..." — fond navy, Cinzel gold |
| CTA | 75-90s | Nouveau | Titre version longue + flèche + durée |

**Principe** : zéro nouvel asset visuel — extraits via `startFrom`/`endAt` dans une nouvelle composition Remotion. La section [22-42s] (mécanisme) est ce qui différencie un Short substantiel d'un simple teaser.

**À faire au moment de produire** :
1. Écrire le script condensé (~120 mots) avec Aziz
2. Générer voix-off ElevenLabs + Whisper force-alignment
3. Nouvelle composition Remotion `SenegalShort90.tsx`

---

## Mix final — Instructions (à exécuter quand tous les actes sont validés)

```bash
# Structure attendue :
# out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4  (42.3s) ✅ VALIDÉ
# out/episodes/senegal-petrole-gaz/senegal-acte2-FINAL.mp4  (à venir)
# out/episodes/senegal-petrole-gaz/senegal-acte3-FINAL.mp4  (à venir)
# out/episodes/senegal-petrole-gaz/senegal-acte4-FINAL.mp4  (à venir)

# Fichiers audio source :
VOICE="public/souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3"
MUSIC="public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3"

# Concat tous les actes (créer le fichier concat avant) :
# /tmp/senegal-full-concat.txt

# Mix voix 100% + Musique A 18% + fade-out 6s avant la fin
ffmpeg -y \
  -f concat -safe 0 -i /tmp/senegal-full-concat.txt \
  -i "$VOICE" \
  -i "$MUSIC" \
  -filter_complex "
    [1:a]volume=1.0[voice];
    [2:a]volume=0.18,afade=t=out:st=<TOTAL_DURATION-6>:d=6[music];
    [voice][music]amix=inputs=2:duration=first[aout]
  " \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k \
  out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4
```

### Paramètres mix validés (Acte 1)
- Voix : `volume=1.0` (100%)
- Musique A : `volume=0.18` (18%) — validé Aziz 2026-05-22
- Fade-out musique : 4s sur Acte 1 (à ajuster selon durée totale finale)
- Codec audio : `aac -b:a 192k`

---

## Statut Actes

| Acte | Durée | Statut | Fichier |
|------|-------|--------|---------|
| Acte 1 (Beats 1–3+5) | 42.3s | VALIDÉ | `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4` |
| Acte 2 (Continu + Beat9) | 88.3s | VALIDÉ 2026-05-23 | `out/episodes/senegal-petrole-gaz/acte2-FINAL.mp4` |
| Acte 3 | — | À produire | — |
| Acte 4 | — | À produire | — |

---

## Backlog SFX (à intégrer avant render final complet)

> Validé par Aziz 2026-05-23 — ajouts non bloquants, à faire à la toute fin (avant assemblage 4 actes).

### Beat0 — Accroche (f0→f1095) — À décider avant assemblage

> Aucun SFX actuellement dans Beat0. À traiter en priorité car c'est le premier beat — l'impact sonore dès le départ est crucial.

**Pistes à explorer (chercher dans `public/_shared/sfx/` d'abord)** :

- **Acte 1 — OdometerFlip (f30→f120)** : son mécanique de compteur/flipboard qui tourne — cliquetis rapide type "reel spinning" synchronisé avec les cases. Peut être un loop court (0.3s) répété. Priorité : haute — c'est le premier son de l'épisode.
- **Acte 1 — Apparition "AVRIL" (f10)** : fade-in discret ou silence. Peut-être rien si le flip couvre déjà.
- **Acte 2 — Mapbox in (f240)** : ambiance sous-marine légère ou bruit de vent océanique à l'apparition de la carte (Yakaar est offshore).
- **Acte 3 — Slide drapeau (f660)** : whoosh léger de glissement horizontal (rapide, ~0.5s) synchronisé avec le slide depuis la gauche.
- **Acte 3 — Stamp "SÉNÉGAL" (f750)** : impact "tampon" — son sourd et sec type cachet officiel. Fort mais court. Clé de la scène.
- **Acte 3 — "Gouvernement dissous" (f870)** : vibration grave type "verdict" ou cloche funèbre courte — marque l'aspect politique et solennel.

**Décision à prendre avec Aziz** : écouter les SFX disponibles dans `public/_shared/sfx/` et choisir case par case. Si manquants, générer via ElevenLabs Sound Effects (prompt court) ou chercher sur freesound.org CC0.

### Acte 2 — SenegalActe2Continu + Beat9

**Phase A (Sangomar) — f0→f512**
- f0 : "ping" subtil quand le dot Sangomar apparaît (genre sonar)
- f197 : "snap" léger sur l'apparition du label SANGOMAR (cliquetis mécanique)

**Trans AB — Pull Back Reveal — f512→f620**
- f512→f572 : whoosh aérien (60f) synchronisé avec le zoom 7.8→3.6 et le blur

**Phase B (GTA) — f620→f1671**
- f620 : "tic" net à l'apparition du dot GTA (différent du ping Sangomar)
- f1442→f1571 : son de "trait qui se trace" (whoosh continu) pendant l'arc Europe
- f1600→f1671 : variation plus aiguë pour l'arc Asie/Qatar
- f1193 : flash subtil "1ère cargaison" avec un bip type téléimprimeur

**Trans BC — Whip Pan SO — f1671→f1760**
- f1671→f1731 : whoosh inverse + counter-rotation audio (effet Doppler)

**Phase C (Yakaar) — f1760→f2134**
- f1760 : note cyan suspendue (différente du gold) — atmosphère sous-marine
- f2027 : "drone" sourd qui monte à l'apparition du "?" géant
- f2173 : vibration audio subtile au mot "capitales" (sync avec vibration visuelle)

**Beat 9 — Donut 60% — f2134→f2650**
- f2194 (F_DONUT) : "tick" mécanique à chaque ~30° d'arc qui se dessine (8 ticks sur 9s)
- f2464 (F_NUMBER) : "pop" / "ding" subtil sur l'apparition du chiffre 60%
- f2514 (F_DIVIDER) : trait audio sec quand le divider gold déploie
- f2534 (F_SCANDALE) + f2579 (F_JACKPOT) : impact sourd type "verdict" sur chaque phrase

### Source SFX
- Banque interne `public/_shared/sfx/` à compléter
- Alternative : freesound.org (CC0) ou ElevenLabs Sound Effects (génération via prompt)
- Format : `.wav` ou `.mp3`, mono, normalisé -12 dB max

### Volume mix recommandé
- SFX UI (ping, tick, snap) : 0.25-0.35
- SFX cinématiques (whoosh, drone) : 0.40-0.55
- Toujours sous la voix-off (1.0) et au-dessus de la musique (0.18)
