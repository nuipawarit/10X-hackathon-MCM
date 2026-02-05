import { put, del, list } from '@vercel/blob';

export async function uploadCreativeImage(file: Buffer, filename: string) {
  const blob = await put(`creatives/${filename}`, file, {
    access: 'public',
    contentType: 'image/png',
  });
  return blob;
}

export async function deleteCreativeImage(url: string) {
  await del(url);
}

export async function listCreativeImages(prefix = 'creatives/') {
  const { blobs } = await list({ prefix });
  return blobs;
}
