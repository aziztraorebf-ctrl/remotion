# Sénégal Pétrole & Gaz — Corrections mineures (post-Acte 1)

> Créé 2026-05-22 après validation Acte 1 V5 → FINAL.
> À traiter en fin de production (après validation tous les actes), avant mix final.

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
