export interface PostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface PostResponse extends PostRequest {
  id: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
}
