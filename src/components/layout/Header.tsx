
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useNews } from '@/context/NewsContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileNav from './MobileNav';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setSearchQuery } = useNews();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const navigate = useNavigate();
  
  useEffect(() => {
    setSearchQuery(debouncedSearchInput);
    if (debouncedSearchInput && window.location.pathname !== '/') {
      navigate('/');
    }
  }, [debouncedSearchInput, setSearchQuery, navigate]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-card py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">WolfStreet</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative max-w-[200px] sm:max-w-xs">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full pl-8 pr-4 py-1 text-sm rounded-full bg-secondary/70 border-transparent focus:bg-background focus:border-input focus:ring-1 focus:ring-ring transition-all duration-300 outline-none"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="transition-opacity opacity-75 hover:opacity-100"
          >
            {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </div>
      
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </header>
  );
};

export default Header;
