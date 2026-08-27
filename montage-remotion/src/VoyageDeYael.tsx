import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {climaxPhotos, sergePhotos, sergeSouthPhoto, vacationPhotos, videoFiles} from "./data";
import {DominiqueEdit} from "./scenes/DominiqueEdit";
import {HeartClose} from "./scenes/HeartClose";
import {LoveWordsScene} from "./scenes/LoveWordsScene";
import {PassportScene} from "./scenes/PassportScene";
import {PerrineScene} from "./scenes/PerrineScene";
import {PhotoSlideshow} from "./scenes/PhotoSlideshow";
import {TravelScene} from "./scenes/TravelScene";
import {VideoMessage} from "./scenes/VideoMessage";

export const VoyageDeYael: React.FC = () => (
  <TransitionSeries name="Voyage de Yael — montage final">
    <TransitionSeries.Sequence durationInFrames={150} name="Introduction — passeport"><PassportScene /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={843} name="Vidéo 1 — Nous"><VideoMessage file={videoFiles.nous} name="Nous" place="Le voyage commence" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 1 — Amérique"><TravelScene from="France" to="Amérique" chapter="Chapitre 1" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={1110} name="Vidéo 2 — Olivier"><VideoMessage file={videoFiles.olivier} name="Olivier" place="Ouest américain" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={2256} name="Vidéo 3 — David et Sandrine"><VideoMessage file={videoFiles.davidSandrine} name="David et Sandrine" place="Californie" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={930} name="Vidéo 4 — Sandrinouche"><VideoMessage file={videoFiles.sandrinouche} name="Sandrinouche" place="Brésil" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 2 — Asie"><TravelScene from="Brésil" to="Asie" chapter="Chapitre 2" accent="#e98f70" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={1080} name="Vidéo 5 — Gad"><VideoMessage file={videoFiles.gad} name="Gad" place="Thaïlande" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={378} name="Vidéo 6 — Yaya"><VideoMessage file={videoFiles.yaya} name="Yaya" place="Tel Aviv" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 3 — Europe"><TravelScene from="Asie" to="Europe" chapter="Chapitre 3" accent="#8fd0c9" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={1226} name="Vidéo 7 — Atlani"><VideoMessage file={videoFiles.atlani} name="Atlani" place="Europe" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={834} name="Vidéo 8 — Dominique (photos seules retirées)"><DominiqueEdit /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={2520} name="Vidéo 9 — Laura"><VideoMessage file={videoFiles.laura} name="Laura" place="Irlande" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={627} name="Vidéo 10 — Sylvia"><VideoMessage file={videoFiles.sylvia} name="Sylvia et son mari" place="Croatie" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={720} name="Photos — Vacances / tous"><PhotoSlideshow photos={vacationPhotos} framesPerPhoto={24} title="Nos voyages" subtitle="30 souvenirs, mille histoires" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={371} name="Vidéo 11 — Léa"><VideoMessage file={videoFiles.lea} name="Léa" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 4 — Sud de la France"><TravelScene from="Europe" to="Sud de la France" chapter="Chapitre 4" accent="#f1aa61" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={1851} name="Vidéo 12 — Serge Sud"><VideoMessage file={videoFiles.serge} name="Serge" place="Sud de la France" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={120} name="Photo — Yael Sud"><PhotoSlideshow photos={sergeSouthPhoto ? [sergeSouthPhoto] : []} framesPerPhoto={120} title="Yael dans le Sud" subtitle="Un souvenir à garder" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={333} name="Vidéo 13 — Perrine, avec cigales"><PerrineScene /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={931} name="Vidéo 14 — Rebecca"><VideoMessage file={videoFiles.rebecca} name="Rebecca" place="Biarritz" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Transition 5 — Paris"><TravelScene from="Sud de la France" to="Paris" chapter="Chapitre 5" accent="#e4b2bb" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={418} name="Vidéo 15 — Marc"><VideoMessage file={videoFiles.marc} name="Marc" place="Paris" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={468} name="Vidéo 16 — Monelle"><VideoMessage file={videoFiles.monelle} name="Monelle" place="Paris" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={1913} name="Vidéo 17 — Gilberte"><VideoMessage file={videoFiles.gilberte} name="Gilberte" place="Paris" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={432} name="Photos — Serge et Yael"><PhotoSlideshow photos={sergePhotos} framesPerPhoto={24} title="Serge & Yael" subtitle="La vie en rose" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={180} name="Transition 6 — Les mots d’amour"><LoveWordsScene /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={177} name="Vidéo 18 — Fouad"><VideoMessage file={videoFiles.fouad} name="Fouad" place="Les mots d’amour" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={60} name="Vidéo 19 — Sydney (19s à 21s)"><VideoMessage file={videoFiles.sydney} name="Sydney" trimBefore={570} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={270} name="Laura — reprise (1:34 à 1:43)"><VideoMessage file={videoFiles.laura} name="Laura" trimBefore={2820} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={120} name="Olivier — reprise (37s à 41s)"><VideoMessage file={videoFiles.olivier} name="Olivier" trimBefore={1110} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={150} name="Sandrinouche — reprise (31s à 36s)"><VideoMessage file={videoFiles.sandrinouche} name="Sandrinouche" trimBefore={930} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={50} name="Vidéo 20 — Josh"><VideoMessage file={videoFiles.josh} name="Josh" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={60} name="Vidéo 21 — David"><VideoMessage file={videoFiles.david} name="David" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={49} name="Vidéo 22 — Steph"><VideoMessage file={videoFiles.steph} name="Steph" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={97} name="Vidéo 23 — Noah"><VideoMessage file={videoFiles.noah} name="Noah" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={750} name="Ajout — Johanna, Ralph et Elisabeth"><VideoMessage file={videoFiles.johanna} name="Johanna, Ralph et Elisabeth" place="Un nouveau message d’amour" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={120} name="Gad — reprise (38s à 42s)"><VideoMessage file={videoFiles.gad} name="Gad" trimBefore={1140} /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={168} name="Photos — Climax"><PhotoSlideshow photos={climaxPhotos} framesPerPhoto={24} title="Ti amo" subtitle="De tous ceux qui t’aiment" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={66} name="Vidéo 24 — Serge Ti amo"><HeartClose /></TransitionSeries.Sequence>
  </TransitionSeries>
);
