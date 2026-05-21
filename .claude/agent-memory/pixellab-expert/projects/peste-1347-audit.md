---
name: peste-1347-pixellab-audit
description: Audit complet assets PixelLab pour épisode Atlas Peste Noire 1347 — réutilisables, manquants, IDs confirmés
metadata:
  type: project
---

# Audit Assets PixelLab — La Peste et le Sahara 1347

> Exécuté : 2026-05-16
> Script V3 LOCKED. Angle "Sahara comme bouclier" (Angle A).
> Style : Atlas pur, carte 2D Mercator low top-down, même pipeline Mansa Moussa.

---

## Assets RÉUTILISABLES DIRECT (chemin local confirmé)

### Characters — Projet Mansa Moussa
Base : `quebec-jacques-poc/public/atlas-mansa-moussa/characters/`

| Personnage | Usage Peste 1347 | Walk cycle | Directions | Canvas | Notes |
|-----------|-----------------|-----------|-----------|--------|-------|
| **chameau** | Caravane Mali traversant Sahara | walk_cycle/east + west (4f) | E+W+S (static) | 92×92 | PRINCIPAL — cheval de bataille du beat Mali Vivant |
| **porteur-mali** | Membre caravane marchande | walk_cycle/east + west (6f) | E+W+S (static) | 92×92 | Représente les marchands maliens |
| **soldat-mali** | Escorte caravane | walk_cycle/east + west (6f) | E+W+S (static) | 92×92 | Donne autorité à la caravane |
| **mansa-moussa** | À ne PAS utiliser tel quel — Mansa Souleymane 1347 pas Moussa | royal_pose/south (4f) + walk_cycle E+W (6f) | E+W+N+S (static) | 92×92 | Visuellement réutilisable comme "sultan Mali" — contexte différent |

**Gotcha chameau** : seulement walk_cycle east/west disponibles localement. Pas de direction nord/sud animée.

### Characters — Projet Empire Ghana
Base : `public/empire-ghana/characters/`

| Personnage | Usage Peste 1347 | Animations locales | Canvas | Notes |
|-----------|-----------------|-------------------|--------|-------|
| **berbere** | Marchand berbère au Maghreb | walking(EWSN 6f) + crouching(EWSN 5f) + idle(EWSN 4f) | 92×92 | PARFAIT pour Beat Maghreb — 4 directions complètes |
| **sahelien** | Marchand sahélien / caravanier | walking(EWSN 6f) + crouching(EWSN 5f) + idle(EWSN 4f) | 92×92 | Alternative au porteur-mali, même style |

**Gotcha dimensions** : epeiste/guerrier/lancier/sundiata = 132×132 — trop grands pour carte Mercator standard si les Mansa Moussa chars sont 92×92. À éviter pour Peste 1347.

### Map Objects — Projet Empire Ghana
Base : `public/empire-ghana/assets/pixellab/`

| Objet | Usage Peste 1347 | Canvas | Notes |
|------|----------------|--------|-------|
| **caravane-chameau.png** | Icône caravane sur route Sahara | 96×96 | Objet composite (chameau + cargaison) — utile comme marqueur route |
| **mosquee-banco.png** | Tombouctou / villes Mali | 96×96 | Signale présence Mali sur carte |
| **niani-mali.png** | Capitale Niani sur carte | inconnue | Marqueur ville de départ caravane |
| **stand-marche.png** | Commerce florissant Mali | 96×96 | Beat "Mali Vivant" |
| **sac-or.png** | Or malien qui part vers Europe | 96×96 | Beat punchline économique |
| **gold-ingot-stack.png** | Richesse Mali | 96×96 | Idem |
| **balance-commerciale.png** | Commerce en cours | 96×96 | Beat "mali alimente les monnaies" |

---

## Assets À CRÉER (manquants pour le script V3)

### Priorité HAUTE (bloquants narratifs)

| Asset | Description pour create_character/create_map_object | Type | Raison |
|-------|---------------------------------------------------|------|--------|
| **Rat noir** (Rattus rattus) | "Black rat (Rattus rattus), small dark rodent, medieval plague carrier, low top-down view, pixel art, isolated on transparent background, atlas style" | map_object 32×32 | Vecteur visuel central du Beat Climax — "la bactérie voyage avec les rats" |
| **Puce** (optionnel) | "Medieval flea, tiny insect vector, pixel art, 16×16, isolated transparent" | map_object 16×16 | Optionnel — peut être remplacé par simple icône CSS |
| **Marqueur Peste rouge** | SVG custom ou map_object — croix rouge ou skull pixel art | map_object 32×32 | Propagation Peste sur carte Europe |

### Priorité MOYENNE

| Asset | Description | Type | Raison |
|-------|-------------|------|--------|
| **Médecin médiéval européen** (bec de corbin) | "Medieval plague doctor, dark robe, bird mask beak, European 14th century, low top-down view, 4 directions, pixel art 92×92" | character | Contraste Europe/Mali — optionnel selon découpage beats |
| **Bateau génois** | "Genoese merchant ship, 14th century, side view, pixel art, arriving in Sicilian port, bringing plague" | map_object 64×48 | Beat intro "navire accoste en Sicile" |
| **Marqueur ville florissante** (Mali) | "14th century Mali city icon, mosque, market, top-down pixel art, thriving, gold/warm colors" | map_object 64×64 | Beat "Mali Vivant" — contraste avec mort européenne |

### Priorité BASSE (peut attendre ou être remplacé)

| Asset | Alternative possible |
|-------|---------------------|
| Mansa Souleymane | Réutiliser mansa-moussa comme "sultan Mali" visuellement (style identique, contexte différent) |
| Fosses communes européennes | SVG custom dark, pas besoin PixelLab |
| Flèche propagation Peste | strokeDashoffset SVG animé, pas besoin PixelLab |

---

## IDs PixelLab confirmés (MASTER-INDEX — live à vérifier si reuse)

| Nom | ID | Statut | À vérifier |
|-----|-----|--------|----------|
| Chameau Mali | `0b93031f-4df6-40ad-8a65-240229d127ff` | Dans MASTER-INDEX | MCP get_character recommandé avant toute anime |
| Porteur Mali | `5d667d1e-8a3e-4b53-903e-28da88200ec4` | Dans MASTER-INDEX | Idem |
| Soldat Mali | `d378d0f2-2704-4f4e-bf60-3a8475b2fb16` | Dans MASTER-INDEX | Idem |
| Mansa Moussa | `0a167efc-1abd-48ae-9c81-f77ad243f80d` | Dans MASTER-INDEX | Usage déconseillé (mauvaise époque) |
| Merchant Berbère | `79865794-abb1-4509-b6d7-580f87acbc4c` | Dans MASTER-INDEX | Walk EWSN confirmé localement |
| Merchant Sahélien | `ef9ac272-1389-430d-9e94-dbd7dd7f9be9` | Dans MASTER-INDEX | Walk EWSN confirmé localement |

**ATTENTION** : IDs MASTER-INDEX peuvent être expirés (PixelLab purge après inactivité). Fichiers locaux = source fiable. Appeler `get_character(id)` uniquement si on a besoin de générer de nouvelles animations.

---

## Chemins locaux confirmés (source de vérité production)

```
# Caravane Mali (PRINCIPALE)
quebec-jacques-poc/public/atlas-mansa-moussa/characters/chameau/
  animations/walk_cycle/east/frame_000-003.png  (4f)
  animations/walk_cycle/west/frame_000-003.png  (4f)
  static-east.png, static-south.png, static-west.png

quebec-jacques-poc/public/atlas-mansa-moussa/characters/porteur-mali/
  animations/walk_cycle/east/frame_000-005.png  (6f)
  animations/walk_cycle/west/frame_000-005.png  (6f)
  static-east.png, static-south.png, static-west.png

quebec-jacques-poc/public/atlas-mansa-moussa/characters/soldat-mali/
  animations/walk_cycle/east/frame_000-005.png  (6f)
  animations/walk_cycle/west/frame_000-005.png  (6f)
  static-east.png, static-south.png, static-west.png

# Marchands Maghreb (PRINCIPAUX)
public/empire-ghana/characters/berbere/
  animations/walking-b8b230ef/{east,north,south,west}/frame_000-005.png  (6f x4)
  animations/crouching-22bab130/{east,north,south,west}/frame_000-004.png  (5f x4)
  animations/animating-63b90882/{east,north,south,west}/frame_000-003.png  (4f x4 — idle)
  rotations/{east,north,south,west}.png

public/empire-ghana/characters/sahelien/
  animations/walking-3848d070/{east,north,south,west}/frame_000-005.png  (6f x4)
  animations/crouching-7ca15898/{east,north,south,west}/frame_000-004.png  (5f x4)
  animations/animating-00dce42d/{east,north,south,west}/frame_000-003.png  (4f x4 — idle)
  rotations/{east,north,south,west}.png

# Map objects réutilisables
public/empire-ghana/assets/pixellab/caravane-chameau.png  (96×96)
public/empire-ghana/assets/pixellab/mosquee-banco.png     (96×96)
public/empire-ghana/assets/pixellab/niani-mali.png
public/empire-ghana/assets/pixellab/stand-marche.png      (96×96)
public/empire-ghana/assets/pixellab/sac-or.png            (96×96)
public/empire-ghana/assets/pixellab/gold-ingot-stack.png  (96×96)
public/empire-ghana/assets/pixellab/balance-commerciale.png (96×96)
```

---

## Validations pipeline

- [x] Tous les assets ci-dessus utilisent view "low top-down" — cohérent avec pipeline Atlas Mansa Moussa
- [x] Chameau : quadrupède, 92×92, walk_cycle east/west — prêt pour svgToComp + camera-track
- [x] Berbere : 92×92, walking 4 directions complètes — adapté Maghreb (peut aller nord/sud)
- [ ] Rat noir : À CRÉER (aucun équivalent dans inventaire)
- [ ] Bateau génois : À CRÉER ou SVG custom
- [ ] Médecin médiéval : À CRÉER si Beat Europe développé

---

## Estimation génération

| Asset | Outil | Temps | Quota |
|-------|-------|-------|-------|
| Rat noir (map_object 32×32) | create_map_object | 30-60s | 1 |
| Bateau génois (map_object 64×48) | create_map_object | 30-60s | 1 |
| Médecin médiéval (character 92×92) | create_character | 2-3 min | 1 |
| Animations médecin (si créé) | animate_character | 2-4 min/animation | 1/anim |

**Total minimal (rat + bateau)** : ~2 min, 2 générations quota.
**Total avec médecin + 2 animations** : ~15 min, 4-5 générations quota.
