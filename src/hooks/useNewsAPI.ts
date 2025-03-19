import { useQuery } from '@tanstack/react-query';
import { NewsApiResponse, Category, Article, NytApiResponse, NytArticle } from '@/types/news';
import { 
  getMockTopHeadlines, 
  getMockSearchResults, 
  getMockArticleByUrl, 
  getMockRelatedArticles 
} from '@/data/mockNewsData';

// New York Times API key
const NYT_API_KEY = '752sssNXAM3dKMpl5vXFDsvXw0efcMY3';

// Flag to use mock data when API fails (or during development)
const useMockData = false;

// Helper function to convert NYT article to our standardized Article format
const convertNytToArticle = (nytArticle: NytArticle): Article => {
  // Find the best image to use
  const image = nytArticle.multimedia?.find(media => 
    media.format === 'superJumbo' || media.format === 'threeByTwoSmallAt2X'
  );
  
  // Get a smaller thumbnail image if available
  const thumbnail = nytArticle.multimedia?.find(media => 
    media.format === 'thumbLarge' || media.format === 'Standard Thumbnail'
  );
  
  return {
    source: {
      id: 'nytimes',
      name: 'The New York Times'
    },
    author: nytArticle.byline ? nytArticle.byline.replace('By ', '') : null,
    title: nytArticle.title,
    description: nytArticle.abstract,
    url: nytArticle.url,
    urlToImage: image ? image.url : (thumbnail ? thumbnail.url : null),
    publishedAt: nytArticle.published_date,
    content: nytArticle.abstract,
    nytSection: nytArticle.section,
    nytSubsection: nytArticle.subsection,
    nytByline: nytArticle.byline,
    nytMedia: nytArticle.multimedia,
  };
};

// Map our categories to NYT sections
const mapCategoryToSection = (category: Category): string => {
  const categoryMap: Record<Category, string> = {
    general: 'home',
    business: 'business',
    technology: 'technology',
    sports: 'sports',
    entertainment: 'arts',
    health: 'health',
    science: 'science',
  };
  
  return categoryMap[category] || 'home';
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response): Promise<NewsApiResponse> => {
  const nytResponse: NytApiResponse = await response.json();
  
  // Filter out articles without images and ensure all required fields are present
  const filteredArticles = nytResponse.results.filter(article => 
    article.multimedia?.length > 0 && 
    article.title && 
    article.abstract
  );
  
  return {
    status: nytResponse.status,
    totalResults: nytResponse.num_results,
    articles: filteredArticles.map(convertNytToArticle)
  };
};

// Fetch top headlines
export const useTopHeadlines = (category: Category = 'general', page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['topHeadlines', category, page, pageSize],
    queryFn: async (): Promise<NewsApiResponse> => {
      if (useMockData) {
        // Using mock data instead of API call
        return getMockTopHeadlines(category, page, pageSize);
      }
      
      // Convert our category to NYT section
      const section = mapCategoryToSection(category);
      
      // NYT API doesn't support pagination in the same way, so we'll need to handle it manually
      // We're using the Top Stories API which doesn't have pagination
      try {
        const response = await fetch(
          `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${NYT_API_KEY}`
        );
        
        const data = await handleApiResponse(response);
        
        // Implement manual pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
          ...data,
          articles: data.articles.slice(start, end)
        };
      } catch (error) {
        console.error('NYT API Error:', error);
        // Fallback to mock data when API fails
        return getMockTopHeadlines(category, page, pageSize);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search news articles
export const useSearchNews = (query: string, page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['news', 'search', query, page, pageSize],
    queryFn: async () => {
      if (useMockData) {
        return getMockSearchResults(query, page, pageSize);
      }

      try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
          `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodedQuery}&page=${page - 1}&api-key=${NYT_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter out articles without images and required fields
        const filteredArticles = data.response.docs.filter(article => 
          article.multimedia?.length > 0 && 
          article.headline?.main && 
          article.abstract
        );

        return {
          status: 'ok',
          totalResults: data.response.meta.hits,
          articles: filteredArticles.map(article => ({
            source: {
              id: 'nytimes',
              name: 'The New York Times'
            },
            author: article.byline?.original ? article.byline.original.replace('By ', '') : null,
            title: article.headline.main,
            description: article.abstract,
            url: article.web_url,
            urlToImage: article.multimedia?.length > 0 
              ? `https://www.nytimes.com/${article.multimedia[0].url}`
              : null,
            publishedAt: article.pub_date,
            content: article.lead_paragraph,
          }))
        };
      } catch (error) {
        console.error('Error fetching search results:', error);
        return getMockSearchResults(query, page, pageSize);
      }
    },
    enabled: query.length > 0
  });
};

// Get article by URL (for detailed view)
export const useArticleByUrl = (url: string) => {
  return useQuery({
    queryKey: ['article', url],
    queryFn: async (): Promise<Article | null> => {
      if (!url) return null;
      
      // We always use mock data for this one since NYT API doesn't have a direct endpoint for fetching by URL
      return getMockArticleByUrl(url);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!url,
  });
};

// Get related articles
export const useRelatedArticles = (title: string, excludeUrl: string, limit: number = 4) => {
  return useQuery({
    queryKey: ['relatedArticles', title, excludeUrl],
    queryFn: async (): Promise<Article[]> => {
      if (!title) return [];
      
      // Extract keywords from title for search
      const keywords = title.split(' ')
        .filter(word => word.length > 3)
        .slice(0, 2)
        .join(' ');
      
      if (useMockData || !keywords) {
        // Using mock data instead of API call or if no good keywords
        return getMockRelatedArticles(title, excludeUrl, limit);
      }
      
      // NYT API search for related articles
      try {
        const response = await fetch(
          `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(keywords)}&api-key=${NYT_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform and filter results
        const articles = data.response.docs
          .map((doc: any) => {
            let imageUrl = null;
            
            // Extract image if available
            if (doc.multimedia && doc.multimedia.length > 0) {
              const image = doc.multimedia.find((media: any) => media.type === 'image');
              if (image) {
                imageUrl = `https://www.nytimes.com/${image.url}`;
              }
            }
            
            return {
              source: {
                id: 'nytimes',
                name: 'The New York Times'
              },
              author: doc.byline?.original ? doc.byline.original.replace('By ', '') : null,
              title: doc.headline.main,
              description: doc.abstract || doc.snippet,
              url: doc.web_url,
              urlToImage: imageUrl,
              publishedAt: doc.pub_date,
              content: doc.lead_paragraph,
            };
          })
          .filter((article: Article) => article.url !== excludeUrl)
          .slice(0, limit);
          
        return articles;
      } catch (error) {
        console.error('NYT Related Articles Error:', error);
        // Fallback to mock data when API fails
        return getMockRelatedArticles(title, excludeUrl, limit);
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!title && !!excludeUrl,
  });
};
