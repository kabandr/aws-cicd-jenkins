import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { Product, ProductListContextType } from "../types/types";

export const ProductListContext = createContext<
  ProductListContextType | undefined
>(undefined);

interface ProductListProviderProps {
  children: ReactNode;
}

export function ProductListProvider({ children }: ProductListProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const apiUrl = "http://localhost:3001/products";

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(apiUrl);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductListContextType = {
    products,
    fetchProducts,
  };

  return (
    <ProductListContext.Provider value={value}>
      {children}
    </ProductListContext.Provider>
  );
}
