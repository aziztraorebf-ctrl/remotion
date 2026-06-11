# Synthèse DA-BRIEF upstream Partie 2 — VÉRIFIÉE par Claude (signal, pas juge)

Réponses brutes : `/tmp/da-refs/da-warmap-p2-upstream-{gemini,kimi,deepseek}.md`.
3 voix sur un PLAN (avant code). Convergences = signal fort. Vérifié contre faisabilité stack + direction Aziz.

## ⭐ CONVERGENCE FORTE (les 3 voix) — À RETENIR, c'est l'ossature visuelle de P2

### 1. POINTS RIGIDES (ordre) SUR SURFACES FLUIDES (désordre) — l'idée maîtresse
La distinction présence FR/ONU vs jihadisme se fait par **MORPHOLOGIE**, pas par la couleur :
- **Présence FR / MINUSMA** = géométrie stricte. Symboles nets (étoile 5 branches encre, point ONU), contours
  précis, FIXES. L'institution, le rigide. Couleur sobre (bleu-acier vieilli #4A6B8A teinté multiply, PAS bleu OTAN pur).
- **Jihadisme** = organique. `<path>` SVG irréguliers (PAS cercles parfaits, PAS hachures qui moirent),
  remplissage rouge-violence #8B3A3A opacity 0.3-0.6, qui s'INFILTRE comme un liquide. PAS de bordure.
→ RECO Claude : OUI, c'est la colonne vertébrale. Abandonner les cercles/hachures pour des paths organiques.

### 2. L'EXTINCTION = RÉACTION à l'encerclement, PAS action simultanée (clé du paradoxe)
Le rouge coule SOUS les symboles de bases (z-index : rouge sous, bases dessus). Quand le rouge ENTOURE une
base → ELLE s'éteint (fill 100%→0%, ne garde que le contour encre). On VOIT la cause (encerclement) puis l'effet
(extinction). = "l'échec malgré les moyens" raconté SANS un mot. Les bases restent visibles mais éteintes =
**cage refermée** (Kimi), pas défaite nette. → RECO Claude : OUI, fort. C'est LE rendu de ta direction "effort/échec".

### 3. Beat 2.4 — SÉQUENCER, ne PAS tout lancer à 100% simultané (anti-surcharge)
Hiérarchie temporelle (z + délai), pas 3 infos à priorité égale :
1. timeline défile (tempo, filigrane opacity 0.4) → 2. rouge s'étend dans les campagnes (pulsation lente) →
3. extinction des bases 1 à 1 (délai ~15f, synchro quand timeline passe 2015/2018...).
L'œil attrape : l'éclat qui s'éteint (drame) → le rouge qui grignote (menace) → la date (contexte).
→ RECO Claude : OUI. Ma direction validée (timeline+rouge+extinction) reste, mais SÉQUENCÉE pas simultanée.

### 4. Caméra = chef d'orchestre du regard (les 3 voix)
Push-in sur une base singularisée (ex Tessalit) pendant que les autres s'éteignent en périphérie ; pull-back
pour l'expansion ; glissement (pan) sud quand le rouge déborde au Burkina. Évite la dispersion. → RECO : OUI (déjà notre grammaire).

### 5. Anti-biais pro/anti-FR (les 3 voix) : extinction ANALYTIQUE, pas pathos
PAS de "fade poétique" ni de glow héroïque ni de drapeaux FR. Marqueurs neutres (étoiles noir/blanc).
Extinction = simplification géométrique (Kimi : l'étoile perd ses branches une à une → point → disparaît) ou
désaturation + petit "×" discret (DeepSeek). Le rouge ne "gagne" pas (pas d'anim victorieuse), il REMPLIT
mécaniquement le vide. → RECO Claude : OUI. Étoile qui perd ses branches = idée forte et analytique.

## ✅ AUTRES POINTS VRAIS (à appliquer)
- Transition P1→P2 : push-in continu, les villes touchées de P1 deviennent les points où s'installent les bases
  (continuité causale : là où la violence a frappé, l'étranger s'installe). PAS de cut.
- GeoConvergence (2.2) : SOBRE. 5-6 lignes fines pointillées (tracé état-major) depuis les voisins, stroke-dashoffset,
  encre 50%, fade-out à l'arrivée au centre. PAS de flèches épaisses/fluo. Overlay justifié (idée abstraite).
- Labels villes : encre + halo parchemin (DÉJÀ FAIT en 8b). Dates en petites capitales serif.
- Respiration après 2.4 (climax) : 2s de carte qui "respire" (rouge étendu + bases éteintes) avant de glisser au Burkina.
- Repères temporels SUR la carte près des zones (un "2015" flottant près du Burkina), pas que sur la timeline du bas.

## ⚠️ DIVERGENCE / À TRANCHER (goût Aziz)
- Couleur présence FR : DeepSeek/Kimi proposent bleu-acier vieilli #4A6B8A. Gemini propose gris-fer. Les deux
  marchent. Reco Claude : bleu-acier #4A6B8A teinté (distinct du bleu-ONU MINUSMA plus clair, et du rouge).
- Extinction : "perd ses branches" (Kimi, élégant mais plus de code) VS "désaturation + ×" (DeepSeek, plus simple).
  Reco Claude : désaturation + opacity↓ d'abord (simple, lisible), garder "perd ses branches" en option si le temps.

## ❌ À IGNORER / déjà réglé
- "Supprimer les hachures de l'image 2" : c'est la Partie 1 (déjà validée), pas P2. Hors-scope.
- Suggestions de polices custom (EB Garamond etc.) : on garde Cormorant Garamond (déjà en place, cohérent).
