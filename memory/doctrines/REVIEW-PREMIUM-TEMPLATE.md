# TEMPLATE — Review PREMIUM downstream (standard, validé Aziz 2026-06-13)

> Quand : sur une version SEMI-FINALE (fond validé), pour la faire monter en gamme. PAS une chasse aux bugs —
> "qu'est-ce qui ÉLÈVERAIT cette vidéo au premium, dans notre stack, sans TikTok, sans tout refaire".
> Cette structure a donné d'excellents résultats (P3 Sahel) → c'est le STANDARD à réutiliser pour comparer
> dans le temps. Outils : Gemini (frames/texte) + Kimi (frames). Tester sur frames downscalées 1280.
>
> ⚠️ Gemini via Files API VIDÉO = non fiable (a répondu "sans voir l'image" 2026-06-13). Pour un review
> qui doit JUGER le rendu : envoyer des FRAMES (8 frames clés downscalées) aux DEUX modèles, pas la vidéo.

## STRUCTURE DU BRIEF (à reproduire à l'identique)

**MANDAT** : version semi-finale, fond validé, on ne refait rien de zéro. Mission = premium + plus vivant,
dans notre stack, sans TikTok. Ouverts aux idées neuves. PRIORITÉ N°1 : tuer la carte morte / espaces vides.
Signaler ce qui est DÉJÀ prévu (ex: "fond qui respire") pour qu'ils cherchent AU-DELÀ.

**LES 7 DEMANDES** (précis, actionnable, hiérarchisé) :
1. **TEMPS MORTS** (priorité 1) : timecodes où la carte est vide/molle + quoi y mettre de faisable.
2. **RÉTENTION** : qu'est-ce qui garde scotché ? où a-t-on l'impression de "jetons qui bougent sans raison" ?
   comment transformer chaque mouvement en INTENTION (qui fait quoi pourquoi) ?
3. **EXPLOITER LA CARTE VIVANTE** : qu'est-ce qu'on sous-utilise (texture, relief/pitch, lumière, fond, ambiance) ?
4. **AUDIT DE NOTRE STACK** : utilise-t-on au max (raisonnable) — jetons / PixelLab (animations incarnées) /
   Gemini (sprites lieux-objets) ? où est-ce sous-utilisé, qu'aurait-on pu faire de plus ?
5. **BENCHMARK** : qu'est-ce qu'une war-map premium (Kings & Generals, Ollie Bye, Al Jazeera carto) a que la
   nôtre n'a PAS, reproductible dans notre stack ? (spécifique, pas "c'est plus pro").
6. **DÉFAUTS À FIXER** dans nos limites techniques.
7. **HIÉRARCHISE** : TOP 3 par rapport IMPACT/EFFORT.
+ Les 5 ANGLES (socle) : spectateur lambda · narration/synchro · transitions vs états · AI-slop · expert métier.

**JOINDRE TOUJOURS** : (a) notre STACK détaillé (briques + interdits : pas de easeTo/blur/3D lourde/AE),
(b) ce que raconte la partie (contexte narratif), (c) 8 frames clés downscalées 1280.

## RÈGLE D'EXPLOITATION (Gemini/Kimi = SIGNAL, JAMAIS JUGE)
Vérifier CHAQUE idée contre : (1) est-ce déjà fait ? (2) est-ce dans le stack (pas easeTo/pixel-art si charte
réaliste/etc.) ? (3) contredit-elle un choix Aziz tranché ? → garder ce qui converge + faisable + nouveau,
écarter le reste, présenter à Aziz le TRI (converge / idée forte à trancher / écarté+pourquoi). Aziz tranche.

## LEÇONS P3 SAHEL (exemples de tri)
- RETENU : wet-ink+waypoints visibles · ombres portées jetons · easing narratif · pictogrammes faction discrets
  (vocabulaire état-major, K&G) · drift caméra continu · flash climax · pitch 3D (à tester, via jumpTo PAS easeTo).
- ÉCARTÉ : PixelLab (jure avec jetons réalistes War-Map + chantier ; pixel = Atlas only) · symboles OTAN/échelle
  km (trop technique grand public) · shaders distorsion (hors stack) · plein écran AES (territorial → overlay ;
  plein écran réservé aux CONCEPTS non-spatiaux, ex P4 coût/franc CFA).
