#!/usr/bin/env bash
set -euo pipefail

# Load API key
GEMINI_API_KEY=$(grep GEMINI_API_KEY /Users/clawdbot/Workspace/remotion/.env | cut -d'=' -f2)
API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}"
OUTPUT_FILE="/Users/clawdbot/Workspace/remotion/src/projects/peste-1347-pixel/scripts/jury-gemini.md"

# Build the prompt as a variable
PROMPT='Tu es un historien et expert en sensibilite culturelle. Tu evalues des scripts de videos educatives pour leur PRECISION FACTUELLE, leur RESPECT des sujets sensibles, et leur RIGUEUR intellectuelle.

CONTEXTE : Nous produisons une video YouTube educative animee de 5 minutes en style pixel art '\''Terminal Tactique Medieval'\''. Audience : francophones curieux 25-45 ans. Ton : Provocateur.

Voici le script complet :

---
HOOK (0:00 - 0:13)

1347... La MOITIE de l'\''Europe va mourir.

Mais cette video ne parle pas de la maladie.

Elle parle de ce que les HUMAINS ont fait... quand ils ont cru que c'\''etait la fin du monde.

SEGMENT 1 : Les Flagellants (0:13 - 0:55)

Des foules de centaines -- parfois DIX MILLE personnes -- traversent l'\''Europe en se fouettant jusqu'\''au sang.

Ils s'\''appellent les Freres de la Croix. Trente-trois jours et demi de marche... un pour chaque annee de la vie du Christ.

Trois seances par jour. A genoux. En croix. Avec des fouets garnis de pointes de fer.

Leur logique ? Dieu punit l'\''humanite par la peste. Donc il faut souffrir PLUS... pour qu'\''il arrete.

Spoiler... ca n'\''a pas marche.

Ca a meme EMPIRE ! Parce que ces processions... propageaient la peste encore plus vite.

SEGMENT 2 : Les Boucs Emissaires (0:55 - 1:50)

Quand les humains ont peur et ne comprennent pas... ils cherchent quelqu'\''un a blamer.

En 1349, la rumeur se repand -- les Juifs empoisonnent les puits.

A Strasbourg, le quatorze fevrier 1349 -- jour de la Saint-Valentin -- on brule deux mille personnes sur un cimetiere.

A Mayence... six mille en un seul jour.

Au total, trois cent cinquante pogroms. Des communautes entieres... effacees.

Le plus tordu ? Les elites locales savaient que c'\''etait faux. Mais elles devaient de l'\''argent aux preteurs juifs. Alors elles ont laisse faire le massacre... et les dettes ont disparu avec les victimes.

SEGMENT 3 : La Fuite des Elites (1:50 - 2:15)

Pendant que les pauvres meurent dans les rues... les riches font leurs valises.

A Florence, Boccaccio decrit des nobles qui partent s'\''installer a la campagne... pour boire du vin et raconter des histoires.

Pendant ce temps, la mortalite chez les pauvres est DEUX FOIS plus elevee que chez les riches.

Ca vous rappelle quelque chose ?

Jets prives, iles privees, confinement en villa... Meme pandemie. Meme reflexe. Six siecles plus tard.

SEGMENT 4 : Les Remedes (2:15 - 2:45)

Et la medecine ? -- Encore pire.

Les medecins de peste portent un masque a bec... rempli de fleurs et de vinaigre.

Leur theorie ? La maladie vient du mauvais air. Donc si ca sent bon... ca guerit.

Autres remedes -- poser un cul de poulet sur les bubons. Boire du vinaigre a l'\''ail... le Vinaigre des Quatre Voleurs. Ou mon prefere -- vivre volontairement dans les egouts, en pensant que la puanteur repousserait la peste.

SEGMENT 5 : Le Miroir (2:45 - 3:20)

Alors... Recapitulons.

1349 -- flagellants qui se torturent. 2020 -- antivax qui boivent de la javel.

1349 -- on brule des Juifs accuses d'\''empoisonner les puits. 2020 -- on attaque des Asiatiques accuses d'\''avoir cree le virus.

1349 -- les riches fuient a la campagne. 2020 -- les riches fuient en jet prive.

1349 -- on pose un poulet sur les bubons. 2020 -- on avale de l'\''ivermectine pour chevaux.

Six cent soixante-treize ans d'\''ecart... Et le script humain... n'\''a pas change d'\''une seule ligne.

La prochaine pandemie arrivera... Et TOI... tu reagiras comment ?
---

Evalue ce script selon les criteres suivants :

1. PRECISION FACTUELLE : Les faits historiques mentionnes sont-ils exacts ? Y a-t-il des simplifications abusives ou des erreurs ?
2. SENSIBILITE CULTURELLE : Le traitement des pogroms antisemites est-il respectueux et factuel ? Les paralleles avec le COVID sont-ils pertinents ou forces ?
3. NUANCE : Le script evite-t-il les raccourcis intellectuels ? Ou tombe-t-il dans la simplification excessive ?
4. FORMULATIONS PROBLEMATIQUES : Y a-t-il des phrases qui pourraient etre mal interpretees, sorties de leur contexte, ou utilisees de maniere malveillante ?
5. EQUILIBRE : Le script traite-t-il tous les groupes mentionnes de maniere equitable, ou prend-il position implicitement ?
6. SOURCES : Les donnees chiffrees (2000 a Strasbourg, 6000 a Mayence, 350 pogroms, mortalite 2x chez les pauvres) sont-elles fiables ?
7. SUGGESTIONS : 3 ameliorations concretes pour renforcer la rigueur sans perdre le ton provocateur.

Reponds en francais. Sois exigeant academiquement.'

# Build JSON payload using jq for proper escaping
PAYLOAD=$(jq -n --arg text "$PROMPT" '{
  "contents": [{"parts": [{"text": $text}]}],
  "generationConfig": {"temperature": 0.7, "maxOutputTokens": 4096}
}')

echo "Sending request to Gemini API..."

# Make the API call
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Extract the text content from the response
TEXT=$(echo "$RESPONSE" | jq -r '.candidates[0].content.parts[0].text // empty')

if [ -z "$TEXT" ]; then
  echo "ERROR: No text in response. Full response:"
  echo "$RESPONSE" | jq .
  exit 1
fi

# Save to markdown file
{
  echo "# Jury Gemini - Evaluation du Script Peste 1347"
  echo ""
  echo "> Modele : gemini-2.5-flash | Temperature : 0.7 | Date : $(date '+%Y-%m-%d %H:%M')"
  echo ""
  echo "---"
  echo ""
  echo "$TEXT"
} > "$OUTPUT_FILE"

echo "Evaluation saved to: $OUTPUT_FILE"
