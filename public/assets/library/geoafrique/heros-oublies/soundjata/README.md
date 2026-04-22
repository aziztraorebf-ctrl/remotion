# Soundjata Keita Short — Assets Structure

> Organisation validée 2026-04-13. Short YouTube 129.12s en 8 Actes.
> Source de vérité du plan : `src/projects/geoafrique-shorts/manifests/soundjata-clip-plan.md`

---

## Structure du dossier

```
soundjata/
├── audio/                  # Narration + dialogues audio
├── actes/                  # Renders Remotion finaux par acte
├── clips-validated/        # Clips Seedance retenus pour le Short final
├── clips-pending/          # Clips tests / alternatives / rejetés (référence)
├── refs/                   # Character sheets + env plates + storyboards validés
│   └── archive/            # Storyboards rejetés (historique des itérations)
└── charte/                 # Assets Acte VI (Empire + Charte, déjà fait)
```

---

## audio/

| Fichier | Contenu | Usage |
|---------|---------|-------|
| `narration-full.mp3` | Narration complète GeoAfrique, 129.12s | Source unique pour tous les actes |
| `insult-dialogue.mp3` | Dialogue matrone (Acte II) | Overlay sur `clips-validated/acte2-insulte.mp4` |

---

## actes/ (renders Remotion finaux)

| Fichier | Acte | Durée | Statut |
|---------|------|-------|--------|
| `acte-v-final.mp4` | V — Kirina | 24.19s | ✅ Validé 2026-04-13 |
| _(acte-vi à render via `SoundjataCharte` composition)_ | VI — Empire + Charte | 20.5s | Composition prête, render à faire |

---

## clips-validated/ (retenus pour assemblage final)

| Fichier | Acte | Contenu | Source |
|---------|------|---------|--------|
| `acte2-insulte.mp4` | II | Scène matrone qui insulte Soundjata | Seedance + Gemini |
| `acte3-iron-bar-v1.mp4` | III | Barre de fer + transformation | Seedance |
| `acte5-segment-a-v2.mp4` | V (1/2) | Invulnérabilité + griot + ergot de coq | Seedance storyboard-to-video (9:16, audio) |
| `acte5-segment-b-v3.mp4` | V (2/2) | POV tir + flèche + impact + terreur | Seedance storyboard-to-video (9:16, audio) |

---

## clips-pending/ (tests, alternatives, rejetés)

| Fichier | Statut | Raison |
|---------|--------|--------|
| `acte5-segment-a-v1-16-9-rejected.mp4` | Rejeté | Format 16:9 (erreur, devait être 9:16 natif) |
| `acte5-segment-b-v1-rejected.mp4` | Rejeté | Storyboard B v1 déconnecté de l'Acte, Soumaoro statique, flèche mal orientée |
| `acte5-segment-b-v3-trimmed-10s.mp4` | Alternative | Version tronquée à 10s (non retenue, on garde v3 complet 12s) |
| `test-motion-transfer-v2.mp4` | Référence | Test motion reference transfer Soundjata vs Soumaoro (2026-04-13, 9.5/10). Technique validée, pas utilisée ici |

---

## refs/ (assets de référence, utilisés pour les générations)

| Fichier | Usage |
|---------|-------|
| `soundjata-combat-ref.png` | Identity anchor Soundjata (fond neutre tan, full body, posture de combat) |
| `soumaoro-combat-ref.png` | Identity anchor Soumaoro (fond neutre tan, full body, posture casting) |
| `savanna-environment-plate.png` | Environment plate Mali savanna (pour [REF_BACKGROUND] en storyboard-to-video) |
| `storyboard-acte5-segment-a.png` | Storyboard 4 panels validé pour Segment A Acte V |
| `storyboard-acte5-segment-b.png` | Storyboard 5 panels validé pour Segment B Acte V (v3d final) |
| `storyboard-9panels-technique-reference.png` | **Référence technique** — exemple de storyboard 9 panels 3×3 (non utilisé pour ce Short, sert d'exemple pour futurs projets Thiaroye/Nzinga/etc.) |

---

## refs/archive/ (storyboards rejetés, historique)

Gardés pour comprendre les itérations. Ne pas utiliser :

| Fichier | Itération | Raison rejet |
|---------|-----------|--------------|
| `storyboard-b-v1-rejected.png` | v1 | Première version avant redesign — déconnectée de l'Acte |
| `storyboard-b-v2-rejected.png` | v2 | Panel 3 direction flèche ambiguë, Panel 5 fuite mollasse |
| `storyboard-b-v3-rejected-6panels.png` | v3 | 6 cellules au lieu de 5, redondance Panel 3-4 |
| `storyboard-b-v3b-rejected-arrow-inconsistent.png` | v3b | Panels 4-5 flèche orientation incohérente (transperce le corps) |
| `storyboard-b-v3c-rejected-edit-failed.png` | v3c | Tentative édition chirurgicale échouée (Gemini Pro Image trop conservateur) |

La version retenue est `refs/storyboard-acte5-segment-b.png` (= storyboard-segment-B-v3d.png originale).

---

## charte/ (Acte VI, déjà fait)

Pipeline Remotion pur + Gemini pour l'Acte VI "Empire + Charte du Manden".
- Assets Gemini : parchemin, médaillons Mali/Occident, icônes droits (vie/protection/dignité), carte Mali Empire
- Narration : `charte/narration-acte-vi.mp3`
- Composition : `src/projects/geoafrique-shorts/SoundjataCharte.tsx`

---

## Nettoyage ancien emplacement (à faire)

Des copies des assets existent encore dans les anciens dossiers éparpillés :
- `public/assets/library/geoafrique/soundjata/combat-refs/` (7 storyboards + 3 refs)
- `public/assets/library/geoafrique/soundjata/combat-tests/` (7 clips mp4)

Tout a été copié (pas déplacé) dans la nouvelle structure ci-dessus. Les anciens dossiers peuvent être supprimés quand Aziz valide que tout fonctionne :

```bash
# À exécuter seulement après validation complète de l'Acte V et des nouveaux paths
rm -rf public/assets/library/geoafrique/soundjata/combat-refs
rm -rf public/assets/library/geoafrique/soundjata/combat-tests
# Ou même tout le dossier parent si vide
rmdir public/assets/library/geoafrique/soundjata 2>/dev/null
```

**Avant de supprimer** : vérifier que le render Remotion `SoundjataActeV` fonctionne avec les nouveaux paths (testé 2026-04-13 mini-render 2s OK).

---

## État d'avancement du Short Soundjata

| Acte | Contenu | Durée | Statut | Asset principal |
|------|---------|-------|--------|-----------------|
| I | SETUP tyrannie + prophétie + handicap | 12.1s | À générer | — |
| II | HUMILIATION (rampant + ridicule + humiliation + insulte) | 16.1s | ✅ **COMPLET** — début iron-bar couvre rampant/ridicule, insulte clip couvre la suite | `clips-validated/acte3-iron-bar-v1.mp4` (début) + `clips-validated/acte2-insulte.mp4` |
| III | TRANSFORMATION (réaction + barre fer + baobab) | 19.3s | ✅ **COMPLET** — clip iron-bar de 15s couvre toute la séquence | `clips-validated/acte3-iron-bar-v1.mp4` |
| IV | EXIL ET RETOUR | 16.4s | À générer (1 clip) | — |
| **V** | **KIRINA (invulnérabilité + impact + défaite)** | **24.2s** | ✅ **VALIDÉ 2026-04-13** | `actes/acte-v-final.mp4` |
| **VI** | **EMPIRE + CHARTE DU MANDEN** | 20.5s | ✅ Composition prête (Remotion pur) | `charte/` + `SoundjataCharte.tsx` |
| VII | LÉGENDE VIVANTE (griots) | 13.2s | À générer (1 clip) | — |
| VIII | CLOSE (signature série) | 6.5s | À générer (Remotion + 2 images Gemini) | — |

**Note importante** : le clip `acte3-iron-bar-v1.mp4` (15s) couvre **visuellement** :
- Début (~0-5s) = Soundjata rampant entouré des femmes = **fin Acte II** (`soundjataRampe` + `epouseRidiculise`)
- Milieu+fin (~5-15s) = barre de fer + transformation + baobab = **Acte III entier**

Le clip joue un **double rôle** narratif. Le clip `acte2-insulte.mp4` s'insère entre les deux usages du clip iron-bar.

**Restent seulement** :
- 3 clips Seedance à générer (Acte I setup, Acte IV exil, Acte VII griots)
- 2 images Gemini (Acte VIII split vertical)
- Assemblage composition `SoundjataShort.tsx` (8 actes → Short complet 129s)

**Budget total restant** : ~$10 (3×Seedance + 2×Gemini + temps de code Remotion)

---

## Techniques utilisées

### Pour les actes avec clips Seedance
- **Segment A/B Acte V** : **Storyboard-to-Video** (nouvelle technique validée 2026-04-13) — voir `memory/tools/seedance-storyboard-technique.md`
- **Motion reference transfer** disponible pour combats futurs — voir `memory/motion-reference-transfer.md`

### Pour les actes narratifs (VI, VIII)
- **Remotion pur + Gemini** — composition React avec assets peints

### Pour l'audio
- Narration ElevenLabs → mixée avec audio Seedance (**keep-and-duck** à 30%) — voir `feedback_seedance-keep-and-duck.md`
