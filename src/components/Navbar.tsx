
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleServicesDropdown = () => setServicesDropdownOpen(!servicesDropdownOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Close menu when route changes
    setIsMenuOpen(false);
    setServicesDropdownOpen(false);

    window.addEventListener('scroll', handleScroll);
    
    // Close the dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Services', 
      path: '/services',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Services', path: '/services' },
        { name: 'Courses', path: '/courses' },
        { name: 'Tools', path: '/tools' },
      ]
    },
    { name: 'Blueprints', path: '/blueprints' },
    { name: 'Team', path: '/team' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isActiveDropdown = (items: { path: string }[]) => items.some(item => location.pathname === item.path);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 font-mono",
      scrolled ? "bg-terminal-black/90 backdrop-blur-sm border-b border-terminal-gray" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-terminal-white text-xl font-bold flex items-center gap-2">
          <span className="text-terminal-red">&gt;</span> 
          <span className="retro-glow">GrowYourNiche</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div 
                key={link.path} 
                className="relative" 
                ref={servicesDropdownRef}
              >
                <button
                  onClick={toggleServicesDropdown}
                  className={cn(
                    "flex items-center relative line-animation",
                    isActiveDropdown(link.dropdownItems) 
                      ? "text-terminal-red" 
                      : "text-terminal-white hover:text-terminal-red transition-colors duration-300"
                  )}
                >
                  {link.name}
                  <ChevronDown size={16} className={cn(
                    "ml-1 transition-transform duration-300",
                    servicesDropdownOpen ? "rotate-180" : ""
                  )} />
                </button>
                
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-terminal-black border border-terminal-gray rounded-md shadow-lg overflow-hidden z-20">
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "block px-4 py-2 text-sm hover:bg-terminal-gray/20 transition-colors duration-300",
                          isActive(item.path) 
                            ? "text-terminal-red" 
                            : "text-terminal-white"
                        )}
                        onClick={() => setServicesDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative line-animation",
                  isActive(link.path) 
                    ? "text-terminal-red" 
                    : "text-terminal-white hover:text-terminal-red transition-colors duration-300"
                )}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-terminal-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 top-16 bg-terminal-black/95 backdrop-blur transition-transform duration-300 md:hidden z-40",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div key={link.path} className="flex flex-col items-center">
                <button
                  onClick={toggleServicesDropdown}
                  className={cn(
                    "text-2xl flex items-center",
                    isActiveDropdown(link.dropdownItems) 
                      ? "text-terminal-red" 
                      : "text-terminal-white hover:text-terminal-red transition-colors duration-300"
                  )}
                >
                  {link.name}
                  <ChevronDown size={20} className={cn(
                    "ml-1 transition-transform duration-300",
                    servicesDropdownOpen ? "rotate-180" : ""
                  )} />
                </button>
                
                {servicesDropdownOpen && (
                  <div className="mt-4 flex flex-col items-center gap-3">
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "text-xl",
                          isActive(item.path) 
                            ? "text-terminal-red" 
                            : "text-terminal-white/80 hover:text-terminal-red transition-colors duration-300"
                        )}
                        onClick={() => {
                          setServicesDropdownOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-2xl",
                  isActive(link.path) 
                    ? "text-terminal-red" 
                    : "text-terminal-white hover:text-terminal-red transition-colors duration-300"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
