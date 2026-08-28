import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

const words = ["Je t’aime", "Ti amo", "I love you", "Te quiero", "אני אוהב אותך", "Eu te amo"];

export const LoveWordsScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: "center", background: "radial-gradient(circle at 50% 42%, #fff7dc, #eadfce 70%, #d8c7b2)", color: "#16181d", display: "flex", justifyContent: "center", overflow: "hidden"}}>
      {words.map((word, index) => {
        const start = index * 28;
        return (
          <div
            key={word}
            style={{
              position: "absolute",
              fontFamily: "Georgia, serif",
              fontSize: 118,
              fontStyle: "italic",
              opacity: interpolate(frame, [start, start + 8, start + 26, start + 34], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1)}),
              scale: interpolate(frame, [start, start + 34], [0.9, 1.05], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
              textShadow: "0 8px 30px rgba(80,55,35,.2)",
            }}
          >{word}</div>
        );
      })}
      <div style={{position: "absolute", bottom: 82, fontSize: 30, letterSpacing: 7, textTransform: "uppercase", color: "#8f5f66"}}>Autour du monde, autour de toi</div>
    </AbsoluteFill>
  );
};
