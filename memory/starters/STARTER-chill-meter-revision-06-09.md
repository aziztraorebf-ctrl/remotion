# STARTER — Chill Meter : la révision du 06/09 (reprise à froid)

> ⛔ **CONTRAT CLIENT ACTIF** — Abigail / AbiGirl Reacts, Upwork. Jalon 1 = 105 $, soumis
> le 02/09, **toujours non payé**. Jalons 2 (140 $) et 3 (105 $) non financés.
> État complet : `memory/client-sim-tests/upwork-chill-meter/STATUS.md` (lire le bandeau de tête).
> ⏱️ **Délai annoncé à la cliente le 06/09 : 24 à 48 h.**

## 📍 OÙ ON EN EST EXACTEMENT

Sa réponse du 06/09 est arrivée avec **5 demandes** + une reconnaissance explicite qu'on avait
raison sur le centrage et que sa référence IA était décalée. Message de confirmation envoyé
(24-48 h).

⛔ **MIS À JOUR LE 07/09 — les 5 demandes sont CODÉES, MESURÉES et COMMITÉES.**
(Cette ligne disait « aucune n'est encore codée » : vrai le 06/09, faux depuis.)
→ État réel et ce qui reste à livrer : `memory/client-sim-tests/upwork-chill-meter/LIVRAISON-ETAT-07-09.md`

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

## ⛔ AVANT TOUT ENVOI — lire la fiche de livraison

`memory/client-sim-tests/upwork-chill-meter/LIVRAISON-ETAT-07-09.md`
Elle dit ce qui est fait (les 5 demandes + leurs commits), ce qui MANQUE pour envoyer
(les 6 MOV alpha datent du 23/08, donc PERIMES — a regenerer), la question de perimetre
non tranchee, et ou est le brouillon de message.

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

## ✅ Export ALPHA fonctionnel — verifie le 07/09

Le bug d'export video transparent (webm/prores perdaient l'alpha) etait une DOUBLE erreur
de verification de ma part, aucun bug Remotion. Detail + commande : `memory/tools/remotion.md`
§ Export video avec ALPHA. Commande retenue pour la livraison (ProRes 4444, CapCut) :
```
npx remotion render src/index.ts <composition-id> out.mov \
  --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --scale=1
```
1er export reel (ChillMeter-Fill75, avec le fix bandeau + ombre renforcee + glacons masques)
verifie objectivement (alpha 0-255, 255 valeurs, ~93% transparent) et visuellement (fond gris
neutre, aucun defaut) : `out/_r-and-d/chill-meter-3d/verif-alpha-06-09/ChillMeter-Fill75-alpha-VERIF.mov`
(43 Mo — fichier de VERIFICATION, pas encore le paquet de livraison officiel du jalon 3, le
jalon 1 est toujours impaye).

---

## 📦 ÉTAT AU 08/09 — les 6 MOV sont FAITS, il reste le message

### Où sont les livrables

| Quoi | Où | Vérifié |
|---|---|---|
| ⭐ **Les 6 MOV alpha à envoyer** | `out/_r-and-d/chill-meter-upwork/v2-07-09/` (208 Mo) | Alpha **décodé**, pas juste déclaré : 93 % du cadre transparent sur les 6. Corrections présentes (objet x 189..715, descendu de 85 px vs les périmés). |
| Récap client (26 s) | `out/_r-and-d/chill-meter-3d/recap-v2/RECAP-client-v5.mp4` · [Blob](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/RECAP-client-v5-hklzVBMz9Bjw56k85W9Anl9lcTTT6I.mp4) | 785 frames, tous segments animés |
| Page de suivi (visuels) | https://claude.ai/code/artifact/5850aa17-cd86-4f75-9d8b-e0be02de5592 | à jour |

⛔ **Les 6 MOV du 23/08 ont été SUPPRIMÉS** (0,54 Go, périmés et jamais envoyés). `out/` est
gitignore : ils ne sont pas récupérables — mais ils se regénèrent en 6 rendus depuis les
compositions `ChillMeter-{Entrance,Idle,Fill25,Fill50,Fill75,Fill100}`.

### La forme du récap — ce qui a été rejeté, et pourquoi

Deux versions rejetées avant la bonne, même cause à chaque fois : **montrer un ÉTAT au lieu
d'un CHANGEMENT**.
1. v1 (zooms recadrés + splits avant/après) → « du statique, différents écrans qui défilent ».
2. v3 (cadre plein, mais objet en `state="idle"`) → mesuré : **0,10 %** de pixels changeant
   sur la zone de l'objet. Sa vidéo bougeait derrière, ce qui masquait l'objet inerte.
   ⭐ Ses 4 demandes ne sont pas des états mais des **changements** (une ombre qui se forme,
   un objet qui se pose) : ça se montre en train de se produire.
3. v5 retenue : entrée + atterrissage + montée à 50 % | carton | power-on | 75 %.

⭐⭐ **Le découpage des chapitres est IMPOSÉ par le code, pas choisi** :
`ChillMeterRustic.tsx:190` → `bandeauOn = powerOn * clamp((chill - 55) / 20)`. L'allumage de
la plaque est piloté par le NIVEAU — rien jusqu'à 55, plein à 75. Le montrer **oblige** à
monter au 75 %. Donc le chapitre 1 s'arrête à 50 % (`fill50` va de 25 à 50) et la plaque y
reste métal : rien du jalon 3 ne fuite dans la partie à valider.

⛔ **Pas de 100 % dans le récap** (décision Aziz 08/09, vérifiée contre la source) : il n'est
dans aucune de ses 5 demandes, il vient du contrat (jalon 3, le moins financé) et surtout il
n'a **aucune cible visuelle validée** — sa référence ne montre jamais cet état.

### ⏭️ CE QUI RESTE

1. ✅ **Le message est VALIDÉ par Aziz (08/09)** : `messages/MESSAGE-VALIDE-08-09.txt`.
   Contrôle des 8 points de `feedback_message-client-ne-pas-sonner-genere` passé (0 tiret
   cadratin, 0 « we/our », 0 jargon interne, 304 mots).
   ⛔ L'ancien brouillon est marqué `.PERIME.txt` — ne pas le reprendre.

   ⭐⭐⭐ **3 coupes d'Aziz sur ma version, à retenir** :
   - ⛔⛔ **J'avais écrit « The six overlay files are ready to send once you've had a look. »
     Retiré.** Ces fichiers SONT le jalon 3 (« final exports + source folder ») : les proposer
     alors que le jalon 1 n'est pas payé, c'est livrer le dernier jalon avant d'avoir fermé le
     premier, et créer une obligation qu'elle n'avait pas demandée. Si elle dit oui, il ne
     reste plus rien à échanger. **Un réflexe de serviabilité qui détruit la position de
     négociation.** On envoie les exports quand TOUT est fini, jamais en cours de révision.
   - **La justification de l'aperçu retirée** (« you wanted to be sure the look was right ») :
     elle l'a déjà expliqué elle-même, le redire = règle 3bis (ne pas re-dérouler un point
     acquis) et ça sonne comme une demande de permission pour du travail déjà fait.
   - **« What I'd like to close now is the four items above » retiré** : redondant avec la
     phrase sur milestone 2 ou 3, qui pose la frontière toute seule.

2. **L'envoi** — le message + le récap vidéo. ⛔ **PAS les 6 MOV** (voir ci-dessus).


---

## 💰 CORRECTIF FINANCIER (08/09, verifie via API Upwork, pas suppose)

⛔ Une affirmation anterieure de ce dossier disait « l'argent n'est meme pas depose » pour
les jalons 2/3. **C'ETAIT FAUX** — verifie via `mcp__upwork__upwork__list_milestones` sur le
contrat `44402562` : les 350 $ des 3 jalons ont un `fundedAmount` deja rempli (105/140/105 $),
vraisemblablement deposes en bloc a l'ouverture (30/08). Jalon 1 = `Submitted` (soumis 05/09,
en attente de SA revue). Jalons 2/3 = `state: NotFunded` mais fonds presents ; la description
du jalon 2 dit « Due after Milestone 1 approval » — ce qui bloque le jalon 2 est vraisemblablement
son APPROBATION du jalon 1, pas un depot d'argent de sa part.

⭐ Detail complet + nuance non tranchee : `STATUS.md` § Etat financier reel (corrige 08/09).

**Decision Aziz (08/09)** : ne PAS envoyer de 2e message pour demander le financement du
jalon 2. Le message deja envoye est clair, le travail montre deja l'avance sur le jalon 2
(power-on, montee a 50%) et une partie du jalon 3 (75%). On attend sa reponse.