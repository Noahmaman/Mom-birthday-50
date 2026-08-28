import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {LocationLowerThird} from "./LowerThirds";
import {MapFlyover} from "./MapFlyover";
import {MusicBed} from "./MusicBed";

type Props = {
  from: string;
  to: string;
  chapter: string;
  accent?: string;
  musicFile?: string;
  musicTrimBefore?: number;
  musicVolume?: number;
  venueText?: string;
};

const places: Record<string, {coordinates: readonly [number, number]; label: string; symbol: string}> = {
  France: {coordinates: [2.3522, 48.8566], label: "Paris, France", symbol: "🇫🇷"},
  Amérique: {coordinates: [-118.2437, 34.0522], label: "Californie, USA", symbol: "🌴"},
  Brésil: {coordinates: [-43.1729, -22.9068], label: "Rio, Brésil", symbol: "🇧🇷"},
  Asie: {coordinates: [100.5018, 13.7563], label: "Bangkok, Thaïlande", symbol: "🇹🇭"},
  Europe: {coordinates: [23.7275, 37.9838], label: "Athènes, Europe", symbol: "🇬🇷"},
  "Sud de la France": {coordinates: [3.8767, 43.6108], label: "Montpellier, France", symbol: "☀️"},
  Paris: {coordinates: [2.3522, 48.8566], label: "Paris, France", symbol: "🗼"},
};

export const TravelScene: React.FC<Props> = ({
  from,
  to,
  chapter,
  accent = "#ef4770",
  musicFile,
  musicTrimBefore = 0,
  musicVolume = 0.38,
  venueText,
}) => {
  const frame = useCurrentFrame();
  const origin = places[from] ?? places.France;
  const destination = places[to] ?? places.Europe;

  return (
    <AbsoluteFill style={{backgroundColor: "#f5c443", overflow: "hidden"}}>
      {musicFile ? <MusicBed file={musicFile} durationInFrames={150} trimBefore={musicTrimBefore} volume={musicVolume} fadeFrames={10} /> : null}
      <MapFlyover
        origin={origin.coordinates}
        destination={destination.coordinates}
        originLabel={origin.label}
        destinationLabel={destination.label}
        durationInFrames={150}
        routeColor={accent}
        lineWidth={18}
        style={{filter: "saturate(.68) sepia(.13) contrast(1.08) brightness(.92)"}}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(22,24,29,.5), transparent 27%, transparent 70%, rgba(22,24,29,.36))", pointerEvents: "none"}} />
      <div
        style={{
          backgroundColor: "#f5c443",
          border: "4px solid #16181d",
          color: "#16181d",
          fontSize: 24,
          fontWeight: 800,
          left: 56,
          letterSpacing: 3,
          opacity: interpolate(frame, [0, 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          padding: "12px 20px",
          position: "absolute",
          rotate: "-2deg",
          textTransform: "uppercase",
          top: 42,
        }}
      >
        {chapter}
      </div>
      <div style={{bottom: 54, left: 58, position: "absolute"}}>
        <LocationLowerThird location={destination.label} venue={venueText ?? from + " → " + to} />
      </div>
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#fff7dc",
          border: "5px solid #16181d",
          borderRadius: 999,
          boxShadow: "10px 11px 0 rgba(22,24,29,.35)",
          display: "flex",
          fontSize: 66,
          height: 112,
          justifyContent: "center",
          opacity: interpolate(frame, [92, 116], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          position: "absolute",
          right: 68,
          rotate: interpolate(frame, [92, 116], ["14deg", "-5deg"], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          top: 52,
          width: 112,
        }}
      >
        {destination.symbol}
      </div>
    </AbsoluteFill>
  );
};
