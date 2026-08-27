import {AbsoluteFill, Series} from "remotion";
import {videoFiles} from "../data";
import {atTempo} from "../timing";
import {VideoMessage} from "./VideoMessage";
import {MusicBed} from "./MusicBed";

const Segment: React.FC<{trimBefore: number}> = ({trimBefore}) => (
  <VideoMessage file={videoFiles.dominique} name="Dominique" place="Rome" trimBefore={trimBefore} />
);

const segments = [atTempo(72), atTempo(219), atTempo(189), atTempo(210), atTempo(144)];
export const DOMINIQUE_DURATION = segments.reduce((total, duration) => total + duration, 0);

export const DominiqueEdit: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={segments[0]} name="Dominique — groupe 1"><Segment trimBefore={0} /></Series.Sequence>
      <Series.Sequence durationInFrames={segments[1]} name="Dominique — groupe 2"><Segment trimBefore={222} /></Series.Sequence>
      <Series.Sequence durationInFrames={segments[2]} name="Dominique — groupe 3"><Segment trimBefore={825} /></Series.Sequence>
      <Series.Sequence durationInFrames={segments[3]} name="Dominique — groupe 4"><Segment trimBefore={1020} /></Series.Sequence>
      <Series.Sequence durationInFrames={segments[4]} name="Dominique — groupe 5"><Segment trimBefore={1386} /></Series.Sequence>
    </Series>
    <MusicBed file="audio/music/week-end-a-rome.mp3" durationInFrames={DOMINIQUE_DURATION} trimBefore={180} volume={0.12} />
  </AbsoluteFill>
);
