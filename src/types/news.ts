
export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  // Additional fields for NYT API compatibility
  nytSection?: string;
  nytSubsection?: string;
  nytByline?: string;
  nytMedia?: NytMedia[];
}

export interface NytMedia {
  url: string;
  format: string;
  height: number;
  width: number;
  type: string;
  subtype: string;
  caption: string;
  copyright: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export type Category = 'general' | 'business' | 'technology' | 'sports' | 'entertainment' | 'health' | 'science';

// NYT API specific types
export interface NytApiResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: NytArticle[];
}

export interface NytArticle {
  section: string;
  subsection: string;
  title: string;
  abstract: string;
  url: string;
  uri: string;
  byline: string;
  item_type: string;
  updated_date: string;
  created_date: string;
  published_date: string;
  material_type_facet: string;
  kicker: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: NytMedia[];
  short_url: string;
}
