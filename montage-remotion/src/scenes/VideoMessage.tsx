import {Video} from "@remotion/media";
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

type Props = {file: string; name: string; place?: string; trimBefore?: number; volume?: number};

export const VideoMessage: React.FC<Props> = ({file, name, place, trimBefore = 0, volume = 1}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const src = staticFile(file);
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 42%, #173f50 0%, #071c2b 72%)", overflow: "hidden"}}>
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(7,28,43,.28) 0%, rgba(7,28,43,0) 48%, rgba(7,28,43,.7) 100%)"}} />
      <Video
        src={src}
        trimBefore={trimBefore}
        volume={volume}
        objectFit="contain"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: interpolate(frame, [0, 12, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 92,
          bottom: 76,
          color: "white",
          opacity: interpolate(frame, [8, 28], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1)}),
          translate: `${interpolate(frame, [8, 28], [-28, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}px 0px`,
          textShadow: "0 3px 24px rgba(0,0,0,.8)",
        }}
      >
        <div style={{fontSize: 48, fontWeight: 650, letterSpacing: -1}}>{name}</div>
        {place ? <div style={{marginTop: 6, fontSize: 28, color: "#f0c77c", letterSpacing: 1.5}}>{place}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
