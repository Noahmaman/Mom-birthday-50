import {Video} from "@remotion/media";
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {VIDEO_PLAYBACK_RATE} from "../timing";
import {CoverBackground} from "./CoverBackground";
import {NameLowerThird} from "./LowerThirds";

type Props = {
  file: string;
  name: string;
  place?: string;
  trimBefore?: number;
  volume?: number;
  playbackRate?: number;
};

const motifForPlace = (place?: string) => {
  if (!place) return null;
  if (/brésil/i.test(place)) return {emoji: "🇧🇷", detail: "Brasil"};
  if (/californie|américain/i.test(place)) return {emoji: "🌴", detail: "California"};
  if (/thaïlande/i.test(place)) return {emoji: "🇹🇭", detail: "Thailand"};
  if (/tel aviv/i.test(place)) return {emoji: "🇮🇱", detail: "Tel Aviv"};
  if (/irlande/i.test(place)) return {emoji: "☘️", detail: "Ireland"};
  if (/croatie/i.test(place)) return {emoji: "🇭🇷", detail: "Croatia"};
  if (/biarritz/i.test(place)) return {emoji: "🏄", detail: "Biarritz"};
  if (/sud|montpellier/i.test(place)) return {emoji: "☀️", detail: "Le Sud"};
  if (/paris/i.test(place)) return {emoji: "🗼", detail: "Paris"};
  if (/rome/i.test(place)) return {emoji: "🇮🇹", detail: "Roma"};
  if (/europe/i.test(place)) return {emoji: "🇪🇺", detail: "Europe"};
  if (/amour/i.test(place)) return {emoji: "💛", detail: "Avec amour"};
  if (/voyage commence/i.test(place)) return {emoji: "✈️", detail: "Bon voyage"};
  return {emoji: "✈️", detail: place};
};

export const VideoMessage: React.FC<Props> = ({
  file,
  name,
  place,
  trimBefore = 0,
  volume = 1,
  playbackRate = VIDEO_PLAYBACK_RATE,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const motif = motifForPlace(place);

  return (
    <AbsoluteFill style={{backgroundColor: "#f5c443", overflow: "hidden"}}>
      <CoverBackground soft />
      <div
        style={{
          backgroundColor: "#fff7dc",
          border: "5px solid #16181d",
          borderRadius: 24,
          boxShadow: "18px 20px 0 rgba(22,24,29,.38)",
          height: "90%",
          left: "6%",
          overflow: "hidden",
          position: "absolute",
          top: "5%",
          width: "88%",
        }}
      >
        <Video
          src={staticFile(file)}
          trimBefore={trimBefore}
          playbackRate={playbackRate}
          volume={volume}
          objectFit="contain"
          style={{
            backgroundColor: "#15181d",
            height: "100%",
            inset: 0,
            opacity: interpolate(frame, [0, 8, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            position: "absolute",
            width: "100%",
          }}
        />
      </div>
      <div style={{bottom: 58, left: 72, position: "absolute"}}>
        <NameLowerThird name={name} title={place} />
      </div>
      {motif ? (
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#fff7dc",
            border: "4px solid #16181d",
            borderRadius: 999,
            boxShadow: "9px 10px 0 rgba(22,24,29,.34)",
            display: "flex",
            gap: 13,
            opacity: interpolate(frame, [12, 28], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
            padding: "12px 22px 12px 14px",
            position: "absolute",
            right: 66,
            rotate: interpolate(frame, [12, 28], ["8deg", "-2deg"], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
            top: 54,
            translate: interpolate(frame, [12, 28], ["40px -20px", "0px 0px"], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          }}
        >
          <span style={{fontSize: 50}}>{motif.emoji}</span>
          <span style={{color: "#16181d", fontSize: 25, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase"}}>{motif.detail}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
