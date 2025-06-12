import React from 'react';
import { TrendingUp, Mail, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-teal-400" />
              <span className="text-xl font-bold">TariffWatch</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Stay informed about Vietnam-US trade tariffs with real-time news, 
              impact calculations, and expert analysis.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-teal-400 transition-colors">
                <Mail className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-teal-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Latest News</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Tariff Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Trade Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 TariffWatch. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Built for traders, by traders.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;