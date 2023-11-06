import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Product, ProductFormProps } from "../types/types";

const apiUrl = "http://localhost:3001";

function ProductForm({
  productToEdit,
  onProductCreated,
  onProductUpdated,
}: ProductFormProps) {
  const initialProductState: Product = {
    name: "",
    description: "",
    price: "",
  };

  const [product, setProduct] = useState<Product>({ ...initialProductState });

  useEffect(() => {
    if (productToEdit) {
      setProduct({ ...productToEdit });
    }
  }, [productToEdit]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (productToEdit) {
      // Edit an existing product
      try {
        const updatedProduct = await axios.put(
          `${apiUrl}/products/${productToEdit._id}`,
          product
        );
        onProductUpdated(updatedProduct.data);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      // Create a new product
      try {
        const newProduct = await axios.post(`${apiUrl}/products`, product);
        onProductCreated(newProduct.data);
        setProduct({ ...initialProductState });
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  return (
    <div>
      <h2>{productToEdit ? "Update Product" : "Create Product"}</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          name="name"
          value={product.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Product Description"
          name="description"
          value={product.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Product Price"
          name="price"
          value={product.price}
          onChange={handleInputChange}
        />
        <button type="submit">{productToEdit ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default ProductForm;
