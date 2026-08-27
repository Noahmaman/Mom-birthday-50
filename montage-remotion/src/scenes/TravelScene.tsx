import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

type Props = {from: string; to: string; chapter: string; accent?: string};

export const TravelScene: React.FC<Props> = ({from, to, chapter, accent = "#f0c77c"}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [16, 126], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1)});
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 75% 20%, rgba(49,135,160,.34), transparent 34%), linear-gradient(145deg, #071c2b, #0d3a4d)", color: "white", overflow: "hidden"}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
        <g opacity="0.19" fill="none" stroke="#cae6e6" strokeWidth="3">
          <path d="M80 280 C260 150 420 200 515 330 C650 510 780 400 920 250 C1080 80 1340 130 1510 260 C1670 390 1720 590 1610 760 C1470 970 1130 970 980 810 C840 660 680 730 520 850 C330 990 90 840 95 610 C98 470 170 390 80 280Z" />
          <path d="M580 190 C510 300 525 440 640 530 C720 595 760 710 710 865" />
          <path d="M1210 220 C1130 350 1170 510 1335 580 C1460 635 1490 740 1400 860" />
        </g>
        <path d="M260 690 C620 260 1170 220 1610 620" fill="none" stroke={accent} strokeWidth="5" strokeDasharray="12 18" opacity="0.82" />
      </svg>
      <div style={{position: "absolute", left: 260, top: 655, width: 22, height: 22, borderRadius: "50%", background: accent, boxShadow: `0 0 0 12px ${accent}25`}} />
      <div
        style={{
          position: "absolute",
          left: 250 + progress * 1345,
          top: 640 - Math.sin(progress * Math.PI) * 340,
          fontSize: 74,
          color: accent,
          rotate: `${interpolate(progress, [0, 0.5, 1], [-35, 4, 35])}deg`,
          filter: "drop-shadow(0 12px 18px rgba(0,0,0,.35))",
        }}
      >✈</div>
      <div style={{position: "absolute", left: 100, top: 88, right: 100}}>
        <div style={{fontSize: 27, textTransform: "uppercase", letterSpacing: 8, color: accent}}>{chapter}</div>
        <div style={{fontFamily: "Georgia, serif", fontSize: 88, marginTop: 16, letterSpacing: -2}}>{from} <span style={{color: accent}}>→</span> {to}</div>
      </div>
      <div style={{position: "absolute", left: 100, bottom: 72, fontSize: 28, color: "rgba(255,255,255,.68)", letterSpacing: 2}}>Prochaine escale</div>
    </AbsoluteFill>
  );
};
