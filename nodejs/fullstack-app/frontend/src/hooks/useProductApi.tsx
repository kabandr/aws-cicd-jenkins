import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Product, UseProductApi } from "../types/types";

const useProductApi = (apiUrl: string): UseProductApi => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(`${apiUrl}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/products/${productId}`);
      fetchProducts();
      setLoading(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiUrl) {
      fetchProducts();
    }
  }, [apiUrl, fetchProducts]);

  return { products, loading, error, fetchProducts, deleteProduct };
};

export default useProductApi;
