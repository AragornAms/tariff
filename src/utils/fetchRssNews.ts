export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  excerpt: string;
  url: string;
}

const DEFAULT_FEED =
  'https://news.google.com/rss/search?q=vietnam%20us%20tariff&hl=en-US&gl=US&ceid=US:en';

/**
 * Fetch an RSS feed and return simplified news items.
 * @param feedUrl RSS feed URL to fetch. Defaults to a Google News query on
 *                Vietnam and US tariff topics.
 * @param limit   Maximum number of items to return (defaults to 5)
 */
export default async function fetchRssNews(
  feedUrl: string = DEFAULT_FEED,
  limit = 5
): Promise<NewsItem[]> {
  const res = await fetch(feedUrl);
  if (!res.ok) {
    throw new Error('Failed to fetch RSS feed');
  }
  const xmlText = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const items = Array.from(doc.querySelectorAll('item')).slice(0, limit);
  return items.map((item, idx) => {
    const link = item.querySelector('link')?.textContent?.trim() ?? '';
    return {
      id:
        item.querySelector('guid')?.textContent?.trim() ||
        link ||
        String(idx),
      title: item.querySelector('title')?.textContent?.trim() ?? '',
      source: new URL(link).hostname.replace('www.', '') || 'unknown',
      timestamp: new Date(
        item.querySelector('pubDate')?.textContent || Date.now()
      ).toLocaleDateString(),
      excerpt: item.querySelector('description')?.textContent?.trim() ?? '',
      url: link,
    };
  });
}
