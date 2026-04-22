# Brief corrections Soundjata — prochaine session

> Mis a jour 2026-04-17 soir (post-test agent + erreurs identifiees)
> Remplace toute version precedente.

---

## Contexte

Assemblage v1 des 8 Actes fait et visionne. Acte VIII (close split-vertical) valide.
2 tentatives de regeneration Acte II ont echoue :
- v1 ($2.74) : storyboard genere from scratch, style different
- v2 ($2.70) : mauvaise ref age (toddler au lieu de garcon 7-8 ans)
Total gaspille en tests : $5.44

Le systeme de gates (maintenant 13 gates) a ete renforce avec les lecons.

---

## 4 corrections a faire (dans cet ordre)

### 1. Ducking variable par acte ($0, 30 min)
Dans `SoundjataShort.tsx`, parametrer le volume Seedance par acte :
- Acte I : 10-15% (voix griot Soumaoro trop presente)
- Acte IV : 20%
- Acte V : 30% (combat SFX)
- Acte VII : 30% (ambiance feu)

### 2. Transition pre-Kirina ($0-3, 30 min)
Ajouter un beat visuel entre Acte IV et Acte V. Verifier si `KirinaDateCard` existe deja dans le code.

### 3. Acte II regeneration (~$5, 1-2h)
UN SEUL clip Seedance 9s couvrant la scene d'humiliation.

**Erreurs a ne PAS reproduire :**
- NE PAS utiliser `soundjata-baby-ref.png` — Soundjata a 7-8 ans dans cette scene (meme age que Acte III iron-bar)
- Extraire une frame de `acte3-iron-bar-v1.mp4` comme ref enfant (continuite avec Acte III)
- Storyboard DOIT etre genere avec refs canoniques en input Gemini (edition chirurgicale), PAS from scratch
- Sauvegarder un fichier `.refs.txt` a cote du storyboard listant les refs utilisees
- Ajouter dans le prompt : "COMPOSITION GUIDE ONLY. Do NOT interpret, deviate from, or add to the storyboard layout."
- Passer Gate 12 (age continuity) + Gate 13 (style consistency) en plus des gates existants
- REVIEW-BEFORE-SPEND : uploader gallery Vercel AVANT de lancer Seedance

**Refs correctes a utiliser :**
- Soundjata enfant : frame extraite de `acte3-iron-bar-v1.mp4` (garcon ~7-8 ans)
- Matrone : `refs/acte2/start-frame-humiliation.png`
- Sogolon + Matrone : `refs/acte2/end-frame-humiliation.png`
- Village : `refs/acte2/village-daytime-plate.png` (genere cette session, village de jour)
- Storyboard : a regenerer avec refs canoniques en input

### 4. Re-render assemblage + validation ($0, 30 min)
Re-render `SoundjataShort.tsx` avec les corrections 1-3, upload Vercel, validation Aziz.

---

## Etat des assets

| Fichier | Statut |
|---------|--------|
| `clips-validated/acte2-humiliation-v1.mp4` | REJETE (style different, storyboard from scratch) |
| `clips-validated/acte2-humiliation-v2.mp4` | REJETE (mauvais age, toddler au lieu de 7-8 ans) |
| `refs/acte2/storyboard-5panels-humiliation-v4.png` | BON storyboard, mais genere sans refs canoniques en input |
| `refs/acte2/village-daytime-plate.png` | VALIDE (village de jour, bon style) |
| `refs/acte2/prompt-seedance-acte2-v2.txt` | Prompt BON (3350 chars, gates PASS) mais ref age incorrecte |
| `out/soundjata-close-v2.mp4` | VALIDE (Acte VIII, split-vertical video) |
| `out/soundjata-short-v1.mp4` | Assemblage v1 complet (a re-render apres corrections) |

---

## Systeme de gates — 13 gates operationnels

Voir `~/.claude/projects/.../memory/pipeline-gates-system.md` pour la liste complete.
Nouveaux gates ajoutes cette session :
- Gate 12 : character_age_continuity (attrape l'erreur baby ref pour 7-8 ans)
- Gate 13 : style_consistency (verifie qu'un sidecar .refs.txt documente les inputs)
