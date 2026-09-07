# CONCEPTS ANIMÉS AVANT LE CODE — montrer l'animation qui joue, pas la décrire

> Capacité acquise et prouvée le 2026-09-07 (chantier chill-meter). Dépasse ce contrat :
> vaut pour tout client, et pour nos propres épisodes.
> Chaîne technique : `memory/tools/minimax-h3-comfy-cloud.md`

## LE PRINCIPE

⭐ **Ne plus envoyer un concept ÉCRIT ou une image FIXE d'une animation. Envoyer 2-3
animations qui JOUENT sur le vrai décor du client, et le laisser choisir.**

Le jugement de goût se déplace AVANT le code au lieu d'après. C'est la doctrine storyboard
(`STORYBOARD-MAPBOX.md`) portée un cran plus loin : on ne montre plus un dessin de ce qu'on
fera, on montre la chose en mouvement, en contexte.

Boucle AVANT : concept écrit → le client imagine → on code → il voit → il corrige → on recode.
Boucle APRÈS : **il voit 3 concepts animés sur SON plateau → il choisit → on code UNE fois.**

## CE QUI REND ÇA POSSIBLE (mesuré le 07/09, pas supposé)

| Brique | Preuve |
|---|---|
| Gemini génère la matière | brume, glace, flocons, onde de choc — 6 assets en une session |
| H3 anime depuis notre image | gabarit `minimax-h3-r2v-graph-template.json` + `submit_workflow` |
| `mixBlendMode: screen` intègre | fond noir pur → aucun détourage, aucun coût |
| **Le seed rend la retouche chirurgicale** | matière changée (bleuté→blanc, lum 83-123 → 172-179), **mouvement identique** |
| Coût négligeable | ~0,03 $ l'image ; H3 sur le forfait ; une itération ≈ 3 min |
| La contrainte se MESURE avant de montrer | visage à 0,0 % de pixels touchés, centre à 0,0 de luminance |

## ⛔ LA FRONTIÈRE — génératif vs code (les deux sens ont été démontrés)

**Ce n'est PAS « le génératif est meilleur que le SVG ».** C'est complémentaire, et la ligne
est nette :

| | Génératif (Gemini + H3) | Code (SVG / calques / Remotion) |
|---|---|---|
| **Gagne sur** | la MATIÈRE — organique, irrégulier, volumétrique | le CONTRÔLE — densité, calage, timing exact |
| **Exemples validés** | brume, glace de bords, fumée, onde de choc | givre calé sur les vis du châssis, jauge, texte |
| **Échecs mesurés** | flocons (densité incontrôlable : +3,8 à +9,7 sur le visage contre 0,2 % en codé) · frimas (ne peut pas se caler sur un objet précis) | un `linear-gradient` cyan ne fera jamais une vraie brume |

⭐ Formule d'Aziz, plus juste que « c'est mieux » : **ça ouvre des directions qu'on n'aurait
pas pu prendre**. On AJOUTE un registre, on n'en remplace pas un.

## LES 3 AVANTAGES CONCRETS EN CONTEXTE CLIENT

1. **Une itération coûte 3 minutes**, pas une session de code.
2. **Zéro malentendu** — le client ne peut pas mal interpréter une animation qu'il regarde
   jouer sur son propre décor. (Anti-pattern vécu : 4 versions successives du bandeau
   « AbiGirl Reacts » parce qu'on tâtonnait sur une description.)
3. **On PROPOSE au lieu de deviner** — et on peut proposer une direction qu'il n'aurait pas
   su demander, ce que la doctrine « signalement et proposition proactifs » réclame déjà.

## ⛔ CE QUI RESTE VRAI MALGRÉ CETTE CAPACITÉ

- **La contrainte prime sur la beauté** : mesurer les zones protégées AVANT de juger le
  rendu. Un effet superbe qui viole une contrainte écrite est un effet mort.
  → `feedback_effet-genere-la-contrainte-prime-sur-la-beaute.md`
- **Ce qui vit SUR l'objet reste en calques** (généré depuis l'objet lui-même, pas à côté).
  → `feedback_texture-figee-gemini-extraction-avant-segmentation.md`
- Un asset payant (Bria et consorts) se teste avant d'être adopté ET avant d'être écarté :
  testé le 07/09, le `screen` gratuit fait mieux sur une matière lumineuse.
