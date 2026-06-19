{
  "scene": {
    "titre": "Intro documentaire - Sénégal pétrole - Kora & Cartes",
    "format": "Remotion React/SVG frame-driven",
    "resolution": "1920x1080",
    "fps": 30,
    "style": "premium documentaire, cartographie politique, métal précieux, crise contrôlée",
    "chaine": "Kora & Cartes",
    "palette": {
      "navy": "#16213a",
      "or": "#e7bd78",
      "ivoire": "#f2ebd9",
      "rouge_crise": "#b23a2e",
      "noir_fissure": "#050505"
    },
    "intention": "Visualiser le retournement du récit pétrolier sénégalais par une pièce biface : d'abord la malédiction, puis le miracle, avant de briser les deux lectures par une fissure noire et le verdict final."
  },
  "duree_estimee_s": 11.5,
  "pivot_central": {
    "objet": "Pièce 3D biface en or, animée en coin-flip",
    "description_visuelle": "Grande pièce circulaire dorée, reliefs fins, bord crénelé, halo chaud, ombre portée douce. Face A : texte LA MALEDICTION avec navire pétrolier, derrick, mer rouge et pictogrammes de crise. Tranche : bord doré crénelé visible en rotation, légère extrusion 3D. Face B : texte LE MIRACLE avec monument/statue de souveraineté dorée, drapeau, socle et lignes de développement durable. Une fissure noire diagonale traverse ensuite la Face B de haut gauche vers bas droit.",
    "comment_anime": "Le flip est le geste symbolique de retourner le récit. La pièce démarre de face sur Face A, pulse légèrement, pivote sur l'axe Y jusqu'à montrer la tranche au milieu, puis termine sur Face B. L'animation doit utiliser des springs Remotion, jamais de linear easing. Le flip combine rotateY, scale, blur directionnel léger, variation de halo et apparition de particules data qui se détachent pendant la tranche."
  },
  "background": {
    "couleur": "#16213a",
    "texture": "Fond navy profond avec grain cinématographique léger, vignettage radial, micro-poussières ivoire/or très discrètes, lignes verticales fines évoquant la planche BEGINNING/MIDDLE/END.",
    "evolution": "Au début, le fond est très sombre et stable. Quand Face A apparaît, une lueur rouge subtile monte derrière la pièce. Pendant le flip, le halo devient circulaire doré avec traînée orbitale. Sur Face B, la lumière devient plus dorée et solennelle. Au moment de la fissure, le fond se refroidit, le vignettage s'accentue et le rouge crise revient très brièvement dans les interstices de la fissure."
  },
  "etapes": [
    {
      "t_relatif_s": [
        0,
        0.8
      ],
      "nom": "Installation du fond premium et repères triptyque",
      "ce_qui_apparait": "Fond navy texturé, grain, vignette, séparateurs verticaux très fins et titres BEGINNING, MIDDLE, END en haut.",
      "position": {
        "fond": "plein écran 1920x1080",
        "separateurs": [
          {
            "x": 640,
            "y1": 95,
            "y2": 985
          },
          {
            "x": 1280,
            "y1": 95,
            "y2": 985
          }
        ],
        "titres": [
          {
            "texte": "BEGINNING",
            "x": 320,
            "y": 92
          },
          {
            "texte": "MIDDLE",
            "x": 960,
            "y": 92
          },
          {
            "texte": "END",
            "x": 1600,
            "y": 92
          }
        ]
      },
      "animation": {
        "fond": "fade-in avec légère montée du grain et vignettage",
        "separateurs": "scaleY de 0 à 1 depuis le centre, opacité 0 à 0.35",
        "titres": "translateY -12 vers 0, opacité 0 à 1",
        "spring": {
          "damping": 24,
          "stiffness": 90
        }
      },
      "couleur": {
        "fond": "#16213a",
        "grain": "rgba(242,235,217,0.055)",
        "separateurs": "rgba(242,235,217,0.25)",
        "titres": "#e7bd78"
      },
      "texte": [
        "BEGINNING",
        "MIDDLE",
        "END"
      ]
    },
    {
      "t_relatif_s": [
        0.6,
        1.8
      ],
      "nom": "Apparition Face A - La malédiction",
      "ce_qui_apparait": "La pièce arrive dans le panneau gauche avec Face A visible. Le titre FACE A puis LA MALEDICTION apparaît au-dessus. Les reliefs internes rouges se révèlent avec une lueur de crise.",
      "position": {
        "piece": {
          "x": 320,
          "y": 430,
          "diametre": 330
        },
        "titre_face": {
          "x": 320,
          "y": 205,
          "alignement": "center"
        },
        "titre_principal": {
          "x": 320,
          "y": 248,
          "alignement": "center"
        },
        "halo": {
          "x": 320,
          "y": 430,
          "rayon": 250
        }
      },
      "animation": {
        "piece": "scale 0.72 à 1.0, rotateZ -4deg à 0deg, opacité 0 à 1, léger overshoot premium",
        "reliefs_faceA": "mask radial du centre vers extérieur, opacité 0 à 1",
        "halo": "scale 0.8 à 1.15 puis stabilisation à 1.0",
        "texte": "apparition 0.5s avant voix supposée : tracking de 0.08em à 0.02em, translateY 14 vers 0",
        "spring": {
          "damping": 18,
          "stiffness": 120
        }
      },
      "couleur": {
        "piece": "#e7bd78",
        "reliefs": "#b23a2e",
        "texte_face": "#f2ebd9",
        "texte_principal": "#f2ebd9",
        "halo": "rgba(231,189,120,0.45)",
        "ombre": "rgba(0,0,0,0.45)"
      },
      "texte": [
        "FACE A",
        "‘LA MALEDICTION’"
      ]
    },
    {
      "t_relatif_s": [
        1.4,
        3.4
      ],
      "nom": "Greffes data sur Face A",
      "ce_qui_apparait": "Trois labels rouges et ivoire se branchent à la pièce par des traits fins : EXTRACTION SANS CONTROLE, DEPENDANCE ECONOMIQUE, COUT ENVIRONNEMENTAL. Les traits pointent vers le navire, le derrick et la mer rouge.",
      "position": {
        "label_1": {
          "texte": "EXTRACTION\nSANS CONTROLE",
          "x": 118,
          "y": 355,
          "ancrage_trait": {
            "x": 188,
            "y": 376
          },
          "cible": {
            "x": 225,
            "y": 398
          }
        },
        "label_2": {
          "texte": "DEPENDANCE\nECONOMIQUE",
          "x": 515,
          "y": 370,
          "ancrage_trait": {
            "x": 470,
            "y": 389
          },
          "cible": {
            "x": 400,
            "y": 398
          }
        },
        "label_3": {
          "texte": "COUT\nENVIRONNEMENTAL",
          "x": 145,
          "y": 595,
          "ancrage_trait": {
            "x": 210,
            "y": 566
          },
          "cible": {
            "x": 245,
            "y": 525
          }
        }
      },
      "animation": {
        "traits": "strokeDashoffset de longueur totale vers 0, avec petit tremblement final",
        "labels": "opacité 0 à 1, translateX directionnel vers la pièce, micro-glow rouge",
        "icones_data": "petits points rouges pulsants le long des traits",
        "spring": {
          "damping": 20,
          "stiffness": 150
        }
      },
      "couleur": {
        "labels_crise": "#b23a2e",
        "labels_secondaire": "#f2ebd9",
        "traits": "rgba(242,235,217,0.75)",
        "points_data": "#b23a2e"
      },
      "texte": [
        "EXTRACTION SANS CONTROLE",
        "DEPENDANCE ECONOMIQUE",
        "COUT ENVIRONNEMENTAL"
      ]
    },
    {
      "t_relatif_s": [
        3.1,
        4.2
      ],
      "nom": "Pré-flip : la Face A devient instable",
      "ce_qui_apparait": "La pièce Face A pulse, les datas rouges vibrent, le halo se contracte comme avant un retournement de récit.",
      "position": {
        "piece": {
          "x_depart": 320,
          "y_depart": 430,
          "x_cible": 960,
          "y_cible": 430,
          "diametre_depart": 330,
          "diametre_cible": 345
        },
        "labels": "restent dans le panneau gauche puis commencent à se désagréger vers le centre"
      },
      "animation": {
        "piece": "translation X du panneau gauche vers centre, scale 1.0 à 1.05, rotateZ 0 à -2deg puis 0",
        "labels": "opacité 1 à 0.25, fragmentation en petits glyphes data",
        "halo": "contraction puis expansion circulaire",
        "spring": {
          "damping": 16,
          "stiffness": 135
        }
      },
      "couleur": {
        "halo": "rgba(231,189,120,0.55)",
        "fragments_data": "#b23a2e",
        "fond_sous_piece": "rgba(178,58,46,0.08)"
      },
      "texte": [
        "La malédiction se retourne"
      ]
    },
    {
      "t_relatif_s": [
        4.0,
        6.2
      ],
      "nom": "Coin-flip central - tranche dorée crénelée",
      "ce_qui_apparait": "La pièce pivote au centre du cadre. À mi-rotation, la tranche dorée crénelée est visible. Des fragments de chiffres, cartes et virgules rouges/orbitent autour.",
      "position": {
        "piece": {
          "x": 960,
          "y": 430,
          "diametre": 360,
          "perspective": 1200,
          "rotateY": "0deg à 180deg",
          "edge_width_visible_midflip": 42
        },
        "orbite_particles": {
          "centre": {
            "x": 960,
            "y": 430
          },
          "rayon_min": 210,
          "rayon_max": 330
        }
      },
      "animation": {
        "flip_3d": "rotateY piloté par spring de 0 à 180deg avec perspective CSS, faceVisibility hidden, Face A visible de 0 à 89deg, tranche renforcée de 70 à 110deg, Face B visible de 91 à 180deg",
        "tranche": "scaleX et opacité maximales autour de 90deg, texture crénelée via repeating-linear-gradient ou SVG strokes",
        "particules": "naissance depuis les labels Face A, orbite spirale puis dispersion légère, rotation individuelle par spring",
        "motion_blur": "blur 0 à 3px autour de la vitesse maximale, retour à 0",
        "halo": "anneau doré en rotation, strokeDashoffset animé au spring",
        "spring": {
          "damping": 14,
          "stiffness": 105
        }
      },
      "couleur": {
        "tranche": "#e7bd78",
        "ombres_tranche": "#9d7441",
        "highlights": "#f2ebd9",
        "particules_or": "#e7bd78",
        "particules_rouges": "#b23a2e",
        "anneau": "rgba(231,189,120,0.38)"
      },
      "texte": [
        "Geste visuel : retourner le récit"
      ]
    },
    {
      "t_relatif_s": [
        5.8,
        7.2
      ],
      "nom": "Révélation Face B - Le miracle",
      "ce_qui_apparait": "La pièce termine son retournement dans le panneau droit avec Face B visible. Titre FACE B puis LE MIRACLE au-dessus. Le relief souveraineté doré apparaît comme une promesse officielle.",
      "position": {
        "piece": {
          "x_depart": 960,
          "y_depart": 430,
          "x_cible": 1600,
          "y_cible": 430,
          "diametre": 330
        },
