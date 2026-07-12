# PLAN — Soudan Acte 4 « Même les voisins sont aspirés »

> Synthèse DA-brief upstream (Gemini 3.1 Pro + Kimi K2.5 + DeepSeek V4, 2026-07-11), suite à
> `creative-director-dual` (2 agents indépendants, convergence 100% Mapbox) sur un blocage créatif
> Beat 4. Sorties brutes : `/tmp/da-refs/da-warmap-soudan-acte4-{gemini,kimi,deepseek}.md`.
> Brief envoyé : `/tmp/da-refs/brief-warmap-soudan-acte4.txt`.

## Régie globale — TRANCHÉ

✅ **100% carte Mapbox continue sur les 6 beats** — convergence totale 3/3 modèles + 2/2 creative-director
internes. Aucun insert SVG état-major (réservé aux assauts, hors-sujet ici). Justification convergente :
le sujet est l'encerclement géopolitique, la carte est le seul espace qui montre physiquement la
compression progressive.

## Beat 4 — Le Nil (« profondeur stratégique égyptienne ») — LE PROBLÈME CENTRAL

**Diagnostic vérifié sur render réel** (v3, frames 68s/72s quasi identiques) : le pulse actuel est invisible.
Deux propositions internes (A: réutiliser halo SAF / B: masse qui se colore) soumises aux 3 modèles.

**Verdict : convergence 3/3 sur une version enrichie de la proposition B.**

- ✅ Tracé qui s'épaissit progressivement (2px→6-15px), révélé par `stroke-dashoffset` (G+K+D)
- ✅ Sens corrigé : Soudan→Égypte, sud vers nord (G+K+D) — confirme le bug déjà identifié
- ✅ Dégradé de teinte le long du tracé, bleu SAF→turquoise désaturé (G+K+D)
- ✅ Flash net à "profondeur stratégique" (p3+f956), caméra figée (G+K+D)
- ✅ `feTurbulence` seed=frame pour texture eau organique, jamais `filter:blur` (G+K+D)
- ✅ Garder `NileFactPlaque` mais discret/en renfort, jamais porteur seul du sens (G+K+D)
- ✅ Nouveau composant dédié `GradientPathReveal`/`LiquidPath` — PAS `GeoFlowConnection` (réservé aux
  objets qui voyagent A→B ; le Nil est un territoire qui se teinte, pas un objet mobile) (K nommé, G+D
  même mécanisme)
- 🔶 NUANCÉ : halo SAF qui vacille de façon irrégulière au moment "redoute" (bruit perlin déterministe) —
  bon complément optionnel (K seul), à activer si la scène respire, pas indispensable

## Autres beats — enrichissements retenus

- **B1** (retournement russe) : rupture violente à "volte-face" — flux RSF se rétracte (pas de fade mollet),
  flux SAF "claque" avec rebond `stroke-width`. ✅ RETENU (G+K).
- **B2** (base navale) : icône Lucide `Anchor` dans cartouche SVG maison, JAMAIS de PNG généré. Ondes
  concentriques pour figurer la négociation en cours (pas un fait accompli). ✅ RETENU (G+K+D).
- **B3** (miroir égyptien) : halo SAF se renforce directement au contact (pas de flux d'objet voyageur,
  cohérent script). Enrichissement : onde de choc (G) ou icône `Eye` reliée en pointillé (K) — 🔶 NUANCÉ,
  à trancher au code, les deux sont faisables.
- **B5** (Kosti) : sprites explosion/fumée déjà en stock (`fx-explosion/`, `fx-smoke/`), jouées 1x (pas
  ping-pong), ton clinique sobre, zéro camera shake. ✅ RETENU (G+K+D, confirme l'existant).
- **B6** (synthèse 4 puissances) : dézoom synchronisé, les 4 flux "respirent" en phase (pression coordonnée,
  pas chaos). Désigné "moment fort" à investir un maximum par G et K ; D nuance que B4 doit rester sobre
  (pas de vraie divergence, juste un vocabulaire différent). ✅ RETENU.

## Idées bonus transversales (Partie C, non-bloquantes pour cet acte)

- "Cicatrices" hachurées SVG sur zones contestées (Khartoum, el-Fasher) — texture carte d'état-major (G).
- Lucide comme langage sémantique transversal : `Anchor`=base, `Eye`=renseignement, `Droplets`=eau,
  `Banknote`=flux financier (K+G convergent sur le principe).
- Composant `DataBadge` standardisé (cartouche SVG + Lucide + chiffre monospace) réutilisable pour toute
  la série, évite les textes libres flottants (K).

## Gate de sortie — TRANCHÉ (2026-07-11)

- **Beat 4** : direction validée telle quelle (masse qui se colore, `GradientPathReveal`, sans proto isolé
  préalable — Aziz a choisi de coder directement).
- **Beat 3** : onde de choc (Gemini) retenue, pas l'icône Eye (Kimi).
- Statut : TRANCHÉ PAR AZIZ.
- Code démarré : OUI, sur la base de cette synthèse.

Liens : [[soudan-midform-ACTE4-SCRIPT]] · doctrine `DA-BRIEF-GATE.md` · `WARMAP-INSERT-SVG-ETATMAJOR.md`.
