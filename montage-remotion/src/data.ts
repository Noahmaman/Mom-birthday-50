import media from "./platform-media.json";

export type PlatformMedia = {
  id: string;
  author_name: string;
  url: string;
  created_at: string;
  file: string;
};

const videos = media.videos as PlatformMedia[];
const photos = media.photos as PlatformMedia[];

const video = (author: string) => {
  const match = videos.find((item) => item.author_name === author);
  if (!match) throw new Error(`Missing synced video: ${author}`);
  return match.file;
};

const photoGroup = (author: string) =>
  photos
    .filter((item) => item.author_name === author)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

export const videoFiles = {
  johanna: video("Johanna, Ralph et Elisabeth"),
  sydney: video("Vidéo 19 : Sydney"),
  monelle: video("Vidéo 16 : Monelle"),
  lea: video("Vidéo 11 : Léa"),
  sergeTiAmo: video("serge ti amo"),
  serge: video("Serge"),
  davidSandrine: video("David et Sandrine"),
  marc: video("Marc"),
  dominique: video("Dominique"),
  steph: video("Steph"),
  noah: video("Noah"),
  david: video("David"),
  josh: video("Josh"),
  nous: video("nous"),
  gad: video("Gad"),
  gilberte: video("Gilberte"),
  laura: video("Laura"),
  olivier: video("Olivier"),
  fouad: video("Fouad"),
  atlani: video("Atlani"),
  sandrinouche: video("Sandrinouche"),
  sylvia: video("Sylvia"),
  rebecca: video("Rebecca"),
  perrine: video("Perrine"),
  yaya: video("Yaelle"),
} as const;

export const vacationPhotos = photoGroup("tous");
export const sergePhotos = photoGroup("Serge");
export const climaxPhotos = photoGroup("Climax");
export const sergeSouthPhoto = photoGroup("photo serge a coller à sa vidéo")[0];
