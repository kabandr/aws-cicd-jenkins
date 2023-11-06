import { useState, useEffect } from "react";
import axios from "axios";
import { Product, UseProductApi } from "../types/types";

const useProductApi = (apiUrl: string): UseProductApi => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(`${apiUrl}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

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
  }, [apiUrl]);

  return { products, loading, error, fetchProducts, deleteProduct };
};

export default useProductApi;
