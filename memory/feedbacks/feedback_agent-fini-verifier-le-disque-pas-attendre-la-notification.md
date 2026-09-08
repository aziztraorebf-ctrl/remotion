---
name: feedback_agent-fini-verifier-le-disque-pas-attendre-la-notification
description: Un agent en fond peut avoir fini sans que la notification arrive — verifier le disque au lieu de repondre "il tourne encore"
metadata:
  type: feedback
---

Quand Aziz demande ou en est un agent lance en `run_in_background`, **verifier l'etat REEL
sur le disque** (`ls -la` sur les chemins de sortie attendus, horodatages des fichiers) AVANT
de repondre. Ne jamais repondre "il tourne encore" sur la seule base de l'absence de
notification.

**Why:** vecu 2026-09-05 (demo Upwork Earth to Suzy). Un agent Fable a ecrit la composition
a 22h44 et rendu le MP4 a 22h48 — soit ~4 minutes de travail reel. J'ai continue a repondre
"il tourne encore" pendant ~40 minutes. C'est Aziz qui a du me signaler que le delai etait
anormal ("on a fait beaucoup plus complexe en moins de temps") pour que je pense a regarder.
Le livrable etait sur le disque depuis longtemps. La notification n'est jamais arrivee et
l'agent s'etait deja termine (TaskStop: "No task found").

C'est la regle connue « un agent qui rapporte "termine" n'a pas forcement produit le fichier »
appliquee DANS L'AUTRE SENS : l'absence de rapport ne prouve pas l'absence de livrable.
Les deux directions se verifient de la meme facon — en regardant le disque.

**How to apply:**
1. Des qu'on s'interroge sur l'avancement (ou des qu'Aziz le demande) : `ls -la` sur le
   dossier de sortie + `git status --short`. Comparer les horodatages a l'heure courante.
2. Si les fichiers attendus existent : le travail est fait. Les VERIFIER SOI-MEME (regarder
   les frames, mesurer le mp4) — c'est de toute facon a l'orchestrateur de valider, pas a
   l'agent. Ne pas attendre son rapport pour avancer.
3. Un ecart flagrant entre la duree observee et la duree plausible de la tache est un signal
   a investiguer immediatement, pas a subir. Ici : 2 pictogrammes SVG animes != 40 minutes.
4. Ne jamais lire le transcript JSONL de l'agent pour verifier (saturation de contexte) —
   le disque suffit.

Lie a [[feedback_rapport-vert-ne-prouve-rien-regarder-l-image]].
