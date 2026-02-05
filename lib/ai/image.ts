export async function generateAdImage(prompt: string): Promise<Buffer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch('https://ai-gateway.vercel.sh/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'bfl/flux-2-pro',
        prompt,
        n: 1,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Image generation failed (${res.status}): ${errText}`);
    }

    const json = await res.json();
    return Buffer.from(json.data[0].b64_json, 'base64');
  } finally {
    clearTimeout(timeout);
  }
}
