import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  excerpt: string;
  url: string;
}

const NewsPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=trade%20tariff&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        const articles = data.articles.map((a: any, index: number) => ({
          id: a.url || String(index),
          title: a.title,
          source: a.source.name,
          timestamp: new Date(a.publishedAt).toLocaleDateString(),
          excerpt: a.description,
          url: a.url,
        }));
        setNewsItems(articles);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest Tariff News</h1>
          <p className="text-lg text-gray-600">
            Breaking updates from official sources and trade publications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading && (
            <p className="col-span-full text-center text-gray-500">Loading news...</p>
          )}
          {error && (
            <p className="col-span-full text-center text-red-600">{error}</p>
          )}
          {!loading && !error &&
            newsItems.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-teal-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {item.source}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.timestamp}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.excerpt}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 font-medium text-sm hover:text-teal-800 transition-colors flex items-center group"
                >
                  Read more
                  <ExternalLink className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </article>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
