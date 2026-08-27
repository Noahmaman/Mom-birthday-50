import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

const words = ["Je t’aime", "Ti amo", "I love you", "Te quiero", "אני אוהב אותך", "Eu te amo"];

export const LoveWordsScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: "center", background: "radial-gradient(circle at 50% 50%, #9b3f4c, #3c162b 65%, #120713)", color: "white", display: "flex", justifyContent: "center", overflow: "hidden"}}>
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
              textShadow: "0 8px 30px rgba(0,0,0,.35)",
            }}
          >{word}</div>
        );
      })}
      <div style={{position: "absolute", bottom: 82, fontSize: 30, letterSpacing: 7, textTransform: "uppercase", color: "#f1c9c9"}}>Autour du monde, autour de toi</div>
    </AbsoluteFill>
  );
};
