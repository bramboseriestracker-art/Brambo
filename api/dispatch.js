import app from './_lib/app.js';

/*
 * Stable Vercel entry point for every /api/* request.
 * vercel.json rewrites nested API URLs here and supplies the original path
 * in the `path` query parameter. Restore the original URL before Express
 * handles the request so the existing routes remain unchanged.
 */
export default function dispatch(req, res) {
  const currentUrl = new URL(req.url || '/', 'http://vercel.internal');
  const apiPath = currentUrl.searchParams.get('path') || '';
  currentUrl.searchParams.delete('path');

  const safePath = apiPath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');

  req.url = `/api/${safePath}${currentUrl.search}`;
  return app(req, res);
}
