import { existsSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { AuthResponse } from '../types';

// Credentials are read from the environment so nothing secret lands in git.
// They fall back to DummyJSON's published demo account (public sample data, not a
// secret) so the suite runs out of the box. Point AUTH_* at any login endpoint that
// returns the same JSON contract: { accessToken, refreshToken, id, username, email }.
const AUTH_BASE_URL = process.env.AUTH_BASE_URL ?? 'https://dummyjson.com/auth';
const AUTH_USERNAME = process.env.AUTH_USERNAME ?? 'emilys';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD ?? 'emilyspass';

const STORAGE_STATE_PATH = 'state.json';

test('Global API Authentication & State Capture', async ({ request }) => {
  const loginResponse = await request.post(`${AUTH_BASE_URL}/login`, {
    data: {
      username: AUTH_USERNAME,
      password: AUTH_PASSWORD,
    },
  });

  expect(loginResponse.status()).toBe(200);

  const session: AuthResponse = await loginResponse.json();
  expect(session.username).toBe(AUTH_USERNAME);
  expect(session.accessToken).toBeTruthy();

  // Extract cookies and session tokens automatically into a storage file
  const storageState = await request.storageState({ path: STORAGE_STATE_PATH });
  expect(existsSync(STORAGE_STATE_PATH)).toBeTruthy();
  expect(storageState.cookies.map((cookie) => cookie.name)).toContain('accessToken');

  // The captured session must actually open a protected endpoint
  const profileResponse = await request.get(`${AUTH_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  expect(profileResponse.status()).toBe(200);

  const profile: AuthResponse = await profileResponse.json();
  expect(profile.username).toBe(AUTH_USERNAME);
});
