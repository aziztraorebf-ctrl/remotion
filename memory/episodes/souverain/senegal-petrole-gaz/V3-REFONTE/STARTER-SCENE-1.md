# STARTER — SCÈNE 1 V3 (prochaine session)

> Copier-coller le bloc « PROMPT » ci-dessous au démarrage de la prochaine session.
> Il pointe vers tout ce qu'il faut. Lire les fichiers AVANT de coder.

---

## PROMPT (à donner à l'instance fraîche)

On reprend la **refonte V3 du Sénégal Pétrole & Gaz**, scène par scène. La **scène 0 (hook) est FAITE et validée**.
On attaque la **scène 1 (les 3 gisements + le paradoxe)**. On NE code PAS avant d'avoir lu et préparé.

**À LIRE EN PREMIER, DANS CET ORDRE :**
1. `memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md` — séparation V1/V3, état des 8 scènes,
   méthode par scène. ⛔ V1 et V3 NE SE MÉLANGENT PAS.
2. `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md` — la doctrine (INTENTION→forme→template, continuité
   du monde, épure, image précède l'oreille). NON-NEGOTIABLE. Elle a fait tomber la scène 0 juste du 1er coup.
3. La scène 0 comme référence : `src/projects/_proto-16-9/SenegalScene0.tsx` (+ `ProtoEffect_MapDrawParchemin` +
   `ProtoEffect_Fracture`). Rendu final : https://files.catbox.moe/yg9k78.mp4

**LE SUJET DE LA SCÈNE 1** (texte exact = `out/episodes/senegal-petrole-gaz/_audio-v3/SCRIPT-V3-senegal.md`, SCÈNE 1) :
écarter les 2 récits → les 3 gisements un par un (Sangomar / GTA / Yakaar-Teranga) → 60% à l'État → le paradoxe
(« ce chiffre ne dit rien sur ce qui décide vraiment »). Yakaar = open loop (« il attend, la plus grosse surprise »).

**MÉTHODE (obligatoire, ordre strict) :**
1. **Comparer V1** : regarder ce qu'avait l'ancienne version → `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4`
   (extraire quelques frames + l'audio). Beats V1 = `src/projects/souverain/senegal-petrole-gaz/beats/Beat1→9.tsx`.
2. **Forced alignment** de la portion narration V3 de la scène 1 : adapter `scripts/senegal-hook-alignment.py`
   (changer le TEXT = SCÈNE 1, et l'extrait audio). Mesurer les mots-clés (Sangomar, GTA, Yakaar, 60%).
   Audio source : `public/souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3` (la scène 1 suit la scène 0).
3. **Intention d'abord** : que doit faire ressentir cette scène ? (poser le paradoxe + tenir la tension sans
   surcharger). 1 verbe dominant. PUIS forme, PUIS template.
4. **TRANCHER LE MÉDIUM** (décision ouverte, la poser à Aziz) : SVG parchemin (continuité directe de la scène 0,
   recomposée) OU Mapbox carte vivante (FlagFill, getCam) ? Question clé : qu'est-ce qui sert le mieux
   « 3 gisements OFFSHORE qui s'allument » ? Si Mapbox → lire `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`
   + scan templates (CATALOGUE-CARTE-VIVANTE). Si SVG → prolonger la carte parchemin scène 0.
5. **Continuité** : réutiliser LA carte du Sénégal (la scène 0 finit sur la carte recomposée). Les 3 gisements
   = 3 points offshore qui s'allument (on a déjà placé Sangomar/GTA offshore dans `ProtoEffect_Loupe3D`). Yakaar
   = pulse "en attente" (open loop). PAS 3 nouveaux écrans : un seul monde, des points qui s'allument.
6. **Épure** : la voix dit les noms/%/entreprises → l'écran MONTRE (point + drapeau acteur via `useClipFlags`),
   ne sous-titre PAS la voix. Drapeaux : Woodside=Australie, BP=Royaume-Uni, Petrosen=Sénégal.
7. **Render → DA-brief vidéo** : `scripts/tools/gemini-video-da-brief.py <render.mp4>` (tester fiabilité d'abord
   via `gemini-video-upload-test.py`). FILTRER (Gemini = signal, pas juge ; ne pas casser l'épure).
8. Mettre à jour le tableau d'état dans `V3-REFONTE/README.md` (scène 1 ✅) à la fin.

**STOCK RÉUTILISABLE (vérifié)** : géométrie Sénégal (`_proto-16-9/senegalPath.ts`), points offshore
(`ProtoEffect_Loupe3D`), count-up (`ProtoEffect_MapDrawParchemin` pour le 60%/18%), `useClipFlags` (drapeaux
réels), filtres premium grain+ombres (dans `ProtoEffect_Fracture`), charte navy/or/ivoire + fond parchemin/grille.

**GARDE-FOUS** :
- Working tree PARTAGÉ (autre instance possible) → `git add` chirurgical, jamais `-A`. Root.tsx sensible.
- Chiffres à l'écran = fact-checkés (la voix V3 est validée ; ne pas inventer de chiffre hors narration).
- Ne pas confabuler de noms de personnalités politiques (post-cutoff) — ne montrer que ce que la voix dit.

---

## RAPPEL — ce que la scène 1 a de différent (pour anticiper)
- Scène la plus DENSE (3 acteurs, 3 lieux, des %). Le risque = surcharge. La doctrine (continuité = 1 monde,
  épure) est faite pour ça : 3 points sur UNE carte, pas 9 écrans.
- 1ère scène où se pose le choix de MÉDIUM (SVG vs Mapbox) — décision à trancher avec Aziz au début.
- Yakaar-Teranga = graine d'open loop à planter visuellement (rappelée plus tard dans la vidéo).

## CHEMINS EXACTS (composants scène 0 = à prolonger)
- `src/projects/_proto-16-9/SenegalScene0.tsx` (assemblage), `_proto-16-9/ProtoEffect_MapDrawParchemin.tsx`
  (count-up parchemin), `_proto-16-9/ProtoEffect_Fracture.tsx` (fracture+recompo), `_proto-16-9/senegalPath.ts`
  (géométrie Sénégal), `_proto-16-9/ProtoEffect_Loupe3D.tsx` (points offshore Sangomar/GTA déjà placés).
- ⚠️ Ces fichiers sont dans `_proto-16-9/` (R&D) **mais sont du FINAL validé**, pas du WIP. Déplacement vers
  `souverain/senegal-petrole-gaz/v3/` = TODO (attend libération de Root.tsx, autre instance).

## DÉCISION MÉDIUM (à poser à Aziz AVANT de coder)
Question : « 3 gisements OFFSHORE qui s'allument — on PROLONGE la carte parchemin SVG de la scène 0
(continuité maximale, même monde) ou on passe en **Mapbox carte vivante** (FlagFill, getCam, plus riche
géographiquement) ? » Reco par défaut (doctrine §continuité) : **prolonger le SVG parchemin** sauf si Aziz
veut la richesse Mapbox. Trancher AVANT, ne pas commencer à coder sans cette réponse.

## READINESS CHECK (avant de coder — répondre OUI aux 4)
1. Ai-je lu la doctrine ET le README V3 ? (pas juste survolé)
2. Ai-je formulé l'INTENTION de la scène 1 en 1 verbe dominant ? (≠ "montrer les gisements")
3. Ai-je compris la CONTINUITÉ avec la scène 0 ? (la carte recomposée RESTE, les gisements s'allument dessus)
4. Le MÉDIUM (SVG vs Mapbox) est-il tranché avec Aziz ?
Si un NON → ne pas coder, compléter d'abord.

## NOTES MINEURES (anticipées par test agent vierge 2026-06-18)
- **Source de vérité texte** = `SCRIPT-V3-senegal.md` (le texte que la voix lit). Les timings = forced
  alignment, jamais édités à la main sans réaligner. Ne PAS modifier le script (audio déjà généré/validé).
- **DA-brief vidéo** (`gemini-video-da-brief.py`) = à lancer quand le render est SEMI-FINAL pour le monter
  en gamme (pas obligatoire à chaque essai). Toujours FILTRER (Gemini = signal).
