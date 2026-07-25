let inMemoryAccessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken || localStorage.getItem('devbraid_access_token');
};

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
  if (token) {
    localStorage.setItem('devbraid_access_token', token);
  } else {
    localStorage.removeItem('devbraid_access_token');
    localStorage.removeItem('devbraid_refresh_token');
  }
};

export const clearTokens = (): void => {
  inMemoryAccessToken = null;
  localStorage.removeItem('devbraid_access_token');
  localStorage.removeItem('devbraid_refresh_token');
};
