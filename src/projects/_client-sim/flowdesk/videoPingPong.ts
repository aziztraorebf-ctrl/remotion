// Ping-pong pour OffthreadVideo — étire un clip source court sur une durée de séquence
// plus longue en alternant clip normal / clip pré-inversé (ffmpeg -vf reverse), sans
// coupure de raccord dure (dernier frame d'un segment = premier frame du suivant).
// OffthreadVideo n'a pas de lecture inversée native (limitation navigateur, playbackRate
// négatif non supporté) — la version inversée est donc un fichier généré à part, PAS un
// seek dynamique frame-par-frame (trop lent au render + casse le SFX embarqué).

// Retourne l'index de segment (0 = clip normal, 1 = clip inversé, alterne ensuite) et la
// frame locale dans ce segment, pour une frame donnée de la séquence Remotion.
export function pingPongSegment(opts: {
  frame: number;
  clipFrameCount: number;
}): { reversed: boolean; localFrame: number } {
  const { frame, clipFrameCount } = opts;
  const rel = Math.max(0, frame);
  const segmentIdx = Math.floor(rel / clipFrameCount);
  const localFrame = rel % clipFrameCount;
  const reversed = segmentIdx % 2 === 1;
  return { reversed, localFrame };
}
