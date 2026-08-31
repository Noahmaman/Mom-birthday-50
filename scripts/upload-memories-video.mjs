import fs from 'node:fs/promises';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';

const env = Object.fromEntries(
  (await fs.readFile(path.resolve('.env.local'), 'utf8'))
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=');
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);

const sourceDirectory = path.resolve('montage-remotion/out/memories-50-hls');
const storageDirectory = 'memories-50/e0f378db';
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const files = (await fs.readdir(sourceDirectory)).sort();
let completed = 0;

const contentTypeFor = (fileName) => {
  if (fileName.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
  if (fileName.endsWith('.ts')) return 'video/mp2t';
  return 'application/octet-stream';
};

const uploadFile = async (fileName) => {
  const contents = await fs.readFile(path.join(sourceDirectory, fileName));
  const objectPath = `${storageDirectory}/${fileName}`;
  const {error} = await supabase.storage.from('videos').upload(objectPath, contents, {
    contentType: contentTypeFor(fileName),
    cacheControl: fileName.endsWith('.m3u8') ? '60' : '31536000',
    upsert: true,
  });

  if (error) throw new Error(`${fileName}: ${error.message}`);
  completed += 1;
  console.log(`Upload ${completed}/${files.length}`);
};

const queue = [...files];
await Promise.all(
  Array.from({length: 4}, async () => {
    while (queue.length > 0) {
      const fileName = queue.shift();
      if (fileName) await uploadFile(fileName);
    }
  }),
);

console.log(`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${storageDirectory}/index.m3u8`);
