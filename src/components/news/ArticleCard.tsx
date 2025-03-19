
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Article } from '@/types/news';
import { Share2, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons inside the card
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Create a URL-friendly slug from the title
    const slug = encodeURIComponent(
      article.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
    );
    
    navigate(`/article/${slug}`, { state: { article } });
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description || '',
        url: article.url,
      }).catch(() => {
        navigator.clipboard.writeText(article.url);
        toast('Link copied to clipboard', {
          position: 'bottom-center',
        });
      });
    } else {
      navigator.clipboard.writeText(article.url);
      toast('Link copied to clipboard', {
        position: 'bottom-center',
      });
    }
  };
  
  const formatPublishedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  return (
    <div 
      className={`group relative bg-card rounded-xl border border-border overflow-hidden animate-fade-in transition-all duration-300 hover:shadow-lg ${
        featured ? 'md:flex' : 'h-full flex flex-col'
      } cursor-pointer subtle-shadow`}
      onClick={handleCardClick}
    >
      {article.urlToImage && !imageError ? (
        <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : 'aspect-video'}`}>
          <div 
            className={`absolute inset-0 bg-muted/50 backdrop-blur-sm ${
              imageLoaded ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-500`}
          />
          <img
            src={article.urlToImage}
            alt={article.title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      ) : (
        <div className={`bg-muted/30 flex items-center justify-center ${
          featured ? 'md:w-1/2' : 'aspect-video'
        }`}>
          <p className="text-muted-foreground text-sm">No image available</p>
        </div>
      )}
      
      <div className={`flex flex-col p-4 flex-grow ${featured ? 'md:w-1/2' : ''}`}>
        <div className="flex-grow">
          <div className="flex gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
              {article.source.name || 'Unknown Source'}
            </span>
          </div>
          
          <h3 className={`font-medium tracking-tight mb-2 line-clamp-2 text-balance ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h3>
          
          {article.description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {article.description}
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatPublishedDate(article.publishedAt)}</span>
            </div>
            
            {article.author && (
              <div className="flex items-center gap-1 max-w-[200px] truncate">
                <User className="h-3 w-3" />
                <span className="truncate">{article.author}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-1">            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
