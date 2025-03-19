
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import CategoryNav from '@/components/news/CategoryNav';
import NewsGrid from '@/components/news/NewsGrid';
import PaginationControls from '@/components/ui/pagination-controls';
import AlertBanner from '@/components/ui/alert-banner';
import { useNews } from '@/context/NewsContext';
import { useTopHeadlines, useSearchNews } from '@/hooks/useNewsAPI';

const Index: React.FC = () => {
  const { selectedCategory, searchQuery } = useNews();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Reset page when category or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);
  
  // Fetch headlines or search results
  const isSearching = searchQuery.trim().length > 0;
  
  const {
    data: headlinesData,
    isLoading: isLoadingHeadlines,
    error: headlinesError
  } = useTopHeadlines(selectedCategory, currentPage, pageSize);
  
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: searchError
  } = useSearchNews(searchQuery, currentPage, pageSize);
  
  // Use appropriate data based on whether we're searching or not
  const data = isSearching ? searchData : headlinesData;
  const isLoading = isSearching ? isLoadingSearch : isLoadingHeadlines;
  const error = isSearching ? searchError : headlinesError;
  
  const totalPages = data ? Math.ceil(Math.min(data.totalResults, 100) / pageSize) : 0;
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Layout>
      <div className="container px-4 mx-auto pt-4 md:pt-6">
        
        
        <section className="mb-8">
          <div className="mb-6">
            <CategoryNav />
          </div>
          
          <h1 className="text-xl md:text-2xl font-medium mb-6">
            {isSearching 
              ? `Search results for "${searchQuery}"`
              : `${selectedCategory === 'general' ? 'Top' : selectedCategory} Headlines`}
          </h1>
          
          {error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              Error loading news: {error.message}
            </div>
          ) : (
            <>
              <NewsGrid 
                articles={data?.articles || []} 
                isLoading={isLoading}
                showFeatured={currentPage === 1 && !isSearching} 
              />
              
              <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
