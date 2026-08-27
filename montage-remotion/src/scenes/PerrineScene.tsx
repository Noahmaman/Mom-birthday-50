import {Audio} from "@remotion/media";
import {AbsoluteFill, staticFile} from "remotion";
import {videoFiles} from "../data";
import {VideoMessage} from "./VideoMessage";

export const PerrineScene: React.FC = () => (
  <AbsoluteFill>
    <VideoMessage file={videoFiles.perrine} name="Perrine" place="Montpellier" volume={0.9} />
    <Audio src={staticFile("audio/cicadas.wav")} volume={0.18} />
  </AbsoluteFill>
);
