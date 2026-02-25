import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const testUser = { email: 'test@example.com', password: 'Test1234', name: 'Test User' };
let token = '';
let productId = '';

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    token = res.body.token;
  });

  it('should fail on duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(400);
    expect(res.body.msg).toContain('Email already in use');
  });

  it('should login a user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail on invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: 'wrongpass' });
    expect(res.status).toBe(400);
  });
});

describe('Products API', () => {
  it('should list products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a product (auth)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Phone')
      .field('price', '999')
      .field('description', 'A test phone');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Phone');
    productId = res.body._id;
  });

  it('should fail to create product without auth', async () => {
    const res = await request(app)
      .post('/api/products')
      .field('title', 'Unauth Phone')
      .field('price', '500');
    expect(res.status).toBe(401);
  });

  it('should fail on invalid price', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test')
      .field('price', 'not-a-number');
    expect(res.status).toBe(400);
  });
});

describe('Cart API', () => {
  it('should get or create cart', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toBeDefined();
  });

  it('should add product to cart', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].quantity).toBe(2);
  });

  it('should remove product from cart', async () => {
    const res = await request(app)
      .post('/api/cart/remove')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(0);
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await mongoose.connection.close();
});
