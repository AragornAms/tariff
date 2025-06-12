import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { fetchNews, NewsItem } from '../data/news';

const NewsPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchNews(20)
      .then(setNewsItems)
      .catch((err) => {
        console.error('Error fetching news', err);
      });
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item) => (
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
              <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                {item.title}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">{item.excerpt}</p>
              <a
                href={item.link}
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
