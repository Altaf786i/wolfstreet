
import React from 'react';
import { useNews } from '@/context/NewsContext';
import { Category } from '@/types/news';
import { Button } from '@/components/ui/button';

interface CategoryNavProps {
  onCategorySelect?: () => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ onCategorySelect }) => {
  const { selectedCategory, setSelectedCategory } = useNews();
  
  const categories: Category[] = [
    'general',
    'technology',
    'business',
    'sports',
    'entertainment',
    'health',
    'science'
  ];
  
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    
    if (onCategorySelect) {
      onCategorySelect();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="w-full overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
      <div className="flex space-x-1 md:space-x-2 min-w-max">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'ghost'}
            size="sm"
            className={`capitalize whitespace-nowrap ${
              selectedCategory === category 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            } transition-all duration-300`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
