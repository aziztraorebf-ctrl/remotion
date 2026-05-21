---
name: Protocole recherche trending — avant toute pré-production Souverain
description: Recherche données-first last 30 days AVANT de choisir un sujet. Évite le confirmation bias. Étape 0 obligatoire de toute pré-production Souverain.
type: project
---

## Règle fondamentale

**Ne jamais partir d'une idée puis chercher des preuves qu'elle est bonne.**
Partir des données brutes, laisser les données choisir ou confirmer le sujet.

---

## Étape 0 — Protocole trending (30 min max, avant fact-check)

### Outils à utiliser dans l'ordre

**1. Perplexity sonar-pro — filtre temporal last 30 days**
```
Prompt : "Quels sujets liés à [l'Afrique / ressources africaines / géographie africaine]
ont généré le plus d'engagement ou de couverture médiatique grand public
au cours des 30 derniers jours ? Inclure : articles viraux, discussions Reddit,
tendances YouTube, tweets avec fort engagement. Exclure : presse spécialisée mining/finance uniquement."
```
Répéter avec angles différents : géopolitique, ressources, géographie, économie.

**2. Google Trends — last 30 days, comparaison régions**
- Requêtes à tester : sujet candidat + mots-clés alternatifs
- Régions cibles : France, Canada, USA, UK, Afrique francophone
- Chercher : spike récent ou tendance haussière stable

**3. Reddit — recherche manuelle last 30 days**
- Subreddits cibles : r/worldnews, r/geopolitics, r/MapPorn, r/Africa, r/europe
- Filtre : "top" last month
- Signal fort : thread >200 commentaires avec participation non-diaspora visible

**4. YouTube — recherche autocomplete + vues récentes**
- Taper le sujet candidat dans la barre de recherche YouTube
- Regarder les suggestions autocomplete = demande réelle
- Vérifier si des vidéos récentes (<6 mois) sur ce sujet font >100K vues

**5. TikTok — autocomplete search bar**
- Taper 2-3 mots-clés du sujet
- Les suggestions = ce que les gens cherchent activement en ce moment

---

## Grille de décision post-recherche

| Signal | Fort (2pts) | Moyen (1pt) | Faible (0pt) |
|--------|-------------|-------------|--------------|
| Perplexity last 30 days | Spike récent + couverture grand public | Mentions occasionnelles | Absent ou seulement spécialisé |
| Google Trends | Spike ou hausse stable | Flat mais existant | Déclin ou absent |
| Reddit engagement | Thread >200 comm, non-diaspora | Thread <200 comm | Absent |
| YouTube demande | Autocomplete + vidéo récente >100K | Autocomplete seulement | Absent |
| TikTok autocomplete | Suggestions immédiates | Suggestions avec effort | Absent |

**Score ≥ 7/10 : lancer sans hésiter**
**Score 4-6/10 : reformuler l'angle, retester**
**Score < 4/10 : changer de sujet**

---

## Cas d'usage : sujet pré-identifié vs sujet découvert

**Sujet pré-identifié** (ex: Zimbabwe lithium) :
→ Utiliser le protocole pour confirmer ou invalider. Si score <4 = pivoter même si l'idée semblait bonne.

**Sujet découvert par les données** :
→ Lancer le protocole sans sujet en tête. Laisser les données faire remonter 3-5 candidats. Choisir selon : score trending + fit format Souverain + valeurs éditoriales.

---

## Intégration dans le workflow production

Ce protocole est **l'Étape 0** — avant le fact-check Perplexity, avant le script, avant tout.

Ordre complet :
0. **Trending research** (ce protocole) — 30 min
1. Fact-check Perplexity sonar-pro sur faits clés
2. Script 140 mots → validation Aziz
3. TTS → ffprobe → timing.ts
4. Storyboard → validation Aziz
5. Production Remotion

**Why:** Partir d'une idée puis chercher des preuves = confirmation bias. Les meilleures vidéos surfent une demande existante, elles ne la créent pas.
