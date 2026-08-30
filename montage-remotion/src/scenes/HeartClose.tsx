import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {videoFiles} from "../data";
import {VideoMessage} from "./VideoMessage";

export const HeartClose: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [8, 62], [8, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: "black"}}>
      <VideoMessage file={videoFiles.sergeTiAmo} name="Serge" />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
        <mask id="heart-window">
          <rect width="1920" height="1080" fill="white" />
          <path d="M960 860 C880 790 610 625 610 410 C610 255 790 190 960 350 C1130 190 1310 255 1310 410 C1310 625 1040 790 960 860Z" fill="black" style={{scale, transformOrigin: "960px 540px"}} />
        </mask>
        <rect width="1920" height="1080" fill="black" mask="url(#heart-window)" />
      </svg>
    </AbsoluteFill>
  );
};
