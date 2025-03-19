
import { NewsApiResponse, Article, Category } from "@/types/news";

// Improved image URLs for different categories
const getCategoryImage = (category: Category, index: number): string => {
  const categoryImages: Record<Category, string[]> = {
    general: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80",
    ],
    business: [
      "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    ],
    technology: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
      "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80",
    ],
    sports: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&q=80",
      "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
    ],
    entertainment: [
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
      "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80",
      "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
    ],
    health: [
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80",
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80",
      "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&q=80",
    ],
    science: [
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
      "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&q=80",
      "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=800&q=80",
    ],
  };

  // Get a consistent image for a specific index within a category
  const images = categoryImages[category];
  return images[index % images.length];
};

// Mock data for different categories
const generateMockArticles = (category: Category, count: number = 10): Article[] => {
  return Array.from({ length: count }, (_, i) => ({
    source: {
      id: `source-${i}`,
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Source ${i + 1}`,
    },
    author: `Author ${i + 1}`,
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} News Article ${i + 1}`,
    description: `This is a mock description for a ${category} news article ${i + 1}. It contains some sample text that gives an overview of what the article is about.`,
    url: `https://example.com/${category}/article-${i + 1}`,
    urlToImage: getCategoryImage(category, i),
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    content: `This is the full content of the mock ${category} article ${i + 1}. It contains much more detailed information about the topic at hand, including quotes, statistics, and analysis.`,
  }));
};

// Create mock data for each category
const mockDataByCategory: Record<Category, Article[]> = {
  general: generateMockArticles('general', 30),
  business: generateMockArticles('business', 30),
  technology: generateMockArticles('technology', 30),
  sports: generateMockArticles('sports', 30),
  entertainment: generateMockArticles('entertainment', 30),
  health: generateMockArticles('health', 30),
  science: generateMockArticles('science', 30),
};

// Function to get mock top headlines
export const getMockTopHeadlines = (
  category: Category = 'general',
  page: number = 1,
  pageSize: number = 10
): NewsApiResponse => {
  const articles = mockDataByCategory[category];
  const startIndex = (page - 1) * pageSize;
  const paginatedArticles = articles.slice(startIndex, startIndex + pageSize);
  
  return {
    status: 'ok',
    totalResults: articles.length,
    articles: paginatedArticles,
  };
};

// Function to get mock search results
export const getMockSearchResults = (
  query: string,
  page: number = 1,
  pageSize: number = 10
): NewsApiResponse => {
  if (!query.trim()) {
    return { status: 'ok', totalResults: 0, articles: [] };
  }
  
  // Search across all categories
  const allArticles = Object.values(mockDataByCategory).flat();
  
  // Filter articles based on search query
  const matchingArticles = allArticles.filter(article => {
    const searchTermLower = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchTermLower) ||
      (article.description?.toLowerCase().includes(searchTermLower)) ||
      (article.content?.toLowerCase().includes(searchTermLower))
    );
  });
  
  const startIndex = (page - 1) * pageSize;
  const paginatedArticles = matchingArticles.slice(startIndex, startIndex + pageSize);
  
  return {
    status: 'ok',
    totalResults: matchingArticles.length,
    articles: paginatedArticles,
  };
};

// Function to get a single article by URL
export const getMockArticleByUrl = (url: string): Article | null => {
  if (!url) return null;
  
  const allArticles = Object.values(mockDataByCategory).flat();
  return allArticles.find(article => article.url === url) || null;
};

// Function to get related articles
export const getMockRelatedArticles = (title: string, excludeUrl: string, limit: number = 4): Article[] => {
  if (!title) return [];
  
  const allArticles = Object.values(mockDataByCategory).flat();
  
  // Extract keywords from title (simple implementation)
  const keywords = title
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3);
  
  // Find articles with matching keywords
  const relatedArticles = allArticles
    .filter(article => {
      if (article.url === excludeUrl) return false;
      
      const hasRelatedKeyword = keywords.some(keyword => 
        article.title.toLowerCase().includes(keyword)
      );
      
      return hasRelatedKeyword;
    })
    .slice(0, limit);
  
  // If we don't have enough related articles, add some random ones
  if (relatedArticles.length < limit) {
    const remainingCount = limit - relatedArticles.length;
    const randomArticles = allArticles
      .filter(article => 
        article.url !== excludeUrl && !relatedArticles.includes(article)
      )
      .slice(0, remainingCount);
    
    relatedArticles.push(...randomArticles);
  }
  
  return relatedArticles;
};
