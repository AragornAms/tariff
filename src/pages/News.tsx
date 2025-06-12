import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink, Newspaper } from 'lucide-react';
import fetchRssNews, { NewsItem } from '../utils/fetchRssNews';

interface NewsPageProps {
  onNavigate: (page: string) => void;
}

const News: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRssNews(undefined, 20);
        setItems(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Newspaper className="h-8 w-8 text-teal-600 mr-2" />
          Latest News
        </h1>
        {loading && <p className="text-center text-gray-500">Loading news...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        <div className="space-y-8">
          {!loading && !error &&
            items.map((item) => (
              <article key={item.id} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-teal-700">{item.source}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.timestamp}
                  </div>
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600 mb-2">{item.excerpt}</p>
                <a
                  href={item.url}
                  className="text-teal-700 text-sm flex items-center"
                >
                  Read more
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </article>
            ))}
        </div>
        <div className="mt-8">
          <button onClick={() => onNavigate('home')} className="text-teal-700">
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;
