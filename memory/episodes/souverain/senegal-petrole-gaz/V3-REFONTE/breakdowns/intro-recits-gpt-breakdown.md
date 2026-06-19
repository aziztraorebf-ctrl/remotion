{
  "scene": "La pièce biface : malédiction ou miracle pétrolier",
  "duree_estimee_s": 8.5,
  "pivot_central": {
    "objet": "Pièce-médaille 3D biface",
    "description_visuelle": "Une grande pièce dorée au centre, traitée comme un jeton de destin géopolitique. Face A : rouge crise #b23a2e avec pictogramme de plateforme pétrolière et texte circulaire LA MALÉDICTION. Tranche centrale : pièce vue de profil avec crénelage doré. Face B : or #e7bd78 avec icône institutionnelle sénégalaise stylisée, drapeau, bâtiment officiel, et une fissure noire diagonale. Texte circulaire LE MIRACLE.",
    "comment_anime": "La pièce arrive légèrement hors champ gauche, se stabilise en face rouge, pivote en rotateY avec perspective CSS/SVG de 0 à 90 degrés, devient une tranche fine crénelée au milieu, puis termine en face dorée à 180 degrés. Chaque bascule utilise spring() avec overshoot léger, jamais linéaire. L’image clé précède les accents de voix d’environ 0.5 seconde."
  },
  "background": {
    "couleur": "#16213a",
    "texture": "grain fin animé, vignette sombre, grille cartographique très subtile à 8% d’opacité, séparation verticale dorée très fine pendant les phases triptyque",
    "evolution": "Le fond reste navy premium mais se réchauffe légèrement pendant la tranche centrale avec un halo or derrière la pièce. Au début, une lueur rouge crise monte depuis le bas gauche. À la fin, la vignette se resserre et la fissure projette une ombre froide."
  },
  "etapes": [
    {
      "t_relatif_s": [
        0,
        0.6
      ],
      "nom": "Pré-roll tension documentaire",
      "ce_qui_apparait": "Fond navy, grain, grille cartographique faible, léger halo rouge au bas gauche. Les séparateurs verticaux dorés suggèrent le storyboard en trois actes mais restent presque invisibles.",
      "position": "full frame",
      "animation": "fade in par spring() opacity 0 vers 1, scale background 1.03 vers 1.0, easing spring damping 18 stiffness 90",
      "couleur": "#16213a",
      "texte": ""
    },
    {
      "t_relatif_s": [
        0.6,
        1.4
      ],
      "nom": "Annonce BEGINNING",
      "ce_qui_apparait": "Titre serif ivoire BEGINNING en haut gauche, tracking large, ombre noire douce. Il précède la voix qui évoque la promesse pétrolière d’environ 0.5 seconde.",
      "position": "top left",
      "animation": "slide vertical -18px vers 0px + fade, spring() damping 16 stiffness 110, micro overshoot sur letter-spacing",
      "couleur": "#f5ead2",
      "texte": "BEGINNING"
    },
    {
      "t_relatif_s": [
        0.9,
        2.2
      ],
      "nom": "Face rouge : la malédiction",
      "ce_qui_apparait": "Grande pièce rouge et or entrant depuis la gauche, partiellement coupée au bord au début puis centrée à 38% de la largeur. Face visible : pictogramme plateforme pétrolière, vagues, cercle doré, texte courbe LA MALÉDICTION.",
      "position": "left center",
      "animation": "slide x -260px vers 0px, rotateZ -4deg vers 0deg, scale 0.92 vers 1.0, spring() damping 14 stiffness 120. Relief simulé par ombres SVG et filters drop-shadow.",
      "couleur": "#b23a2e",
      "texte": "LA MALÉDICTION"
    },
    {
      "t_relatif_s": [
        1.5,
        2.6
      ],
      "nom": "Chiffre de crise",
      "ce_qui_apparait": "Typographie rouge crise en bas gauche, très grande, fragments de chiffres et devise évoquant une dette ou un coût. À droite du chiffre, le mot CRISE en ivoire apparaît comme un tampon éditorial.",
      "position": "bottom left",
      "animation": "compteur frame-driven avec spring() sur value, révélation par mask vertical, puis stamp scale 1.18 vers 1.0 avec spring() damping 11 stiffness 160",
      "couleur": "#b23a2e",
      "texte": "COÛT\\n300 M$\\nCRISE"
    },
    {
      "t_relatif_s": [
        2.2,
        3.1
      ],
      "nom": "Glissement vers le doute",
      "ce_qui_apparait": "La pièce rouge se décale vers le centre. Le titre BEGINNING s’efface. Le halo rouge se réduit et une ligne dorée verticale se renforce au centre comme une charnière.",
      "position": "center",
      "animation": "translateX vers centre + blur 0 vers 1.5px puis 0, opacity titres 1 vers 0, spring() damping 20 stiffness 100",
      "couleur": "#e7bd78",
      "texte": ""
    },
    {
      "t_relatif_s": [
        2.7,
        3.5
      ],
      "nom": "Annonce MIDDLE",
      "ce_qui_apparait": "Titre MIDDLE en haut centre, ivoire, très premium. La pièce commence à pivoter juste avant la voix, pour que l’image annonce le retournement.",
      "position": "top center",
      "animation": "fade + slide -12px vers 0px, spring() damping 18 stiffness 100",
      "couleur": "#f5ead2",
      "texte": "MIDDLE"
    },
    {
      "t_relatif_s": [
        3.1,
        4.5
      ],
      "nom": "Flip 3D : tranche de la pièce",
      "ce_qui_apparait": "La pièce tourne sur son axe vertical. À 90 degrés, elle devient une tranche dorée épaisse, crénelée, avec reflets successifs sur les stries. L’icône pétrolière devient presque illisible, comme un destin suspendu.",
      "position": "center",
      "animation": "rotateY 0deg vers 92deg en perspective 1200px, spring() damping 13 stiffness 95. Épaisseur simulée par 36 rectangles SVG dorés en éventail ou stack CSS. Highlights animés par mask gradient suivant la tranche.",
      "couleur": "#e7bd78",
      "texte": ""
    },
    {
      "t_relatif_s": [
        3.8,
        4.9
      ],
      "nom": "Mot-pivot LE MIRACLE fragmenté",
      "ce_qui_apparait": "En bas centre, LE MIRACLE apparaît en deux couleurs : LE en rouge crise, MIRACLE en or. Le mot est momentanément coupé au milieu par la tranche de la pièce.",
      "position": "bottom center",
      "animation": "reveal par clip-path horizontal, lettres en y 24px vers 0px, spring() damping 15 stiffness 125. Split mask synchronisé avec la pièce à 90deg.",
      "couleur": "#e7bd78",
      "texte": "LE MIRACLE"
    },
    {
      "t_relatif_s": [
        4.5,
        5.9
      ],
      "nom": "Face or : promesse nationale",
      "ce_qui_apparait": "La pièce termine son flip et révèle la face dorée : bâtiment officiel stylisé, drapeau, cercle en relief, texte courbe LE MIRACLE. Le rouge disparaît presque totalement, remplacé par un halo or doux.",
      "position": "right center",
      "animation": "rotateY 92deg vers 180deg, translateX 0 vers 220px, scale 1.0 vers 0.96, spring() damping 14 stiffness 105. Opacité de la face B crossfade 0 vers 1 autour de 5.0s.",
      "couleur": "#e7bd78",
      "texte": "LE MIRACLE"
    },
    {
      "t_relatif_s": [
        5.4,
        6.4
      ],
      "nom": "Annonce END",
      "ce_qui_apparait": "Titre END en haut droit. La composition devient symétrique et froide, comme un verdict. La pièce est maintenant bien lisible côté droit.",
      "position": "top right",
      "animation": "fade + slide x 20px vers 0px, spring() damping 18 stiffness 105",
      "couleur": "#f5ead2",
      "texte": "END"
    },
    {
      "t_relatif_s": [
        5.9,
        7.1
      ],
      "nom": "Fissure du miracle",
      "ce_qui_apparait": "Une fissure noire part du bord haut droit de la pièce et descend en diagonale vers le bas gauche. Elle traverse le mot MIRACLE et le bâtiment. Des micro éclats dorés se détachent.",
      "position": "right center",
      "animation": "stroke-dashoffset animé par spring() de longueur totale vers 0, puis particules SVG en burst léger avec opacity decay. Léger shake de la pièce amplitude 5px, spring() damping 9 stiffness 180",
      "couleur": "#0b0f1a",
      "texte": ""
    },
    {
      "t_relatif_s": [
        6.6,
        7.8
      ],
      "nom": "Verdict : deux illusions",
      "ce_qui_apparait": "Grand texte ivoire en bas droit : DEUX ILLUSIONS. La pièce fissurée reste au-dessus, comme une preuve visuelle. Le texte apparaît 0.5 seconde avant le commentaire final.",
      "position": "bottom right",
      "animation": "scale 0.96 vers 1.0 + fade, spring() damping 16 stiffness 115, ombre portée progressive, léger tracking animé",
      "couleur": "#f5ead2",
      "texte": "DEUX\\nILLUSIONS"
    },
    {
      "t_relatif_s": [
        7.8,
        8.5
      ],
      "nom": "Hold premium final",
      "ce_qui_apparait": "Plan final stable : pièce dorée fissurée à droite, texte DEUX ILLUSIONS en dessous, fond navy grainé, halo or très discret et rouge crise presque éteint.",
      "position": "right weighted composition",
      "animation": "hold avec respiration imperceptible scale 1.0 vers 1.006 via spring() très amorti, grain animé frame-driven, vignette opacity 0.28 vers 0.34",
      "couleur": "#16213a",
      "texte": "DEUX ILLUSIONS"
    }
  ],
  "assets_a_generer": [
    {
      "quoi": "Texture métal doré premium pour la pièce",
      "pourquoi_pas_codable": "Le relief réaliste, les micro-rayures, la rugosité anisotrope et les variations de patine peuvent être approximés en SVG, mais un asset bitmap donnera un rendu documentaire plus luxueux et moins plat.",
      "prompt_suggere": "Seamless premium brushed gold coin metal texture, subtle micro scratches, warm cinematic highlights, dark navy compatible, no text, no logo, high resolution, realistic but clean, documentary title design style"
    },
    {
      "quoi": "Texture rouge cuivré oxydé pour la face LA MALÉDICTION",
      "pourquoi_pas_codable": "La couleur et les gradients sont codables, mais l’aspect matière cuivrée sombre avec poussière et corrosion fine nécessite une texture pour éviter un rendu trop vectoriel.",
      "prompt_suggere": "Dark oxidized copper red coin surface texture, crisis red tone, subtle dust, fine scratches, premium geopolitical documentary mood, no text, no symbols, high resolution"
    },
    {
      "quoi": "Grain cinématographique navy transparent",
      "pourquoi_pas_codable": "Un bruit procédural SVG est possible, mais un overlay grain réel en boucle courte donne une vibration plus organique et haut de gamme.",
      "prompt_suggere": "Transparent cinematic film grain overlay, subtle, dark navy shadows, premium documentary, seamless loop feel, high resolution, no visible pattern"
    }
  ],
  "ce_qui_est_codable_directement": [
    "Fond navy #16213a en React/SVG avec vignette radiale et grille cartographique en lignes SVG à faible opacité",
    "Pièce circulaire SVG avec anneaux, gradients radiaux or #e7bd78, face rouge #b23a2e, ombres portées et filtres feGaussianBlur",
    "Texte circulaire LA MALÉDICTION et LE MIRACLE via SVG textPath",
    "Pictogramme de plateforme pétrolière, vagues, bâtiment officiel, drapeau et socle en paths SVG simples",
    "Flip 3D de la pièce avec CSS transform rotateY, perspective et backface-visibility",
    "Tranche crénelée codable avec une série de rectangles/traits dorés répétés ou un pattern SVG",
    "Fissure diagonale en path SVG animé avec strokeDasharray et strokeDashoffset",
    "Micro éclats et poussières dorées en particules SVG frame-driven",
    "Textes BEGINNING, MIDDLE, END, CRISE, LE MIRACLE, DEUX ILLUSIONS avec typographie serif, tracking, drop-shadow et masks",
    "Compteur de chiffre de crise via interpolation frame-driven",
    "Séparateurs verticaux dorés, halos, glow rouge/or et tremblement contrôlé par spring()"
  ],
  "details_premium": [
    "Utiliser une typographie serif contrastée type Cinzel, Cormorant Garamond ou Trajan-like, avec letter-spacing large pour BEGINNING/MIDDLE/END",
    "Appliquer une ombre portée double aux textes : ombre noire courte pour lisibilité et highlight ivoire/or très fin pour effet gravure",
    "Ajouter un bevel simulé sur les anneaux de la pièce par superposition de cercles SVG avec gradients radiaux opposés",
    "Pendant le flip, ajouter un highlight vertical mobile sur la tranche, masqué par la forme de la pièce",
    "Ne jamais faire d’animation linéaire : utiliser spring() pour entrées, flips, reveals et impacts, avec damping adapté selon la masse visuelle",
    "Faire précéder chaque idée visuelle principale de 0.5 seconde avant la voix : face rouge avant l’évocation de crise, flip avant le retournement narratif, fissure avant la conclusion critique",
    "Conserver le rouge #b23a2e uniquement comme signal de crise, pas comme couleur décorative dominante",
    "Ajouter un grain animé très léger sur tout le plan pour casser le rendu vectoriel",
    "Créer une profondeur par z-index : grille au fond, halos, pièce, fissure, particules, textes verdict au premier plan",
    "Ajouter une micro-respiration sur le plan final pour éviter un arrêt figé trop numérique"
  ],
  "ordre_de_code": [
    "etape 1: Créer la composition Remotion 8.5s avec fps fixe, palette globale navy #16213a, or #e7bd78, ivoire #f5ead2, rouge crise #b23a2e",
    "etape 