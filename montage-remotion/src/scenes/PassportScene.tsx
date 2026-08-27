import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {CoverBackground} from "./CoverBackground";
import {MusicBed} from "./MusicBed";

export const PassportScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: "#f5c443", color: "#16181d", overflow: "hidden", perspective: 1600}}>
      <MusicBed file="audio/music/the-passenger.mp3" durationInFrames={150} trimBefore={1440} volume={0.34} />
      <CoverBackground soft />
      <div
        style={{
          backgroundColor: "#fff7dc",
          border: "6px solid #16181d",
          borderRadius: 26,
          boxShadow: "22px 25px 0 rgba(22,24,29,.38)",
          height: 930,
          left: 180,
          overflow: "hidden",
          position: "absolute",
          rotate: interpolate(frame, [0, 34], ["-8deg", "-2deg"], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          scale: interpolate(frame, [0, 28, 126, 149], [0.72, 1, 1, 1.12], {easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          top: 75,
          width: 665,
        }}
      >
        <Img src={staticFile("design/cover-anniv.jpg")} style={{filter: "saturate(.76) contrast(1.04) brightness(.94)", height: "100%", objectFit: "cover", width: "100%"}} />
      </div>
      <div
        style={{
          backgroundColor: "rgba(255,247,220,.94)",
          border: "5px solid #16181d",
          boxShadow: "16px 18px 0 rgba(22,24,29,.34)",
          opacity: interpolate(frame, [18, 42, 118, 146], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          padding: "42px 50px",
          position: "absolute",
          right: 150,
          rotate: "2deg",
          top: 260,
          translate: interpolate(frame, [18, 42], ["80px 0px", "0px 0px"], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          width: 720,
        }}
      >
        <div style={{color: "#ef4770", fontSize: 28, fontWeight: 800, letterSpacing: 5, textTransform: "uppercase"}}>Le film d’anniversaire</div>
        <div style={{fontFamily: "Georgia, serif", fontSize: 96, fontStyle: "italic", fontWeight: 700, marginTop: 22}}>Yael, 50 ans</div>
        <div style={{fontSize: 35, fontWeight: 600, lineHeight: 1.25, marginTop: 20}}>Un voyage autour du monde,<br />raconté par tous ceux qui t’aiment.</div>
        <div style={{fontSize: 64, marginTop: 28}}>✈️ 💛 🌍</div>
      </div>
    </AbsoluteFill>
  );
};
