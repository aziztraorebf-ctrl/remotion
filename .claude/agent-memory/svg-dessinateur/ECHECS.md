# ⛔ ÉCHECS — lire AVANT de tenter

> Chaque entrée décrit le SYMPTÔME VISUEL exact, pas une impression.
> But : ne jamais repayer une tentative déjà perdue.

## ⛔⛔ ANATOMIE HUMAINE — 5 modèles sur 5 échouent SANS RÉFÉRENCE (2026-08-28)

> ⚠️ **Portée du verdict PRÉCISÉE le 2026-08-28 (soir)** : ces 5 échecs valent **SANS image de
> référence uniquement**. Avec une référence visuelle dans le brief, le registre main-curseur a été
> DESSINÉ avec succès (3 poses, validées au rendu contre la référence) — cf. `TECHNIQUES.md`
> § « Anatomie AVEC référence ». La question ouverte est TRANCHÉE : avec image-ref on exécute,
> sans image on ne trouve pas la forme.

**Protocole** : test à l'aveugle, planches anonymisées, clé scellée avant jugement.
Brief détaillé, pièges explicitement nommés, consigne d'empilement incluse.
**Modèles** : Gemini 3.1 Pro · GPT-5.6 Sol · Kimi K3 · Grok 4.6 · GLM-5.2.

| Registre | Résultat |
|---|---|
| Objets d'interface | ✅ 5/5 réussissent |
| **Main humaine (3 poses)** | ⛔ **5/5 échouent** |

**Symptômes visuels, systématiques d'un modèle à l'autre :**
- la paume est un **rectangle** — elle se lit comme une manche, pas comme une main
- les doigts repliés forment une **grappe de bulles** au lieu de trois arcs distincts
- le **poignet est coupé net**, sans raccord
- le **pouce est une forme rapportée** posée à côté, il flotte
- une planche a même un **index qui se plie à l'envers**

⚠️ **Deux planches avaient PLUS de formes que les autres sans être meilleures.**
Le volume ne compense pas une anatomie fausse — la consigne d'empilement ne sauve pas ce registre.

⛔ **Correction d'une attente** : GPT-5.6 Sol est le champion documenté de l'organique (il avait
réussi un visage de pêcheur là où les autres échouaient). **Il a produit une des pires mains.**
« Bon sur les visages » ≠ « bon sur les mains ».

**→ Que faire à la place** : prendre une pièce de banque et la restructurer.
Mode opératoire : `memory/tools/banques-lottie-et-greffe.md` (la géométrie est en clair dans
le `.lottie`, l'extraction est triviale). Résultat : préféré par Aziz contre les 5 modèles,
et **plus léger** (1 chemin continu contre 52 à 139 formes).

✅ **Question TRANCHÉE (2026-08-28, main-curseur avec référence)** : avec une image de référence,
le registre SE DESSINE — succès en 3 itérations, aucun des 5 symptômes ci-dessus au rendu final
(`out/_r-and-d/concours-svg-ui/main-avec-ref/fable.svg`). Méthode : `TECHNIQUES.md` § « Anatomie
AVEC référence ». ⚠️ Les 2 pièges rencontrés EN COURS de route (ils reviendront) :
- **la vallée pouce-index mangée par le trait** : un écart de ~5 unités entre deux parois est
  entièrement absorbé par un stroke de 7 → fente noire, lit comme une craquelure. Garantir ≥12
  unités entre parois parallèles avant stroke.
- **la paume qui s'allonge toute seule** : sans mesure, le poing sort plus haut que large (0,9:1) ;
  la référence est PLUS LARGE que haute (~1,2-1,35:1). Mesurer le ratio du poing, pas l'impression.
Le verdict « 5/5 échouent » reste ENTIER pour toute anatomie **sans** référence : dans ce cas,
greffe de banque, pas de génération.

## ⛔ Dessiner à la main dans le code (l'erreur de l'orchestrateur, 2026-08-28)

Symptôme : tous les objets en **aplats de couleur**, une forme par objet, là où la référence a
des dégradés et ~10 formes empilées. Cause : les formes avaient été écrites au clavier en JSX
au lieu d'être dessinées. **L'aplat généralisé est le symptôme visuel de cette erreur.**
→ `memory/feedbacks/feedback_svg-dessine-a-la-main-au-lieu-de-deleguer-a-fable.md`

## ⭐ PERSONNAGE ARTICULE — mes erreurs des 3 versions (2026-08-29)

### Ce que j'ai cru, et que le RENDU a dementi
- **L'ombre de chevelure sur le front** : promise dans mon programme design, elle lisait
  comme un **bandeau** malgre 2 affinages → supprimee (les refs pro n'en ont pas).
  ⭐ **Une idee de programme se lache quand le rendu la contredit.** Ne pas s'y accrocher
  parce qu'on l'a annoncee.
- **La taille pincee** (mon point 3 de programme V2) : les refs font des torses **tonneau
  quasi droits**. C'etait une coquetterie de designer contraire au registre. ⭐ La SENSATION
  d'Aziz a detecte ce que mes mesures n'avaient pas cherche.
- **« Les jonctions visibles viennent des rotules »** : FAUX. La rotule est de la couleur du
  membre, elle ne peut pas se voir. C'etaient **mes ellipses d'ombre decoratives**.
  ⭐ Meme symptome, autre cause — chercher la cause avant de refaire le mecanisme.

### Le piege de DOSAGE que j'ai failli repeter
La jonction cuisse/mollet a resiste a **2 dosages** avant que je zoome : la cause etait
**structurelle** (mollet plus etroit que le bas de cuisse → le fond clair dessine la
jonction). Fix : mollet **aussi large** que le bas de cuisse — bleu sur bleu, bord invisible.
⛔ **Des le 2e dosage sans progres, chercher la cause, pas une 3e valeur.**

### Ce qui m'a limite pendant 3 versions sans que je le nomme
⛔ **Aucune reference humaine DE FACE.** Je transposais des largeurs depuis des vues 3/4 et
de profil. Verifie apres coup : les 23 pieces du corpus n'en contiennent aucune.
⭐ **Reflexe a garder : nommer TOT ce qui manque comme materiau**, au lieu de compenser en
silence. Je l'ai demande a la V3 seulement — 2 versions trop tard.

### Un chiffre atteint n'est pas un dessin reussi
En V3 j'ai atteint TOUS mes ratios cibles et perdu 3 choses a l'oeil : bras qui se fondent
dans le torse au repos, cou disparu, souliers devenus des sabots.
⛔ **Toujours REGARDER le rendu final en entier apres avoir corrige une metrique** — la
correction d'un chiffre peut casser ce qui allait.

## 2026-08-30 — planche-onboarding "Loop" (defauts intermediaires, tous corriges au rendu)
- ⛔⛔ **UN `<rect>` CLAIR FLOTTANT DANS UNE FORME = LIGNE PARASITE.** Lustre pose en rect arrondi
  a l'interieur des pastilles d'app : son bord bas se lit comme un TRAIT, pas comme un volume
  (meme symptome que "2 bandes claires flottantes" de la planche-docs). Fix : lustre ANCRE au
  bord, epousant les coins arrondis.
- ⛔⛔ **A GRANDE LARGEUR, TOUT LUSTRE DEVIENT UNE LIGNE.** Sur un bouton de 420px, une calotte
  claire `q-210 16 -420 0` lit comme une barre horizontale coupant le bouton. 2 dosages tentes
  (opacite, courbure) AVANT de comprendre que la cause etait structurelle. → a cette echelle,
  liseré fin ancre au bord uniquement, jamais une zone.
- ⛔ **CERNE evenodd MAL FERME = MOITIE DU BOUTON ASSOMBRIE.** Mon 2e sous-chemin ecrivait les
  arcs et le `v-24` dans le mauvais ordre : le "trou" ne coincidait pas avec le contour et
  remplissait la moitie basse. Symptome identique a la ligne parasite du lustre — j'ai donc
  d'abord accuse la mauvaise forme. → Quand un defaut persiste apres correction de la cause
  supposee, RETIRER les formes une par une pour identifier la coupable.
- ⛔ **LISERÉ PARTIEL SUR UNE PILULE = ENCOCHE AUX BOUTS.** Le cerne haut de l'interrupteur OFF
  se terminait par un crochet visible a droite. Un cerne fait le tour complet ou n'existe pas.
- ⛔ **ECRAN DESEQUILIBRE** : l'ecran 2 n'avait de contenu que sur son tiers haut, 400px vides
  en bas. Un ecran mobile se juge en ENTIER, pas element par element. Fix : ajout d'un apercu
  de notification + une note d'aide + un pied (progression + bouton) — des pieces credibles du
  registre, pas du remplissage decoratif.
- ⛔ Fleche hampe-rect + pointe-triangle : decrochement au raccord (voir TECHNIQUES).
