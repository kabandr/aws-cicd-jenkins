import "./App.css";
import { useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import useProductApi from "./hooks/useProductApi";
import { Product } from "./types/types";
import { ProductListProvider } from "./context/ProductListContext";

function App() {
  const apiUrl = "http://localhost:3001";
  const { products } = useProductApi(apiUrl);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductCreated = async () => {
    setSelectedProduct(null);
  };

  const handleProductUpdated = async () => {
    setSelectedProduct(null);
  };

  const handleProductSelect = (selectedProduct: Product) => {
    setSelectedProduct(selectedProduct);
  };

  return (
    <ProductListProvider>
      <h1>Product Management App</h1>
      <ProductForm
        productToEdit={selectedProduct}
        onProductCreated={handleProductCreated}
        onProductUpdated={handleProductUpdated}
      />
      <ProductList products={products} onProductSelect={handleProductSelect} />
    </ProductListProvider>
  );
}

export default App;
