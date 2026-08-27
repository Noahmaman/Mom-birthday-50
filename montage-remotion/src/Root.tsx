import "./index.css";
import {Composition, Folder} from "remotion";
import {VoyageDeYael} from "./VoyageDeYael";
import {LoveWordsScene} from "./scenes/LoveWordsScene";
import {PassportScene} from "./scenes/PassportScene";
import {TravelScene} from "./scenes/TravelScene";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="VoyageDeYael" component={VoyageDeYael} durationInFrames={20644} fps={30} width={1920} height={1080} />
    <Folder name="Scenes">
      <Composition id="Passport" component={PassportScene} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="Travel" component={TravelScene} defaultProps={{from: "France", to: "Amérique", chapter: "Chapitre 1"}} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="LoveWords" component={LoveWordsScene} durationInFrames={180} fps={30} width={1920} height={1080} />
    </Folder>
  </>
);
