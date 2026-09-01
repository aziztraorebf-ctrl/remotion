---
name: Preview refs + prompt AVANT tout appel API payant
description: Toujours montrer les images de reference et le prompt a Aziz AVANT de lancer une generation payante (fal.ai, Seedance, Kling, etc.)
type: feedback
---

Migré depuis auto-memory 2026-08-31.

Toujours presenter a Aziz les images de reference ET le prompt AVANT de lancer un appel API payant (fal.ai, Seedance, Kling, etc.).

**Why:** Quand Claude envoie directement via API, Aziz ne voit pas ce qui part — contrairement au workflow manuel ou il voyait tout. Les surprises dans le resultat (artefacts, mauvaise ref, prompt mal calibre) coutent des credits et du temps. Aziz veut pouvoir valider ou corriger AVANT que l'argent soit depense.

**How to apply:**
1. Afficher chaque image de reference (Read tool) pour qu'Aziz les voie
2. Afficher le prompt complet en texte
3. Afficher le cout estime
4. Attendre la validation explicite d'Aziz ("ok", "go", "lance")
5. Seulement APRES validation -> lancer l'appel API

Cette regle s'applique a TOUT appel payant : fal.ai, Kling, ElevenLabs, Recraft, etc. Meme pour un "test rapide".
