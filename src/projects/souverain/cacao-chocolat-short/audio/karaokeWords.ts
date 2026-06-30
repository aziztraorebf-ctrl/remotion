// Helper karaoke PARTAGE (cacao-chocolat-short).
// Whisper coupe les ELISIONS : "l'or" -> ["l","or"], "n'est" -> ["n","est"], "qu'une" -> ["qu","une"]...
// buildDisplayWords recolle l/d/qu/n/t/j/c/s/m + mot suivant en un seul token affiche "l'or",
// en conservant les timings (start du 1er fragment, end du dernier) et un index "covers" des fragments fusionnes.
// Source de verite extraite de B5Pont (2026-06-29), mutualisee pour harmoniser B1..B5.

export type RawWord = { word: string; start: number; end: number };
export type DispWord = { text: string; start: number; end: number; covers: number[] };

const ELISIONS = new Set(["l", "d", "qu", "n", "t", "j", "c", "s", "m"]);

export const buildDisplayWords = (words: RawWord[]): DispWord[] => {
  const out: DispWord[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const lower = w.word.toLowerCase();
    if (ELISIONS.has(lower) && i + 1 < words.length && words[i + 1].word) {
      const nxt = words[i + 1];
      out.push({ text: `${w.word}'${nxt.word}`, start: w.start, end: nxt.end, covers: [i, i + 1] });
      i++; // on a consomme le mot suivant
    } else if (w.word) {
      out.push({ text: w.word, start: w.start, end: w.end, covers: [i] });
    } else {
      out.push({ text: "", start: w.start, end: w.end, covers: [i] });
    }
  }
  return out;
};
