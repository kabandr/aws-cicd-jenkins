import { useEffect } from "react";
import { ProductListProps } from "../types/types";
import useProductApi from "../hooks/useProductApi";

const apiUrl = "http://localhost:3001";

function ProductList({ onProductSelect }: ProductListProps) {
  const { products, loading, error, fetchProducts, deleteProduct } =
    useProductApi(apiUrl);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 py-8">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.description}</td>
                <td className="border p-2">{product.price}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => onProductSelect(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => product._id && deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
