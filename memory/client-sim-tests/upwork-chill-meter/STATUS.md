# Upwork — "Max Chill Factor Meter" (AbiGirl Reacts) — STATUS

> Prototype de bout en bout sur un VRAI brief client Upwork (350 $, overlay YouTube animé).
> Session du 2026-08-22. Rien n'a été envoyé à la cliente, aucun engagement pris.

## ETAT : prototype COMPLET, livrables prêts, non envoyé

Branche : `feat/proto-chill-meter-upwork` (3 commits, mergeable ou à garder en R&D).

### Ce qui existe sur disque
| Quoi | Où |
|---|---|
| 6 MOV ProRes 4444 **alpha vérifié** (`yuva444p12le`) | `out/_r-and-d/chill-meter-upwork/` |
| Démo 18 s sur le plateau réel (v2 = flocons corrigés) | `out/_r-and-d/chill-meter-upwork/DEMO-FINALE-v2.mp4` |
| 4 planches SVG de l'appareil (kimi/gpt/fable/grok) | idem, `out-*.svg` |
| Code : device + overlay + showcase + planche givre | `src/projects/_rnd/chill-meter/` |
| Briefs réutilisables + script de mix | ce dossier |

⚠️ **Les 6 MOV datent d'AVANT la correction des flocons** — à régénérer si on postule :
```
npx remotion render ChillMeter-<Etat> out.mov \
  --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
```
Les 3 flags sont obligatoires : sans `--pixel-format`, ProRes retombe silencieusement
en `yuv422p12le` SANS alpha, sans erreur. Sans `--image-format=png`, TypeError.

## PROCHAINE SESSION — dans cet ordre

1. **Test CapCut** (Aziz, sur ordinateur — personne d'autre ne peut le faire).
   Importer un MOV sur une piste au-dessus d'une vidéo : fond transparent = OK.
   ⚠️ La version WEB de CapCut a échoué à l'import (testé 2026-08-22) → appli de bureau.
   ℹ️ L'alpha est déjà prouvé par ffmpeg (57,2 % de pixels transparents après re-décodage)
   et par la composition sur sa vraie vidéo. Le test CapCut confirme SON outil à elle.
2. **Remplir le profil Upwork** — actuellement vide. Prérequis à toute candidature.
3. **Décider ce qu'on envoie** : filigrane, quel extrait, quel texte de candidature.
   Le questionnaire a 2 pièges : mot-code **"FROSTY"** dans le titre (PDF p.9) + question
   sur le format transparent (réponse : MOV ProRes 4444).
4. **Vérifier les règles plateforme** (voir § ci-dessous, à compléter).

## CE QU'ON A APPRIS (transposable, indépendant de cette annonce)

- **Coût réel mesuré** : 4 planches SVG de l'objet = **0,79 $** (Kimi 0,21 · GPT 0,19 ·
  Grok 0,25 · Fable 0) + 3 planches de givre = 0,48 $. Rendu ProRes 1080p : **53 s** pour 135 frames.
- **Le brief qui DICTE les noms de `<g id>`** rend les planches interchangeables → mix-and-match
  mécanique par script. Sans ça, il faut choisir une seule planche et vivre avec ses défauts.
- **Exiger le châssis PROPRE (sans givre)** alors que la référence client est givrée à 100 % :
  sans cette clause, les paliers 0/25/50 % auraient été impossibles → tout à refaire.
- **Profils des modèles sur objet texturé** (4 testés, même brief, même image) :
  Kimi = le plus propre · GPT = matière la plus riche mais **textes chevauchés** ·
  Fable = meilleur néon, gratuit · **Grok 4.6 = la meilleure typographie, seul sans chevauchement**.
  → Grok entre dans la rotation quand la LISIBILITÉ compte (HUD, habillage de marque).
- **Le marché ne demande pas "du SVG"** : il demande "de l'animation 2D" et un fichier au bon
  format. Le moyen ne l'intéresse pas. Ne jamais vendre la technique, vendre le livrable + la révision.

## GOTCHAS PAYÉS DANS CETTE SESSION

- ⛔ `dangerouslySetInnerHTML` parse en **HTML** → garder le SVG en kebab-case.
  Convertir en camelCase (réflexe JSX) éteint silencieusement les attributs.
- ⛔ Le contrat "prêt à animer" livre `frost_layer`/`icicles` en `opacity="0"`. Si l'enveloppe
  React pilote aussi l'opacité : `0 × frost = 0`, l'élément n'apparaît JAMAIS. Retirer l'attribut figé.
- ⛔ Un gros cercle avec `filter: blur` est rastérisé en **rectangle opaque** en headless.
- ⛔⛔ **La transparence s'AFFICHE comme un rectangle noir** dans les visualiseurs d'images.
  J'ai signalé un bug inexistant et "corrigé" pour rien. Mesurer l'alpha (`getpixel` → `(0,0,0,0)`)
  AVANT de conclure à un défaut de rendu. Cf. [[feedback_transparence-lue-comme-bug]].
- ⛔ `yt-dlp` : 3 installations concurrentes sur cette machine. La seule à jour est
  `/opt/homebrew/Caskroom/miniforge/base/bin/yt-dlp`. Les versions >90 j échouent en 403 sur YouTube.

## RÈGLES PLATEFORME — vérifié 2026-08-22, À CONFIRMER avant d'envoyer

Sources : recherche web du 2026-08-22, **non vérifié contre les pages officielles Upwork**.
- Upwork n'a **pas** de page de politique dédiée à la divulgation d'IA ; l'obligation générale
  est de « personnellement relire et personnaliser » ce qu'on envoie.
- Upwork **ne scanne pas** les livrables à la recherche d'IA au niveau plateforme. Ce qui compte
  est **ce que le client a spécifié dans SON brief**.
- Depuis le **5 janvier 2026**, Upwork entraîne ses modèles sur le contenu créé sur la plateforme
  (contrats, livrables, pièces jointes, code, messages). Une option de retrait existe.
- ⚠️ **Ce brief-ci n'interdit rien** sur l'IA (contrairement à l'annonce n°2 de la session, qui
  exigeait "ZERO AI GENERATION"). Mais notre pipeline est du **code déterministe**, pas de la
  génération d'image — c'est un argument, pas une zone grise. Le dire dans ces termes.

## LIENS
- Démo v2 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/chill-meter-v2/DEMO-FINALE-qXGU37QYKRIJ9vFvQc3FTqzFOw4cqt.mp4
- Comparatif 4 modèles (artifact) : https://claude.ai/code/artifact/099539be-2871-4bba-9a46-b4752b49bd48
- Chaîne cliente : https://www.youtube.com/@Abigirl_Reacts (107 K abonnés, **1 500 vues médianes**,
  ratio vues/abonnés 0,026 — chaîne à fort volume, faible engagement, monétisation faible).
