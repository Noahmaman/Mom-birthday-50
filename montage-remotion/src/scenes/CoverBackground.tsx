import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";

export const CoverBackground: React.FC<{soft?: boolean}> = ({soft = false}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: "#f7df9b", overflow: "hidden"}}>
      <Img
        src={staticFile("design/cover-4.png")}
        style={{
          height: "100%",
          inset: 0,
          objectFit: "cover",
          opacity: soft ? 0.42 : 0.58,
          position: "absolute",
          scale: interpolate(frame, [0, 300], [1.08, 1.14], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          width: "100%",
          filter: soft
            ? "blur(18px) saturate(.38) brightness(.72) contrast(1.05)"
            : "blur(9px) saturate(.52) brightness(.62) contrast(1.08)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 14% 18%, rgba(255,217,61,.62), transparent 26%), radial-gradient(circle at 88% 30%, rgba(242,64,120,.5), transparent 30%), linear-gradient(135deg, rgba(255,244,211,.78), rgba(21,160,173,.48) 54%, rgba(245,103,125,.55))",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(18,24,32,.2) 1.2px, transparent 1.2px)",
          backgroundSize: "9px 9px",
          opacity: 0.24,
        }}
      />
    </AbsoluteFill>
  );
};
