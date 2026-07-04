# Starter — War-Map Sahel AES, Session C (fix audio "déjà" + render final unique)

Reprise War-Map Sahel AES — Session C : dernier point audio à traiter, PUIS le render complet
bout-en-bout jamais encore fait.

Lis `memory/episodes/warmap-sahel/STATUS.md` en entier depuis la section "✅✅✅ SESSION B — ÉTAT DE
FIN (2026-07-04)" en tête de fichier — c'est la source de vérité complète et à jour de ce qui a été
fait, testé, validé Aziz, et de ce qui reste.

Contexte en une phrase : la Session B a branché les 2 SVG (Liptako-Gourma, Ressources), appliqué les
9 fixes techniques du backlog, ajouté une respiration à la transition P3→P4 — tout validé Aziz en
mini-renders isolés — mais N'A JAMAIS LANCÉ le render complet Acte1+P1+P2+P3+P4, et il reste UN point
audio ouvert (écho/reverb sur le mot "déjà" en P1, f2743) qu'Aziz veut traiter AVANT ce render final.

Étape 0 obligatoire : demander à Aziz comment il veut procéder (système agentique ou en direct), ne pas présumer.

Ordre de travail recommandé (à confirmer avec Aziz) :
1. **Fix audio "déjà"** (STATUS.md § pistes détaillées) : une resynthèse TTS complète a déjà été tentée
   et payée (~443 crédits, backup dans `memory/episodes/warmap-sahel/audio-fixes/deja-resynth-backup-
   2026-07-04.mp3`) mais dure 2.49s de trop pour la fenêtre originale (10.0s) — ne pas l'intégrer telle
   quelle (désynchroniserait tous les triggers F_* du reste de la vidéo). Pistes à essayer dans l'ordre :
   a. Recouper les silences internes de ce backup (ffmpeg silenceremove ciblé sur les pauses, pas la voix)
      pour le faire tenir dans 10.0s, puis re-tenter le splice + mini-render de vérification.
   b. Si (a) échoue : tester un filtre de repair ciblé UNIQUEMENT sur le mot "déjà" isolé (90.94s→91.42s
      dans `narration-v5-expressive.mp3`), pas toute la phrase.
   c. Si rien ne marche rapidement : proposer à Aziz d'accepter l'artefact tel quel (déjà pré-approuvé
      comme option de repli si aucune solution fiable n'émerge vite).
2. **UN SEUL render complet Acte1+P1+P2+P3+P4** (jamais fait — tout le travail Session B n'est vérifié
   qu'en mini-renders isolés). Vérifier `check-frame-continuity.py` avant tout envoi à Aziz.
3. Si le render complet révèle un souci de calage non anticipé sur Liptako/Ressources (contexte
   VRAIMENT bout-en-bout avec musique, différent des mini-renders isolés de Session B) : ajuster les
   constantes de chorégraphie internes (tête de `LiptakoRevealSVG.tsx`/`ResourcesRevealSVG.tsx`),
   ne jamais tronquer le SVG.
4. Une fois le render complet propre et validé Aziz : promouvoir vers `out/PRET-PUBLICATION/`.
