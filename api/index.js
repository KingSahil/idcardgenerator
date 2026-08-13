export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);

    // Fetch the index.html template from static assets
    const originRes = await fetch(new URL('/index.html', req.url));
    let html = await originRes.text();

    const name = url.searchParams.get('name') || '';
    const title = url.searchParams.get('title') || '';
    const format = url.searchParams.get('format') || 'A';
    const badgeId = url.searchParams.get('badgeId') || '';

    // Build dynamic OG Image URL
    const ogImageParams = new URLSearchParams({
      format,
      ...(name && { name }),
      ...(title && { title }),
      ...(badgeId && { badgeId }),
    });

    const ogImageUrl = `${url.origin}/api/og?${ogImageParams.toString()}`;
    const pageTitle = name
      ? `${name} — HH Goa 2026 ${format === 'A' ? 'PFP Frame' : 'Builder Badge'}`
      : 'HH Goa 2026 — Frame & Builder ID Card Generator';

    // Inject dynamic meta tags into HTML <head> for Twitterbot crawler
    html = html
      .replace(
        /<title>.*?<\/title>/,
        `<title>${pageTitle}</title>`
      )
      .replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="${pageTitle}" />`
      )
      .replace(
        /<meta name="twitter:title" content=".*?" \/>/,
        `<meta name="twitter:title" content="${pageTitle}" />`
      )
      .replace(
        /<meta property="og:image" content=".*?" \/>/,
        `<meta property="og:image" content="${ogImageUrl}" />`
      )
      .replace(
        /<meta name="twitter:image" content=".*?" \/>/,
        `<meta name="twitter:image" content="${ogImageUrl}" />`
      );

    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch (e) {
    return fetch(new URL('/index.html', req.url));
  }
}
