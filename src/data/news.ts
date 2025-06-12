export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  timestamp: string;
  excerpt: string;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export async function fetchNews(limit = 5): Promise<NewsItem[]> {
  const rssUrl = 'https://news.google.com/rss/search?q=vietnam+us+tariff';
  const response = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  const data = await response.json();
  return data.items.slice(0, limit).map((item: any, index: number) => {
    const [titlePart, sourcePart] = item.title.split(' - ');
    const excerpt = String(item.description ?? '').replace(/<[^>]*>/g, '').trim();
    return {
      id: item.guid ?? index.toString(),
      title: titlePart ?? item.title,
      link: item.link,
      source: sourcePart ?? 'Unknown',
      timestamp: timeAgo(item.pubDate),
      excerpt,
    } as NewsItem;
  });
}
