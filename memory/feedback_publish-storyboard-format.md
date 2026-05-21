---
name: publish-storyboard-format
description: Format canonique validé pour la publication storyboard Phase 1 — script publish-storyboard.sh obligatoire pour tout dashboard here.now de review
metadata:
  type: feedback
---

Toute publication de storyboard Phase 1 DOIT utiliser `./scripts/publish-storyboard.sh`.

**Why:** Aziz a validé ce format comme standard permanent le 2026-05-14 — "peu importe que ce soit dans cette session ou dans dix sessions".

**How to apply:** Avant toute publication storyboard, vérifier que le HTML contient les 4 sections :
1. Script audio en bloc citation (bordure or)
2. Grille segments 2x2 avec image + timing + changement visuel + éléments + bg_texture
3. Tableau R1 complet (segment / frames / durée / R1 / changement)
4. Composants suggérés + Tailwind tokens + notes animations

**Pipeline images :** catbox.moe → fallback litterbox.catbox.moe (72h) → fallback base64. Jamais de chemins relatifs dans le HTML (here.now ne reçoit qu'un seul fichier).

**Commande canonique :**
```bash
./scripts/publish-storyboard.sh <beat_dir> <beat_name> "<script_audio>" [slug] [claimToken]
```

**Notif ntfy :** le script envoie automatiquement `ntfy-notify.sh storyboard_ready <beat> <url>` avec lien cliquable.

**Source de données :** le script lit `storyboard.md` depuis `beat_dir/` ou `src/projects/souverain/<projet>/<beat>/storyboard.md`. Le JSON dans storyboard.md est la source de vérité pour les segments, composants et tokens.
