import React from 'react';
import { ArrowRight, Newspaper, Calculator, BookOpen, Mail, Clock, ExternalLink } from 'lucide-react';

interface HomepageProps {
  onNavigate: (page: string) => void;
  onShowNewsletter: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onNavigate, onShowNewsletter }) => {
  const newsItems = [
    {
      id: 1,
      title: "US Announces New Tariff Framework for Vietnamese Textiles",
      source: "Trade.gov",
      timestamp: "2 hours ago",
      excerpt: "New regulations expected to impact textile imports by 15% starting Q2 2025..."
    },
    {
      id: 2,
      title: "Vietnam Electronics Sector Responds to Tariff Changes",
      source: "VietnamNews",
      timestamp: "5 hours ago",
      excerpt: "Local manufacturers adapt pricing strategies amid shifting trade policies..."
    },
    {
      id: 3,
      title: "Bilateral Trade Agreement Updates: What Importers Need to Know",
      source: "CBP",
      timestamp: "1 day ago",
      excerpt: "Critical updates to documentation requirements for cross-border commerce..."
    },
    {
      id: 4,
      title: "Q4 Tariff Impact Analysis: Winners and Losers",
      source: "TradeInsight",
      timestamp: "2 days ago",
      excerpt: "Comprehensive analysis of how recent tariff changes affected different sectors..."
    },
    {
      id: 5,
      title: "New HS Code Classifications for Tech Products",
      source: "WTO",
      timestamp: "3 days ago",
      excerpt: "Updated harmonized system codes affect tariff calculations for tech imports..."
    }
  ];

  const features = [
    {
      icon: <Newspaper className="h-8 w-8 text-teal-600" />,
      title: "Real-time News",
      description: "Get instant updates on tariff changes, trade policies, and regulatory announcements from official sources."
    },
    {
      icon: <Calculator className="h-8 w-8 text-teal-600" />,
      title: "Impact Calculator", 
      description: "Calculate exact duty costs, landed prices, and margin impacts for your specific products and quantities."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-teal-600" />,
      title: "Expert Guides",
      description: "Access comprehensive guides on compliance, documentation, and strategies from trade professionals."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Vietnam ↔ US{' '}
              <span className="text-teal-700">Tariff News</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stay ahead of trade policy changes with real-time tariff updates, 
              precise cost calculations, and expert insights for Vietnam-US commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('calculator')}
                className="bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-800 transition-all duration-200 flex items-center justify-center group"
              >
                Use Calculator
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('guides')}
                className="border border-teal-700 text-teal-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-50 transition-all duration-200"
              >
                Read Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Tariff News</h2>
            <p className="text-lg text-gray-600">
              Breaking updates from official sources and trade publications
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.excerpt}
                </p>
                <button className="text-teal-700 font-medium text-sm hover:text-teal-800 transition-colors flex items-center group">
                  Read more
                  <ExternalLink className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('news')}
              className="text-teal-700 font-semibold hover:text-teal-800 transition-colors"
            >
              View all news →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Everything you need to navigate Vietnam-US trade tariffs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-all duration-200 border border-gray-100"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-16 bg-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-teal-200 mr-3" />
            <h2 className="text-3xl font-bold text-white">Get Weekly Tariff Updates</h2>
          </div>
          <p className="text-xl text-teal-100 mb-8">
            Join 5,000+ traders getting essential tariff news delivered to their inbox
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-300 focus:outline-none"
            />
            <button
              onClick={onShowNewsletter}
              className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Subscribe
            </button>
          </div>
          <p className="text-sm text-teal-200 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Homepage;