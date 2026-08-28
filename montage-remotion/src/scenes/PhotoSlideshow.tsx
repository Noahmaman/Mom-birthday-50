import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import type {PlatformMedia} from "../data";
import {CoverBackground} from "./CoverBackground";
import {MusicBed} from "./MusicBed";

type Props = {
  photos: PlatformMedia[];
  framesPerPhoto: number;
  title: string;
  subtitle?: string;
  musicFile?: string;
  musicTrimBefore?: number;
  musicVolume?: number;
  showCaption?: boolean;
  badgeText?: string;
  imageObjectFit?: "contain" | "cover";
};

export const PhotoSlideshow: React.FC<Props> = ({
  photos,
  framesPerPhoto,
  title,
  subtitle,
  musicFile,
  musicTrimBefore = 0,
  musicVolume = 0.34,
  showCaption = true,
  badgeText,
  imageObjectFit = "contain",
}) => {
  const frame = useCurrentFrame();
  const index = Math.min(Math.floor(frame / framesPerPhoto), Math.max(photos.length - 1, 0));
  const nextIndex = Math.min(index + 1, Math.max(photos.length - 1, 0));
  const thirdIndex = Math.min(index + 2, Math.max(photos.length - 1, 0));
  const localFrame = frame % framesPerPhoto;
  const fadeStart = Math.max(framesPerPhoto - 7, 0);
  const current = photos[index];
  const next = photos[nextIndex];
  const third = photos[thirdIndex];
  const showParallaxGrid = index % 6 === 0 && Boolean(next && third);

  if (!current) return <AbsoluteFill style={{backgroundColor: "#f5c443"}} />;

  return (
    <AbsoluteFill style={{backgroundColor: "#f5c443", overflow: "hidden"}}>
      {musicFile ? <MusicBed file={musicFile} durationInFrames={photos.length * framesPerPhoto} trimBefore={musicTrimBefore} volume={musicVolume} /> : null}
      <CoverBackground soft />
      {showParallaxGrid ? (
        <div style={{display: "flex", gap: 34, inset: "8% 5%", position: "absolute"}}>
          {[current, next, third].map((photo, column) => (
            <div
              key={`${photo.id}-${column}`}
              style={{
                backgroundColor: "#fff7dc",
                border: "5px solid #16181d",
                borderRadius: 22,
                boxShadow: "13px 15px 0 rgba(22,24,29,.3)",
                flex: 1,
                overflow: "hidden",
                rotate: `${column === 0 ? -2 : column === 1 ? 1.5 : -1}deg`,
                translate: `0px ${interpolate(localFrame, [0, framesPerPhoto], [column % 2 === 0 ? 54 : -48, column % 2 === 0 ? -34 : 42], {easing: Easing.bezier(0.2, 0.8, 0.2, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp"})}px`,
              }}
            >
              <Img src={staticFile(photo.file)} style={{height: "100%", objectFit: "cover", scale: 1.06, width: "100%"}} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <Img src={staticFile(current.file)} style={{filter: "blur(34px) brightness(.58) saturate(.65)", height: "100%", inset: 0, objectFit: "cover", opacity: 0.7, position: "absolute", scale: 1.14, width: "100%"}} />
          <div style={{backgroundColor: "#eadfce", border: "5px solid #16181d", borderRadius: 22, boxShadow: "16px 18px 0 rgba(22,24,29,.34)", inset: "5% 8%", overflow: "hidden", position: "absolute"}}>
            <Img
              src={staticFile(current.file)}
              style={{
                height: "100%",
                objectFit: imageObjectFit,
                opacity: interpolate(localFrame, [fadeStart, framesPerPhoto], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
                scale: interpolate(localFrame, [0, framesPerPhoto], [1.02, 1.075], {easing: Easing.bezier(0.2, 0.8, 0.2, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
                width: "100%",
              }}
            />
            {next ? <Img src={staticFile(next.file)} style={{height: "100%", inset: 0, objectFit: imageObjectFit, opacity: interpolate(localFrame, [fadeStart, framesPerPhoto], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), position: "absolute", width: "100%"}} /> : null}
          </div>
        </>
      )}
      {showCaption ? (
        <div style={{backgroundColor: "#ef4770", border: "4px solid #16181d", bottom: 42, boxShadow: "9px 10px 0 rgba(22,24,29,.32)", color: "#fff7dc", left: 62, padding: "15px 24px 17px", position: "absolute", rotate: "-1deg"}}>
          <div style={{fontFamily: "Georgia, serif", fontSize: 49, fontWeight: 700}}>{title}</div>
          {subtitle ? <div style={{color: "#fff7dc", fontSize: 23, letterSpacing: 1.5, marginTop: 3}}>{subtitle}</div> : null}
        </div>
      ) : null}
      {badgeText ? (
        <div style={{backgroundColor: "#fff7dc", border: "4px solid #16181d", borderRadius: 999, boxShadow: "9px 10px 0 rgba(22,24,29,.34)", color: "#16181d", fontSize: 27, fontWeight: 800, padding: "16px 24px", position: "absolute", right: 66, top: 54}}>
          💛 {badgeText}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
