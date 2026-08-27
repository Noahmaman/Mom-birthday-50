import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

export const PassportScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: "center", background: "radial-gradient(circle at 50% 45%, #164760 0%, #071c2b 72%)", color: "#f7e8c7", display: "flex", justifyContent: "center", overflow: "hidden", perspective: 1600}}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 620,
          borderRadius: 30,
          background: "linear-gradient(145deg, #754436, #3d2020)",
          border: "4px solid rgba(240,199,124,.5)",
          boxShadow: "0 40px 120px rgba(0,0,0,.5)",
          rotate: `${interpolate(frame, [0, 110], [-3, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}deg`,
          scale: interpolate(frame, [0, 28, 118, 149], [0.75, 1, 1, 1.2], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      >
        <div style={{position: "absolute", inset: 22, border: "2px solid rgba(240,199,124,.58)", borderRadius: 20}} />
        <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: interpolate(frame, [12, 38, 118, 145], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>
          <div style={{fontSize: 34, letterSpacing: 12, textTransform: "uppercase"}}>Passeport</div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 108, fontStyle: "italic", marginTop: 42}}>Yael</div>
          <div style={{fontSize: 36, letterSpacing: 4, marginTop: 18}}>50 ans · un voyage autour de toi</div>
          <div style={{fontSize: 68, marginTop: 34}}>✈</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
