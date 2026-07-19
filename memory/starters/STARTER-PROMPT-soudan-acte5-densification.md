# Starter — Soudan Acte 5 : trier le diagnostic densification, puis coder

Reprise session Soudan Mid-form, Acte 5. État à la fin de la session précédente (2026-07-18, s12) :
script verrouillé, audio généré, timing frame-exact, **code écrit et rendu (v2)**. Le render a été
validé par ma propre review (2 bugs de jonction caméra trouvés et corrigés), PUIS soumis à un double
downstream Gemini+Kimi qui a révélé que la vraie faiblesse n'est pas le cadrage — c'est l'absence
d'acteurs visuels et de conséquence territoriale du mouvement.

**Lire dans cet ordre avant de toucher au code :**
1. `memory/episodes/soudan-midform/STATUS.md` (section en tête) — état exact + pointeurs.
2. `memory/doctrines/WARMAP-DENSIFICATION-CARTE.md` — doctrine condensée du diagnostic (15+ techniques
   classées par couche, règle garder/effacer "verbe→efface, nom→persiste", 5 points d'application
   suggérés pour l'Acte 5 en fin de fichier — PAS à appliquer aveuglément, à trier avec Aziz).
3. `memory/episodes/soudan-midform/da-briefs-acte5/` (4 fichiers bruts, si le condensé ne suffit pas) :
   `01-comparatif-{gemini,kimi}.md` (diagnostic vs référence Sahel P2) + `02-densification-{gemini,kimi}.md`
   (brainstorm source de la doctrine).

**Point d'arbitrage explicite à trancher avec Aziz avant de coder** : Gemini et Kimi convergent sur le
fait que le dézoom caméra vers Abou Dabi (ajouté en session 12) ne fonctionne pas, mais divergent sur
la solution — Gemini propose de le retirer (faire "entrer" une plaque depuis le bord plutôt que
dézoomer dans le vide) ; Kimi propose de le garder en persistance réduite (miniature + trait fantôme
permanent). Poser la question à Aziz en premier, pas trancher seul.

**Code actuel** : `src/projects/warmap/soudan-acte5/SoudanActe5.tsx` (100% carte, 4 sections calées sur
les 4 parties audio). Render v2 : `https://litter.catbox.moe/4ov6bx.mp4` (⚠️ hébergement 72h, probablement
expiré — re-render + re-upload si besoin de revoir l'état actuel avant de coder par-dessus).

**Point technique non-négociable, déjà respecté dans le code actuel, à préserver** : le trait corridor
Kufra→El-Fasher est UNE seule variable de trajectoire continue (Beat3→4 du fichier), jamais deux tracés
indépendants — vérifier que ça reste vrai après toute modification.

**Outils prêts à réutiliser** (créés/fixés session 12, pas besoin de les recréer) :
- `scripts/tools/da-compare.py` / `scripts/tools/kimi-video-compare.py` — le fix IPv6 est maintenant en
  dur (import `force_ipv4` natif), plus besoin de wrapper CLI. `max_tokens` déjà correct.
- `scripts/warmap/templates/warmap-densification-brief.txt` — brief générique réutilisable pour un
  futur acte si le même diagnostic de densité doit être refait ailleurs.

**Ne pas répéter** : ne pas relancer un 3e appel Gemini/Kimi sur le même sujet avant d'avoir lu et trié
les 4 réponses déjà obtenues — la valeur est déjà là, il manque le tri + la décision de code.
