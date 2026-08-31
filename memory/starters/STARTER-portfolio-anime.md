# STARTER — PORTFOLIO ANIMÉ : du marché réel à nos propres pièces

> Mis à jour le **2026-08-31** en clôture de la session « Onboarding Flow ».
> Session précédente (30/08) créée par Aziz. Plan de cette session-là **EXÉCUTÉ**.
> ⭐ **Prochaine étape définie par Aziz.** Copier-coller le bloc PROMPT en début de session.

---

## ⭐⭐ LE DOSSIER PORTFOLIO — `out/PORTFOLIO/` — 2 PIÈCES

**Décision d'Aziz** : les pièces prêtes à envoyer vivent là, **un sous-dossier par pièce**.

| pièce | format | poids | statut |
|---|---|---|---|
| `carte-etat-major/` | 1024 carré, 4,7 s | **7,7 Ko** | ✅ générique (alpha/bravo/charlie) |
| `onboarding-flow/` | 500×1080, 4,58 s, 60 fps | **116 Ko** ⚠️ | ✅ **ACCEPTÉ** — fidélité 0,30 %, 13 groupes anglais |

⭐ **La structure en sous-dossiers permet à plusieurs sessions de travailler en parallèle** :
chacune ajoute le sien, personne ne touche à ceux des autres. Vécu le 30/08 : une session
chill-meter travaillait en parallèle sur la même branche `master` — aucun conflit, mais
**`/wrap` complet skippé par prudence** (agent CLEANUP aurait pu toucher ses fichiers non
commités). À relancer en session solo.

⛔ **La barrière d'entrée est dans `out/PORTFOLIO/README.md`** — 4 conditions : rendu fidèle
mesuré · calques **lisibles par un client** · format qui s'achète · **réutilisable**.

⚠️ **`onboarding-flow` dépasse le repère marché** (116 Ko vs < 50 Ko pour les pièces qui se
vendent). Cause identifiée : ~40 textes en glyphes vectoriels + 6 lignes de membres. Une
variante allégée (moins de membres, moins de texte) descendrait nettement — **à faire avant
toute publication ou vente**.

---

## ⭐⭐⭐ CE QUI EST ACQUIS (ne pas refaire)

**Le corpus de repro est ÉPUISÉ** (4/4 pièces d'interface traitées, verdict confirmé). On ne
reproduit plus : on **crée**, sur ce que le marché valide.

**Chaîne complète SVG → Lottie livrable, prouvée de bout en bout** (session du 30/08) :
```
gen-planche.py (dessin, source de vérité, PARAMÉTRABLE : ICONES, OPTION_ACTIVE, THEME, EMPILE)
  -> svg2lottie_scene.py   conversion + rapport ce qui passe/casse
  -> animate_scene.py      partition -> animation (primitives : glisse, parait_disparait, pop, fondu...)
  -> group_layers.py       177 calques -> 13 groupes lisibles PAR INTENTION
  -> livrer_piece.py       nom de la pièce, respecte les noms déjà propres
  -> verifier_fidelite.py  la preuve, contre la composition Remotion — ⛔ TOUJOURS avec
                           `--sans-alignement` (voir règle n°1 ci-dessous)
```
Outils : `src/projects/_client-sim/lottie-ui/tools/`. Pièce de référence :
`src/projects/_client-sim/onboarding-generique/`.

**2 primitives ajoutées à `animate_scene.py`** (le format savait faire, l'outil n'émettait rien
— 4e occurrence de cette leçon, cf. `CE-QUI-PASSE-EN-LOTTIE.md`) :
- `parait_disparait` — un élément apparaît PUIS s'efface (aucune primitive ne savait disparaître)
- `glisse` — glissement AMORTI qui se termine (≠ `monte`, qui oscille en boucle)

---

## ▶️ CE QUI RESTE OUVERT (prochaine session)

### 1. Alléger `onboarding-flow` sous 50 Ko
Moins de membres dans la liste, ou texte moins dense. Mesurer avant/après.

### 2. Générer les variantes déclinées
Le générateur les permet déjà (`ICONES=2|3|4`, `OPTION_ACTIVE=1..4`, `THEME=clair|sombre`) —
il reste à les produire, les mesurer, et les déposer.

### 3. Décider les 3-4 prochaines pièces
Piste posée mais **NON validée par mesure directe** — voir réserve ⛔ ci-dessous : « New Feature
Announcement », « Integration Connected », « Dashboard qui se remplit ». Croiser avec le verdict
Dribbble (nommer par EMPLACEMENT PRODUIT, jamais par technique) avant de trancher.

### 4. Publication (LottieFiles / IconScout) — feu vert juridique, décision de calendrier ouverte
Vérifié le 30/08 : publier en gratuit **ne cède PAS l'exclusivité** (LottieFiles = licence
*non-exclusive* ; IconScout = *"you hold the ownership"*). Le risque n'est pas juridique mais
commercial (perte d'exclusivité commerciale sur une pièce publiée). Objectif d'Aziz : **gratuit
d'abord, crédibilité/trafic — pas revenu**. Le premium n'est envisagé QUE si le gratuit valide,
et ⛔ vérifier l'exclusivité côté premium LottieFiles avant d'y songer (pas côté gratuit).

### 5. Navigation authentifiée — reportée, PAS résolue
Aziz a un compte Fiverr connecté (mobile ce jour-là, pas d'écran dispo). Aucun outil actuel
(agents Playwright anonymes, superpowers-chrome profil isolé) n'hérite de sa session. Piste
retenue pour la prochaine fois : **Browser MCP** (piloté par le navigateur d'Aziz, sa session) —
ou `superpowers-chrome show_browser` + connexion manuelle une fois (le profil persiste ensuite).
⛔ Ne PAS relancer d'agents anonymes sur Fiverr : mur PerimeterX systématique, mesuré 2x.

---

## ⛔⛔ RÈGLES PAYÉES CETTE SESSION (30/08 → 31/08, non négociables)

1. ⭐⭐⭐ **UN RAPPORT ROUGE NE PROUVE RIEN NON PLUS.** `verifier_fidelite.py` REFUSAIT une
   pièce à 12,81 % d'écart. Cause : son `aligner_cadrage()` déduit le fond de
   `getpixel((0,0))` — un calque qui glisse laisse une bande transparente rendue BLANCHE,
   qui empoisonne la bbox et RESCALE toutes les frames de référence. Même fichier, même
   commande, `--sans-alignement` seul : 12,91 % → 4,36 %, puis pièce corrigée → **0,30 %,
   ACCEPTÉ**. Le pendant exact de « un rapport vert ne prouve rien » — côté rouge cette fois.
   ⛔ Sur toute pièce dont un calque glisse : mesurer AVEC ET SANS alignement avant de
   conclure au défaut.
2. ⭐⭐⭐ **LE NOM DE LA PIÈCE VAUT 5-10× LA TECHNIQUE.** Mesuré sur Dribbble Services (ouvert,
   contrairement à Fiverr/LottieFiles/Upwork, tous en 403 ce jour-là) : « lottie animation »
   = 10 $, « SaaS Hero Animation | Lottie » = 350 $, « Product Motion Pack » = 1150 $. Titrer
   par l'EMPLACEMENT PRODUIT (hero, onboarding, dashboard), jamais par la technique.
   → verdict n°10, `memory/projects/RECHERCHE-MARCHE-INDEX.md` § DRIBBBLE.
3. ⭐⭐ **« QUI LIT ? » EST LE CRITÈRE DE LANGUE, PAS « QUEL PROJET ».** Calques Lottie et guide
   d'édition → anglais (l'acheteur les lit), SANS accents (risque d'encodage chez un lecteur
   tiers pour zéro bénéfice). Code et commentaires → français (nous seuls les lisons). Un nom
   de calque n'est pas du texte affiché.
4. ⭐⭐ **UN CHIFFRE LU DANS UN EXTRAIT INDEXÉ N'EST PAS UNE MESURE.** Un agent a rapporté des
   comptages IconScout par catégorie (« new-feature = 9 pièces ») tirés de titres de pages
   indexées, les pages elles-mêmes étant en 403. Aziz est allé vérifier directement : chiffres
   FAUX, aucune catégorie n'était quasi vide. Quand la page est inaccessible, le mot juste est
   NON MESURÉ — jamais « mesuré indirectement ». → `DEMANDE-REELLE-LOTTIE-2026-08-30.md`
   (corrigé en tête de fichier).
5. ⭐ **UN Lottie N'A PAS DE MOTEUR DE MISE EN PAGE.** Rien ne se recentre chez le client. Pour
   « le client peut supprimer une icône » : livrer des VARIANTES PRÉGÉNÉRÉES (nous calculons
   la mise en page à la génération), pas un vrai responsive — qui n'existe pas dans ce format.
6. ⭐ **UN CADRE QUI DÉSIGNE VAUT MIEUX QU'UNE ACTION ARBITRAIRE.** Idée d'Aziz : avant qu'un
   interrupteur bascule, un contour lumineux doit désigner LA ligne concernée. Sans lui,
   l'action se lit comme arbitraire. A aussi révélé un bug caché (interrupteur câblé en dur
   sur une autre rangée que celle désignée par le cadre) — invisible tant que rien ne les
   comparait visuellement.
7. ⛔ **CAPTCHA = ARRÊT NET, PAS UN OBSTACLE À CONTOURNER.** La ligne n'est pas « pas
   d'automatisation » (Playwright/navigateurs pilotés = légitimes, utilisés sans réserve cette
   session) — c'est spécifiquement : ne jamais résoudre soi-même une épreuve qui demande de
   prouver qu'on est humain. Devant un CAPTCHA : constater, arrêter, remettre à un humain (ici,
   Aziz). Ne pas généraliser cette règle en « site fermé » dans une note — c'est un fait sur
   l'outil du moment, pas sur le monde (Aziz passe sans difficulté depuis son navigateur).
8. ⛔ **UN CHEMIN DE SORTIE EN DUR DANS UN GÉNÉRATEUR PARTAGÉ = RISQUE D'ÉCRASEMENT SILENCIEUX.**
   `gen-planche.py` avait `SORTIE = pathlib.Path("/chemin/absolu/vers/repro-onboarding/...")`
   — en le lançant depuis une pièce voisine, il a écrasé la planche de l'autre (restaurée par
   git, elle était commitée). Toujours un chemin relatif au script (`Path(__file__).parent`).
9. ⛔ **2 ÉCHECS IDENTIQUES SUR LE MÊME OUTIL → DÉLÉGUER, PAS RE-TENTER.** Appliqué 2x cette
   session (cache de bundle Remotion périmé, puis écart de fidélité) — les deux fois un agent
   dédié a trouvé la cause structurelle en une passe là où re-tenter n'aurait fait que répéter
   le symptôme.

---

## ▶️ PROMPT DE DÉMARRAGE (copier tel quel)

```
Session : PORTFOLIO ANIMÉ — suite.

Lire d'abord :
  memory/starters/STARTER-portfolio-anime.md        (ce fichier : acquis + plan)
  memory/projects/RECHERCHE-MARCHE-INDEX.md          (verdicts marché, dont § DRIBBBLE n°10)
  out/PORTFOLIO/onboarding-flow/FICHE.md             (la pièce de référence, mesures)

2 pièces au portfolio : carte-etat-major (7,7 Ko) et onboarding-flow (116 Ko, ACCEPTÉ mais
trop lourd). La chaîne SVG->Lottie livrable est prouvée de bout en bout.

Prochaine étape à choisir avec Aziz : (1) alléger onboarding-flow sous 50 Ko, (2) générer les
variantes déclinées, (3) décider les 3-4 prochaines pièces à produire, (4) navigation
authentifiée (Browser MCP ou connexion manuelle superpowers-chrome) pour enfin lire les avis
Fiverr et les compteurs LottieFiles/IconScout réels.

⛔ RAPPELS NON NÉGOCIABLES :
 - Sur toute pièce dont un calque glisse : mesurer verifier_fidelite.py AVEC ET SANS
   --sans-alignement avant de conclure à un défaut (règle n°1).
 - Titrer une pièce par son EMPLACEMENT PRODUIT, jamais par sa technique (règle n°2).
 - Calques Lottie + guide client en anglais sans accents ; code + commentaires en français
   (règle n°3, critère = qui lit).
 - Un chiffre venant d'une page inaccessible (403) est NON MESURÉ, jamais "indirect" (règle n°4).
 - Devant un CAPTCHA : arrêt net, on ne le résout jamais soi-même (règle n°7).
 - 2 échecs identiques sur le même outil → déléguer à un agent, ne pas re-tenter (règle n°9).
```
