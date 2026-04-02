import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Share2, Rss, Camera, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-700 dark:bg-charcoal-900 text-cream-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <BookOpen className="text-charcoal-900" size={18} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-cream-100">Maktaba</span>
                <span className="text-[10px] text-gold-400 tracking-widest">مكتبة</span>
              </div>
            </Link>
            <p className="text-sm text-cream-400 leading-relaxed">
              Your curated online bookstore. Discover stories that inspire, educate, and captivate.
            </p>
            <div className="flex gap-3 mt-4">
              {[Share2, Rss, Camera].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="p-2 rounded-lg bg-charcoal-600 hover:bg-gold-500 hover:text-charcoal-900 text-cream-400 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Browse',
              links: [
                { label: 'All Books', to: '/books' },
                { label: 'Fiction', to: '/books?genre=Fiction' },
                { label: 'Science', to: '/books?genre=Science' },
                { label: 'Bestsellers', to: '/books?sort=bestseller' },
                { label: 'New Arrivals', to: '/books?filter=new' },
              ],
            },
            {
              title: 'Account',
              links: [
                { label: 'Wishlist', to: '/wishlist' },
                { label: 'Cart', to: '/cart' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', to: '#' },
                { label: 'Contact', to: '#' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-display font-semibold text-cream-100 mb-3">{title}</h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-cream-400 hover:text-gold-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-charcoal-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-500">
            © {new Date().getFullYear()} Maktaba. All rights reserved.
          </p>
          <p className="text-xs text-cream-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-gold-400 fill-gold-400" /> for book lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
