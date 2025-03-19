import React, { createContext, useContext, useState } from 'react';
import { Category } from '@/types/news';

interface NewsContextType {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('general');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <NewsContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = (): NewsContextType => {
  const context = useContext(NewsContext);
  
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  
  return context;
};
