
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 mt-16 border-t">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold">WolfStreet</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Stay informed with the latest news
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} WolfStreet. All rights reserved.
            </p>
            <a 
              href="https://altafrehman.online" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-primary hover:underline mt-1"
            >
              Developed by Altaf Rehman
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
