# STARTER — PORTFOLIO ANIMÉ : du marché réel à nos propres pièces

> Créé le **2026-08-30** en clôture de la session « scènes du corpus ».
> ⭐ **Plan défini par Aziz.** Copier-coller le bloc PROMPT en début de session.

---

## ⭐ CE QUI EST ACQUIS (ne pas refaire)

**3 pièces terminées**, écarts mesurés vs les originaux d'un studio qui vend :

| pièce | ce qu'elle a appris | livrable |
|---|---|---|
| `repro-redeem` | l'ancrage **au bout du doigt** (un curseur se tient par sa pointe) | `out/_r-and-d/repro-redeem/repro-redeem-FINAL.mp4` |
| `repro-docs` | la **poignée invisible** (N objets parentés, on n'anime que le parent) + le **morphing de forme** | `out/_r-and-d/repro-docs/repro-docs-FINAL.mp4` |
| `repro-onboarding` | la **cascade inversée** (l'ordre de sortie ≠ l'entrée à l'envers) + **anticipation/dépassement** | `onboarding-FINAL.mp4` · **`onboarding-CLAIR.mp4`** |

**Le corpus est ÉPUISÉ** : les 4 pièces d'interface sont traitées. ⛔ Ne pas y retourner.

**Outils créés** :
- ⭐⭐ `scripts/tools/da-brief-anim.py` — DA-brief ANIMATION **4 voix** (Gemini + Kimi
  en vidéo native, GPT + Grok en frames), **avec ou SANS référence**. Le mode
  **sans référence est le principal**. Blocs : récit → motion → test du prix
  (200 $ ou 2000 $ ?) → 3 corrections → **ancrage** (nommer une référence réelle,
  interdiction du vocabulaire « premium » creux) → **l'idée qu'on n'a pas eue**.
- Thème clair/sombre paramétré dans `repro-onboarding/assets/gen-planche.py`
  (`THEME=clair python3 gen-planche.py`).

**Ce que le thème clair a prouvé** (test d'Aziz) : une demande client « je veux
du clair » se traite **dans la même session**, sans redessiner ni ré-animer.
C'est l'argument déterministe rendu concret.

---

## ▶️ LE PLAN DE LA PROCHAINE SESSION (défini par Aziz)

### 1. MCP Fiverr — ce que les VRAIS clients demandent
But : sortir des suppositions. Voir ce qui a été **commandé**, ce que les
acheteurs ont **dit** dans leurs avis. Même sans les vidéos, la description et
les avis suffisent à savoir ce que le marché valide.

⚠️ **Réserves de l'audit (2026-08-30)** — le dépôt `KyuRish/fiverr-mcp-server` :
- ✅ **AUCUNE authentification** requise (vérifié dans le code : zéro cookie,
  token ou session). Le compte Fiverr d'Aziz n'est jamais exposé.
- ✅ Code propre : aucune télémétrie, seul hôte sortant = fiverr.com, throttle
  correct (2 s, plancher dur à 1 s).
- ⛔ **Abandonné** : 3 commits, tous du 2026-02-23, 9 étoiles. Un scraper figé
  6 mois se dégrade en silence.
- ⛔ **Contourne activement Cloudflare** (`curl-cffi impersonate`, rotation
  d'empreintes sur 403) → clause CGU (vii), plus sévère que le scraping seul.
- ⚠️ Risque résiduel = **blocage IP**, pas bannissement de compte.

⭐ **Protocole retenu** : essai **depuis un agent isolé**, lecture seule,
`RATE_LIMIT_DELAY=5`, quelques dizaines de requêtes, **une seule fois**,
installation depuis les sources figées (pas `uvx`). Si ça ne marche pas
(probable), on le sait en 10 min → plan B : lecture manuelle de
`fiverr.com/search/gigs?query=...&sort_by=best_selling` + `last30days` sur
r/Fiverr et r/motiondesign.

### 2. Rétro-ingénierie → QUOI mettre au portfolio
À partir de ce que le marché a validé, décider les pièces à produire.
⛔ Plus de reproduction : ce sont **nos** pièces désormais.

### 3. Workflow SVG → planches
Réutiliser le workflow SVG existant (agent `svg-dessinateur`, qui a maintenant
sa **RÈGLE N°0** : réclamer le récit avant de dessiner).
⚠️ **FORMAT À TRANCHER, pas par défaut** : le corpus est carré 60 fps, mais nos
2 pièces d'interface réussies sont **verticales** (500×1080). Le carré est le
format des pièces COURTES (logo, icône) ; les flux d'interface sont verticaux.
Décider au brief selon le registre visé.

### 4. Code → animation
Comme d'habitude : le SVG est la source, le TSX pilote, jamais l'inverse.

### 5. `da-brief-anim.py` en mode SANS référence
⭐ C'est là que la valeur est apparue cette session : il ne trouve pas que des
gestes d'animation, il trouve les **trous de logique narrative**. Sur
`repro-onboarding` il a sorti 3 incohérences de texte que ni Aziz ni Claude
n'avaient vues (chiffre qui contredit la liste, titre qui annonce autre chose
que l'étape, notification qui inverse la perspective) — **toutes vérifiées
vraies dans le code**.

### 6. Itérer

---

## ⛔ LES RÈGLES PAYÉES CETTE SESSION (non négociables)

1. ⭐⭐⭐ **Le RÉCIT avant la technique.** Écrire en UNE phrase ce que le
   spectateur doit avoir compris, AVANT de dessiner. Si on ne sait pas l'écrire,
   la pièce n'est pas prête. → `feedbacks/feedback_animation-sans-recit-est-une-demo-vide.md`
2. ⭐⭐⭐ **Un recouvrement est un problème d'ANCRE, pas de dosage.** Si réduire
   la taille ET décaler ne suffisent pas, les 2 variables sont innocentes.
   → `feedbacks/feedback_recouvrement-est-un-probleme-d-ancre-pas-de-dosage.md`
3. ⭐⭐ **Mesurer le FICHIER ne remplace pas mesurer l'IMAGE.** Le scan du
   `.lottie` disait « 37/38 en opacité seule » — exact, et pourtant trompeur :
   le glissement d'ensemble n'appartenait à aucun calque.
4. ⭐⭐ **Un mouvement en bloc ≠ le même mouvement par élément décalé.** Le
   décalage EST le geste.
5. ⭐⭐ **Un thème clair n'est PAS le négatif du sombre.** Le gris secondaire doit
   y être nettement plus foncé (mesure WCAG : 2,46 → illisible ; il fallait
   #3e4a58 et non #5d6b7d). Et les OMBRES noires en dur sont le piège invisible.
6. ⭐⭐ **Transcoder avant d'envoyer une vidéo dans le chat** (H.264 niveau ≤ 4.0,
   `yuv420p` range TV). Un 2000×2000 @ 60 fps est refusé par le mobile.
   → `memory/fiches/FICHE-ASSEMBLAGE.md`
7. ⛔ **Vérifier la taille d'un fichier après toute réécriture par regex** — un
   `re.sub` mal formé a vidé `gen-planche.py` (20 Ko → 14 octets), récupéré par
   git grâce au commit précédent.

---

## ▶️ PROMPT DE DÉMARRAGE (copier tel quel)

```
Session : PORTFOLIO ANIMÉ — du marché réel à nos propres pièces.

Lire d'abord :
  memory/starters/STARTER-portfolio-anime.md   (ce fichier : plan + acquis)
  memory/projects/RECHERCHE-MARCHE-INDEX.md    (8 verdicts marché)
  memory/client-sim-tests/corpus-kamotion/CORPUS-REFERENCE-UI.md

Le corpus est ÉPUISÉ (4 pièces d'interface sur 4 traitées). On ne reproduit
plus : on crée nos propres pièces, sur ce que le marché valide.

Étape 1 — MCP Fiverr, essai encadré depuis un AGENT ISOLÉ (voir les réserves
de l'audit dans le starter : pas d'auth requise, mais dépôt abandonné et
contournement Cloudflare). Lecture seule, RATE_LIMIT_DELAY=5, quelques dizaines
de requêtes, une seule fois. But : ce que les clients ont COMMANDÉ et ce qu'ils
en ont DIT. Si ça casse → plan B (lecture manuelle + last30days sur Reddit).

⛔ RAPPELS NON NÉGOCIABLES :
 - Le RÉCIT avant la technique. Une phrase de ce que le spectateur doit
   comprendre, AVANT de dessiner. Sinon la pièce n'est pas prête.
 - Déclarer `// MOTEUR: <registre>` dans tout nouveau .tsx (gate actif).
 - Juger la netteté UNIQUEMENT sur un render scale=1.
 - Transcoder toute vidéo avant de l'envoyer à Aziz (niveau ≤ 4.0).
 - Un défaut qui résiste à 2 dosages est un problème de REPÈRE, pas d'amplitude.
```
