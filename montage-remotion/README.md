# Montage anniversaire de Yael

Montage Remotion 1920 × 1080 à 30 i/s, construit à partir des vidéos et des photos de la plateforme MOM BIRTHDAY. La timeline suit le document `script montage .docx` : ouverture passeport, messages vidéo, six étapes de voyage animées, diaporamas rapides, mots d'amour et fermeture en cœur.

Les chansons du script ne sont volontairement pas incluses : elles doivent être ajoutées après l'export. Les voix originales sont conservées et une ambiance de cigales accompagne Perrine.

## Commandes

```console
npm install
npm run sync-media
npm run dev
npm run lint
npm run render:final
```

`npm run sync-media` télécharge les médias actuels de la plateforme dans `public/media` et régénère `src/platform-media.json`. Les médias et les exports sont ignorés par Git.
