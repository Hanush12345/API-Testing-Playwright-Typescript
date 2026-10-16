import { test, expect } from '@playwright/test';
import { PostRequest, PostResponse } from '../types';

test.describe('JSONPlaceholder API Test Collection', () => {
  // These specs target JSONPlaceholder, not the restful-booker baseURL in playwright.config.ts
  test.use({ baseURL: 'https://jsonplaceholder.typicode.com' });

  let createdPostId: number;

  // 1. POST Request - Create a Resource
  test('POST /posts - should create a new post', async ({ request }) => {
    const payload: PostRequest = {
      title: 'Playwright API Testing',
      body: 'Automating endpoints with TypeScript is highly efficient.',
      userId: 1,
    };

    const response = await request.post('/posts', {
      data: payload,
    });

    // Verify response status and headers
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    // Validate body payload structure
    const responseBody: PostResponse = await response.json();
    expect(responseBody.title).toBe(payload.title);
    expect(responseBody.body).toBe(payload.body);
    expect(responseBody.userId).toBe(payload.userId);
    expect(responseBody.id).toBeDefined();

    // Store ID for subsequent dependent test scripts if using a real stateful backend
    createdPostId = responseBody.id;
  });

  // 2. GET Request - Read a Resource
  test('GET /posts/1 - should retrieve post details', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);

    const post: PostResponse = await response.json();
    expect(post.id).toBe(1);
    expect(post.title).toBeDefined();
    expect(post.body).toBeDefined();
  });

  // 3. PUT Request - Update a Resource completely
  test('PUT /posts/1 - should update an entire post payload', async ({ request }) => {
    const updatePayload: PostRequest = {
      title: 'Updated Playwright Title',
      body: 'This resource has been rewritten.',
      userId: 1,
    };

    const response = await request.put('/posts/1', {
      data: updatePayload,
    });

    expect(response.status()).toBe(200);

    const updatedPost: PostResponse = await response.json();
    expect(updatedPost.title).toBe(updatePayload.title);
    expect(updatedPost.body).toBe(updatePayload.body);
  });

  // 4. DELETE Request - Destroy a Resource
  test('DELETE /posts/1 - should delete the resource', async ({ request }) => {
    const response = await request.delete('/posts/1');

    expect(response.status()).toBe(200);
    // Note: Some REST APIs correctly return a 204 No Content response code.
  });
});
