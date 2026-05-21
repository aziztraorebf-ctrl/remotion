"""
Generation audio Senegal petrole & gaz — Script V2
- ElevenLabs V3 (Narratrice GeoAfrique v2, config max-style)
- Minimax Speech 2.8 HD (voice clone neutre)
Lancer : python3 memory/episodes/souverain/senegal-petrole-gaz/audio/generate-audio.py
"""

import os, requests, json, time, urllib.request
from pathlib import Path
import fal_client

OUT_DIR = Path("memory/episodes/souverain/senegal-petrole-gaz/audio")
OUT_DIR.mkdir(parents=True, exist_ok=True)

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE_ID = "z3gESu49naEZW8Af2Upm"  # Narratrice GeoAfrique v2

# Scan FR applique :
# - "royalties" conserve (terme technique passe en francais)
# - "Yakaar-Teranga" : pas de s final a prononcer -> OK
# - "GTA" : signe / acronyme -> lu lettre par lettre OK
# - "FONSIS" : acronyme -> OK
# - "ITIE" : nomme en entier dans le texte -> OK
# - "FMI" : nomme en entier -> OK
# - Chiffres en lettres : tous convertis (1969->mil neuf cent soixante-neuf, 60%->soixante pour cent, etc.)
# - Participes en e/ee fin de groupe : AUCUN detecte dans ce script
# - "ont + voyelle" : AUCUN detecte
# - Accents : presents partout

# Texte ElevenLabs avec audio tags V3
TTS_ELEVENLABS = """[tense] Tout le monde vous vend la même histoire sur le pétrole africain.

Soit c'est une catastrophe — la corruption, la malédiction, les multinationales qui pompent et repartent. Soit c'est une révolution — la souveraineté retrouvée, la richesse qui arrive enfin.

[pause]

Huit millions de dollars par jour. C'est ce que le Sénégal sort de l'eau depuis juin deux mille vingt-quatre — pour la première fois en soixante-quatre ans d'indépendance.

[pause]

Et pourtant, l'État n'est pas certain d'en garder la moitié.

[pause]

Entre la malédiction pétrolière et l'eldorado, il y a une mécanique plus complexe — et le Sénégal est en train de la tester en direct.

[calm] Le Sénégal n'a pas trouvé un gisement. Il en a trouvé trois.

Sangomar, d'abord — du pétrole brut, opéré par l'Australien Woodside Energy, avec Petrosen, l'entreprise nationale sénégalaise, qui détient dix-huit pour cent du projet.

GTA ensuite — un champ gazier à cheval sur la frontière maritime avec la Mauritanie, opéré par le Britannique BP. En février deux mille vingt-cinq, il a commencé à produire du gaz naturel compressé pour l'export. En avril deux mille vingt-cinq, la première cargaison a quitté les côtes.

[pause]

Le Sénégal n'est plus un aspirant. C'est un fournisseur réel, avec des acheteurs au bout — en Europe et en Asie, qui cherchent à diversifier leurs sources depuis la guerre en Ukraine.

Et il y a un troisième champ, Yakaar-Teranga. Aussi gazier, aussi offshore. Mais personne n'a encore décidé comment ce champ va être exploité. Il attend. Et plusieurs capitales le regardent avec intérêt.

Sur le papier, le gouvernement sénégalais affirme que l'État touche environ soixante pour cent des revenus au total — participations, taxes, royalties, tout compris.

[pause]

Soixante pour cent. C'est la moyenne des pays producteurs émergents. Ni un scandale, ni un jackpot.

Mais voilà où ça devient intéressant.

[dramatic tone] Avant de parler du Sénégal, regardez ces deux pays.

La Norvège découvre du pétrole en mil neuf cent soixante-neuf. Elle crée un fonds souverain — une caisse spéciale réservée aux revenus du pétrole. Aujourd'hui, ce fonds vaut mille cinq cents milliards de dollars — soit deux cent quatre-vingts mille dollars par Norvégien.

Le Congo découvre du pétrole à peu près à la même époque. Aujourd'hui, c'est l'un des pays les plus endettés d'Afrique, avec une population parmi les plus pauvres du continent.

Le Botswana a fait la même chose avec ses diamants dès mil neuf cent soixante-six — partir de rien, construire des institutions solides, devenir l'un des pays les plus stables du continent.

Même ressource. Même époque. [pause] Trois résultats radicalement différents.

Ce qui a tout décidé, ce ne sont pas les ressources. Ce sont les mécanismes.

[pause]

[tense] MÉCANISME UN — LE CONTRAT.

Le gouvernement sénégalais affirme que l'État touche soixante pour cent. Mais ce chiffre, c'est une estimation officielle. La réalité dépend des contrats qui définissent comment les profits sont partagés entre l'État et les compagnies étrangères — et ces contrats ne sont pas tous publics.

En ce moment même, Woodside Energy et l'administration sénégalaise ne s'entendent pas sur le calcul des revenus imposables — la compagnie défend son droit à récupérer ses coûts d'infrastructure massifs avant de partager les profits. Ce désaccord se joue à huis clos. C'est exactement le genre de friction qui révèle si les règles du jeu tiennent ou pas.

[pause]

MÉCANISME DEUX — LE PIÈGE DE LA DETTE.

Le Sénégal a créé un fonds souverain — une caisse spéciale réservée aux revenus du pétrole, qu'on ne peut pas toucher pour payer les factures du quotidien. Il s'appelle le FONSIS. Il existe depuis avant même que le premier baril soit sorti. C'est une bonne nouvelle.

Mais voilà le piège. Avec une dette publique qui équivaut à soixante-dix pour cent de la richesse annuelle du pays, le service de cette dette asphyxie déjà le budget. La tentation de piocher dans l'argent du pétrole pour payer les factures d'aujourd'hui est immense.

Le Fonds monétaire international — le FMI — tire la sonnette d'alarme. Et les règles qui définissent comment alimenter le FONSIS, et surtout comment ne pas le vider, sont moins rigides que celles de la Norvège.

[pause]

MÉCANISME TROIS — QUI REGARDE DEPUIS LES COULISSES.

Le troisième champ, Yakaar-Teranga. Gazier, offshore, déjà contractualisé entre Kosmos, BP et Petrosen — mais aucune décision finale d'investissement n'a encore été prise. Ce champ attend. Et pendant qu'il attend, plusieurs capitales regardent qui va financer son développement. Des discussions avec des entreprises chinoises ont été rapportées. Rien de signé à ce stade — mais Pékin regarde.

Pourquoi ça compte ? Parce que l'Europe, sous pression climatique, ralentit ses investissements dans les nouveaux champs gaziers. Si les Occidentaux se retirent de Yakaar-Teranga, la question de qui prend la place — et à quelles conditions — va se poser très vite.

[pause]

[solemn] Voilà où en est le Sénégal.

Un pays qui, en dix mois, est passé de zéro à exportateur de pétrole et de gaz. Des garde-fous qui existent — le FONSIS, l'ITIE — l'organisme international qui pousse les États producteurs à publier leurs revenus pétroliers — et une loi qui oblige les compagnies étrangères à recruter et former des Sénégalais sur place.

Et des fragilités réelles aussi. Une dette élevée. Des contrats pas entièrement publics. Un troisième champ dont l'avenir dépend de qui sera à la table de négociation.

La Norvège et le Botswana n'ont pas réussi par accident. Ils ont construit des règles au moment précis où l'argent n'était pas encore là. C'est le moment le plus difficile pour le faire — et le seul où c'est encore possible.

[pause]

Le Sénégal est exactement dans ce moment-là. Maintenant.

[pause]

[whispers] Les décisions prises dans les cinq prochaines années vont définir la prochaine génération.

[pause]

Si ce sujet vous intéresse, la prochaine vidéo examine ce que d'autres pays africains ont fait de leurs fonds souverains — et pourquoi les résultats vous surprendront."""

# Texte Minimax — propre (pas de tags V3, seules pauses <#0.X#>)
TTS_MINIMAX = """Tout le monde vous vend la même histoire sur le pétrole africain.

Soit c'est une catastrophe — la corruption, la malédiction, les multinationales qui pompent et repartent. Soit c'est une révolution — la souveraineté retrouvée, la richesse qui arrive enfin.

<#1.0#>

Huit millions de dollars par jour. C'est ce que le Sénégal sort de l'eau depuis juin deux mille vingt-quatre — pour la première fois en soixante-quatre ans d'indépendance.

<#0.8#>

Et pourtant, l'État n'est pas certain d'en garder la moitié.

<#0.8#>

Entre la malédiction pétrolière et l'eldorado, il y a une mécanique plus complexe — et le Sénégal est en train de la tester en direct.

Le Sénégal n'a pas trouvé un gisement. Il en a trouvé trois.

Sangomar, d'abord — du pétrole brut, opéré par l'Australien Woodside Energy, avec Petrosen, l'entreprise nationale sénégalaise, qui détient dix-huit pour cent du projet.

GTA ensuite — un champ gazier à cheval sur la frontière maritime avec la Mauritanie, opéré par le Britannique BP. En février deux mille vingt-cinq, il a commencé à produire du gaz naturel compressé pour l'export. En avril deux mille vingt-cinq, la première cargaison a quitté les côtes.

<#0.8#>

Le Sénégal n'est plus un aspirant. C'est un fournisseur réel, avec des acheteurs au bout — en Europe et en Asie, qui cherchent à diversifier leurs sources depuis la guerre en Ukraine.

Et il y a un troisième champ, Yakaar-Teranga. Aussi gazier, aussi offshore. Mais personne n'a encore décidé comment ce champ va être exploité. Il attend. Et plusieurs capitales le regardent avec intérêt.

Sur le papier, le gouvernement sénégalais affirme que l'État touche environ soixante pour cent des revenus au total — participations, taxes, royalties, tout compris.

<#0.5#>

Soixante pour cent. C'est la moyenne des pays producteurs émergents. Ni un scandale, ni un jackpot.

Mais voilà où ça devient intéressant.

Avant de parler du Sénégal, regardez ces deux pays.

La Norvège découvre du pétrole en mil neuf cent soixante-neuf. Elle crée un fonds souverain — une caisse spéciale réservée aux revenus du pétrole. Aujourd'hui, ce fonds vaut mille cinq cents milliards de dollars — soit deux cent quatre-vingts mille dollars par Norvégien.

Le Congo découvre du pétrole à peu près à la même époque. Aujourd'hui, c'est l'un des pays les plus endettés d'Afrique, avec une population parmi les plus pauvres du continent.

Le Botswana a fait la même chose avec ses diamants dès mil neuf cent soixante-six — partir de rien, construire des institutions solides, devenir l'un des pays les plus stables du continent.

Même ressource. Même époque. <#0.5#> Trois résultats radicalement différents.

Ce qui a tout décidé, ce ne sont pas les ressources. Ce sont les mécanismes.

<#1.0#>

MÉCANISME UN — LE CONTRAT.

Le gouvernement sénégalais affirme que l'État touche soixante pour cent. Mais ce chiffre, c'est une estimation officielle. La réalité dépend des contrats qui définissent comment les profits sont partagés entre l'État et les compagnies étrangères — et ces contrats ne sont pas tous publics.

En ce moment même, Woodside Energy et l'administration sénégalaise ne s'entendent pas sur le calcul des revenus imposables — la compagnie défend son droit à récupérer ses coûts d'infrastructure massifs avant de partager les profits. Ce désaccord se joue à huis clos. C'est exactement le genre de friction qui révèle si les règles du jeu tiennent ou pas.

<#1.0#>

MÉCANISME DEUX — LE PIÈGE DE LA DETTE.

Le Sénégal a créé un fonds souverain — une caisse spéciale réservée aux revenus du pétrole, qu'on ne peut pas toucher pour payer les factures du quotidien. Il s'appelle le FONSIS. Il existe depuis avant même que le premier baril soit sorti. C'est une bonne nouvelle.

Mais voilà le piège. Avec une dette publique qui équivaut à soixante-dix pour cent de la richesse annuelle du pays, le service de cette dette asphyxie déjà le budget. La tentation de piocher dans l'argent du pétrole pour payer les factures d'aujourd'hui est immense.

Le Fonds monétaire international — le FMI — tire la sonnette d'alarme. Et les règles qui définissent comment alimenter le FONSIS, et surtout comment ne pas le vider, sont moins rigides que celles de la Norvège.

<#1.0#>

MÉCANISME TROIS — QUI REGARDE DEPUIS LES COULISSES.

Le troisième champ, Yakaar-Teranga. Gazier, offshore, déjà contractualisé entre Kosmos, BP et Petrosen — mais aucune décision finale d'investissement n'a encore été prise. Ce champ attend. Et pendant qu'il attend, plusieurs capitales regardent qui va financer son développement. Des discussions avec des entreprises chinoises ont été rapportées. Rien de signé à ce stade — mais Pékin regarde.

Pourquoi ça compte ? Parce que l'Europe, sous pression climatique, ralentit ses investissements dans les nouveaux champs gaziers. Si les Occidentaux se retirent de Yakaar-Teranga, la question de qui prend la place — et à quelles conditions — va se poser très vite.

<#0.8#>

Voilà où en est le Sénégal.

Un pays qui, en dix mois, est passé de zéro à exportateur de pétrole et de gaz. Des garde-fous qui existent — le FONSIS, l'ITIE — l'organisme international qui pousse les États producteurs à publier leurs revenus pétroliers — et une loi qui oblige les compagnies étrangères à recruter et former des Sénégalais sur place.

Et des fragilités réelles aussi. Une dette élevée. Des contrats pas entièrement publics. Un troisième champ dont l'avenir dépend de qui sera à la table de négociation.

La Norvège et le Botswana n'ont pas réussi par accident. Ils ont construit des règles au moment précis où l'argent n'était pas encore là. C'est le moment le plus difficile pour le faire — et le seul où c'est encore possible.

<#0.8#>

Le Sénégal est exactement dans ce moment-là. Maintenant.

<#1.0#>

Les décisions prises dans les cinq prochaines années vont définir la prochaine génération.

<#0.8#>

Si ce sujet vous intéresse, la prochaine vidéo examine ce que d'autres pays africains ont fait de leurs fonds souverains — et pourquoi les résultats vous surprendront."""


def generate_elevenlabs():
    print("[ElevenLabs] Démarrage génération...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": TTS_ELEVENLABS,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.22,
            "similarity_boost": 0.55,
            "style": 0.55,
            "speed": 1.0,
        },
        "output_format": "mp3_44100_128",
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=120)
    if resp.status_code != 200:
        print(f"[ElevenLabs] ERREUR {resp.status_code}: {resp.text[:300]}")
        return None
    out_path = OUT_DIR / "senegal-petrole-elevenlabs-v1.mp3"
    out_path.write_bytes(resp.content)
    size_kb = len(resp.content) // 1024
    print(f"[ElevenLabs] Sauvegardé : {out_path} ({size_kb} KB)")
    return str(out_path)


def generate_minimax():
    print("[Minimax] Clonage voix depuis sample Niger Uranium...")
    sample_path = "public/souverain/niger-uranium/audio/narration-niger-uranium-v5.mp3"

    if not Path(sample_path).exists():
        print(f"[Minimax] Sample non trouvé : {sample_path}")
        print("[Minimax] Recherche d'un sample alternatif...")
        for alt in Path("public/souverain").rglob("narration-*.mp3"):
            sample_path = str(alt)
            print(f"[Minimax] Utilisation : {sample_path}")
            break

    # Upload sample
    print(f"[Minimax] Upload sample : {sample_path}")
    audio_url = fal_client.upload_file(sample_path)
    print(f"[Minimax] Sample uploadé : {audio_url}")

    # Clone voix
    clone_result = fal_client.subscribe(
        "fal-ai/minimax/voice-clone",
        arguments={
            "audio_url": audio_url,
            "noise_reduction": True,
            "need_volume_normalization": True,
            "model": "speech-02-hd",
        },
        with_logs=False,
    )
    custom_voice_id = clone_result["custom_voice_id"]
    print(f"[Minimax] Voice clonée : {custom_voice_id}")

    # TTS
    print("[Minimax] Génération TTS neutral...")
    tts_result = fal_client.subscribe(
        "fal-ai/minimax/speech-2.8-hd",
        arguments={
            "text": TTS_MINIMAX,
            "voice_setting": {
                "voice_id": custom_voice_id,
                "speed": 1.0,
                "vol": 1.0,
                "pitch": 0,
                "emotion": "neutral",
            },
            "audio_setting": {
                "sample_rate": 44100,
                "bitrate": 256000,
                "format": "mp3",
                "channel": 1,
            },
            "language_boost": "French",
            "output_format": "url",
        },
        with_logs=True,
    )
    audio_url_out = tts_result["audio"]["url"]
    print(f"[Minimax] Audio URL : {audio_url_out}")

    out_path = OUT_DIR / "senegal-petrole-minimax-neutral-v1.mp3"
    urllib.request.urlretrieve(audio_url_out, out_path)
    size_kb = out_path.stat().st_size // 1024
    print(f"[Minimax] Sauvegardé : {out_path} ({size_kb} KB)")

    # Sauvegarder le voice_id pour réutilisation
    voice_id_path = OUT_DIR / "minimax-voice-id.txt"
    voice_id_path.write_text(custom_voice_id)
    print(f"[Minimax] Voice ID sauvegardé : {voice_id_path}")

    return str(out_path), custom_voice_id


if __name__ == "__main__":
    import threading

    results = {}
    errors = {}

    def run_el():
        try:
            results["elevenlabs"] = generate_elevenlabs()
        except Exception as e:
            errors["elevenlabs"] = str(e)
            print(f"[ElevenLabs] EXCEPTION : {e}")

    def run_mm():
        try:
            results["minimax"] = generate_minimax()
        except Exception as e:
            errors["minimax"] = str(e)
            print(f"[Minimax] EXCEPTION : {e}")

    t1 = threading.Thread(target=run_el)
    t2 = threading.Thread(target=run_mm)

    print("=== Lancement génération parallèle ===")
    t1.start()
    t2.start()
    t1.join()
    t2.join()

    print("\n=== RÉSULTATS ===")
    for k, v in results.items():
        print(f"  {k}: {v}")
    for k, v in errors.items():
        print(f"  {k} ERREUR: {v}")
