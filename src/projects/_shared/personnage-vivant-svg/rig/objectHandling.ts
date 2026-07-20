/**
 * objectHandling.ts — machine a etats REUTILISABLE : un perso ramasse un objet, le TIENT (colle a la main),
 * le transporte, puis le DEPOSE dans un contenant. Validee sur HistoirePlanteur (cacao, 2026-06-30).
 * Doc : ../PERSONNAGE-VIVANT-INDEX.md (recette "manipuler un objet").
 *
 * ⛔ Principe-cle (corrige avec Aziz) : l'objet est TOUJOURS colle a la position REELLE de la main
 *    (handScene, calculee par computePose) tant qu'il est tenu. JAMAIS de glissade autonome de l'objet vers
 *    une cible — c'est la MAIN (donc le bras/le corps) qui l'amene. L'objet ne disparait qu'au depot.
 *
 * Usage (la scene fournit les frames-cles + la position main courante + la position-sol de depart) :
 *   const st = objectState({ frame, fGrab, fDrop, handX, handY, groundX, groundY });
 *   // st.visible -> dessiner l'objet a (st.x, st.y) ; st.deposited -> incrementer le contenu du contenant.
 */

export type ObjectHandlingInput = {
  frame: number;
  fGrab: number;     // frame ou la main saisit l'objet (HOLD) -> objet passe "en main"
  fDrop: number;     // frame ou l'objet est depose (entre dans le contenant) -> objet disparait
  handX: number;     // position SCENE courante de la main (computePose -> x + frontHandX*scale)
  handY: number;
  groundX: number;   // position SCENE de l'objet au sol (avant saisie)
  groundY: number;
};

export type ObjectState = {
  visible: boolean;  // l'objet doit-il etre dessine ?
  inHand: boolean;   // est-il tenu (colle a la main) ?
  deposited: boolean;// a-t-il ete depose (contenu du contenant +1) ?
  x: number;
  y: number;
  justGrabbedT: number; // 0..1 sur ~10 frames apres la saisie (pour un flash de prise optionnel)
};

export function objectState({ frame, fGrab, fDrop, handX, handY, groundX, groundY }: ObjectHandlingInput): ObjectState {
  const inHand = frame >= fGrab && frame < fDrop;
  const deposited = frame >= fDrop;
  const visible = frame < fDrop; // apres le depot, l'objet "fait partie" du contenant (gere par la scene)
  const x = inHand ? handX : groundX;
  const y = inHand ? handY : groundY;
  const justGrabbedT = Math.max(0, Math.min(1, (frame - fGrab) / 10));
  return { visible, inHand, deposited, x, y, justGrabbedT };
}

/**
 * depotStopX — ou le CORPS doit s'arreter pour que la MAIN tendue arrive au-dessus du contenant.
 * (Sinon le corps se met SUR le contenant et la main tendue le depasse — bug corrige 2026-06-30.)
 *   containerX : position scene du contenant. frontHandLocalX : computePose(depot).frontHandX. scale : MAN_S.
 */
export function depotStopX(containerX: number, frontHandLocalX: number, scale: number): number {
  return containerX - frontHandLocalX * scale;
}

/**
 * handoffState — machine a etats pour un transfert d'objet MAIN-A-MAIN entre 2 persos (recette "passer-objet").
 * Meme principe que objectState (JAMAIS de glissade autonome) : l'objet suit la main A jusqu'au HOLD, puis
 * la main B. Les 2 mains fournies sont deja en coordonnees SCENE (handAX/Y, handBX/Y au frame courant).
 *
 *   const st = handoffState({ frame, fHold, fRelease, handAX, handAY, handBX, handBY });
 *   // avant fHold -> objet colle a A. entre fHold et fRelease -> HOLD (les 2 mains sont proches, objet fixe
 *   // au point de contact). apres fRelease -> objet colle a B.
 */
export type HandoffInput = {
  frame: number;
  fHold: number;    // frame de contact (les 2 mains se rejoignent) -> debut du HOLD
  fRelease: number;  // fin du HOLD -> l'objet devient enfant de la main B
  handAX: number; handAY: number; // main A (donneur), coords scene, au frame courant
  handBX: number; handBY: number; // main B (receveur), coords scene, au frame courant
  // point de contact FIGE (calcule par la scene UNE FOIS a fHold, ex. via computePose au frame fHold) —
  // evite que l'objet "glisse" si les mains bougent encore legerement pendant le HOLD.
  contactX: number; contactY: number;
};

export type HandoffState = {
  x: number;
  y: number;
  holding: "A" | "hold" | "B";
};

export function handoffState({ frame, fHold, fRelease, handAX, handAY, handBX, handBY, contactX, contactY }: HandoffInput): HandoffState {
  if (frame < fHold) return { x: handAX, y: handAY, holding: "A" };
  if (frame < fRelease) return { x: contactX, y: contactY, holding: "hold" };
  return { x: handBX, y: handBY, holding: "B" };
}
