import { useState, useEffect, useCallback } from 'react';
import { fetchProductBySlug } from '../config/api';
import { Product } from '../types/product';

export interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useProduct = (slugOrId: string | undefined): UseProductResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(slugOrId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugOrId) {
      return;
    }

    let isMounted = true;

    fetchProductBySlug(slugOrId)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setError(data ? null : 'Product not found');
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load product';
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slugOrId]);

  const refresh = useCallback(async () => {
    if (!slugOrId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchProductBySlug(slugOrId);
      setProduct(data);
      if (!data) {
        setError('Product not found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load product';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  return {
    product,
    loading,
    error,
    refresh,
  };
};
