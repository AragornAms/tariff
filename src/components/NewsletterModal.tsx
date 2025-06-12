import React, { useState } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';

interface NewsletterModalProps {
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribing(false);
    setIsSuccess(true);
    
    // Auto-close after success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Stay Updated
              </h2>
              <p className="text-gray-600">
                Get weekly tariff updates and trade insights delivered to your inbox
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe to Updates'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're All Set!
            </h2>
            <p className="text-gray-600">
              Welcome to TariffWatch. You'll receive your first update within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;