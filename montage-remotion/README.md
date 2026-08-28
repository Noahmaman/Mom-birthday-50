# Montage anniversaire de Yael

Montage Remotion 1920 × 1080 à 30 i/s, construit à partir des vidéos et des photos de la plateforme MOM BIRTHDAY. La timeline suit la révision `modifs montage .docx` : ouverture passeport, messages vidéo, cinq étapes de voyage animées, diaporamas rapides, mots d'amour et fermeture en cœur.

Les voix originales sont conservées et le vrai chant de cigales accompagne Perrine. Les morceaux disponibles sont fondus aux chapitres prévus dans le script, avec un niveau réduit sous les voix.

La révision visuelle utilise les covers de l'invitation, une carte satellite MapLibre/Turf, des cartons animés Inter et des diaporamas parallax. Zorba le Grec et Ti Amo sont maintenant intégrés. Les deux morceaux encore non fournis restent à ajouter au mix final par la commanditaire : Le Sud et Il est cinq heures Paris s'éveille.

## Commandes

```console
npm install
npm run sync-media
npm run dev
npm run lint
npm run render:final
```

`npm run sync-media` télécharge les médias actuels de la plateforme dans `public/media` et régénère `src/platform-media.json`. Les médias et les exports sont ignorés par Git.
