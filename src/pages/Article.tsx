import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useArticleByUrl, useRelatedArticles } from '@/hooks/useNewsAPI';
import { Article as ArticleType } from '@/types/news';
import { useNews } from '@/context/NewsContext';
import { Share2, ArrowLeft, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/news/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get article from location state if available
  const articleFromState = location.state?.article as ArticleType | undefined;
  
  // Fetch article if not available in state
  const { data: fetchedArticle, isLoading: isLoadingArticle } = useArticleByUrl(
    articleFromState ? '' : slug || ''
  );
  
  const article = articleFromState || fetchedArticle;
  
  // Fetch related articles
  const { data: relatedArticles, isLoading: isLoadingRelated } = useRelatedArticles(
    article?.title || '',
    article?.url || '',
    4
  );
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShareClick = () => {
    if (article) {
      navigator.clipboard.writeText(article.url);
      toast('Link copied to clipboard', {
        description: article.title,
      });
    }
  };
  
  const formatPublishedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  return (
    <Layout>
      <div className="container px-4 mx-auto pt-4 md:pt-6">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        {isLoadingArticle || !article ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="aspect-video w-full mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <article className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 text-balance">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {article.source?.name && (
                  <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                    {article.source.name}
                  </span>
                )}
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatPublishedDate(article.publishedAt)}</span>
                </div>
                
                {article.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleShareClick}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
            
            {article.urlToImage && (
              <div className="my-6 rounded-lg overflow-hidden">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-lg mb-4">
                {article.description}
              </p>
              
              {article.content && (
                <div className="mt-4">
                  <p>{article.content.split('[+')[0]}</p>
                </div>
              )}
              
              <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm">
                  This is a preview. Read the full article at:{' '}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {article.source.name}
                  </a>
                </p>
              </div>
            </div>
          </article>
        )}
        
        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="text-xl md:text-2xl font-medium mb-6">Related Articles</h2>
          
          {isLoadingRelated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : relatedArticles && relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <ArticleCard key={`${relatedArticle.url}-${index}`} article={relatedArticle} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No related articles found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Article;
