
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryNav from '@/components/news/CategoryNav';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="container h-full px-4 mx-auto flex flex-col">
        <div className="flex justify-end py-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-6 mt-6 animate-slide-in">
          <Button 
            variant="ghost" 
            className="flex items-center justify-start gap-3 text-lg py-6"
            onClick={() => handleNavigation('/')}
          >
            <Home className="h-5 w-5" />
            Home
          </Button>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Categories</h3>
            <CategoryNav onCategorySelect={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
