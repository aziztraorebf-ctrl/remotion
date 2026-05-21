---
name: STARTER PROMPT — Session Atlas Tombouctou
description: Prompt copier-coller pour demarrer la prochaine session Claude Code de production Atlas Tombouctou (style Parchemin Mande)
type: reference
---

# STARTER PROMPT — Session Atlas Tombouctou (a copier-coller au demarrage)

> Cree : 2026-04-28
> Usage : copier le bloc ci-dessous au debut d'une nouvelle session Claude Code sur PC.
> Le prompt charge automatiquement tout le contexte necessaire pour reprendre exactement ou on s'arrete.

---

## LE PROMPT (copier le bloc ci-dessous integralement)

```
Charge la memoire de session Atlas en lisant ces 5 fichiers dans l'ordre :

1. memory/MEMORY.md (index general - section "NOUVEAU TERRITOIRE - CHAINE GEOAFRIQUE")
2. memory/NEXT-SESSION-atlas-mali-tombouctou.md (brief complet de cette session)
3. memory/templates/script-atlas-v1.md (template script methode complete)
4. quebec-jacques-poc/scripts-atlas/script-tombouctou-v1.md (script brouillon valide)
5. quebec-jacques-poc/research/FACT-CHECK-CONVERSATION.md (verifications + rectifications)

Session : production video pilote Atlas Tombouctou.

Contexte rapide :
- Chaine YouTube en construction : Geoafrique, hors politique
- Format Atlas (densite Cesar, geo + richesse-record)
- Pilote : Tombouctou (mini-serie avec Mali en episode 2)
- Style choisi : B Parchemin Mande (option deja figee)
- Stack : Remotion 4 + mapbox-gl 3.22 + react-map-gl 8.1 + Gemini 3.1 Flash Image Preview
- Tout l'environnement est setup (.env contient toutes les keys necessaires)
- Cout mensuel estime : ~$33-48/mois (Mapbox gratuit, ElevenLabs $22, Gemini $5-15)

Reference visuelle cible (style Parchemin Mande) :
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/B-parchemin-mande.png

Decisions FIGEES (ne pas rediscuter sauf demande explicite) :
- Style B Parchemin Mande
- Pilote Tombouctou
- Audience francophonie mondiale + diaspora bilingue
- Bootstrap 6 mois accepte

PREMIERE ETAPE de cette session : coder mapbox-styles/atlas-parchemin-mande.json (estime 4-8h).

ATTENTION risque technique a valider en debut de session :
- Performance Remotion + Mapbox-GL en headless mode (GPU disabled par defaut)
- Test concrete a faire avant de tout coder : 1 frame Mapbox custom doit prendre <10s sur Mac avec config chromiumOptions.gl: "angle-egl"
- Si >30s/frame en headless = pivot vers strategie pre-render Mapbox en images statiques

Process attendu :
1. Tu confirmes que tu as lu les 5 fichiers
2. Tu fais le test technique perf Mapbox+Remotion (1 frame statique) AVANT le style.json
3. Selon le resultat : code style.json OU pivot strategie pre-render
4. Aziz upload sur studio.mapbox.com, recoit Style ID, le donne dans la conversation
5. Mini-render 5s validation
6. Iterations si necessaire
7. Decoupage scene-par-scene Tombouctou

Demarre par confirmer la lecture des 5 fichiers et propose le test perf en premier.
```

---

## Notes pour Aziz (NON-COPIER dans le prompt — contexte personnel)

### Ce que ce prompt fait pour toi

1. **Charge automatiquement** tous les fichiers memoire pertinents
2. **Rappelle Claude des decisions figees** pour eviter qu'il rediscute
3. **Identifie le risque #1** (perf Mapbox headless) pour le valider en debut
4. **Donne l'ordre d'execution** (test perf d'abord, code ensuite)
5. **Fournit la reference visuelle** Vercel pour le style cible

### Pourquoi tester la perf en premier

Si Mapbox+Remotion est trop lent en headless (>30s/frame), on perd des heures a coder un style.json qui ne pourra jamais etre rendu. Mieux vaut decouvrir le probleme en 30 min de test qu'apres 8h de code.

### Si le test perf echoue

Pivot vers : pre-render Mapbox en sequence d'images statiques (puppeteer + screenshots)
puis Remotion compose ces images comme video. C'est moins elegant mais ca marche.

### Liens de reference rapide

- **Index recherche complet** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/index.html
- **Brief NEXT SESSION** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/next-session-atlas-mali-tombouctou.html
- **Fact-check** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/fact-check-conversation.html
- **Comparison styles** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/comparison.html
