# Pixel Art Assets - Sources & Strategy (Peste 1347, fev 2026)

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — le projet Peste 1347 a depuis pivoté vers
> Atlas Mapbox pur (voir `memory/episodes/peste-1347/STATUS.md`), abandonnant le pipeline pixel
> art décrit ici. Conservé pour la comparaison itch.io vs CraftPix (pertinente si un futur projet
> a besoin d'assets pixel art achetés).

## Plateformes

### itch.io (ACHETE - Panier de base, a l'epoque)
- **Modele**: Marketplace ouvert, achat a l'unite
- **Licence**: Variable par vendeur (verifier chaque pack)
- **Force**: Artistes independants de qualite (Elthen, Pixel Frog, unTied Games)
- **Faiblesse**: Qualite variable, pas d'abonnement, coherence inter-packs non garantie

### CraftPix.net (EVALUE - option non retenue)
- **Modele**: Store curate + abonnement
- **Pricing**: $15/mois mensuel, **$48/an (~$4/mois)**, promos Black Friday ~$24/an
- **Catalogue**: 2085 assets total, ~650 packs medievaux (41 pages), ~270 freebies
- **Equipe**: 6 artistes maison (Ukraine, fondee 2016) - coherence interne par pack
- **Licence**: Commercial illimite, modification autorisee, assets telecharges restent a vie apres desabonnement
- **Licence YouTube**: Pas explicitement mentionne ("projects" generique) mais probablement couvert
- **Force**: Volume massif, licence uniforme, freebies genereux
- **Faiblesse**: Pas de Plague Doctor, coherence inter-artistes variable (6 styles differents)
- **Presence itch.io**: CraftPix publie ses freebies sur itch.io sous "Free Game Assets"

### Comparaison rapide
| Critere | itch.io | CraftPix |
|---------|---------|----------|
| Modele | Achat unitaire | Abonnement tout-inclus |
| Licence | Variable | Uniforme, commerciale |
| Coherence | Tres variable | Bonne par pack (6 artistes) |
| Medieval | Milliers (inegal) | ~650 packs (curate) |
| Prix | ~13$ notre panier | $48/an tout le catalogue |
| Plague Doctor | Oui (Elthen) | Non |

**Verdict a l'epoque**: Les 2 sont complementaires. itch.io pour artistes specifiques, CraftPix pour volume.

---

## Assets Achetes (itch.io) - Panier Peste 1347 (historique)

| Categorie | Asset | Prix | Licence |
|-----------|-------|------|---------|
| Docteur Peste | Elthen - Plague Doctor | 3$ | Commercial OK |
| Paysans | Elthen - Medieval Peasants | 3$ | Commercial OK |
| Rats | Elthen - Rat Sprites | 1$ | Commercial OK |
| Faucheuse | SamuelLee - Reaper | Gratuit | "Use any way you like" |
| Village | unTied Games - Medieval Village + Haunted | 3.25$ | Commercial OK |
| Carte monde | unTied Games - World Map Tileset | 2.50$ | Commercial OK |
| Batiments/Terrain | Pixel Frog - Tiny Swords | Gratuit | Commercial OK |
| Cranes/Os | CraftPix - 50 Bone & Skull Icons | Gratuit | Royalty-free |
| Squelettes | CraftPix - Skeleton Sprites | Gratuit | Royalty-free |
| Cimetiere | angrysnail - Graveyard 16x16 | Gratuit | CC0 |
| Feu/Torches | Devkidd - Pixel Fire | Gratuit | Commercial OK |
| **TOTAL** | | **~12.75$** | |

### Upgrade achete
| Asset | Prix | Raison |
|-------|------|--------|
| Mucho Pixels - Medieval Town | 5$ | Scenes pre-composees, cycle jour/nuit, profondeur visuelle |

### Upgrades NON achetes (evaluation)
| Asset | Prix | Verdict | Raison |
|-------|------|---------|--------|
| GandalfHardcore 100+ NPC | 9$ | SKIP | Redondant avec Elthen + Tiny Swords |
| Elthen - Death Sprites | 5$ | SKIP | Reaper gratuit suffit pour prototype |

---

## CraftPix - Packs Medievaux Notables (référence)

### Specifiques au theme Peste
- **Giant Rat "Plague Carrier"** ($9.99 ou premium) : 3 rats dont un "Plague Carrier", 4 directions, animations completes
- Free Skeleton Pixel Art Sprite Sheets (GRATUIT)
- Free Undead Tileset Top Down (GRATUIT)

### Environnements
- Free Village Pixel Tileset for Top-Down Defense (GRATUIT)
- Free Medieval Armory Street Cartoon 2D Tileset (GRATUIT)
- Free Tropical Medieval City 2D Tileset (GRATUIT, 18 batiments)
- Village Pixel Art Environment Assets Pack (Premium)
- Medieval Interior Top Down Tileset (Premium)

### Personnages
- Fantasy Pixel Art Character Collection (Premium, massive)
- Pixel Prototype Medieval Character Pack 5 & 6 (Premium)
- 64x64 Medieval Pixel Character Portraits (Premium)
- Priest Pixel Art Character Sprite Sheets (Premium)
- **PAS de Plague Doctor** - Elthen (itch.io) reste la seule source

### UI & Polices
- Medieval GUI (Premium, 3 couleurs)
- Medieval Gothic Pixel Font (Premium)
- Free Basic Pixel Art UI for RPG (GRATUIT)

---

## Utilisation dans Remotion (a l'epoque)

### Sprite Sheets
- PNG transparents avec frames d'animation en grille
- Decoupage par `background-position` CSS ou extraction individuelle
- Fichiers PSD disponibles (CraftPix) pour recolorer/adapter les layers

### Animations supportees (standard sprite sheets)
- idle, walk, run, attack, hurt, death
- 4 directions (certains packs)
- Exploitables avec `interpolate()` de Remotion pour controler frame par frame

### Techniques Remotion pour pixel art
- Scrolling horizontal parallax multi-couches (decors de ville)
- Transition jour/nuit (opacity crossfade ou palette shift)
- Sprite sheet animation via interpolate()
- Zoom progressif sur zones specifiques
- Apparition progressive par couches (rats -> croix -> rues vides)
- Split-screen ou wipe avant/apres
- CRT/scanlines via CSS/SVG (gratuit, code dans Remotion)

---

## Strategie Asset a Long Terme (dépassée, projet a pivoté vers Mapbox)

1. Prototype (a l'epoque) : Assets itch.io achetes (~17.75$ avec Medieval Town)
2. Prochaine video envisagée : Tester freebies CraftPix pour compatibilite de style
3. Si style compatible : Abonnement annuel CraftPix ($48/an)
4. Attendre Black Friday : Possible $24/an
5. Toujours garder itch.io : Pour les artistes specifiques non disponibles sur CraftPix
