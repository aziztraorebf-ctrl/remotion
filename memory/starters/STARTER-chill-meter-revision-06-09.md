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

## ✅ LE POINT BLOQUANT EST TRANCHE — L'OCCLUSION EST IMPOSSIBLE (06/09)

⛔⛔ **NE PLUS TENTER D'OCCLUSION. NE PLUS RETOUCHER LE POLYGONE.** Les 4 essais rates
n'etaient pas des erreurs de dosage : **la surface de premier plan n'existe pas**.

Mesure a 0,4 px pres (agent dedie : segmentation couleur + RANSAC, 3 methodes, 5 seuils) :
- Le panneau du piano couvre **x=109..356** seulement — c'est le coin en POINTE du panneau
  avant, pas une surface traversante. Il s'arrete NET a x=356.
- Le meter va de **x=188 a x=716**. Les **2/3 droits n'ont AUCUN element de premier plan**
  devant eux ; le banc, lui, est en ARRIERE-plan (son bord superieur MONTE vers la droite).
- Couverture maximale possible : **5,7 % de l'objet**, sur son seul tiers gauche.

Donc toute occlusion fidele au decor est NECESSAIREMENT asymetrique — et une asymetrie sur
un objet symetrique se lit comme une AMPUTATION. La simulation avec la geometrie exacte
**reproduit precisement l'echec des 4 tentatives**. Cause geometrique, pas algorithmique.

⛔ **La note « le rebord descend vers la gauche » etait FAUSSE** (elle a guide 2 essais) :
l'arete est **PLATE** (+1,2 px sur 130 px, soit 0,54°). Ce qu'on prenait pour une diagonale
etait le FLANC ombre du meuble — un autre objet. Donnees : `POLYLIGNE.json` dans le
scratchpad de l'agent.

**Ce qu'on a fait a la place** (commit `456747ee`) : le jury demandait « ne pas flotter » ;
l'occlusion n'etait que son MOYEN. Ancrage par les 2 indices disponibles partout :
1. **Ombre de contact a 2 composantes** — noyau serre et dense + etalement ambiant. Une
   ombre unique et floue se lit comme « vol stationnaire ».
2. **Reflet** du meter borne a x=188..356 (seule surface claire devant le plan du meter).

⛔ Defaut trouve au passage : les 2 ombres etaient centrees sur la ligne de sol alors que le
chassis est opaque JUSQU'A cette ligne — leur moitie haute etait **cachee derriere l'objet**.
Presentes dans l'alpha, invisibles a l'ecran. Repositionnees sous la base.
Mesure : assombrissement -75 a y=1036 (visible), tail -45 jusqu'a y=1056.

⛔⛔ **LA LECON LA PLUS CHERE** (conservee) : j'ai valide le 4e essai sur une vue plein cadre
reduite + des chiffres dans la fourchette. **Aziz a vu le defaut sur son telephone**, sur une
image plus petite, parce qu'il a **compare les deux cotes**.
→ Sur un objet symetrique : TOUJOURS comparer gauche/droite au meme zoom.
Lecon generalisee : `memory/feedbacks/feedback_occlusion-impossible-mesurer-le-decor-avant-de-doser.md`

## ⚠️ LA QUESTION DE FOND, POSEE PAR AZIZ (06/09) — non tranchee avec la cliente

Le meter est pose dans la bande SOUS sa fenetre video, par-dessus le clavier du piano. Il est
trop grand pour reposer dessus et il chevauche le cadre video. **Il se lit comme un overlay
d'interface — parce que c'en est un.** Aucune ombre ne le fera passer pour un objet physique.

Elle demande donc en partie l'impossible : ancrer un objet a un endroit ou il n'y a rien pour
l'ancrer. **Meme schema que le centrage** : elle avait « l'impression » que ce n'etait pas
centre, on a mesure (66,7 % vs 67,0 %), elle l'a reconnu. Une cliente au feeling decrit
fiablement le SYMPTOME, pas la CAUSE — a nous de traduire.
⭐ Argument disponible : son enseigne neon « AbiGirl Reacts » est deja un element graphique
qui vit SUR la vitre. Le precedent est dans son propre decor.

## ⏭️ PAR OÙ REPRENDRE — dans cet ordre

1. ✅ **FAIT — les 4 demandes simples** (commit `77f23964`) : icônes bleues dès l'idle ·
   « MAX CHILL DETECTION » (déjà couvert par le clip TITRE, vérifié au rendu) · au 75 %
   seuls le texte et les symboles s'illuminent (plancher du filtre ramené à ~0, le métal
   sombre ne reçoit plus de bleu) · taille inchangée (aucune réduction n'avait été appliquée).
2. ✅ **FAIT — l'ancrage** (commit `456747ee`), voir ci-dessus. **Reste à faire juger par
   Aziz sur son téléphone** : mon jugement « flotte / flotte pas » vaut sur des rendus fixes.
3. ⏭️ **Décider quoi écrire à la cliente** sur l'occlusion impossible (cf. section ci-dessus).
4. Le détail des 4 demandes, pour mémoire :
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

- 📱 **Page de suivi (artifact, à enrichir toute la session)** :
  https://claude.ai/code/artifact/5850aa17-cd86-4f75-9d8b-e0be02de5592
  (comparatif avant/après de l'ancrage + la démonstration que l'occlusion est impossible)

- Code : `src/projects/_rnd/chill-meter/ChillMeterRustic.tsx` + `ChillMeterOverlay.tsx`
- Branche : `fix/chill-meter-ancrage-sol` (repo principal) = `rnd/chill-meter-3d` (worktree `wt-chill`)
- Décor de travail : `/tmp/vraie-capture-1920x1080.png` (sa capture recadrée 16:9)
- Prototypes d'occlusion : `/private/tmp/.../scratchpad/agent-occlusion/`

## ✅ 2e MESSAGE DU 06/09 (le même jour) — reçu APRÈS la 1ère passe de code

⛔ **Correction importante** : sa "vraie capture" jointe à ce 2e message est **le fichier
identique, checksum MD5 confirmé**, à `vraie-capture-06-09.png` déjà mesuré. Pas de nouveau
plateau à intégrer — toute la géométrie mesurée (panneau x=109..356, etc.) reste valide.

Son message complet confirme le centrage (elle l'a vu dans notre image) et ajoute :
- **« Give it a stronger shadow/contact shadow underneath »** — elle tranche EXPLICITEMENT
  contre le jury externe (qui rejetait « une ombre plus grasse »). C'est sa lecture qui
  prime. ⛔ Ce point manquait de mon 1er résumé — vrai trou de suivi, pas une question
  d'interprétation.
- **« Move the meter slightly lower vertically »** — idem, absent du 1er résumé.
- Les 4 autres demandes (taille, icônes bleues idle, MAX CHILL bleu, 75% isolé au texte)
  confirmées mot pour mot, rien de nouveau dessus.

### Corrections codées suite à ce 2e message (même session)
- `POS_Y` / `RUSTIC_POS_Y` : `706` → `706 + 18` (descente mesurée, marge dispo 49 px avant
  que la ligne de sol touche le bas du cadre 1080).
- Ombre de contact **renforcée** (pas juste repositionnée) : noyau 0.38→0.52 de hauteur,
  alpha 0.86→0.94 ; étalement 1.5→2.1 de hauteur, largeur ×1.06→×1.14, alpha 0.70→0.80.
  Mesure : assombrissement passe de -75 (pic) à **-123 (pic), plateau -60/-85** sur une
  bande bien plus large.
- **Glaçons masqués au sol** (défaut du jury jamais traité avant ce tour) : `mask_givreFade`
  dans `ChillMeterRustic.tsx`, dégradé qui efface le calque de givre 55 px avant
  `RUSTIC_SOL_Y` — sans régénération d'image, le givre est un calque procédural par-dessus.

⏭️ Rendu vidéo demandé par Aziz en cours : `ChillMeter-Fill75` (75% isolé) + composite sur
sa vraie capture, format webm alpha pour préserver la transparence lors du composite.
