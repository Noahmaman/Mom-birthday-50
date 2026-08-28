import {loadFont} from "@remotion/google-fonts/Inter";
import {Easing, Interactive, interpolate, useCurrentFrame} from "remotion";

const {fontFamily} = loadFont("normal", {
  subsets: ["latin"],
  weights: ["500", "700"],
});

export const NameLowerThird: React.FC<{name: string; title?: string}> = ({name, title}) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Carton nom"
      style={{
        alignItems: "flex-start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily,
        height: 132,
        width: 720,
        filter: "drop-shadow(0 9px 18px rgba(22,24,29,.28))",
      }}
    >
      <Interactive.Div
        cropRight={interpolate(frame, [0, 20, 96, 116], [1, 0, 0, 1], {
          easing: [Easing.bezier(0.65, 0, 0.35, 1), Easing.linear, Easing.bezier(0.65, 0, 0.35, 1)],
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        name="Nom"
        style={{
          alignItems: "center",
          backgroundColor: "#ef4770",
          border: "3px solid #16181d",
          boxSizing: "border-box",
          color: "#fff7dc",
          display: "flex",
          fontSize: 34,
          fontWeight: 700,
          height: 66,
          letterSpacing: 0.6,
          lineHeight: 1,
          overflow: "hidden",
          padding: "0 24px",
          whiteSpace: "nowrap",
          width: 680,
        }}
      >
        {name}
      </Interactive.Div>
      {title ? (
        <Interactive.Div
          cropRight={interpolate(frame, [4, 24, 92, 112], [1, 0, 0, 1], {
            easing: [Easing.bezier(0.65, 0, 0.35, 1), Easing.linear, Easing.bezier(0.65, 0, 0.35, 1)],
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          name="Lieu"
          style={{
            alignItems: "center",
            backgroundColor: "#f5c443",
            borderBottom: "3px solid #16181d",
            borderLeft: "3px solid #16181d",
            borderRight: "3px solid #16181d",
            boxSizing: "border-box",
            color: "#16181d",
            display: "flex",
            fontSize: 28,
            fontWeight: 500,
            height: 62,
            letterSpacing: 1,
            lineHeight: 1,
            overflow: "hidden",
            padding: "0 24px",
            whiteSpace: "nowrap",
            width: 570,
          }}
        >
          {title}
        </Interactive.Div>
      ) : null}
    </Interactive.Div>
  );
};

export const LocationLowerThird: React.FC<{location: string; venue: string}> = ({location, venue}) => {
  const frame = useCurrentFrame();
  const visibleLocationCharacters = Math.floor(
    interpolate(frame, [8, 30, 116, 136], [0, location.length, location.length, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const visibleVenueCharacters = Math.floor(
    interpolate(frame, [18, 42, 110, 130], [0, venue.length, venue.length, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <Interactive.Div name="Carton destination" style={{fontFamily, height: 138, position: "relative", width: 760}}>
      <Interactive.Svg
        name="Épingle"
        viewBox="0 0 64 80"
        style={{
          filter: "drop-shadow(0 7px 9px rgba(24,24,27,.22))",
          height: 130,
          left: 18,
          opacity: interpolate(frame, [0, 9, 130, 144], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          overflow: "visible",
          position: "absolute",
          scale: interpolate(frame, [0, 16], [0.82, 1], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          top: 4,
          translate: interpolate(frame, [0, 16], ["0px -12px", "0px 0px"], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          width: 104,
        }}
      >
        <path d="M32 3C15.4 3 4 15.4 4 31C4 50.8 22.1 69.6 29.3 76.2C30.8 77.6 33.2 77.6 34.7 76.2C41.9 69.6 60 50.8 60 31C60 15.4 48.6 3 32 3Z" fill="#ef4770" stroke="#16181d" strokeWidth="2.5" />
        <circle cx="32" cy="30" fill="#fff4cf" r={interpolate(frame, [10, 21], [0, 9], {easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
      </Interactive.Svg>
      <div style={{display: "flex", flexDirection: "column", height: 132, left: 142, position: "absolute", top: 3, width: 590}}>
        <div style={{alignItems: "center", display: "flex", height: 82, overflow: "hidden"}}>
          <Interactive.Div
            name="Destination"
            style={{
              backgroundColor: "rgba(255,247,220,.92)",
              border: "3px solid #16181d",
              clipPath: `inset(0 ${100 - (visibleLocationCharacters / Math.max(location.length, 1)) * 100}% 0 0)`,
              color: "#16181d",
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1,
              maxWidth: 590,
              overflow: "hidden",
              padding: "12px 20px",
              whiteSpace: "nowrap",
            }}
          >
            {location}
          </Interactive.Div>
        </div>
        <Interactive.Div
          name="Trajet"
          style={{
            alignItems: "center",
            clipPath: `inset(0 ${100 - (visibleVenueCharacters / Math.max(venue.length, 1)) * 100}% 0 0)`,
            color: "#fff7dc",
            display: "flex",
            fontSize: 27,
            fontWeight: 500,
            minHeight: 48,
            overflow: "hidden",
            textShadow: "0 3px 12px rgba(0,0,0,.72)",
            whiteSpace: "nowrap",
          }}
        >
          {venue}
        </Interactive.Div>
      </div>
    </Interactive.Div>
  );
};
