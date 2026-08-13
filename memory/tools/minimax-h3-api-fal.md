# MiniMax H3 — API fal.ai (payante, fallback)

> Fichier scindé depuis `minimax.md` le 2026-08-13. Sommaire général : `minimax.md`. Voie principale (gratuite, Comfy Cloud) : `minimax-h3-comfy-cloud.md` — toujours essayer en premier.
> Contenu : endpoint fal.ai `minimax/h3/image-to-video`, ~1.30$/5s, à utiliser seulement si Comfy Cloud est down/saturé.

## MiniMax H3 — image-to-video via API fal.ai (payant, validé 2026-08-06)

⚠️ Ne pas confondre avec Minimax Music/TTS ci-dessous — H3 est un modèle **vidéo**, sorti fin
juillet/début août 2026, testé pour la première fois sur le projet Flowdesk (_client-sim, registre
personne/émotion, panneaux "Chaos" et "Bascule" — voir `src/projects/_client-sim/flowdesk/`).
**Depuis le 2026-08-08, préférer la voie Comfy Cloud ci-dessus (même modèle, gratuit)** — garder
cette section pour le fallback si Comfy Cloud est indisponible, ou pour le tier 2K/Context-IR
non-open (variantes `api_minimax_h3_*` sur Comfy Cloud consomment aussi des crédits, donc revenir
ici reste équivalent en coût si le 2K est strictement nécessaire).

- **Endpoint** : `minimax/h3/image-to-video` (fal.ai)
- **Coût observé** : ~$1.30 pour 5s de vidéo en 2K
- **Usage validé** : anime une image statique (silhouette flat-design SVG-like) en gardant
  fidèlement le style d'origine — contrairement à Recraft qui ne produisait que des blocs SVG
  rigides non-animables par partie. Résout le blocage "personnage ne peut pas être animé via
  vectoriel" identifié dans une session antérieure.
- **⛔ Pas de lecture inversée native** (limitation Remotion ET navigateur, pas spécifique à H3) —
  pour un effet ping-pong (aller-retour en boucle), pré-générer la vidéo inversée via
  `ffmpeg -vf reverse` puis alterner/concaténer les deux fichiers en `<Sequence>` Remotion. Ne
  jamais tenter un `playbackRate` négatif au runtime, ça ne marche pas.
- Fichiers de référence dans le repo : `src/projects/_client-sim/flowdesk/videoPingPong.ts`
  (wrapper Remotion ping-pong) et `src/projects/_client-sim/flowdesk/test-minimax-h3/` (itérations
  de test v1→v9).
- **⭐ Personnage récurrent sur plusieurs plans : UNE SEULE image de référence, réutilisée comme
  input à chaque appel H3** — ne jamais régénérer une nouvelle image de référence par plan/scène
  pour le même personnage (risque de dérive visuelle, le personnage ne se ressemble plus d'un
  plan à l'autre). Tranché explicitement par Aziz sur NorthShield (2026-08-07, personnage Sarah
  sur 3 plans). H3 est *image-to-video* (pas un prompt texte pur comme Seedance) : l'image de
  référence doit être générée en amont (Gemini/Recraft) avant tout appel H3. Vaut aussi pour la
  voie Comfy Cloud ci-dessus (le paramètre R2V `ref_images` fonctionne identiquement).
- **⭐ Gotcha "objet mécanique sans articulation visible" (barrière, levier, interrupteur)** :
  détail complet + exemples avant/après dans `.claude/agent-memory/visual-producer/GOTCHAS-TOOLS.md`
  — en résumé, un verbe d'impact seul ("stops abruptly", "closes abruptly") produit un clip figé
  ou un simple changement de lumière, PAS de mouvement mécanique ; il faut comparer explicitement
  à un objet mécanique réel connu ("swinging down fast like a real parking-lot barrier arm") pour
  que H3 improvise une trajectoire physique cohérente.
- Choisi pour son coût (le moins cher testé pour ce registre personne/émotion à date) — pas
  verrouillé : tester d'autres générateurs vidéo (Seedance, etc.) si H3 échoue sur un cas donné.

