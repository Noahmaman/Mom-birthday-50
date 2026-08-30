import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {wipe} from "@remotion/transitions/wipe";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Sequence, interpolate, staticFile} from "remotion";
import {climaxPhotos, sergePhotos, sergeSouthPhoto, vacationPhotos, videoFiles} from "./data";
import {HeartClose} from "./scenes/HeartClose";
import {LoveWordsScene} from "./scenes/LoveWordsScene";
import {PassportScene} from "./scenes/PassportScene";
import {PerrineScene} from "./scenes/PerrineScene";
import {PhotoSlideshow} from "./scenes/PhotoSlideshow";
import {TravelScene} from "./scenes/TravelScene";
import {VideoMessage} from "./scenes/VideoMessage";
import {atTempo} from "./timing";

export const VOYAGE_DURATION = 17220;

const TI_AMO_START = 15750;
const TI_AMO_DURATION = 1470;
const TI_AMO_CLIMAX_FRAME = 768;

export const VoyageDeYael: React.FC = () => (
  <AbsoluteFill>
  <TransitionSeries name="Voyage de Yael — montage final — modif 5">
    <TransitionSeries.Sequence durationInFrames={150} name="Introduction — passeport"><PassportScene /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(843)} name="Vidéo 1 — Maman’s"><VideoMessage file={videoFiles.nous} name="Maman’s" badgeText="Bon voyage" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom-left"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 1 — Amérique"><TravelScene from="France" to="Amérique" chapter="Chapitre 1" musicFile="audio/music/surfin-usa.mp3" musicTrimBefore={900} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-top-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={540} name="Vidéo 2 — Olivier, conservé de 0:49 à 1:07"><VideoMessage file={videoFiles.olivier} name="Olivier" trimBefore={459} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={612} name="Vidéo 3 — David et Sandrine, coupé à 1:27"><VideoMessage file={videoFiles.davidSandrine} name="David et Sandrine" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={720} name="Vidéo 4 — Sandrinouche, 1:55 à 2:19"><VideoMessage file={videoFiles.sandrinouche} name="Sandrinouche" trimBefore={207} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom-left"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 2 — Asie"><TravelScene from="Brésil" to="Asie" chapter="Chapitre 2" accent="#e98f70" musicFile="audio/music/one-night-in-bangkok.mp3" musicTrimBefore={1500} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-top-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={1030} name="Vidéo 5 — Gad, coupé à 3:01"><VideoMessage file={videoFiles.gad} name="Gad" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(378)} name="Vidéo 6 — Yaya"><VideoMessage file={videoFiles.yaya} name="Yaya" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom-left"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 3 — Europe / Zorba"><TravelScene from="Asie" to="Europe" chapter="Chapitre 3" accent="#8fd0c9" musicFile="audio/music/zorba-the-greek.mp3" musicTrimBefore={360} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-top-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(1226)} name="Vidéo 7 — Atlani’s"><VideoMessage file={videoFiles.atlani} name="Atlani’s" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(2520)} name="Vidéo 9 — Laura"><VideoMessage file={videoFiles.laura} name="Laura" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(627)} name="Vidéo 10 — Sylvia et David"><VideoMessage file={videoFiles.sylvia} name="Sylvia et David" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={288} name="Photos — uniquement Vacances"><PhotoSlideshow photos={vacationPhotos} framesPerPhoto={24} title="Vacaciones" musicFile="audio/music/me-gustas-tu.mp3" musicTrimBefore={90} musicVolume={0.36} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(371)} name="Vidéo 11 — Léa"><VideoMessage file={videoFiles.lea} name="Léa" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom-left"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 4 — Montpellier avec cigales"><TravelScene from="Europe" to="Sud de la France" chapter="Chapitre 4" accent="#f1aa61" musicFile="audio/sfx/cicadas-south.mp3" musicVolume={0.3} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-top-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(333)} name="Vidéo 13 — Perrine, avec cigales"><PerrineScene /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(1851)} name="Vidéo 12 — Serge Sud"><VideoMessage file={videoFiles.serge} name="Serge" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={120} name="Photo — Yael Sud sans typo"><PhotoSlideshow photos={sergeSouthPhoto ? [sergeSouthPhoto] : []} framesPerPhoto={120} title="" showCaption={false} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(931)} name="Vidéo 14 — Rebecca"><VideoMessage file={videoFiles.rebecca} name="Rebecca" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom-left"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 5 — Paris s’éveille"><TravelScene from="Sud de la France" to="Paris" chapter="Chapitre 5" accent="#e4b2bb" venueText="Arrivée à Paris" musicFile="audio/music/paris-seveille.mp3" musicVolume={0.42} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-top-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(418)} name="Vidéo 15 — Marc"><VideoMessage file={videoFiles.marc} name="Marc" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(468)} name="Vidéo 16 — Monelle"><VideoMessage file={videoFiles.monelle} name="Monelle" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={1748} name="Vidéo 17 — Gilberte, coupé à 9:49"><VideoMessage file={videoFiles.gilberte} name="Gilberte" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={408} name="Photos — Yael et Serge"><PhotoSlideshow photos={sergePhotos} framesPerPhoto={24} title="Yael et Serge" badgeText="Avec amour" imageObjectFit="cover" musicFile="audio/music/la-vie-en-rose.mp3" musicTrimBefore={1260} musicVolume={0.34} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={372} name="Johanna, Ralph et Elisabeth — coupé à 8:56"><VideoMessage file={videoFiles.johanna} name="Johanna, Ralph et Elisabeth" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(177)} name="Vidéo 18 — Fouad"><VideoMessage file={videoFiles.fouad} name="Fouad" place="Les mots d’amour" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(406)} name="Albert — à partir de 2 secondes"><VideoMessage file={videoFiles.albert} name="Albert" trimBefore={60} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={100} name="Johanna, Ralph et Elisabeth — reprise finale"><VideoMessage file={videoFiles.johanna} name="Johanna, Ralph et Elisabeth" trimBefore={642} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(50)} name="Vidéo 20 — Josh"><VideoMessage file={videoFiles.josh} name="Josh" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(60)} name="Vidéo 21 — David"><VideoMessage file={videoFiles.david} name="David" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(49)} name="Vidéo 22 — Steph"><VideoMessage file={videoFiles.steph} name="Steph" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={atTempo(97)} name="Vidéo 23 — Noah"><VideoMessage file={videoFiles.noah} name="Noah" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={75} name="Gad — uniquement je t’aime fort fort fort"><VideoMessage file={videoFiles.gad} name="Gad" trimBefore={1224} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom-left"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={480} name="Photos — uniquement tous les Climax"><PhotoSlideshow photos={climaxPhotos} framesPerPhoto={24} title="Joyeux anniversaire" subtitle="De tous ceux qui t’aiment" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-bottom"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={180} name="Les mots d’amour — fond beige"><LoveWordsScene /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: "from-top-right"})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={66} name="Vidéo 24 — Serge Ti amo"><HeartClose /></TransitionSeries.Sequence>
  </TransitionSeries>
  <Sequence from={TI_AMO_START} durationInFrames={TI_AMO_DURATION} name="Musique — Ti Amo de 8:45 jusqu’à la fin">
    <Audio
      src={staticFile("audio/music/ti-amo.mp3")}
      trimBefore={300}
      durationInFrames={TI_AMO_DURATION}
      volume={(frame) => interpolate(
        frame,
        [0, 45, 62, 438, 468, TI_AMO_CLIMAX_FRAME - 30, TI_AMO_CLIMAX_FRAME + 30, TI_AMO_DURATION - 120, TI_AMO_DURATION],
        [0, 0.12, 0.08, 0.08, 0.16, 0.16, 0.78, 0.3, 0],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
      )}
    />
  </Sequence>
  </AbsoluteFill>
);
