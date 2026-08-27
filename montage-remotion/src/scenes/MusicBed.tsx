import {Audio} from "@remotion/media";
import {interpolate, staticFile} from "remotion";

type Props = {
  file: string;
  durationInFrames: number;
  trimBefore?: number;
  volume?: number;
  fadeFrames?: number;
};

export const MusicBed: React.FC<Props> = ({
  file,
  durationInFrames,
  trimBefore = 0,
  volume = 0.28,
  fadeFrames = 14,
}) => (
  <Audio
    src={staticFile(file)}
    trimBefore={trimBefore}
    durationInFrames={durationInFrames}
    volume={(frame) =>
      interpolate(
        frame,
        [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
        [0, volume, volume, 0],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
      )
    }
  />
);
