import {Audio} from "@remotion/media";
import {AbsoluteFill, staticFile} from "remotion";
import {videoFiles} from "../data";
import {VideoMessage} from "./VideoMessage";

export const PerrineScene: React.FC = () => (
  <AbsoluteFill>
    <VideoMessage file={videoFiles.perrine} name="Perrine" volume={0.9} />
    <Audio src={staticFile("audio/sfx/cicadas-south.mp3")} volume={0.16} />
  </AbsoluteFill>
);
