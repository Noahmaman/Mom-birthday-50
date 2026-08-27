/* global Buffer, URL, fetch, process */
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";

const baseUrl = "https://mom-birthday-50.vercel.app";
const root = process.cwd();
const manifestPath = path.join(root, "src", "platform-media.json");

const extensionFromUrl = (url) => {
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).toLowerCase();
  return extension || ".bin";
};

const fetchJson = async (route) => {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) {
    throw new Error(`${route}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const download = async (item, kind) => {
  const extension = extensionFromUrl(item.url);
  const relativePath = `media/${kind}/${item.id}${extension}`;
  const destination = path.join(root, "public", relativePath);
  await mkdir(path.dirname(destination), {recursive: true});

  try {
    await readFile(destination);
    return {...item, file: relativePath};
  } catch {
    // File is not present yet.
  }

  const response = await fetch(item.url);
  if (!response.ok) {
    throw new Error(`${item.author_name}: ${response.status} ${response.statusText}`);
  }
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  process.stdout.write(`✓ ${item.author_name}\n`);
  return {...item, file: relativePath};
};

const mapWithConcurrency = async (items, limit, worker) => {
  const output = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({length: Math.min(limit, items.length)}, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await worker(items[index]);
    }
  });
  await Promise.all(runners);
  return output;
};

const [videos, photos] = await Promise.all([
  fetchJson("/api/videos"),
  fetchJson("/api/photos"),
]);

const [localVideos, localPhotos] = await Promise.all([
  mapWithConcurrency(videos, 5, (item) => download(item, "videos")),
  mapWithConcurrency(photos, 8, (item) => download(item, "photos")),
]);

await writeFile(
  manifestPath,
  `${JSON.stringify({syncedAt: new Date().toISOString(), videos: localVideos, photos: localPhotos}, null, 2)}\n`,
);

process.stdout.write(`Synced ${localVideos.length} videos and ${localPhotos.length} photos.\n`);
