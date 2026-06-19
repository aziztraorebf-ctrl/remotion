# DOCTRINE — Continuité de scène & Intention d'abord (anti-cercle-vicieux des templates)

> ⭐ **NON-NEGOTIABLE. À lire avant de construire OU prolonger toute scène (hook, beat, transition).**
> Née d'un cas réel prouvé DEUX FOIS du premier coup le 2026-06-18 (hook Sénégal Pétrole + sa suite).
> Elle répond à un problème récurrent nommé par Aziz : *« à chaque nouvelle scène ou prolongement, ça
> redevient problématique, on tâtonne, on hésite, on refait tout. »* La cause n'était PAS « trop de
> templates » — c'était **l'ORDRE dans lequel on les invoque.**

---

## LE PIÈGE (ce qu'on faisait avant, qui paralyse)

**Réflexe template-first** : *« voici nos 71 composants — lequel colle ? »*
La doctrine du projet le pousse même (« scan templates AVANT de coder »). Résultat observé :
- On déroule un catalogue, **rien ne colle tout à fait**, on hésite.
- On finit par plaquer un composant « qui ressemble » → l'instinct d'Aziz sent le décalage (« ça ne fait pas 100% »).
- Ou on bricole / on refait à zéro. **10 essais** avant que ça tombe juste par hasard.
- Le catalogue, censé accélérer, **PARALYSE** : il demande de *reconnaître* la bonne réponse au lieu de la *déduire*.

**Exemple vécu (à ne PAS refaire)** : pour la suite du hook Sénégal (le limogeage), première tentative =
prendre 2 templates existants (`NewsClippingV2` coupure de presse + `FaceAFace` bascule) et les *remplir*
de texte. Verdict Aziz : *« les deux sont intéressants mais ça ne le fait pas à 100%. »* → exactement le
symptôme. On était parti **du template, pas du sens**.

---

## LA RÈGLE (ce qui a marché, prouvé)

### 1. INTENTION → FORME → TEMPLATE (dans CET ordre, jamais l'inverse)
Avant tout composant, répondre : **« que doit FAIRE ressentir ce moment ? »** (4-5 verbes max :
poser une tension / révéler un chiffre / annoncer un fait / **faire basculer** / faire respirer).
- L'intention dicte la **forme** (le geste visuel qui porte cette émotion).
- Le template vient **en dernier**, et seulement comme question binaire : *« a-t-on déjà cette forme ? »*
  Si oui → on l'adapte. Si non → on code, mais on sait EXACTEMENT quoi, parce que l'intention est claire.

**Preuve** : le mot de la voix était *« bascule »*. Une bascule n'est ni une annonce (coupure de presse,
statique) ni une comparaison (face-à-face, équilibré) : c'est un **renversement**. D'où la forme codée
(la carte se FEND, les moitiés se décalent) — qui n'existait dans aucun template. Tombé juste **du 1er coup**.

### 2. CONTINUITÉ > NOUVEAUTÉ (le vrai capital réutilisable)
Une scène = **UN MONDE qui se transforme**, pas une succession d'écrans. Le premium vient de RESTER
dans le même monde et de le faire évoluer. Mot exact d'Aziz : *« on n'a pas changé de template, on a
continué la scène en rajoutant des éléments. »*
- Phase 1 (hook) : carte parchemin + count-up `8 000 000 $`.
- Phase 2 (suite) : **la MÊME carte** se fracture, le **MÊME 8M$** est repris figé, le **MÊME fond** se
  contamine. Puis la carte recule/s'estompe et **la question monte par-dessus le même monde**.
- ⚠️ Chaque fois qu'on CHANGE de monde (nouveau template = nouvel écran), il faut tout re-justifier →
  c'est là qu'on tâtonnait. **Le vrai template réutilisable, c'est le MONDE (fond + carte + chiffre), pas un composant.**

### 3. ÉPURE = ANTI-REDONDANCE (l'écran ne répète pas la voix) — ⭐ LE FIL ROUGE D'AZIZ
**Règle gravée (répétée par Aziz depuis le début du sujet) : à l'écran, GARDER L'ESSENTIEL, alléger
tout le reste. Jamais 2-3 lignes de texte qui redisent la même chose, ni une paraphrase de la voix.**
Quand la voix porte déjà l'info, l'écran montre soit ce que la voix NE dit pas, soit le NOYAU en 2-3 mots.
- Hook : retiré le sous-titre qui doublait « 8 millions de dollars » mot pour mot.
- Fracture : gardé **« 22 MAI » seul + pulse**, retiré « tout bascule » et « le gouvernement saute ».
- Question : la voix dit *« Comment un pays qui s'enrichit bascule dans la tourmente ? »* (phrase complète)
  → l'écran ne la paraphrase PAS, il montre le paradoxe NU en 2 mots opposés : **« S'enrichir. / S'effondrer. »**
  C'est ça « garder l'essentiel » : le contraste, pas la phrase.
Test : si le texte à l'écran pourrait être lu À VOIX HAUTE en même temps que la narration sans gêne → il
double la voix → le réduire au noyau ou le supprimer.

### 4. CALAGE AUDIO = l'image PRÉCÈDE l'oreille
Mesurer la voix (Whisper word-timestamps), caler l'animation pour **culminer ~1s AVANT** le mot-clé.
Une animation en retard sur la voix = sensation de lenteur. L'image qui précède = vivacité.
(Hook : le compteur atteint 8M à ~5s, la voix dit « dollars » à ~6s.)

---

## LE SIGNAL « OUI » D'AZIZ (ce qu'on cherchait à comprendre)
Aziz demandait : *« il y a quelque chose derrière qui fait que je dis oui — il faut le reverse-engineer. »*
**Réponse : son instinct dit OUI quand la FORME ÉPOUSE L'INTENTION.** Quand c'est aligné, le oui est
immédiat (du 1er coup). Quand on plaque un template, l'instinct sent le décalage. La mesure objective =
**le nombre d'essais** : méthode template-first = ~10 essais ; méthode intention-first = 1 essai.

---

## CHECKLIST (30 secondes, avant de coder/prolonger une scène)
1. **Intention** : ce moment doit faire ressentir QUOI ? (1 verbe dominant)
2. **Continuité** : quel monde est déjà à l'écran ? Je le PROLONGE (je ne le remplace pas).
3. **Forme** : quel geste porte l'intention ? (ne pas penser « composant » encore)
4. **Template** : a-t-on déjà cette forme ? oui→adapter / non→coder (mais je sais quoi).
5. **Épure** : qu'est-ce que la voix dit déjà ? → je le retire de l'écran.
6. **Calage** : l'animation culmine ~1s avant le mot-clé (Whisper si besoin).

---

## RAPPORT AVEC LES AUTRES DOCTRINES
- Ne REMPLACE pas le scan templates — le **réordonne** : intention d'abord, template en vérification finale.
- Complète [[feedback_premium-d-abord-anti-paresse]] (le premium = direction, pas un composant plaqué).
- Le COMPOSANTS-INDEX reste utile comme RÉPONSE à une forme déjà déduite, pas comme point de départ.
- Lié au chantier [[decode-hera-templates]] : les 3 fonds + 6 familles servent comme *réponses* à une
  intention, jamais comme catalogue où l'on « cherche quoi mettre ».
- Cas incarné : hook Sénégal `ProtoEffect_MapDrawParchemin` + suite `ProtoEffect_Fracture`.
