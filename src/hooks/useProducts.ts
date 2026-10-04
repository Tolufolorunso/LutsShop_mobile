import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchProducts } from '../config/api';
import { CameraProfile, Product, ProductCategory } from '../types/product';

export interface UseProductsOptions {
  initialCamera?: CameraProfile | string;
  initialCategory?: ProductCategory | 'All';
  initialSearch?: string;
  featuredOnly?: boolean;
}

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCamera: CameraProfile | string;
  selectedCategory: ProductCategory | 'All';
  featuredOnly: boolean;
  totalCount: number;
  featuredProduct: Product | undefined;
  setSearchQuery: (query: string) => void;
  setSelectedCamera: (camera: CameraProfile | string) => void;
  setSelectedCategory: (category: ProductCategory | 'All') => void;
  setFeaturedOnly: (featured: boolean) => void;
  refresh: () => Promise<void>;
  clearFilters: () => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>(options.initialSearch || '');
  const [selectedCamera, setSelectedCamera] = useState<CameraProfile | string>(
    options.initialCamera || 'All'
  );
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(
    options.initialCategory || 'All'
  );
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(options.featuredOnly || false);

  useEffect(() => {
    let isMounted = true;

    fetchProducts({
      search: searchQuery,
      camera: selectedCamera !== 'All' ? selectedCamera : undefined,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      featured: featuredOnly ? true : undefined,
    })
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load products';
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCamera, selectedCategory, featuredOnly]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts({
        search: searchQuery,
        camera: selectedCamera !== 'All' ? selectedCamera : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        featured: featuredOnly ? true : undefined,
      });
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCamera, selectedCategory, featuredOnly]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCamera('All');
    setSelectedCategory('All');
    setFeaturedOnly(false);
  }, []);

  const totalCount = products.length;

  const featuredProduct = useMemo(() => {
    return products.find((p) => p.isFeatured) || products[0];
  }, [products]);

  return {
    products,
    loading,
    error,
    searchQuery,
    selectedCamera,
    selectedCategory,
    featuredOnly,
    totalCount,
    featuredProduct,
    setSearchQuery,
    setSelectedCamera,
    setSelectedCategory,
    setFeaturedOnly,
    refresh,
    clearFilters,
  };
};
