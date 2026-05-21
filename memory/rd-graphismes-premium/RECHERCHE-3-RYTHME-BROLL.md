# R&D Graphismes Premium — Recherche 3
## Sujet : Rythme intensif — comment mixer data + B-roll + motion graphics pour la rétention
## Date : 2026-05-20
## Méthode : last30days (Reddit + X + TikTok + Polymarket) + WebSearch
## Script : 82 threads Reddit · 10 posts X · 4 vidéos TikTok · 20 pages Web

---

## 1. La règle de rythme 2026 — version complète et affinée

### Règle granulaire (plus précise que ce qu'on avait)
- **Changement visuel toutes les 3-5 secondes** pour du contenu éducatif
  (Recherche 1 disait 5-7s — la Recherche 3 affine : 3-5s pour le format explicatif)
- Tout compte comme changement visuel : B-roll, texte overlay, zoom, cut, graphique animé

### Structure en 3 zones — documentée AIR Media-Tech + Video Editors Anonymous

| Zone | Durée | Énergie | Technique |
|------|-------|---------|-----------|
| **Zone A — Hook** | 0-3 min | Haute, cuts fréquents | Changement toutes les 3-5s, visuels dynamiques |
| **Zone B — Développement** | 3-7 min | Stabilisée | B-roll contextuel plus long, moins de cuts |
| **Zone C — Relance** | Après 8 min | Pics ponctuels | Data pop-ups, inserts émotionnels, récap rapide |

### Pattern interrupt — règle précise
- **Toutes les 60-90 secondes** : B-roll, angle nouveau, graphique, ou récap rapide
- Ce n'est pas une suggestion : c'est le seuil au-delà duquel le cerveau décroche

---

## 2. La règle du B-roll — révision complète

### Ce que le B-roll N'est PAS
- Un fond pour meubler les silences
- Un habillage visuel décoratif
- Une séquence de remplacement quand on n'a pas de carte

### Ce que le B-roll EST — per @kickassvargas (252 likes) + insidetheedit.com
**"B-roll is an emotional delivery system."**

> "Fast editing while still maintaining clarity, geography, and — most importantly — story.
> The editor stays on shots where the camera is making intentional movement."
> — @kickassvargas

La formule : **Horizontal narrative + Vertical emotional alignment = storytelling**
- Horizontal = la chronologie de l'histoire (ce qui se passe)
- Vertical = la résonance émotionnelle de ce qui se passe (comment ça fait sentir)
- Le B-roll opère sur l'axe vertical : il amplifie le poids d'une phrase sans la répéter

### Application pratique pour GéoAfrique
Quand la voix-off dit "les revenus pétroliers n'ont jamais atteint les populations" :
- Mauvais B-roll : une carte de pétrole, un graphique de revenus
- Bon B-roll : un village sans électricité, des enfants à l'école de brousse, des mains vides

---

## 3. La règle du cut timing selon le registre émotionnel

### Per @tryahdd (X) — règle fondamentale non documentée ailleurs
> "The cut timing matters as much as the clip itself.
> If your script is slow and emotional → longer clips, slower cuts, let the footage breathe.
> If your script is fast and punchy → short cuts, match the energy."

### Traduction en termes Remotion/beats

| Registre du script | Durée clip/séquence | Type de cut | Équivalent Remotion |
|-------------------|---------------------|-------------|---------------------|
| Émotionnel, grave | 4-8 secondes | Fondu lent | spring damping 80+ |
| Factuel, informatif | 2-4 secondes | Cut sec | interpolate linéaire |
| Dynamique, révélation | 0.5-2 secondes | Cut rapide + son | spring stiffness 200+ |

---

## 4. La règle "stat à l'écran" — obligatoire

### Per AIR Media-Tech (source la plus citée sur la rétention 2026)
> "Si ta narration mentionne un chiffre spécifique, montre ce chiffre à l'écran simultanément."

- Les chiffres à l'oral sans visuel = -40% de mémorisation
- Bold ou colored text = ancrage visuel qui re-engage les viewers
- Particulièrement critique pour le contenu finance et géopolitique (notre cible exacte)

### Ce qu'on fait déjà (✅) vs ce qui manque
| Élément | Notre stack | Statut |
|---------|------------|--------|
| CountUp animé | CountUp.tsx | ✅ |
| Badge informatif | Badge.tsx | ✅ |
| Stat + narration simultanés | timing.ts audio-ancré | ✅ |
| Bold/colored text highlight | Tailwind text-gold | ✅ |
| Stat persistante à l'écran | Baseline.tsx | ✅ partiel |

---

## 5. Cartes = moteur de rétention géopolitique — validé

### Rizzle (source éditoriale)
"Maps Are The Powerhouse of YouTube Success For Geopolitics Daily"
→ Notre pari Mapbox n'est pas un choix technique arbitraire — c'est le facteur #1 de rétention dans notre créneau

### MapStory — arxiv 2505.21966 (mai 2026, ACM UIST 2026)
"LLM-Powered Text-Driven Map Animation Prototyping with Human-in-the-Loop Editing"
→ La recherche académique travaille sur exactement notre problème
→ Architecture clé : **modular animation design** — chaque bloc carte est indépendant, un changement ne perturbe pas le reste
→ C'est ce que nos beats font déjà avec `<Sequence>` Remotion

### Rôle des cartes dans la structure de rythme
Les cartes ne remplacent pas le B-roll — elles occupent un rôle différent :

| Type de visuel | Rôle narratif | Fréquence recommandée |
|---------------|--------------|----------------------|
| Carte animée Mapbox | Ancrage géographique, "où" | 1x par acte narratif (~30-60s) |
| Data overlay (stat) | Ancrage factuel, "combien" | À chaque chiffre clé |
| B-roll terrain | Ancrage émotionnel, "quoi ça fait" | 20-30% du temps écran |
| Motion graphics (titre, badge) | Ancrage éditorial, "quoi penser" | Ponctuel (hooks, conclusions) |

---

## 6. Le gap B-roll — notre seul vrai manque

### Ce que les créateurs documentaires ont et nous n'avons pas
- Stock footage terrain (Artgrid, Pexels, Envato) : vraies images de terrain contextuel
- @collectorstock (TikTok) : "3 websites pour footage qui coûte pas cher" — marché actif
- Ce footage représente **20-30% du temps écran** dans les vidéos haute rétention

### Solutions envisageables avec notre stack

| Solution | Effort | Qualité | Coût |
|----------|--------|---------|------|
| Seedance i2v — simuler B-roll depuis image Gemini | Moyen | Acceptable | ~$0.10/clip |
| Kling i2v — B-roll contextuel animé | Faible | Bon | ~$0.50/clip |
| Envato stock video géopolitique | Zéro | Variable | $16-49/mois |
| Pexels/Videvo — géopolitique gratuit | Zéro | Limité | Gratuit |

**Recommandation** : Envato Elements pour le stock footage terrain (déjà dans notre stack pour les templates). Le contenu géopolitique y est disponible (confirmé WebSearch : "Royalty-Free Geopolitics Videos - Envato").

---

## 7. Synthèse applicative — ce qu'on doit changer dans nos beats

### Règles à appliquer immédiatement

**R1 — 3-5s (pas 5-7s)** : chaque beat doit avoir un changement visuel toutes les 3-5 secondes
→ Glow et float ne comptent PAS (déjà dans CLAUDE.md mais la règle est plus serrée que prévu)

**R2 — B-roll émotionnel 20-30%** : prévoir au moins 1 séquence B-roll par beat > 15 secondes
→ Solution immédiate : Kling i2v depuis image Gemini contextuelle

**R3 — Cut speed = registre script** : avant de coder un beat, lire le registre émotionnel du segment audio
→ Beat factuel → spring damping 80+, Beat révélation → stiffness 200+

**R4 — Stat simultanée obligatoire** : tout chiffre énoncé en voix-off doit apparaître à l'écran au même instant
→ Vérifier timing.ts : le frame du CountUp = le frame exact du mot dans la voix-off

**R5 — Pattern interrupt 60-90s** : dans tout beat > 90 secondes, prévoir un cut de registre différent
→ Beat1 Sénégal (43s) : pas concerné. Futur Beat complet (> 2 min) : obligatoire.

---

## 8. Sources

| Source | Plateforme | Engagement | Signal |
|--------|-----------|------------|--------|
| @kickassvargas | X | 252 likes | B-roll = système émotionnel |
| @tryahdd | X | 4 likes (très récent) | Cut timing = miroir du registre |
| @piyascode9 | X | 27 likes | Blueprint editing documentaire |
| @sonduckfilm | TikTok | 12 856 vues | Tuto documentary motion graphics |
| AIR Media-Tech | Web | — | Advanced retention editing 2026 |
| Video Editors Anonymous | Web | — | Secret formula addictive videos |
| insidetheedit.com | Web | — | B-roll structure pro |
| Rizzle | Web | — | Maps = moteur YouTube géopolitique |
| arxiv 2505.21966 | Web | ACM UIST 2026 | MapStory — LLM map animation |
| Virvid / Fluxnote | Web | — | Benchmarks rétention YouTube 2026 |
