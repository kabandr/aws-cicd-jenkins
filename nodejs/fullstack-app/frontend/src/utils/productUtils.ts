import { useContext } from "react";
import { ProductListContext } from "../context/ProductListContext";

export function useProductList() {
  const context = useContext(ProductListContext);
  if (!context) {
    throw new Error("useProductList must be used within a ProductListProvider");
  }
  return context;
}
