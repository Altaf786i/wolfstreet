
import React from 'react';
import { Article } from '@/types/news';
import ArticleCard from './ArticleCard';
import NewsLoadingSkeleton from './NewsLoadingSkeleton';

interface NewsGridProps {
  articles: Article[];
  isLoading: boolean;
  showFeatured?: boolean;
}

const NewsGrid: React.FC<NewsGridProps> = ({ 
  articles, 
  isLoading, 
  showFeatured = false 
}) => {
  if (isLoading) {
    return <NewsLoadingSkeleton showFeatured={showFeatured} />;
  }
  
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    );
  }
  
  // Display first article as featured if showFeatured is true
  const featuredArticle = showFeatured ? articles[0] : null;
  const remainingArticles = showFeatured ? articles.slice(1) : articles;
  
  return (
    <div className="space-y-8">
      {featuredArticle && (
        <div className="mb-10">
          <ArticleCard article={featuredArticle} featured={true} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingArticles.map((article, index) => (
          <ArticleCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;
