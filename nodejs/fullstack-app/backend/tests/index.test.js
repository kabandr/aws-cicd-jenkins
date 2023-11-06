const request = require('supertest');
const Product = require('../models/Product');
const { app } = require('../src/index');

jest.mock('../models/Product');

const mockProduct = {
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
};

describe('API Endpoints', () => {
  it('should fetch all products', async () => {
    const mockProducts = [
      { name: 'Product 1', description: 'Description 1', price: 10 },
      { name: 'Product 2', description: 'Description 2', price: 20 },
      { name: 'Product 3', description: 'Description 3', price: 30 },
    ];

    Product.find.mockResolvedValue(mockProducts);
    const res = await request(app).get('/products');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProducts);
  });

  it('should handle errors', async () => {
    Product.find.mockRejectedValue(new Error('Error fetching products'));

    const res = await request(app).get('/products');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Error fetching products' });
  });

  it('should return a product if it exists', async () => {
    Product.findById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/products/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProduct);
  });

  it('should return 404 if product does not exist', async () => {
    Product.findById.mockResolvedValue(null);

    const res = await request(app).get('/products/1');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });

  it('should return 500 if there is an error', async () => {
    Product.findById.mockRejectedValue(new Error('Test error'));

    const res = await request(app).get('/products/1');

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Error fetching product' });
  });

  it('should update a product if it exists', async () => {
    Product.findByIdAndUpdate.mockResolvedValue(mockProduct);

    const res = await request(app)
      .put('/products/1')
      .send({ name: 'Updated Product' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockProduct);
  });

  it('should return 404 if product does not exist', async () => {
    Product.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/products/1')
      .send({ name: 'Updated Product' });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });

  it('should return 500 if there is an error', async () => {
    Product.findByIdAndUpdate.mockRejectedValue(new Error('Test error'));

    const res = await request(app)
      .put('/products/1')
      .send({ name: 'Updated Product' });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({ error: 'Error updating product' });
  });

  it('should return a 404 status code if the product does not exist', async () => {
    const productId = '12'; // Replace with an ID that does not exist
    const response = await request(app)
      .delete(`/products/${productId}`)
      .expect(404)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({ error: 'Product not found' });
  });
});
