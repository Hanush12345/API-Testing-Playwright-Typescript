import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    // Base URL used for all relative API request endpoints
    // baseURL: 'https://jsonplaceholder.typicode.com',
    baseURL: 'https://restful-booker.herokuapp.com/',
    extraHTTPHeaders: {
      'Content-type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
    },
  },
});
