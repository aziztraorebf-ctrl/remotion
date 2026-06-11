// SahelContext — contrat moteur <-> Parties (refactor V5).
//
// La War-Map a un ETAT CONTINU (jetons/taches persistent, camera glisse sans
// coupe). On ne peut donc PAS concatener des fichiers independants facon
// Atlas/Souverain. Le moteur (SahelWarMapEngine) detient carte + projection geo
// + camera + etat + grain/vignette + audio, et passe a chaque <PartieX> ce
// CONTEXTE. Chaque Partie est un composant PUR qui dessine SA couche par-dessus
// la carte, sans posseder la map.
//
// `project` est une CLOSURE capturant la map courante, reconstruite a chaque
// frame DANS la boucle de rendu du moteur (apres map.jumpTo). lon/lat -> px ecran.

export type ScreenPoint = { x: number; y: number };

export type SahelRenderContext = {
  /** Frame absolue Remotion (useCurrentFrame). */
  frame: number;
  /** Dimensions composition (px). */
  width: number;
  height: number;
  /**
   * Projette une coordonnee geo lon/lat -> pixel ecran, via la map courante
   * (deja positionnee par jumpTo a cette frame). Closure capturee par le moteur.
   */
  project: (lon: number, lat: number) => ScreenPoint;
  /**
   * Etat de controle territorial a cette frame (0..1), si pertinent pour la
   * partie. 0 = rien, 1 = sature. Pilote par le moteur (sahelJalonAt / tGlobal).
   */
  controlAt: number;
  /**
   * Facteur de respiration / color-pacing global (0..1) — battement lent
   * partage pour synchroniser les pulses de couleur entre couches.
   */
  breathe: number;
};
