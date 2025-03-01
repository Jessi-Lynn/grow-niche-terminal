
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-terminal-gray py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-terminal-white text-xl font-bold flex items-center gap-1 mb-4">
              <span className="text-terminal-red">&gt;</span> 
              <span className="retro-glow">GrowYourNiche</span>
            </Link>
            <p className="text-sm text-terminal-white/70 mb-4">
              Your source for premium JSON blueprints and automation services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-terminal-white hover:text-terminal-red transition-colors duration-300">
                <Github size={20} />
              </a>
              <a href="#" className="text-terminal-white hover:text-terminal-red transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-terminal-white hover:text-terminal-red transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-terminal-white hover:text-terminal-red transition-colors duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-terminal-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blueprints" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Blueprints
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-terminal-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-terminal-white/70 hover:text-terminal-red transition-colors duration-300">
                  Support
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-terminal-white font-bold mb-4">Subscribe</h3>
            <p className="text-sm text-terminal-white/70 mb-4">
              Stay updated with the latest blueprints and automation tips.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow bg-terminal-gray/30 border border-terminal-gray text-terminal-white rounded-l py-2 px-3 focus:outline-none focus:border-terminal-red transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-terminal-red text-terminal-black px-4 py-2 rounded-r font-mono font-bold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-terminal-gray/50 mt-8 pt-8 text-center">
          <p className="text-sm text-terminal-white/50">
            &copy; {currentYear} GrowYourNiche. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
