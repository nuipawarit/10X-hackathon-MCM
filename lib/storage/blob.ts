import { put, del, list, head } from '@vercel/blob';

/**
 * Upload a creative asset to Vercel Blob storage
 */
export async function uploadCreative(
  file: File | Blob,
  personaId: string,
  filename: string
): Promise<string> {
  const path = `creatives/${personaId}/${filename}`;

  const blob = await put(path, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return blob.url;
}

/**
 * Delete a creative asset from storage
 */
export async function deleteCreative(url: string): Promise<void> {
  await del(url);
}

/**
 * List all creatives for a persona
 */
export async function listCreatives(personaId: string) {
  const { blobs } = await list({
    prefix: `creatives/${personaId}/`,
  });

  return blobs;
}

/**
 * Check if a blob exists
 */
export async function creativeExists(url: string): Promise<boolean> {
  try {
    await head(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Upload campaign report PDF
 */
export async function uploadReport(
  file: File | Blob,
  campaignId: string
): Promise<string> {
  const timestamp = new Date().toISOString().split('T')[0];
  const path = `reports/${campaignId}/${timestamp}-report.pdf`;

  const blob = await put(path, file, {
    access: 'public',
  });

  return blob.url;
}
