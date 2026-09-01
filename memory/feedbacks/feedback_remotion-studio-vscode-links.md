# Liens Remotion Studio en local (pas Vercel) — pour itérations en cours

Pour partager un render ou une composition Remotion à Aziz, donner par défaut le **lien local du Studio** (ex: `http://localhost:3000/OrAfricainBeat1`) plutôt que d'uploader sur Vercel Blob.

**Why:** VS Code ouvre les liens localhost directement comme un navigateur intégré. Aziz peut visionner les compositions/MP4 sans avoir à passer par le web. C'est plus rapide et zéro coût Vercel pour les itérations de production.

**How to apply:**
- Itérations en cours, validations visuelles, previews → lien `http://localhost:PORT/<CompositionId>` (Remotion Studio) ou chemin de fichier local cliquable
- Render MP4 produit localement → donner le chemin `out/...mp4` ou ouvrir avec `open <path>`
- **Exception** : si Aziz dit explicitement qu'il est sur mobile, ou demande "publication" / "Postiz" / "à montrer à quelqu'un d'externe" → là on upload sur Vercel Blob
- S'applique à tout projet Remotion (Atlas, Souverain, Shorts, etc.)

Validé 2026-05-07 sur Or Africain Beat 1.

**⚠️ Contexte à vérifier (2026-08-31)** : depuis, Aziz est passé majoritairement sur mobile (cf CLAUDE.md
§ Communication mobile — Artifact Claude est désormais le défaut de présentation). La distinction
"itération locale = localhost, publication = upload" tenait quand Aziz travaillait depuis un poste avec
VS Code ouvert ; sur mobile pur, le lien localhost n'est plus consultable. Vérifier le contexte de
travail courant d'Aziz avant d'appliquer cette règle par défaut.

---
Migré depuis auto-memory (`feedback_remotion-studio-vscode-links.md`) le 2026-08-31, contenu original
inchangé (note de contexte ajoutée).
