import {Series} from "remotion";
import {videoFiles} from "../data";
import {VideoMessage} from "./VideoMessage";

const Segment: React.FC<{trimBefore: number}> = ({trimBefore}) => (
  <VideoMessage file={videoFiles.dominique} name="Dominique" place="Rome" trimBefore={trimBefore} />
);

export const DominiqueEdit: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={72} name="Dominique — groupe 1"><Segment trimBefore={0} /></Series.Sequence>
    <Series.Sequence durationInFrames={219} name="Dominique — groupe 2"><Segment trimBefore={222} /></Series.Sequence>
    <Series.Sequence durationInFrames={189} name="Dominique — groupe 3"><Segment trimBefore={825} /></Series.Sequence>
    <Series.Sequence durationInFrames={210} name="Dominique — groupe 4"><Segment trimBefore={1020} /></Series.Sequence>
    <Series.Sequence durationInFrames={144} name="Dominique — groupe 5"><Segment trimBefore={1386} /></Series.Sequence>
  </Series>
);
