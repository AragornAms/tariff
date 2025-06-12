import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import Calculator from './pages/Calculator';
import News from './pages/News';
import NewsletterModal from './components/NewsletterModal';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'calculator':
        return <Calculator onEmailResults={() => setShowNewsletterModal(true)} />;
      case 'guides':
        return (
          <div className="min-h-screen pt-20 px-4">
            <div className="max-w-4xl mx-auto py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Tariff Guides</h1>
              <p className="text-gray-600">Expert guides coming soon...</p>
            </div>
          </div>
        );
      case 'news':
        return <News onNavigate={setCurrentPage} />;
      default:
        return <Homepage onNavigate={setCurrentPage} onShowNewsletter={() => setShowNewsletterModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
      
      {showNewsletterModal && (
        <NewsletterModal onClose={() => setShowNewsletterModal(false)} />
      )}
    </div>
  );
}

export default App;