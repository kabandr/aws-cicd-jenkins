import { waitFor, renderHook, act } from "@testing-library/react";
import useProductApi from "../hooks/useProductApi";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

describe("useProductApi", () => {
  let consoleSpy: jest.SpyInstance;
  const apiUrl = "http://localhost:3001"

  beforeAll(() => {
    mock.reset();
  });

  beforeEach(() => {
    // Mock console.error before each test
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleSpy.mockRestore();
  });

  it("fetches products successfully", async () => {
    const products = [
      { id: "1", name: "Test Product", description: "Best product", price: 30 },
    ]; // Example product data
    mock.onGet(`${apiUrl}/products`).reply(200, products);

    const { result } = renderHook(() => useProductApi(apiUrl));

    await waitFor(() => expect(result.current.products).toEqual(products));

    expect(result.current.products).toEqual(products);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("handles error while fetching products", async () => {
    mock.onGet(`${apiUrl}/products`).networkError();

    const { result } = renderHook(() => useProductApi(apiUrl));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
  });

  it("deletes a product", async () => {
    const productId = "1"; // ID of the product to be deleted
    mock.onDelete(`${apiUrl}/products/${productId}`).reply(200);

    // Mock fetchProducts to resolve immediately
    mock.onGet(`${apiUrl}/products`).reply(200, []);

    const { result } = renderHook(() => useProductApi(apiUrl));

    // Trigger deleteProduct
    act(() => {
      result.current.deleteProduct(productId);
    });

    // Wait for the loading state to become false
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
  });

  it("handles error while deleting a product", async () => {
    const productId = "nonexistent"; // ID of the product that does not exist
    mock.onDelete(`${apiUrl}/products/${productId}`).networkError();

    const { result } = renderHook(() => useProductApi(apiUrl));

    // Trigger deleteProduct
    act(() => {
      result.current.deleteProduct(productId);
    });

    // Use waitFor to wait for the hook to update state after the deletion attempt
    await waitFor(() => {
      // Check that the error is defined
      expect(result.current.loading).toBe(false);
    });

    // The loading state should be false and error should be defined
    expect(result.current.error).toBeDefined();
  });
});
