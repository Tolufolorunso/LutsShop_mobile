export type CameraProfile =
  | 'All'
  | 'Sony S-Log3'
  | 'ARRI LogC'
  | 'Apple Log'
  | 'RED IPP2'
  | 'BMPCC Gen 5';

export type ProductCategory =
  | 'Cinema'
  | 'Vintage'
  | 'Commercial'
  | 'Horror'
  | 'Sci-Fi'
  | 'Portrait'
  | 'Documentary';

export interface TechSpecs {
  cameraCurves?: string[];
  colorSpace?: string;
  fileFormats?: string[];
  packageSize?: string;
  lutCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  supportedCameras: string[];
  lutCount: number;
  badge?: string;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  beforeImageUrl: string;
  afterImageUrl: string;
  thumbnailUrl: string;
  techSpecs: TechSpecs;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  camera?: string;
  featured?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page?: number;
  limit?: number;
}
