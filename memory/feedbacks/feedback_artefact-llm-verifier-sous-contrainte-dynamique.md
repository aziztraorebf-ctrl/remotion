# Artefact LLM — vérifier sous contrainte dynamique, pas à l'état statique

> Migré depuis auto-memory 2026-08-31 (créé 2026-07-05). Le "test décisif" (SVG rig FK Gemini vs
> GPT-5.5) est référencé dans `memory/tools/openrouter-svg.md` (§ Fugu Ultra) mais le PRINCIPE
> général n'y était pas énoncé comme leçon indépendante — migré ici pour combler ce trou.

Un artefact généré par un LLM et destiné à un usage **dynamique** (SVG animé, code interactif, système avec
état) doit être jugé sous cette contrainte dynamique réelle, jamais sur son état statique/figé seul. Ce
n'est pas juste "le test statique est incomplet" — le verdict de qualité peut **s'inverser totalement**
entre les deux modes de jugement.

**Why** : prouvé dans la session 2026-07-02 (voir `memory/tools/openrouter-svg.md` § "LE VRAI TEST DÉCISIF").
Jugement initial sur images fixes : GPT-5.5 semblait produire un personnage SVG plus riche et mieux
anatomisé que Gemini 3.1 Pro. Renversement complet après inspection de la structure XML et test de
mouvement réel en code : Gemini avait produit spontanément une vraie hiérarchie de rig FK
(`translate(joint) rotate(angle)` imbriqué parent→enfant), animable en continu sans décrochage. GPT avait
produit des paths en coordonnées absolues sans aucune hiérarchie — seul un cut sec entre états figés était
possible, le mouvement "sautait" au lieu de progresser. La différence était invisible sur une image fixe et
devenait déterminante dès qu'on appliquait la vraie contrainte d'usage (interpolation frame par frame).

**How to apply** : pour tout artefact LLM dont l'usage final est dynamique — toujours vérifier la structure
sous-jacente pertinente à cet usage (hiérarchie de transforms pour du SVG animé, gestion d'état pour du code
interactif, comportement sous charge pour un système) AVANT de conclure sur sa qualité, même si le rendu
statique/premier jet semble impressionnant. Un jugement "ça a l'air bien" sur un aperçu figé n'est pas un
signal fiable pour un usage qui sera dynamique — le vrai test est de faire fonctionner l'artefact dans les
conditions réelles.

**Cas apparenté 2026-07-05** (Soudan, inserts tactiques SVG) : un LLM texte-only (Claude/Sonnet) qui code du
SVG en coordonnées pures, sans jamais voir le rendu pendant qu'il écrit, réussit sur un vocabulaire géométrique
universel (rectangle long = piste d'aéroport, invariant d'un aéroport à l'autre) mais échoue à composer une
forme originale complexe sans référence canonique unique (palais présidentiel, tour TV) — le dosage des
proportions relatives (ex: un élément-clé qui devient minuscule/invisible dans la composition finale) échappe
au raisonnement spatial pur. Gemini image-gen n'a pas ce problème : sa composition ET son rendu sont la même
étape, pas de couche d'abstraction texte→coordonnées entre les deux. Root cause voisine mais distincte du cas
ci-dessus (ici ce n'est pas statique-vs-dynamique, c'est composition-à-l'aveugle-vs-composition-qui-se-voit) —
même famille de leçon : ne pas juger/produire un artefact visuel via un canal qui ne permet pas de vérifier le
résultat dans les conditions réelles de composition. Détail complet et verdict comparatif (Gemini vs SVG pour
bâtiments complexes) : `memory/tools/openrouter-svg.md`.
