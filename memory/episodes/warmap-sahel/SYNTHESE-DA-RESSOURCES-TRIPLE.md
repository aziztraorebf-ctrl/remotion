# SYNTHÈSE EXTRACTIVE — DA-brief downstream "LE LEVIER" (ressources triple-screen)

> 2026-06-15. Gemini 3.1 Pro a répondu (riche). Kimi a ÉCHOUÉ (erreur parsing JSON API — à relancer si besoin
> d'une 2e voix). Frame envoyée = v1 (icônes sur pastilles). ⚠️ Plusieurs remarques Gemini portent sur des
> défauts DÉJÀ corrigés en v2 (carte de fond supprimée, séquentiel, texte en bas) → hallucinations sur état périmé.
> Méthode : extraire CHAQUE idée, vérifier vs réel, trancher ✅RETENU / 🔶OPTION / ❌ÉCARTÉ + raison.

## IDÉES DE REPRÉSENTATION (au-delà de l'icône plate)
| Idée Gemini | Verdict | Raison |
|---|---|---|
| **Jauge territoriale** : le polygone du pays se REMPLIT de la ressource (dégradé doré qui monte, `clipPath`) — "le pays DEVIENT la ressource" | ✅ **RETENU** | = exactement ma reco "la richesse est le sol". Organique, premium, justifie la carte. Le plus fort. |
| **Cartographie des nœuds** : géolocaliser la ressource au VRAI gisement (Arlit au nord Niger) + cercles concentriques qui pulsent (rayonnement) | ✅ **RETENU** (combiner avec jauge) | Plus précis qu'une icône au centre. Arlit a un vrai lieu. Le "rayonnement" = la richesse convoitée. |
| **Icônes Lucide minimalistes** (`Diamond`/`Coins` or, `Hexagon` uranium) `stroke 1.5`, SANS pastille ivoire, posées sur le gisement | 🔶 **OPTION** | Mieux que mes icônes SVG sur pastille (pastille = "clip-art bas de gamme" selon Gemini, juste). Mais à tester vs la jauge (peut-être redondant). |

## HIÉRARCHIE DES VOLETS
| Idée | Verdict | Raison |
|---|---|---|
| **Accordéon dynamique** : Mali/Burkina 40% chacun, Niger écrasé 20% → au climax le Niger s'OUVRE à 60%, les 2 autres se réduisent à 20% | ✅ **RETENU** | = ma reco "Niger volet plus large", mais EN ANIMATION (la mise en page réagit à la narration). Fort. À ajouter au template `WarMapSplitScreen` (ratios animés). |

## TRANSITION NIGER (nationalisation, sobre)
| Idée | Verdict | Raison |
|---|---|---|
| **Flux repris** : ligne grise pointillée fuit vers l'extérieur (exploité) → "beat" rouge depuis Arlit → la ligne disparaît, contour intérieur OR s'allume (la ressource RESTE au territoire) | 🔶 **OPTION** (attention) | Idée juste MAIS Aziz a DÉJÀ rejeté "ligne vers l'extérieur hors-cadre = arbitraire". Ici la ligne reste DANS le volet Niger (cadré) donc moins risqué. À valider Aziz. La 2e partie (contour OR s'allume = "ça reste à nous") est SOBRE et bonne. |
| Remplacer le cartouche "NATIONALISÉ 2025" (style sticker/bouton web) par un TEXTE BRUT rouge brique + un `<path>` SVG qui SOULIGNE/ENCERCLE "2025" à la main (`stroke-dashoffset`) | ✅ **RETENU** | Juste : le cartouche rouge fait "sticker collé", jure avec le parchemin. L'annotation manuscrite = identité analyste/carte. Fort et sobre. |

## AI-SLOP / FINITION (corrections de fond)
| Point | Verdict | Raison |
|---|---|---|
| **Pastilles ivoire sous les icônes = "clip-art bas de gamme"** → supprimer | ✅ **RETENU** | Vrai. Surtout si on passe à la jauge territoriale (plus d'icône posée). |
| **Cartouche rouge arrondi + dégradé + ombre = "sticker"** → texte brut + lignes SVG fines | ✅ **RETENU** | Voir ci-dessus. |
| **Remplissage intérieur "marronnasse qui salit le parchemin"** → fond parchemin PUR, couleur que sur le stroke + fill animé très léger (0.1) au focus | 🔶 PARTIEL | ⚠️ HALLUCINATION sur v1 (le marronnasse = carte Mapbox de fond, DÉJÀ supprimée en v2). MAIS le principe "fill très léger au focus" reste bon. |
| **Texte par-dessus les frontières (OR ~60t sur ligne Burkina)** → espace négatif, data en bas | ❌ ÉCARTÉ (déjà fait) | Hallucination v1. En v2 le texte est DÉJÀ en bas dégagé. |
| **Tout apparaît d'un coup = spoile** → séquençage | ❌ ÉCARTÉ (déjà fait) | En v2 déjà séquentiel Mali→Burkina→Niger. |
| **Mix typo serif/sans-serif/cartouche = amateur** → hiérarchie stricte (serif noms pays, sans-serif light datas) | 🔶 OPTION | Juste sur le principe. À soigner (actuellement tout en Georgia serif). |

## ⚠️ DÉSACCORD MAJEUR — les séparateurs verticaux
| Idée Gemini | Verdict | Raison |
|---|---|---|
| **SUPPRIMER les barres verticales** ("tableau Excel") + faire UNE SEULE grande carte continue AES où la caméra PAN du Mali → Burkina → Niger (dé-zoom au climax) | ❌ **ÉCARTÉ** (contredit la décision Aziz) | C'est exactement ce qu'Aziz a REJETÉ au tour précédent (carte unique + caméra qui voyage = illisible, contours qui tremblent). Le TRIPLE-SCREEN est le CHOIX d'Aziz justement pour éviter ça. Gemini ne connaît pas l'historique. Les séparateurs INCARNENT la juxtaposition des 3 pays. → GARDER le split. (On peut affiner le style des séparateurs, pas les supprimer.) |

## PLAN D'AMÉLIORATION RETENU (à proposer à Aziz, par impact)
1. ✅ **Jauge territoriale** : le polygone se remplit de la ressource (or doré qui monte) au lieu de l'icône-pastille.
2. ✅ **Supprimer pastilles ivoire** + remplacer cartouche "NATIONALISÉ" par texte brut + soulignement SVG manuscrit.
3. ✅ **Accordéon** : Niger s'élargit au climax (volet 60% vs 20/20).
4. 🔶 Nœud géolocalisé Arlit + pulse (option, combiner avec jauge).
5. 🔶 Transition Niger "contour OR s'allume = reste au territoire" (sobre, sans flux hors-cadre).
6. ❌ NE PAS supprimer les séparateurs / revenir à carte unique (décision Aziz).

Kimi à relancer si 2e voix souhaitée. Source brief : `/tmp/da-refs/brief-ressources-triple.txt`.
