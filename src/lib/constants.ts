export const API_BASE_URL = process.env.API_BASE_URL
export const AUTH_COOKIE_NAME = 'docuchat_access_token';
export const IS_API_MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'true';
export const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ['http://localhost:9002', 'http://127.0.0.1:9002'];
