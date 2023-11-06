export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: string;
}

export interface ProductFormProps {
  productToEdit?: Product | null;
  onProductCreated: (product: Product) => void;
  onProductUpdated: (product: Product) => void;
}

export interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export interface UseProductApi {
  products: Product[];
  loading: boolean;
  error: Error | null;
  fetchProducts: () => Promise<void>;
}

export interface UseProductApi {
  products: Product[];
  loading: boolean;
  error: Error | null;
  fetchProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export interface ProductListContextType {
  products: Product[];
  fetchProducts: () => void;
}
