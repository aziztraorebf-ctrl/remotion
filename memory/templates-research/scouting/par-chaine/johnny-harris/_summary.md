# Johnny Harris — Synthèse scouting (3 vidéos)

Date : 2026-05-08
Status : COMPLET

## Vidéos analysées
1. How Europe Stole Africa so Quickly, Mapped (LjieOlWXwTw, 28:29) — 7 frames
2. China's Rush Into Africa, Explained (aJSD8XV3qzE, 15:30) — 3 frames
3. The World's Most Ignored War Explained (yczYThn4nDI, 28:12) — 4 frames

Ratio live action / motion design moyen : ~58% live / ~42% motion design.
Confirmation hypothèse : Johnny Harris = présence forte du présentateur, MAIS quand il fait du motion design c'est une signature unique au monde.

## Verdicts par axe
- **Palette** : 🟢 (sur v1+v3, signature paper ivoire `#E8E0CD` + accents terracotta/rouge `#C82828` + hachures graphite — COHÉRENT et distinct de Souverain Or Africain qui est noir+or)
- **Assets** : 🟢 (cartes papier hatched scannées, frontières dessinées au stylo bille, marqueur fluo highlighter, légendes serif XIXe — chaque asset a une raison d'être "carnet de reporter")
- **Caméra** : 🟢 (handheld micro-shake permanent 2-4px = SIGNATURE ABSOLUE, ken burns lent + tilt 5-10° "carte sur bureau", reveal progressif tracés "marqueur qui dessine")

## Verdict global : 🟢

## Top 3 backlog (à intégrer dans backlog templates Souverain)
1. **Texture papier vivant + handheld permanent** : la combinaison d'un grain papier qui breathe (cycle 8-12 frames) + micro-shake 2-4px sur cartes Mapbox = effet "documentaire intimiste". Recette Remotion : composition Mapbox figée → screenshot frame-by-frame → overlay texture papier scannée en `mix-blend-mode: multiply` → wrapper avec random translate noise. Faisabilité tech : moyenne (overlay multiply trivial, micro-shake = `random` seedé sur frame).
2. **Tracés rouges dessinés progressivement** : reveal d'un trajet géopolitique en simulant un marqueur permanent. Stroke-dasharray animé sur SVG path + léger jitter + bavure aux extrémités via filtre SVG `feTurbulence`. Réutilisable directement pour Souverain (route export uranium Niger, route or Mali, etc.). 10/10 priorité.
3. **Légendes serif XIXe + cadres ornementés** : typographie Caslon/Garamond avec carrés couleur miniatures, posée en bas-droite des cartes. Signe le ton "rigueur académique vintage". Polices Google : Cormorant Garamond, IM Fell DW Pica, Cardo. À combiner avec hachures = look unique.

## Template "carnet de reporter / texture organique" potentiel ?

**OUI — fortement.** Ce style mérite un template dédié, distinct de B (Carto Caspian, vector clean géopol) et D (WonderWhy beige, illustratif vector).

**Proposition Template F — "Carnet Reporter"** :
- Palette signature : ivoire papier `#E8E0CD` + rouge terracotta `#C82828` + hachures graphite `#4A4540` + accents territoires désaturés (kaki, rose poussiéreux, bleu eau)
- Texture obligatoire : grain papier scanné (multiply), micro-shake handheld 2-4px sur tout
- Cartes : hachures crayon (PixelLab ou texture Procreate exportée), frontières stylo bille tracé manuel, ZÉRO frontière vector clean
- Typo : Garamond/Caslon pour labels carte, slab serif antique pour titres
- Mouvements : ken burns lent + tilt 5-10°, push-in vers détail, reveal "marqueur qui dessine"
- Ton narratif compatible : intimiste, "je te raconte ce que j'ai trouvé", Type B Souverain (gap francophone, autorité par sources, pas par démonstration spectaculaire)
- Différenciateur clé vs B Caspian : Caspian = pro-investor géopol clean | F Carnet = reporter terrain authenticité

**Faisabilité Souverain** :
- Stack actuel (Remotion + Mapbox GL JS + Gemini i2i) compatible. Mapbox génère carte base claire → overlay textures + hachures via Gemini i2i frame par frame OU layer Remotion en multiply blend.
- Coût : modéré. Le gros chantier = curer une bibliothèque de textures papier/hachures réutilisables (1 session R&D).
- Premier épisode test idéal : sujet à forte composante territoriale documentaire (mines uranium Niger, contrebande or Mali, blocus carburant) — pas un sujet abstrait économique.

## Recommandation
Ajouter Template F "Carnet Reporter" dans `memory/templates-research/` avec backlog R&D dédié. Avant de l'utiliser sur un épisode, faire 1 session POC technique : tester l'overlay texture multiply + micro-shake handheld sur une composition Mapbox existante (Or Africain Beat 2 par exemple) pour valider que le rendu "respire" comme chez Harris. Ne PAS créer le template à partir de rien — partir d'une comp validée et y appliquer la couche carnet.

## Chemin
`memory/templates-research/scouting/par-chaine/johnny-harris/_summary.md`
