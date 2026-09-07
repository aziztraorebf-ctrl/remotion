# STARTER — Chill Meter : la révision du 06/09 (reprise à froid)

> ⛔ **CONTRAT CLIENT ACTIF** — Abigail / AbiGirl Reacts, Upwork. Jalon 1 = 105 $, soumis
> le 02/09, **toujours non payé**. Jalons 2 (140 $) et 3 (105 $) non financés.
> État complet : `memory/client-sim-tests/upwork-chill-meter/STATUS.md` (lire le bandeau de tête).
> ⏱️ **Délai annoncé à la cliente le 06/09 : 24 à 48 h.**

## 📍 OÙ ON EN EST EXACTEMENT

Sa réponse du 06/09 est arrivée avec **5 demandes** + une reconnaissance explicite qu'on avait
raison sur le centrage et que sa référence IA était décalée. Message de confirmation envoyé
(24-48 h). **Aucune des 5 demandes n'est encore codée.**

## ✅ CE QUI EST ACQUIS (ne pas refaire)

1. **Sa VRAIE capture de plateau** : `out/_r-and-d/chill-meter-3d/REFERENCE-CLIENTE/vraie-capture-06-09.png`
   (2880×1608). Mesurée : sa fenêtre vidéo finit à 66,7 % de hauteur contre 67,0 % sur notre
   plateau yt-dlp → **notre cadrage était déjà bon**. La vraie différence est un PREMIER PLAN
   (piano blanc + peluche) que notre décor n'a pas.
2. **Jury externe 4 voix** (GPT-6 Astra, Grok, Gemini 3.1 Pro, Kimi K3), consultés sans le
   contexte du repo, verdict UNANIME : l'ombre plus prononcée est insuffisante par construction ;
   la solution est **l'OCCLUSION PARTIELLE** (faire passer un bout du décor DEVANT le bas du
   meter). Script : `scripts/tools/jury-chill-meter-flottement.py` · sorties : `/tmp/da-refs/`.
3. **Le nom de la chaîne qui s'allume au 75 %** — codé et commité (`ef92f017`).

## ⛔ LE POINT BLOQUANT — 4 ESSAIS RATÉS SUR L'OCCLUSION

| Essai | Qui | Erreur |
|---|---|---|
| 1 et 2 | Claude | Un `<rect>` horizontal là où l'arête est une diagonale → 50 px de châssis avalés, boutons masqués |
| 3 | Agent délégué | Bon contour, bonne méthode, mais arête trop basse (y≈1012) → 3,7 % occlus, **mesurable mais invisible à l'œil** |
| 4 | Claude | Arête remontée → chiffres corrects (6,9 %, 100 % des stalactites) mais **AMPUTATION ASYMÉTRIQUE** : coin bas-gauche tranché, boutons STATUS/DATA coupés, alors que le côté droit est intact |

⭐⭐⭐ **CAUSE DU 4e : LA PENTE EST INVERSÉE.** Sur la photo, le rebord du couvercle descend
**vers la gauche**. Mon polygone le fait remonter à gauche (y≈1005 alors que le châssis y
descend à 1049 → 44 px mangés), et à droite il passe sous l'objet sans rien toucher.

⛔⛔ **LA LEÇON LA PLUS CHÈRE** : j'ai validé sur une vue plein cadre réduite + des chiffres
qui tombaient dans la fourchette. **Aziz a vu le défaut sur son téléphone**, sur une image plus
petite, parce qu'il a **comparé les deux côtés** au lieu de regarder l'ensemble.
→ Sur un objet symétrique : TOUJOURS comparer gauche/droite au même zoom. Une mesure globale
ne dit rien sur la répartition.
Preuves : `DEFAUT-OCCLUSION-ASYMETRIE.png` (les 2 coins côte à côte) · `PROTO4-OCCLUSION-RATEE.png`.

## ⏭️ PAR OÙ REPRENDRE — dans cet ordre

1. **L'occlusion** (le point dur) : relire l'arête réelle du couvercle sur grille en vérifiant
   **le sens de la pente**, re-tester, et comparer les 2 coins bas au même zoom AVANT de conclure.
   Paramètres du 4e essai (ombre, ordre de rendu, feather) dans le STATUS — seul le polygone
   est à refaire.
2. **Les 4 autres demandes d'Abigail**, toutes simples à côté :
   - icônes des boutons bleues **dès l'idle / 0 %** (actuellement elles s'allument avec `powerOn`)
   - « MAX CHILL DETECTION » + ses symboles en bleu à l'allumage
   - au 75 % : **seuls le texte et les symboles** s'illuminent, PAS la plaque ni le métal derrière
     (aujourd'hui c'est la plaque entière qui bleuit) — et garder le texte NET, pas flou
   - taille inchangée (elle a tranché : pas de réduction de 12 %)
3. **Tester sur extrait vidéo réel** — ⚠️ le téléchargement yt-dlp a ÉCHOUÉ 2× (403 Forbidden
   sur le client `android_vr`, y compris sans découpage `--download-sections`). yt-dlp installé
   = 2026.03.17 alors que pip a 2026.8.19 → **tenter d'abord la mise à jour** avant de rechercher
   une autre cause. Chaîne : `https://youtube.com/@abigirl_reacts`.

## 🔗 Fichiers clés

- Code : `src/projects/_rnd/chill-meter/ChillMeterRustic.tsx` + `ChillMeterOverlay.tsx`
- Branche : `fix/chill-meter-ancrage-sol` (repo principal) = `rnd/chill-meter-3d` (worktree `wt-chill`)
- Décor de travail : `/tmp/vraie-capture-1920x1080.png` (sa capture recadrée 16:9)
- Prototypes d'occlusion : `/private/tmp/.../scratchpad/agent-occlusion/`
