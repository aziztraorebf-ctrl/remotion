# R&D SVG — Index des protos validés

> Source d'inspiration pour les prochains Shorts SVG. Les fichiers restent dans `src/projects/_rnd/svg-scenes/`
> (ne pas déplacer — imports Root.tsx). Ce fichier = index avec verdict + lien visuel + ce que le proto prouve.
>
> Consulter AVANT de coder une nouvelle scène : si le geste existe déjà, adapter plutôt que recoder.
> Verdict : ✅ VALIDÉ (réutilisable tel quel) · ⭐ RÉFÉRENCE (meilleur exemple du registre) · ⚠️ PARTIEL (bon mais une partie à éviter) · ❌ ÉCARTÉ

---

## Protos validés — par registre

### Registre `médaille` (gravure dorée, fond ivoire)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| Ville / port | `VilleGeminiAnimee.tsx` | Gemini | RESPIRE (plans étagés, profondeur) | https://files.catbox.moe/nv6iy6.mp4 | ✅ VALIDÉ |
| Carte d'état-major | `EtatMajorGptAnimee.tsx` | GPT-5.5 | SE CONSTRUIT (flèches tracées strokeDashoffset) | https://files.catbox.moe/pt5od0.mp4 | ✅ VALIDÉ |

**Ce que ces protos prouvent** : même registre, deux natures opposées (organique vs schéma) → Gemini gagne le port, GPT gagne la carte. Règle Gemini/GPT validée ici pour la première fois.

---

### Registre `blueprint` (bleu nuit, cyan, or)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| Plateforme offshore | `OffshoreGeminiAnimee.tsx` | Gemini | SE CONSTRUIT + flux qui monte | https://files.catbox.moe/o6vxpc.mp4 | ✅ VALIDÉ |
| ⭐ Offshore + SFX timé | `OffshoreGeminiAnimeeSFX.tsx` | Gemini | idem + SFX frame-perfect | https://files.catbox.moe/s1jloa.mp4 | ⭐ RÉFÉRENCE SFX |

**Ce que ces protos prouvent** : blueprint = idéal infrastructure pétrolière/industrielle. `OffshoreGeminiAnimeeSFX` = référence pour SFX timés (pattern `<Sequence from={frame}>`, plancher 0.50).

---

### Registre `tactique` (bleu très sombre, rouge menace, or solidarité)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| ⭐⭐ Défense mutuelle AES | `DefenseGptAnimee.tsx` | GPT-5.5 | SE CONSTRUIT + DÉCLENCHE + SFX (boom-coup + liptako-gong) | https://files.catbox.moe/05xbm1.mp4 | ⭐⭐ RÉFÉRENCE TACTIQUE |

**Ce que ce proto prouve** : registre tactique = ENCART CONCEPTUEL (un pacte, un mécanisme) — PAS une carte géographique. Nœuds + liens + vecteurs. GPT-5.5 gagne ce registre clairement. Pattern "DÉCLENCHE" (transition activation brusque) prouvé ici.

---

### Registre `braise-or` (terre sombre chaude, or lumineux, braise/guerre)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| Mine d'or Darfour | `MineGeminiAnimee.tsx` | Gemini | RESPIRE (2 couches, 28s) | https://files.catbox.moe/lkf0ia.mp4 | ✅ VALIDÉ |
| ⭐ Creuset « l'or devient la guerre » | `CreusetAnimee.tsx` | GPT-5.5 | TRANSFORMATION (creuset bascule → balles émergent) | https://files.catbox.moe/yonpoq.mp4 | ⭐ RÉFÉRENCE TRANSFORMATION |

**Ce que ces protos prouvent** : `braise-or` = scènes chaudes matérées (ressource, conflit, terre africaine ardente). `CreusetAnimee` = meilleure démonstration du pattern TRANSFORMATION (un objet change de nature — réutilisable pour toute métamorphose conceptuelle).

---

### Registre `or-jour` (illustration chaude LUMINEUSE)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| ⭐⭐⭐ « Suivre l'or » Soudan HÉROS | `HeroGptAnimee.tsx` | GPT-5.5 | tomber-sec + bascule couleur + fade + fumée→ciel noir | https://files.catbox.moe/1ws3kh.mp4 | ⭐⭐⭐ RÉFÉRENCE or-jour |

**Ce que ce proto prouve** : `or-jour` = sortir du sombre dépressif et du parchemin sans tomber dans le joyeux pédagogique. Matin doré, personnage en action, lumineux et premium. GPT-5.5 gagne ce registre.

---

### Registre `papier-decoupe` (couches empilées, palette claire chaude)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| ⭐ Graine → arbre (finition complète) | `GraineGeminiAnimee.tsx` | Gemini | SE CONSTRUIT + vent + soleil actif + fruit tombe + feuilles flottent + SFX nature | https://files.catbox.moe/ft5l5g.mp4 | ⭐ RÉFÉRENCE papier-decoupe |
| « D'une graine naît un arbre » PÉDAGOGIQUE | `GraineStatic.tsx` (base) | Gemini | SE CONSTRUIT bas→haut (graine→tronc scaleY→feuillage en vagues) + 2 couches | https://files.catbox.moe/wv4xlm.mp4 | ✅ VALIDÉ |

**Ce que ces protos prouvent** : `papier-decoupe` = registre pédagogique/explainer (Kurzgesagt-papier). Gemini gagne nettement (couches organiques empilées + ombres douces = sa force atmosphérique). Pattern "SE CONSTRUIT bas→haut" avec `scaleY` sur le tronc = réutilisable pour toute croissance végétale.

---

### Registre `encre` (GGW — parchemin narratif)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| GGW B3 — Le Malentendu | `B3Malentendu.tsx` | Gemini | mur qui reste + sol mort gris + mort en cascade | voir ETAT-GGW | ⭐ RÉFÉRENCE clipPath bottom-up |
| GGW B4 — FMNR (Demi-lune) | `B4Demilune.tsx` | Gemini | souches + cambium + demi-lunes | voir ETAT-GGW | ⭐ RÉFÉRENCE souches |
| GGW B7 — Mosaïque Vivante | `B7MosaiqueFinal.tsx` | Gemini | buvard + sway + glow pulse + hachures + karaoke | voir ETAT-GGW | ⭐⭐ RÉFÉRENCE encre narrative complète |

**Ce que ces protos prouvent** : registre `encre` = canevas de colorisation sémantique timée. Monde inerte en encre → la vie/le sens apparaît en couleur au moment exact. Les techniques clipPath, buvard, sway, glow sont toutes documentées dans `techniques/`.

---

### Registre `encre` — test organique humain (résultat négatif documenté)

| Proto | Fichier source | Modèle | Résultat | Render | Verdict |
|---|---|---|---|---|---|
| Profil humain isolé | (compo dédiée) | Gemini | profil expressif (tient) | https://files.catbox.moe/4v26et.png | ⚠️ STATIQUE OK, animation délicate |
| Duo de personnages | (compo dédiée) | Gemini | geste/relation confus | https://files.catbox.moe/g7su52.png | ❌ ÉCARTÉ |
| Animal héraldique (aigle) | (compo dédiée) | Gemini | superbe (meilleur terrain organique) | https://files.catbox.moe/k3q8fp.png | ✅ VALIDÉ (emblème) |

**Décision gravée** : SVG = ABSTRAIT/SYMBOLIQUE, pas l'organique humain (uncanny). Portrait humain = vraie photo → Gemini stylise en gravure encre (`gemini-gen-image-ref.py`). Animal héraldique = exception car emblème, pas un personnage réaliste.

---

### Jetons & assets SVG en lot (GLM-5.2)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| ⭐ Jetons géopolitiques | `GisementTokensGlm.tsx` + `JetonsGlmDemo.tsx` | GLM-5.2 | planche animée (spin, scale) | https://files.catbox.moe/jmeup8.mp4 | ⭐ RÉFÉRENCE GLM |
| Flux pétrolier conceptuel | `FluxPetroleAnimee.tsx` | GLM-5.2 | flux qui circule (nodes + liens) | https://files.catbox.moe/hhftb1.mp4 | ✅ VALIDÉ |

**Ce que ces protos prouvent** : GLM-5.2 = 3e modèle complémentaire pour jetons/pictogrammes/assets en lot (5-7× moins cher que GPT/Gemini). Excellent en géométrie/technique/schéma. Faible sur l'encre/gravure → ne pas l'y envoyer.

---

### Franc CFA (mid-form SVG-insert)

| Proto | Fichier source | Modèle | Animation | Render | Verdict |
|---|---|---|---|---|---|
| ⭐ CFA + SFX (référence SVG-insert mid-form) | `CfaFrancAnimeeSFX.tsx` | GPT-5.5 | pièce tourne + bascule + logo qui disparaît + SFX | https://files.catbox.moe/i241v3.mp4 | ⭐ RÉFÉRENCE SVG-insert |

**Ce que ce proto prouve** : SVG-insert = encart court (<8s) intégré dans une mid-form Souverain. Doctrine complète : `memory/doctrines/SVG-MIDFORM-FORMAT.md`. Ce proto = référence visuelle pour les encarts pièce/jeton dans une vidéo longue.

---

## Protos écartés (ne pas reproduire)

| Proto | Raison du rejet |
|---|---|
| `MurTopDownBraise.tsx` | top-down pour GGW → mauvais registre spatial (encre narrative s'impose) |
| `GgwD3GeoMap*.tsx` | d3-geo pour GGW → trop froid, pas de colorisation narrative. Acquis réutilisable ailleurs. |
| Duo de personnages SVG | uncanny humain — voir verdict ci-dessus |

---

## Comparatifs statiques (pour choisir Gemini vs GPT)

| Scène | Lien |
|---|---|
| Ville Gemini vs GPT | https://files.catbox.moe/jzwofu.png |
| État-major Gemini vs GPT | https://files.catbox.moe/af65no.png |
| Offshore blueprint | https://files.catbox.moe/lhgojl.png |
