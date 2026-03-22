# Sassou Nguesso Short - Image Generation Prompts

## Style Reference
Match the existing portrait style: editorial illustration, flat bold colors,
strong graphic shapes, high contrast, dark palette with gold/amber accents.

---

## IMAGE 1: Vue aerienne Brazzaville

### Prompt ChatGPT / NanoBanana:

> Aerial view of Brazzaville, Republic of the Congo, at golden hour. Editorial illustration style with flat bold colors and strong graphic shapes. The Congo River visible in the background separating Brazzaville from Kinshasa. Modern buildings mixed with older neighborhoods. Dark atmospheric mood, dramatic lighting with golden sunlight breaking through clouds. Color palette: deep navy, charcoal, warm gold and amber highlights. No text, no labels, no watermarks. Vertical format (1080x1920). High contrast, clean vector-inspired look matching a geopolitical briefing aesthetic.

### Variante plus sombre (alternative):

> Dark dramatic aerial view of a Central African capital city at dusk. Editorial illustration, flat bold vector style. Dense urban landscape with a wide river in the background. Moody atmosphere, deep shadows, isolated golden light sources from street lamps and windows. Color palette: near-black, deep navy, scattered amber/gold points of light. No text, no labels. Vertical format (1080x1920). Style: modern geopolitical documentary.

### Usage dans Remotion:
- Background layer pour Beat 3 (constitution)
- Ken Burns lent zoom-in
- Overlay texte constitutionnel anime par-dessus
- Possible dark vignette animee sur les bords

---

## IMAGE 2: Foule de jeunes (Beat final)

### Prompt ChatGPT / NanoBanana:

> Silhouettes of a crowd of young African people seen from behind, looking toward a bright golden horizon. Editorial illustration style, flat bold shapes, minimal detail on individuals. The crowd fills the lower two-thirds of the frame. Sky transitions from deep dark navy at top to warm golden amber at the horizon line. Some raised fists and raised phones visible in silhouette. No faces visible (all seen from behind). No text, no labels, no watermarks. Vertical format (1080x1920). Style: powerful, hopeful, documentary editorial.

### Variante (plus graphique, plus animable):

> Stylized crowd of young people in flat vector silhouettes against a gradient background transitioning from black at top to bright gold at bottom. Seen from behind, facing the light. Varying heights, some with raised fists. Minimal detail, strong graphic shapes. The silhouettes are pure black/dark navy, cleanly separated from the golden background. No text, no faces. Vertical format (1080x1920). Clean separation between foreground silhouettes and background for easy compositing.

### Usage dans Remotion:
- Background layer pour Beat 6 (perspective humaine)
- Parallax: foule layer avance lentement, horizon reste fixe
- Texte "60% ont moins de 25 ans" apparait en spring() par-dessus
- Possible: particules dorees montant depuis l'horizon (pure Remotion)
- Fondu progressif vers noir pour la question finale
- La variante "plus graphique" est recommandee: separation nette silhouettes/fond
  permet d'animer independamment les layers dans Remotion

---

## NOTES TECHNIQUES

### Format de sortie
- Toujours demander **vertical 1080x1920** (format Short)
- PNG avec fond si couleur unie, PNG transparent si besoin de compositing
- Pour la foule: demander la variante avec **separation nette** entre silhouettes et fond

### Coherence de style
- Palette commune: noir, navy profond, or/ambre, blanc
- Style: editorial illustration, flat bold, high contrast
- Jamais de texte bake dans l'image (tout texte = Remotion)
- Pas de details photo-realistes: rester dans le graphique/vectoriel

### Animabilite dans Remotion
- Images = canvas statiques
- Tout mouvement = code Remotion (spring, interpolate, parallax)
- Prevoir des zones libres pour le texte anime (haut et centre de l'image)
