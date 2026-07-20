---
name: checklist-grok-imagine
description: Checklist vivante pré-production + production Grok Imagine Video 1.5 (API et app). Mise à jour après chaque session.
metadata:
  type: project
---

# Checklist Grok Imagine Video 1.5 — Vivante & Contraignante
> Lire au DEBUT de toute session Grok Imagine. Cocher au fur et a mesure.
> Mis a jour : 2026-07-04 (session R&D pecheur, 4 tests API)
> Refs : `memory/tools/grok-imagine-rules.md`, `memory/tools/grok-imagine-prompts.md`

---

## Etat du projet (2026-07-04)

- **API testee et fonctionnelle** : 4 tests reussis + 2 echecs Extension documentes. Methode reproductible = v3 (voir `grok-imagine-prompts.md`).
- **App NON testee** : Aziz compte prendre l'abonnement SuperGrok standard ($30/mois — PAS Heavy, verifie trop cher a ~$157/mois taxes incluses).
- **Decision en attente** : verifier une fois abonne si le multi-image storyboard (`@image1`/`@image2`) resout le probleme de raccord inter-clips (R7) que l'API n'a pas resolu.

---

## PHASE 0 — Decision Grok Imagine vs Seedance vs autre outil

- [ ] Cas d'usage = personnage figure, action simple, budget serre → Grok Imagine justifie
- [ ] Cas d'usage = sequence longue/multi-shot avec objets manipules → Seedance reste plus fiable (cf tableau comparatif `grok-imagine-rules.md`)
- [ ] Budget estime : $0.14/s en 720p API (~$1.40 pour 10s), vs $0.683/s Seedance i2v (~$6.83 pour 10s)
- [ ] Si sequence > 10-15s planifiee → NE PAS compter sur Video Extension API (cassee sur -1.5, instable sur ancien modele, cf R6)

---

## PHASE 1 — Preparation image de depart (CRITIQUE, cf R1)

- [ ] Lire `memory/tools/grok-imagine-rules.md` en entier AVANT le premier prompt, en particulier R1-R7
- [ ] **Lister explicitement ce qui est visible dans l'image source** (objets, position, ce que le personnage tient) — ne JAMAIS decrire une action sur un objet absent de l'image
- [ ] Si l'action necessite un objet qui n'est pas dans l'image de depart originale → generer une image intermediaire via Gemini i2i AVANT le prompt video (jamais laisser Grok "imaginer" l'apparition)
- [ ] Repartir de l'image source ORIGINALE ou d'une image Gemini fraiche — JAMAIS d'une frame extraite d'un clip Grok deja genere (risque de propager un artefact deja present, cf R5)
- [ ] Clause anti-duplication ajoutee explicitement dans le prompt pour tout objet secondaire (panier, outil, etc.) — cf R2

---

## PHASE 2 — Ecriture du prompt

- [ ] Un seul beat par clip privilegie (cf R3) — sauf si on teste explicitement une sequence complete (v3 a mieux fonctionne qu'attendu, mais reste plus risque)
- [ ] Cue audio ajoute pendant tout moment de rotation/transition pour stabiliser le visage (cf R4)
- [ ] "Camera holds steady... face must not distort" explicitement present si le plan comporte une rotation
- [ ] Anti-parasites generaux en fin de prompt (no text, no extra objects, no dust motes...)
- [ ] Prompt compare contre `grok-imagine-prompts.md` (formats v1/v2/v3 comme reference)

---

## PHASE 3 — Generation (API)

- [ ] Preview cout AVANT tout appel payant ($0.14/s en 720p, $0.08/s en 480p)
- [ ] Validation Aziz AVANT lancement (sauf test technique <$1 deja discute)
- [ ] Modele : `grok-imagine-video-1.5` (PAS l'ancien `grok-imagine-video` sauf test Extension explicite)
- [ ] Script de base : copier `scripts/tools/grok-imagine-pecheur-v3.py`, adapter SOURCE_IMAGE/PROMPT/OUTPUT
- [ ] Si le script Python semble bloque (CPU fige, pas d'erreur) apres 60-90s → basculer sur curl direct en Bash plutot que d'attendre indefiniment (cf R8)
- [ ] Clip recu → extraire plusieurs frames avec ffmpeg → review visuelle AVANT presentation Aziz (verifier duplication objet, morphing visage, coherence style)

---

## PHASE 4 — Si sequence multi-clips necessaire

- [ ] **NE PAS** utiliser `/v1/videos/extensions` sur `grok-imagine-video-1.5` (erreur garantie, cf R6)
- [ ] **NE PAS** compter sur des clips independants juxtaposes sans transition geree (raccord visible confirme, cf R7)
- [ ] Envisager plutot : (a) tester le multi-image storyboard app si abonnement pris (voir Protocole App ci-dessous), (b) masquer le raccord en post-prod (cut + SFX/musique), (c) rester sur Seedance pour ce type de plan

---

## Protocole de test — App SuperGrok (a executer des l'abonnement pris)

**Objectif** : verifier si le multi-image storyboard natif de l'app resout ce que l'API n'a pas resolu (R7 — raccord inter-clips).

1. [ ] Ouvrir grok.com/imagine (web) ou l'app mobile, verifier acces a la generation video 720p/10s
2. [ ] Uploader les 2 images deja generees cette session : `public/assets/pecheur-grok-test/scenes/pecheur-etat-A-filet-plie.png` et `pecheur-etat-B-poisson-en-main.png` (ou catbox : https://files.catbox.moe/l2gz6p.png pour Etat A)
3. [ ] Tester la syntaxe `@image1` / `@image2` dans un seul prompt decrivant la sequence complete (lancer → ramener → poser → regard) en referencant les 2 images comme etats-cles
4. [ ] Comparer le resultat a notre v3 (meilleur resultat API) sur : (a) coherence du panier tout du long, (b) fluidite du geste de depose, (c) absence de raccord visible
5. [ ] Tester "Extend from Frame" natif sur un clip genere dans l'app (pas l'API) — noter si plus fiable que les 2 echecs `internal_error` obtenus via API
6. [ ] Documenter le resultat dans `memory/tools/grok-imagine-rules.md` (deplacer les regles R13/R14 de [RAPPORTE] vers [PROUVE] ou [INFIRME] selon le resultat)
7. [ ] Si l'app resout R7 → mettre a jour le tableau comparatif Grok vs Seedance avec ce nouvel avantage

---

## Etapes les plus souvent oubliees (a surveiller)

1. Verifier ce qui est REELLEMENT visible dans l'image source avant d'ecrire le prompt (R1) — erreur commise sur le v1
2. Ne pas repartir d'une frame de clip deja generee sans verifier qu'elle n'a pas deja l'artefact qu'on corrige (R5) — erreur commise sur le v2
3. Ne pas presumer qu'une clause anti-duplication appliquee a 2 clips separement garantit la coherence entre eux (R7)
4. Confirmer xAI/Grok vs Groq (puces) avant toute recherche ou tout achat d'abonnement — confusion frequente
