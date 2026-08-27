import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import type {PlatformMedia} from "../data";

type Props = {photos: PlatformMedia[]; framesPerPhoto: number; title: string; subtitle: string};

export const PhotoSlideshow: React.FC<Props> = ({photos, framesPerPhoto, title, subtitle}) => {
  const frame = useCurrentFrame();
  const index = Math.min(Math.floor(frame / framesPerPhoto), Math.max(photos.length - 1, 0));
  const nextIndex = Math.min(index + 1, Math.max(photos.length - 1, 0));
  const localFrame = frame % framesPerPhoto;
  const fadeStart = Math.max(framesPerPhoto - 8, 0);
  const current = photos[index];
  const next = photos[nextIndex];
  if (!current) return <AbsoluteFill style={{backgroundColor: "#071c2b"}} />;
  const imageStyle: React.CSSProperties = {position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain"};
  return (
    <AbsoluteFill style={{backgroundColor: "#071c2b", overflow: "hidden"}}>
      <Img src={staticFile(current.file)} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(48px) brightness(.42) saturate(.8)", scale: 1.15}} />
      <Img
        src={staticFile(current.file)}
        style={{
          ...imageStyle,
          opacity: interpolate(localFrame, [fadeStart, framesPerPhoto], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          scale: interpolate(localFrame, [0, framesPerPhoto], [1, 1.045], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1)}),
        }}
      />
      {next ? <Img src={staticFile(next.file)} style={{...imageStyle, opacity: interpolate(localFrame, [fadeStart, framesPerPhoto], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}} /> : null}
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(7,28,43,.5), transparent 34%, rgba(7,28,43,.62))"}} />
      <div style={{position: "absolute", left: 92, top: 74, color: "white", textShadow: "0 4px 24px #000"}}>
        <div style={{fontFamily: "Georgia, serif", fontSize: 68}}>{title}</div>
        <div style={{fontSize: 27, marginTop: 8, letterSpacing: 2.2, color: "#f0c77c"}}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};
