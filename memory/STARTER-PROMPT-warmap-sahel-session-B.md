# Starter — War-Map Sahel AES, Session B (intégration + fixes + render final)

Reprise War-Map Sahel AES — Session B : branchement des 3 SVG validés, fixes techniques, render final unique.

Lis `memory/episodes/warmap-sahel/STATUS.md` en entier depuis la section "✅✅ SESSION A TERMINÉE" en tête
de fichier (puis la section "SESSION B — FIXES TECHNIQUES" juste après) — c'est la source de vérité complète.

Contexte en une phrase : la Session A a produit et fait valider par Aziz 3 inserts SVG narratifs (CFA déjà
branché, Liptako-Gourma et Ressources codés dans `LiptakoRevealSVG.tsx`/`ResourcesRevealSVG.tsx` mais PAS
ENCORE branchés dans le moteur) ; cette session doit les brancher, appliquer 16 fixes techniques précis déjà
diagnostiqués (HUD résiduel, jetons flous P4, caméra CEDEAO, sources mal placées, SFX résiduel CFA, etc.),
reconfirmer le calage de durée des 2 nouveaux SVG avec l'audio réel, puis faire UN SEUL render complet
bout-en-bout (Acte1+P1+P2+P3+P4) vérifié par `check-frame-continuity.py` avant toute présentation à Aziz.

Étape 0 obligatoire : demander à Aziz comment il veut procéder (système agentique ou en direct), ne pas présumer.

Ordre de travail recommandé (à confirmer avec Aziz) :
1. Brancher `LiptakoRevealSVG` dans `Partie3Rupture.tsx` (retirer/commenter l'ancien `WarMapOverlayDynamic`)
   et `ResourcesRevealSVG` dans `Partie4Cout.tsx` (remplacer l'appel à `ResourcesReveal`).
2. Mini-render de chaque zone avec la vraie narration+musique jouée par-dessus, vérifier le calage de durée
   (point d'attention explicite dans STATUS.md — les 2 SVG ont été testés isolément en Session A).
3. Appliquer les 16 fixes techniques listés dans STATUS.md § SESSION B, en commençant par le point 16
   (jetons flous P4, priorité) et le SFX résiduel CFA (point ajouté fin de Session A).
4. Render complet unique, vérifié par `check-frame-continuity.py`, avant présentation à Aziz.
