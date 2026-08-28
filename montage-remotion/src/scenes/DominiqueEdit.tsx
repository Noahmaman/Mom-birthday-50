import {dominiquePhotos} from "../data";
import {PhotoSlideshow} from "./PhotoSlideshow";

export const DOMINIQUE_DURATION = 690;

export const DominiqueEdit: React.FC = () => (
  <PhotoSlideshow
    photos={dominiquePhotos}
    framesPerPhoto={115}
    title="Dominique"
    subtitle="Week-end à Rome"
    musicFile="audio/music/week-end-a-rome.mp3"
    musicTrimBefore={180}
    musicVolume={0.34}
  />
);
