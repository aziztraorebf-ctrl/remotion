# PLAN ASSEMBLAGE FINAL — War-Map Sahel AES

> Créé 2026-06-25 (trou de parcours confirmé par audit SYNTHESE-COHERENCE-PILIERS.md).
> ⚠️ **PRÉREQUIS BLOQUANT : passe séquentielle AVANT assemblage** (STATUS.md en tête).
> Acte 1 (hook + recalage triggers V5) et P1 doivent être refaits AVANT de lancer cet assemblage.
> P4 existe en wip/ mais n'est PAS encore un FINAL promu.

---

## (a) Compositions à rendre + plages de frames

| Composition (Root.tsx) | `durationInFrames` | Durée @30fps | Fichier FINAL cible | État actuel |
|---|---|---|---|---|
| `SahelActe1-Final` | 2126 f | ~70.9s | `out/episodes/warmap-sahel/acte1-FINAL.mp4` | ✅ EXISTS (76.7s mesurés — écart : le render inclut intro/outro) |
| `SahelPartie1` | 2940 f | ~98s | `out/episodes/warmap-sahel/p1-FINAL.mp4` | ✅ EXISTS (35.2s mesurés — À CONFIRMER : durée incohérente, p1 à re-render après refonte Acte1) |
| `SahelPartie2` | 5700 f | ~190s | `out/episodes/warmap-sahel/p2-FINAL.mp4` | ✅ EXISTS (89.7s mesurés) |
| `SahelPartie3` | 9410 f | ~313.7s | `out/episodes/warmap-sahel/p3-FINAL.mp4` | ✅ EXISTS (109.8s mesurés) |
| `SahelPartie4` | 13500 f | ~450s | `out/episodes/warmap-sahel/p4-FINAL.mp4` | 🔴 PAS FINAL — candidat : `wip/p4-FULL-v3-audio.mp4` (136.1s, non validé full HD) |

> ⚠️ Les durées mesurées ne correspondent pas aux `durationInFrames`. Les compositions incluent
> seulement la plage narrative de chaque partie (le moteur continu passe en mode "muet" hors plage).
> Les durées RÉELLES des fichiers FINAL existants (mesurées ffprobe) sont les références pour le concat.

### Durées réelles à utiliser pour le concat (ffprobe)
```
acte1-FINAL.mp4  : 76.7s
p1-FINAL.mp4     : 35.2s  (À RECONFIRMER après refonte Acte1/P1)
p2-FINAL.mp4     : 89.7s
p3-FINAL.mp4     : 109.8s
p4-FINAL.mp4     : À CONFIRMER (136.1s en wip — render full HD à faire)
TOTAL estimé     : ~447.5s (~7min27)
```

> Audio de référence : `narration-v5-expressive.mp3` = 445.9s (7min26) — cohérent.

---

## (b) Commande de render

**Toutes les compositions Sahel utilisent Mapbox (WebGL) → render local obligatoire via `render-mapbox.sh`.**
Vercel (`scripts/tools/render-on-vercel.py`) NE supporte pas WebGL/Mapbox.

```bash
# Render chaque partie (ordre conseillé — plus rapide si récent)
./scripts/render-mapbox.sh SahelActe1-Final  out/episodes/warmap-sahel/acte1-FINAL.mp4
./scripts/render-mapbox.sh SahelPartie1      out/episodes/warmap-sahel/p1-FINAL.mp4
./scripts/render-mapbox.sh SahelPartie2      out/episodes/warmap-sahel/p2-FINAL.mp4
./scripts/render-mapbox.sh SahelPartie3      out/episodes/warmap-sahel/p3-FINAL.mp4
./scripts/render-mapbox.sh SahelPartie4      out/episodes/warmap-sahel/p4-FINAL.mp4
```

> Vitesse indicative : ~5 fps → SahelPartie4 (13500 f) ≈ 45 min.
> Option `--frames=A-B` pour re-render partiel (vérif non-régression rapide).

---

## (c) Concat ffmpeg (ordre exact)

```bash
# 1. Créer la liste de concat (muet)
cat > /tmp/sahel-concat.txt << 'EOF'
file '/Users/clawdbot/Workspace/remotion/out/episodes/warmap-sahel/acte1-FINAL.mp4'
file '/Users/clawdbot/Workspace/remotion/out/episodes/warmap-sahel/p1-FINAL.mp4'
file '/Users/clawdbot/Workspace/remotion/out/episodes/warmap-sahel/p2-FINAL.mp4'
file '/Users/clawdbot/Workspace/remotion/out/episodes/warmap-sahel/p3-FINAL.mp4'
file '/Users/clawdbot/Workspace/remotion/out/episodes/warmap-sahel/p4-FINAL.mp4'
EOF

# 2. Concat vidéo seule (sans audio — le mix se fait à l'étape d)
ffmpeg -y -f concat -safe 0 -i /tmp/sahel-concat.txt \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  /tmp/sahel-concat-muet.mp4

# 3. Vérif durée totale
ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 /tmp/sahel-concat-muet.mp4
# Attendu : ~447s ± 3s (À CONFIRMER après render P4 final)
```

---

## (d) Mix audio

### Pistes à mixer
| Piste | Fichier | Rôle | Timing |
|---|---|---|---|
| **Narration (principale)** | `public/_shared/audio/sahel-warmap/narration-v5-expressive.mp3` | Voix GéoAfrique V2, 445.9s | 0 → fin (couvre toute la vidéo) |
| **Musique (fond continu)** | `public/_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3` | Choix validé Aziz (option D), 538.5s | 0 → fin vidéo (tronquer à durée concat) |
| **SFX** | `public/_shared/audio/sahel-warmap/sfx/` | Ponctuels (ink-spread, impact, boom-coup, etc.) | À CONFIRMER — timings SFX dans SahelTimings.tsx |

> ⚠️ Dossier SFX : À CONFIRMER — chemin exact à vérifier (`public/_shared/audio/sahel-warmap/sfx/` ou sous-dossier warmap/).

```bash
# Mix final avec narration + musique (fade in 3s / fade out 5s sur musique)
DURATION=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 /tmp/sahel-concat-muet.mp4)
MUSIC_FADE_OUT=$(echo "$DURATION - 5" | bc)

ffmpeg -y \
  -i /tmp/sahel-concat-muet.mp4 \
  -i public/_shared/audio/sahel-warmap/narration-v5-expressive.mp3 \
  -i public/_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3 \
  -filter_complex "
    [1:a]volume=1.0[narration];
    [2:a]afade=t=in:st=0:d=3,afade=t=out:st=${MUSIC_FADE_OUT}:d=5,volume=0.18[music];
    [narration][music]amix=inputs=2:duration=first:dropout_transition=3[aout]
  " \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  out/episodes/warmap-sahel/SAHEL-AES-FULL-PREMIX.mp4

# Si SFX à ajouter (timings précis requis) : passe ffmpeg séparée ou intégrer dans Remotion
# À CONFIRMER : décider si SFX intégrés Remotion (déjà dans chaque Partie) ou ajoutés au mix final
```

> Note : les SFX sont déjà intégrés dans chaque composition Remotion (via `<Audio>` dans les fichiers Partie*.tsx).
> Si c'est le cas, le concat muet + mix narration/musique suffit — les SFX seront déjà dans la piste vidéo.
> À CONFIRMER en écoutant acte1-FINAL.mp4 (contient-il des SFX ? Oui → pas de passe SFX séparée).

---

## (e) Checklist QC anti-figé

```bash
# Vérif anti-figé : extraire 1 frame toutes les 2s, vérifier qu'elles diffèrent (md5)
DURATION=$(ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/episodes/warmap-sahel/SAHEL-AES-FULL-PREMIX.mp4)
mkdir -p /tmp/qc-frames
ffmpeg -i out/episodes/warmap-sahel/SAHEL-AES-FULL-PREMIX.mp4 \
  -vf fps=0.5 /tmp/qc-frames/frame_%04d.png -y -v quiet

# Détecter les frames identiques consécutives (figé = bug Mapbox headless)
cd /tmp/qc-frames && md5 frame_*.png | awk -F'= ' '{print $2}' | \
  sort | uniq -d > /tmp/duplicate-frames.txt
cat /tmp/duplicate-frames.txt
# Si vide → OK. Si frames dupliquées → identifier le timecode et re-render la partie.

# Vérif durée cohérente avec narration
echo "Narration : 445.9s — Vidéo finale : ${DURATION}s"
# Tolérance : ±2s
```

### Points de contrôle qualitatifs (à valider à l'oreille/oeil)
- [ ] Raccords entre parties : pas de coupure abrupte (la caméra raccorde via `getPartieNCam`)
- [ ] Narration commence dès le premier frame (pas de silence en tête)
- [ ] Musique : fade in 3s au début, fade out 5s sur les derniers mots
- [ ] P4 : extinction au noir présente (Ph11 dans Partie4Cout.tsx)
- [ ] Contours nationaux visibles P3+P4 (colorés : Mali ocre, Burkina brique, Niger sarcelle)
- [ ] Aucun overlay "@koraetcartes" visible pendant les parties (gaté `!isPartie`)

---

## Séquence complète (ordre d'exécution)

```
1. [PRÉREQUIS] Valider passe séquentielle : refaire Acte1 + P1 (STATUS.md §PROCHAINE)
2. Rendre les 5 compositions (render-mapbox.sh) → 5 fichiers *-FINAL.mp4
3. Vérifier chaque FINAL individuellement (audio + visuel, 30s sample)
4. Concat ffmpeg → /tmp/sahel-concat-muet.mp4
5. Mix audio (narration + musique D) → SAHEL-AES-FULL-PREMIX.mp4
6. QC anti-figé (md5 frames) + vérif durée
7. Gemini/Twelve Labs review rythme/rétention sur la vidéo COMPLÈTE (INVENTAIRE §3)
8. → out/episodes/warmap-sahel/SAHEL-AES-FULL-PREMIX.mp4 promu PRET-PUBLICATION/
```

---

## Items "À CONFIRMER"

| # | Item | Où vérifier |
|---|---|---|
| 1 | SFX déjà dans les renders Remotion ? (→ pas de passe séparée) | Écouter `acte1-FINAL.mp4` + `p3-FINAL.mp4` |
| 2 | Chemin exact dossier SFX war-map | `ls public/_shared/audio/sahel-warmap/` |
| 3 | P4 : render full HD validé Aziz avant de promouvoir p4-FINAL.mp4 | Session dédiée P4 |
| 4 | P1 : durée 35.2s cohérente ? (semble court — p1 = f0→2940 = 98s théoriques) | Re-render + mesurer |
| 5 | Volume musique 0.18 : ajuster à l'oreille (musique fond discret sous narration) | Mix test |
| 6 | Option hook 30s avant Acte1 (gabarit HOOK-MAXBELLONA) | Décision Aziz avant publi |
