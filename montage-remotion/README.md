# Montage anniversaire de Yael

Montage Remotion 1920 × 1080 à 30 i/s, construit à partir des vidéos et des photos de la plateforme MOM BIRTHDAY. La timeline suit le document `script montage .docx` : ouverture passeport, messages vidéo, six étapes de voyage animées, diaporamas rapides, mots d'amour et fermeture en cœur.

Les voix originales sont conservées et le vrai chant de cigales accompagne Perrine. Les morceaux disponibles sont fondus aux chapitres prévus dans le script, avec un niveau réduit sous les voix.

La révision visuelle utilise les covers de l'invitation, une carte satellite MapLibre/Turf, des cartons animés Inter et des diaporamas parallax. Les titres encore absents restent à ajouter avant l'export complet.

## Commandes

```console
npm install
npm run sync-media
npm run dev
npm run lint
npm run render:final
```

`npm run sync-media` télécharge les médias actuels de la plateforme dans `public/media` et régénère `src/platform-media.json`. Les médias et les exports sont ignorés par Git.
