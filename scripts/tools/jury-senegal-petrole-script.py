#!/usr/bin/env python3
"""
Jury LLM 4 modeles — Script V1 Senegal petrole & gaz.
Gemini 2.5 Pro Preview + Grok (xAI) + GPT-4o (OpenAI) + Kimi K2 (Moonshot)
Parallele, sans images — texte only (script + contraintes + inventaire templates).
"""
import os, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / ".env")

XAI_API_KEY      = os.getenv("XAI_API_KEY")
MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY")
OPENAI_API_KEY   = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY   = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

OUT_DIR = Path("memory/episodes/souverain/senegal-petrole-gaz/jury")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Brief complet — script + contraintes + inventaire templates
# ---------------------------------------------------------------------------

BRIEF = """
Tu es un directeur éditorial senior spécialisé dans les formats YouTube éducatifs analytiques.
Tu vas évaluer un script pour une vidéo YouTube Mid-form de 6-7 minutes sur le pétrole et gaz du Sénégal.

Ton rôle : donner un avis critique, objectif et constructif. Tu n'es pas là pour valider — tu es là pour améliorer.
Réponds en français. Sois direct et précis. Pas de flatterie.

---

## CONTEXTE DE LA CHAÎNE

Nom : Souverain
Positionnement : analyste (ni militant, ni neutre)
Audience cible : francophone curieux à Paris, Tokyo, Montréal, Dakar — 25-45 ans, bac+3 dans un autre domaine
Ton : Provocateur Souverain — retourne le cadre narratif ambiant sans accuser personne directement

**4 règles fermes de la charte éditoriale :**
1. Pas de méchant désigné — uniquement systèmes, intérêts, bascules
2. Chaque chiffre = source vérifiée (Perplexity sonar-pro fait — chiffres validés)
3. Test "couper l'audio" — les visuels seuls ne codent pas de jugement moral
4. Multi-perspective explicite : au moins 2 voix factuellement citées (Dakar / majors / FMI / Pékin)

---

## FORMAT ET CONTRAINTES TECHNIQUES

- Durée cible : 6 min 30s
- Rythme narration : 140 mots/min MAX (si on dépasse, la voix court après les visuels)
- Mots cibles : ~900 mots (script actuel : ~910 mots — dans la cible)
- Structure : 4 actes (Anomalie / Démonstration / Mécanismes / Implication)
- 3-4 respirations obligatoires (pauses visuelles sans info nouvelle)
- Palier A YouTube : pas de mid-rolls, test rétention 65%+

**Règle densité cognitive :**
- 1 concept max par minute
- Re-hook toutes les 90 secondes minimum
- Chaque transition d'acte = signal visuel fort (changement de fond, plein écran)

---

## INVENTAIRE TEMPLATES VISUELS DISPONIBLES

Ces templates Remotion existent et sont production-ready. Les suggestions visuelles doivent
s'appuyer sur ces outils, ou signaler explicitement si un template manquant serait vraiment nécessaire.

**Cartes et géo :**
- CartoCaspian (Mapbox 2D éditorial, palette Sepia/Noir/Smoke) — zoom, pan, highlight pays
- MapboxGeoAfriqueV5 (dark, style signature chaîne) — globe vers pays
- GlobeLocationReveal V4 (dezoom globe entier)
- Overlay SVG sur Mapbox (points, frontières, labels animés)

**Data-viz :**
- FillScreen (remplissage liquide 0-100%, stat centrale) — idéal pour %
- BigStat (chiffre seul, impact maximal, 1-2s)
- PulseNumber (chiffre géant pulsant avec anneaux)
- StackedBars (2-4 barres verticales comparatives, podium)
- SmallMultiplesGrid (3-4 entités avec courbes divergentes, cream ou kraft)
- BarRace (classement animé horizontal)
- DualStat (deux entités côte à côte, stat chiffrée centrale)
- ScaleShock (deux cercles proportionnels — choc d'échelle)
- RadarPing (stats orbitales autour d'un centre)
- IconGrid (grille 4-6 icônes + stats — données multi-entrées)
- IconStat (icône géante + chiffre — 1 stat pilier)
- CountdownReveal (arc SVG + countUp + flash révélation)

**Narration et texte :**
- TypeReveal (typing lettre par lettre, mot-clé géant doré)
- BrutalHookSplit (photo 55% haut + typewriter bas, Ken Burns diagonal)
- BrutalHeadline (titre choc + photo B&W plein cadre)
- SpeechBubble (citation orale, portrait + bulle)

**Contexte et documents :**
- KraftCardDocClassifie (fiche acteur, tampon VÉRIFIÉ/CONTESTÉ/CLASSIFIÉ)
- DataCard (chiffre + source + contexte, kraft ou dark)
- NewsClipping V2 (article presse plein écran, crème ou grain)
- DateBar (marqueur temporel fullscreen ou bottom overlay)
- ArchiveFade (photo archive + annotations SVG dynamiques)
- Timeline (chronologie animée, 3-5 événements)
- ProcessFlow (flux vertical, 3-4 étapes + flèches + icônes)

**Effets et révélation :**
- GlitchReveal (stat corrompue → stabilisation → reveal net — style CRT)
- OdometerFlip (compteur slot machine — dates/chiffres)
- SplitFlap (tableau aéroport — lettres qui roulent)
- TimelineFracture (ligne brisée — rupture dramatique)
- CoinFlip (pièce 3D — deux faces d'un sujet)

**Manquant / à créer si vraiment nécessaire :**
- PieChart/camembert — pas disponible (remplacé par FillScreen + BigStat)
- Graphique linéaire autonome — SmallMultiplesGrid couvre ce besoin

---

## LE SCRIPT V1

---

### ACTE 1 — L'ANOMALIE (0:00 – 1:00)

[ANIM: Carte Afrique de l'Ouest, zoom progressif vers le Sénégal depuis l'Atlantique]

Tout le monde vous vend la même histoire sur le pétrole africain.

Soit c'est une catastrophe — la corruption, la malédiction, les multinationales qui pompent et repartent. Soit c'est une révolution — la souveraineté retrouvée, la richesse qui arrive enfin.

[TEXT: "Juin 2024 — Dakar"]

Personne ne vous explique comment ça marche vraiment.

[ANIM: Point lumineux apparaît à 100 km au large de Dakar — Sangomar]

En juin 2024, pour la première fois en soixante-quatre ans d'indépendance, le Sénégal a sorti du pétrole de son sous-sol marin. Pas quelques barils de test. Un champ entier, à plein régime prévu : cent mille barils par jour.

[PAUSE: 2s — chiffre reste à l'écran, carte tourne lentement]

Pour vous donner une idée : à quatre-vingts dollars le baril, c'est huit millions de dollars qui sortent de l'eau — chaque jour.

[TRANS: coupe nette — fond sombre, texte seul]

[TEXT: "La vraie question n'est pas combien le Sénégal va produire. C'est combien il va garder."]

[PAUSE: 2s]

Et ça, c'est une tout autre histoire.

---

### ACTE 2 — LA DÉMONSTRATION (1:00 – 2:45)

[ANIM: Carte offshore — 3 points apparaissent progressivement : Sangomar au sud, GTA au nord, Yakaar-Teranga au centre]

Le Sénégal n'a pas trouvé un gisement. Il en a trouvé trois.

Sangomar, d'abord — du pétrole brut, opéré par l'Australien Woodside Energy, avec Petrosen, l'entreprise nationale sénégalaise, qui détient dix-huit pour cent du projet.

[ANIM: Point GTA s'allume — frontière Sénégal/Mauritanie]

GTA ensuite — un champ gazier à cheval sur la frontière maritime avec la Mauritanie, opéré par le Britannique BP. En février 2025, il a commencé à produire du gaz naturel compressé pour l'export. En avril 2025, la première cargaison a quitté les côtes.

[PAUSE: 2s — carte tourne lentement, audio respire]

Le Sénégal n'est plus un aspirant. C'est un fournisseur réel, avec des acheteurs au bout — en Europe et en Asie, qui cherchent à diversifier leurs sources depuis la guerre en Ukraine.

[ANIM: Troisième point — Yakaar-Teranga]

Et il y a un troisième champ, Yakaar-Teranga. Aussi gazier, aussi offshore. Mais personne n'a encore décidé comment ce champ va être exploité. Il attend. Et plusieurs capitales le regardent avec intérêt.

[GRAPH: FillScreen 60% — "L'État touche environ 60% des revenus"]

Sur le papier, le gouvernement sénégalais affirme que l'État touche environ soixante pour cent des revenus au total — participations, taxes, royalties, tout compris.

[PAUSE: 1s]

Soixante pour cent. C'est la moyenne des pays producteurs émergents. Ni un scandale, ni un jackpot.

Mais voilà où ça devient intéressant.

---

### ACTE 3 — LES MÉCANISMES QUI DÉCIDENT (2:45 – 5:15)

[TRANS: Changement de fond — texture paper kraft, titre acte]
[TypeReveal: "Trois pays. Un seul choix différent."]

[SmallMultiplesGrid: 3 colonnes — Norvège / Congo / Botswana — courbes divergentes]

Avant de parler du Sénégal, regardez ces trois pays.

La Norvège découvre du pétrole en 1969. Elle crée un fonds souverain — une caisse spéciale réservée aux revenus du pétrole. Aujourd'hui, ce fonds vaut mille cinq cents milliards de dollars — soit deux cent quatre-vingts mille dollars par Norvégien.

Le Congo découvre du pétrole à peu près à la même époque. Aujourd'hui, c'est l'un des pays les plus endettés d'Afrique, avec une population parmi les plus pauvres du continent.

Le Botswana découvre des diamants en 1966 — l'un des pays les plus pauvres du monde à l'époque. Il construit des institutions solides autour de cette richesse naturelle. Aujourd'hui c'est l'un des pays les plus stables du continent.

Même ressource. Même époque. Trois résultats radicalement différents.

Ce qui a tout décidé, ce ne sont pas les ressources. Ce sont les mécanismes.

[PAUSE: 2s]

**Mécanisme 1 — Le contrat.**

[KraftCardDocClassifie — tampon "CONTESTÉ"]

Le gouvernement sénégalais affirme que l'État touche soixante pour cent. Mais ce chiffre, c'est une estimation officielle. La réalité dépend des contrats qui définissent comment les profits sont partagés entre l'État et les compagnies étrangères — et ces contrats ne sont pas tous publics.

En ce moment même, Woodside Energy est en contentieux avec l'administration fiscale sénégalaise — un redressement de plusieurs dizaines de millions d'euros que la compagnie conteste. Ce n'est pas anecdotique. C'est exactement le genre de friction qui révèle si les règles du jeu tiennent ou pas.

[DualStat — "Dakar" vs "Woodside — Sydney"]

**Mécanisme 2 — Le fonds souverain.**

[IconStat — icône Shield + "FONSIS"]

Le Sénégal a créé un fonds souverain — une caisse spéciale réservée aux revenus du pétrole, qu'on ne peut pas toucher pour payer les factures du quotidien. Il s'appelle le FONSIS. Il existe depuis avant même que le premier baril soit sorti. C'est une bonne nouvelle.

Mais les règles qui définissent comment l'alimenter, et surtout comment ne pas le vider, sont moins strictes que celles de la Norvège. Et le Fonds monétaire international, le FMI, tire la sonnette d'alarme : avec une dette publique qui dépasse soixante-dix pour cent du PIB — sur chaque euro que l'État dépense, soixante-dix centimes sont déjà empruntés — la tentation de dépenser cet argent maintenant, avant même qu'il soit arrivé, est réelle.

[FillScreen 70% — couleur alerte]

[ProcessFlow — FONSIS → Budget national → Vide]

**Mécanisme 3 — Qui regarde depuis les coulisses.**

[Mapbox overlay — Yakaar-Teranga, point clignotant]

Le troisième champ, Yakaar-Teranga, n'a pas encore trouvé son opérateur définitif. BP est présent à l'étape d'exploration, mais personne n'a encore décidé comment ce champ va être exploité. Des discussions avec des entreprises chinoises ont été rapportées. Rien de signé à ce stade — mais Pékin regarde.

Pourquoi ça compte ? Parce que l'Europe, sous pression climatique, ralentit ses investissements dans les nouveaux champs gaziers. Si les Occidentaux se retirent de Yakaar-Teranga, la question de qui prend la place — et à quelles conditions — va se poser très vite.

[PAUSE: 2s — carte, les trois champs visibles]

---

### ACTE 4 — L'IMPLICATION (5:15 – 6:30)

[GlobeLocationReveal — dezoom vers globe entier, Afrique de l'Ouest visible]

Voilà où en est le Sénégal.

Un pays qui, en dix mois, est passé de zéro à exportateur de pétrole et de gaz. Des garde-fous qui existent — le FONSIS, l'ITIE — l'organisme international qui pousse les États producteurs à publier leurs revenus pétroliers — et une loi qui oblige les compagnies étrangères à recruter et former des Sénégalais sur place.

Et des fragilités réelles aussi. Une dette élevée. Des contrats pas entièrement publics. Un troisième champ dont l'avenir dépend de qui sera à la table de négociation.

[SmallMultiplesGrid — 4 colonnes : Norvège / Congo / Botswana / Sénégal "?"]

Le Botswana et la Norvège n'ont pas réussi par accident. Ils ont construit des règles au moment précis où l'argent n'était pas encore là. C'est le moment le plus difficile pour le faire — et le seul où c'est encore possible.

[PAUSE: 2s]

Le Sénégal est exactement dans ce moment-là. Maintenant.

[TypeReveal — fond navy, texte gold]
[TEXT: "Les décisions prises dans les cinq prochaines années vont définir la prochaine génération."]

[PAUSE: 2s]

Si ce sujet vous intéresse, la prochaine vidéo examine ce que d'autres pays africains ont fait de leurs fonds souverains — et pourquoi les résultats vous surprendront.

[CTA abonnement discret]

---

## TES QUESTIONS DE JURY

Évalue le script sur ces 6 axes. Pour chaque axe : verdict (FORT / MOYEN / FAIBLE) + justification + correction concrète si MOYEN ou FAIBLE.

**AXE 1 — Hook (Acte 1)**
Le hook retourne-t-il le cadre narratif ambiant de manière efficace ? Est-ce que la phrase "Personne ne vous explique comment ça marche vraiment" crée suffisamment de tension pour retenir pendant 6 min ? Y a-t-il un meilleur angle d'attaque ?

**AXE 2 — Clarté vulgarisation**
Les 3 mécanismes (contrat, fonds souverain, Chine en coulisses) sont-ils expliqués de manière accessible à quelqu'un qui ne suit pas l'actualité économique africaine ? Où est-ce que le script risque de perdre le spectateur ?

**AXE 3 — Rythme et respiration**
Le script de ~910 mots tient-il la distance sur 6 min 30s ? Y a-t-il des zones de saturation cognitive (trop de concepts en trop peu de temps) ? Les 4 respirations sont-elles bien placées ?

**AXE 4 — Multi-perspective**
La charte exige au moins 2 perspectives factuellement citées. Le script présente : Dakar (60%), Woodside (contentieux), FMI (alarme dette), Pékin (intérêt). Est-ce suffisant ? Manque-t-il une voix importante ?

**AXE 5 — Charte Souverain (pas de méchant désigné)**
Y a-t-il des formulations qui glissent vers la désignation d'un coupable ? Le script reste-t-il dans l'analyse des mécanismes ou dérive-t-il vers le militantisme ?

**AXE 6 — Templates visuels**
En lisant les directions visuelles et l'inventaire des templates disponibles : est-ce que les choix visuels servent la narration ? Y a-t-il un moment où le visuel et l'audio ne se renforcent pas ? Suggères-tu un template différent pour un moment précis ? Si tu identifies un besoin visuel non couvert par les templates listés, nomme-le et justifie pourquoi c'est nécessaire.

---

Format de ta réponse :
## Verdict global (FORT / MOYEN / FAIBLE)
[2-3 phrases synthèse]

## AXE 1 — Hook : [FORT/MOYEN/FAIBLE]
[Justification + correction si besoin]

## AXE 2 — Clarté : [FORT/MOYEN/FAIBLE]
[...]

## AXE 3 — Rythme : [FORT/MOYEN/FAIBLE]
[...]

## AXE 4 — Multi-perspective : [FORT/MOYEN/FAIBLE]
[...]

## AXE 5 — Charte : [FORT/MOYEN/FAIBLE]
[...]

## AXE 6 — Visuels : [FORT/MOYEN/FAIBLE]
[...]

## Top 3 corrections prioritaires
1. [La plus urgente]
2. [La deuxième]
3. [La troisième]
"""

# ---------------------------------------------------------------------------
# Appels LLM
# ---------------------------------------------------------------------------

def call_gemini_pro():
    """Gemini 2.5 Pro Preview via Google genai SDK."""
    try:
        import google.genai as genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="models/gemini-3.1-pro-preview",
            contents=[BRIEF],
            config=genai.types.GenerateContentConfig(max_output_tokens=6000),
        )
        return response.text
    except Exception as e:
        return f"ERROR Gemini Pro: {e}"


def call_grok():
    """Grok-3 via xAI API."""
    if not XAI_API_KEY:
        return "ERROR: XAI_API_KEY missing"
    payload = {
        "model": "grok-3",
        "messages": [{"role": "user", "content": BRIEF}],
        "max_tokens": 6000,
        "temperature": 0.3,
    }
    r = requests.post(
        "https://api.x.ai/v1/chat/completions",
        headers={"Authorization": f"Bearer {XAI_API_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=300,
    )
    if r.status_code != 200:
        return f"ERROR Grok {r.status_code}: {r.text[:500]}"
    return r.json()["choices"][0]["message"]["content"]


def call_kimi():
    """Kimi K2 via Moonshot API."""
    if not MOONSHOT_API_KEY:
        return "ERROR: MOONSHOT_API_KEY missing"
    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": BRIEF}],
        "max_tokens": 6000,
        "temperature": 1,
    }
    r = requests.post(
        "https://api.moonshot.ai/v1/chat/completions",
        headers={"Authorization": f"Bearer {MOONSHOT_API_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=300,
    )
    if r.status_code != 200:
        return f"ERROR Kimi {r.status_code}: {r.text[:500]}"
    msg = r.json()["choices"][0]["message"]
    return msg.get("content") or msg.get("reasoning_content") or ""


def call_gpt4o():
    """GPT-4o via OpenAI API."""
    if not OPENAI_API_KEY:
        return "ERROR: OPENAI_API_KEY missing"
    payload = {
        "model": "gpt-4o",
        "messages": [{"role": "user", "content": BRIEF}],
        "max_tokens": 6000,
        "temperature": 0.3,
    }
    r = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=180,
    )
    if r.status_code != 200:
        return f"ERROR GPT-4o {r.status_code}: {r.text[:500]}"
    return r.json()["choices"][0]["message"]["content"]


TASKS = {
    "gemini-31-pro-preview": call_gemini_pro,
    "grok-3":                call_grok,
    "gpt-4o":                call_gpt4o,
    "kimi-k2":               call_kimi,
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f"\nJury Senegal petrole — 4 modeles en parallele")
    print(f"Gemini 2.5 Pro Preview + Grok-3 + GPT-4o + Kimi K2")
    print(f"Output -> {OUT_DIR}/\n")
    t0 = time.time()
    results = {}
    with ThreadPoolExecutor(max_workers=3) as ex:
        futures = {ex.submit(fn): name for name, fn in TASKS.items()}
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                verdict = fut.result()
                results[name] = verdict
                path = OUT_DIR / f"verdict-{name}.md"
                path.write_text(f"# Verdict {name}\n\n{verdict}\n", encoding="utf-8")
                print(f"[OK] {name} — {len(verdict)} chars — {path}")
            except Exception as e:
                results[name] = f"ERROR: {e}"
                print(f"[ERR] {name}: {e}")
    elapsed = time.time() - t0
    print(f"\nTermine en {elapsed:.0f}s")

    # Synthese rapide
    synth_path = OUT_DIR / "SYNTHESE.md"
    synth = "# Synthese Jury — Senegal petrole script V1\n\n"
    for name, verdict in results.items():
        synth += f"---\n\n## {name}\n\n{verdict}\n\n"
    synth_path.write_text(synth, encoding="utf-8")
    print(f"\nSynthese -> {synth_path}")


if __name__ == "__main__":
    main()
