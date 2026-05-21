# Script V5 LOCKED — Silicon Savannah (Kenya M-Pesa)
> Locké 2026-05-14 après jury GPT-4o + Gemini + Grok (2/3 RÉVISION MINEURE → corrigé → LOCKÉ)
> Durée estimée : 90-95s · 7 beats · Format Souverain hybride

---

## Règles sources à l'écran (NON-NEGOTIABLE)
- Sources affichées discrètement à l'écran — jamais dites à l'oral
- Dates dans la narration : "en 2025", "depuis 2007" — oui
- Zéro "selon", "d'après", "des études montrent" dans la voix-off

---

## BEAT 1 — Hook · 0-8s
**Template : BrutalHeadline** (photo B&W Nairobi skyline)
**Animation : Ken Burns frame 0 (zoom lent 1.0→1.08) + headline typewriter mot par mot + sous-titre fade-in à 3s**

> "En 2025, un pays africain a la plus forte pénétration de paiements mobiles au monde.
> Pas la Chine. Pas les États-Unis.
> Le Kenya."

---

## BEAT 2 — Situer · 8-20s
**Template : CartoCaspian Sepia**
**Animations : zoom continent Afrique → Kenya (zoom 2→4.5, pitch 0→20°) · highlight Kenya pulse or (3 pulses) · labels Nairobi/Mombasa/Kisumu en séquence · DateBar overlay bas "6 MARS 2007"**

> "Tout commence en 2007. Safaricom lance M-Pesa.
> Un service de paiement par SMS.
> Pas de smartphone. Pas d'appli. Pas de banque. Juste un réseau et un vieux Nokia."

*"Un modèle que la Banque Mondiale citera comme référence mondiale." → sous-titre à l'écran uniquement*

---

## BEAT 3 — Le miracle · 20-42s
**Template : FillScreen 91% → BigStat "300 000"**
**Animation : FillScreen remplit de bas en haut, countUp · cut sec vers BigStat**

> "Dix-huit ans plus tard.
> 9 Kenyans sur 10 ont accès à un compte mobile money actif — le taux le plus élevé au monde.
> 300 000 points de paiement physiques dans tout le pays — des kiosques, des épiceries, des pharmacies.
> Des familles séparées par des centaines de kilomètres envoient de l'argent en secondes.
> C'était une révolution réelle."

*Source écran discret : Communications Authority Kenya 2025 · Safaricom 2025*

---

## BEAT 4 — Le prix · 42-58s
**Template : NOUVEAU — TariffLadder** (deux colonnes : montant envoyé vs % frais, effet ciseaux inversés)
**Animation : visuel apparaît en silence 2s · voix arrive après · "structure régressive" retiré de la narration — le visuel le montre**

> "Mais voilà ce qu'on dit moins.
> 200 shillings envoyés — 7 shillings de frais. Moins d'un centime d'euro.
> 50 000 shillings envoyés — 108 shillings de frais. Moins d'un euro.
> Même service. Même tuyau. Plus la somme est petite, plus le pourcentage est élevé.
> C'est dans le barème officiel de Safaricom."

*Source écran : Safaricom tarifs 2025*

---

## BEAT 5 — Le monopole · 58-72s
**Template : CountdownReveal "7 ANS"**
**Animation : arc se remplit · label "SANS CADRE RÉGLEMENTAIRE COMPLET" · countUp 0→7**

> "La Banque Centrale du Kenya a laissé M-Pesa opérer sept ans avant d'imposer un cadre réglementaire complet — ce que la BCK appelait elle-même une approche test-and-learn.
> Sept ans pendant lesquels une seule entreprise privée est devenue l'infrastructure financière d'un pays entier.
> Un seul service. Les rails de tout un pays."

*"Les flux bruts de M-Pesa représentent aujourd'hui plusieurs fois le PIB kenyan en volume de transactions annuelles." → source + sous-titre à l'écran*

*Source écran : National Payment System Regulations 2014*

---

## BEAT 6 — La question · 72-88s
**Template : BrutalHeadline** (fond noir pur, pas de photo, texte typewriter)

> "M-Pesa a sorti des millions de Kenyans de l'exclusion financière. C'est vrai.
> Et les rails sur lesquels circule cet argent — ton salaire, tes frais de scolarité, tes urgences — appartiennent à une seule entreprise privée.
> La question n'est pas si M-Pesa est bon ou mauvais.
> La question c'est : qui décide ?"

---

## BEAT 7 — CTA · 88-95s
**Template : overlay texte simple · logo KART et KORA · lien newsletter**

> "Et dans ton pays — qui contrôle ces rails ? Une entreprise privée ou l'État ?
> Réponds en commentaire."

---

## Mapping templates
| Beat | Template | Statut |
|------|----------|--------|
| 1 | BrutalHeadline (Ken Burns + typewriter) | Existant — vérifier animation intégrée |
| 2 | CartoCaspian Sepia | Existant |
| 3 | FillScreen + BigStat | Existant |
| 4 | TariffLadder | **NOUVEAU à coder** — Gemini 3.1 Pro mockup → Tailwind + spring |
| 5 | CountdownReveal | Existant |
| 6 | BrutalHeadline (fond noir, no photo) | Existant |
| 7 | Overlay texte | Existant |

---

## Chiffres validés (Perplexity sonar-pro 2026-05-14)
- 91% pénétration mobile money — Communications Authority Kenya, sept. 2025
- 298 900 agents (~300 000) — The Star Kenya, 6 mars 2026
- 200 KES → 7 KES frais (3,5%) / 50 000 KES → 108 KES frais (0,2%) — Safaricom tarifs 2025
- 7 ans sans cadre réglementaire complet (2007→2014) — NPS Regulations 2014
- Flux M-Pesa > plusieurs fois le PIB kenyan — IIARD Journal 2025

---

## Prochaines étapes
1. Audio ElevenLabs (voix Narratrice GeoAfrique v2 — z3gESu49naEZW8Af2Upm)
2. Mesure ffprobe → timing.ts
3. Gemini 3.1 Pro mockup TariffLadder → coder le template
4. Storyboard Gemini 3.1 Flash (visualisation)
5. Manifest visuel complet
6. Code Remotion
