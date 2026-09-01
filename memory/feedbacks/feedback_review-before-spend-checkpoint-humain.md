---
name: Review-before-spend — checkpoint humain avant appel API
description: L'agent de production prepare tout (storyboard + refs + prompt + gates) et uploade pour review. Claude examine, Aziz valide sur mobile, puis seulement on lance Seedance. Jamais de generation directe.
type: feedback
---

Migré depuis auto-memory 2026-08-31.

Le visual-producer ne lance JAMAIS Seedance directement. Il prepare, uploade, et attend le GO.

**Why:** Session 2026-04-17 — l'agent a genere un storyboard from scratch (sans refs canoniques en input Gemini), Seedance a copie le style du storyboard au lieu des refs canon, le clip avait un style different de la serie. $2.74 perdus. L'agent s'est auto-evalue 9.5/10 alors que le style ne matchait pas.

**How to apply:**
1. L'agent prepare tout (storyboard, refs, prompt, gates PASS)
2. Upload gallery (Artifact/Vercel) (storyboard + refs + prompt)
3. Claude orchestrateur examine visuellement (compare storyboard vs refs canoniques)
4. Aziz recoit le lien et valide sur mobile
5. Seulement apres le GO : lancer Seedance

Regle additionnelle : tout storyboard DOIT etre genere avec les refs canoniques en input Gemini (edition chirurgicale avec image source), JAMAIS from scratch. Si le storyboard est en couleur, re-generer en N&B sketch si le contexte le demande.
