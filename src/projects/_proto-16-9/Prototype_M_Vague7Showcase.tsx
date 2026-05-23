import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import { PortraitSilhouette } from "../_shared/components/layouts/PortraitSilhouette";
import { MosaiqueActeurs } from "../_shared/components/layouts/MosaiqueActeurs";
import { PassationPouvoir } from "../_shared/components/layouts/PassationPouvoir";

const SCENE_DURATION = 270;

export const Prototype_M_Vague7Showcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Scene 1 — PortraitSilhouette */}
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <PortraitSilhouette
            name="OUSMANE SONKO"
            title="PREMIER MINISTRE"
            country="SÉNÉGAL"
            countryCode="SN"
            facts={[
              "Ancien inspecteur des impôts",
              "Opposition radicale 2014-2024",
              "Nommé Premier ministre avril 2024",
            ]}
            status="EN FONCTION"
          />
        </SouverainScene>
      </Sequence>

      {/* Scene 2 — MosaiqueActeurs */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="slate-medium">
          <MosaiqueActeurs
            title="RÉSEAU — SANGOMAR OFFSHORE"
            actors={[
              { name: "BASSIROU DIOMAYE FAYE", role: "Président de la République", status: "ALLIE" },
              { name: "WOODSIDE ENERGY", role: "Opérateur principal", status: "NEUTRE" },
              { name: "PETROSEN", role: "Société nationale", status: "ALLIE" },
              { name: "MACKY SALL", role: "Ex-Président", status: "ANTAGONISTE" },
              { name: "FARBA NGOM", role: "Intermédiaire présumé", status: "CIBLE" },
              { name: "FMI", role: "Créancier international", status: "NEUTRE" },
            ]}
            connections={[[0, 2], [1, 2], [3, 4], [1, 3]]}
          />
        </SouverainScene>
      </Sequence>

      {/* Scene 3 — PassationPouvoir */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="kraft-dark">
          <PassationPouvoir
            outgoing={{ name: "MACKY SALL", role: "4e Président du Sénégal", period: "2012 - 2024" }}
            incoming={{ name: "BASSIROU DIOMAYE FAYE", role: "5e Président du Sénégal", period: "2024 - PRÉSENT" }}
            transitionYear="2024"
          />
        </SouverainScene>
      </Sequence>
    </AbsoluteFill>
  );
};
