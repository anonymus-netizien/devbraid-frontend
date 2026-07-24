import { describe, it, expect, beforeEach, mock } from "bun:test";

const mockAxiosInstance = {
  post: mock(),
  get: mock(),
  interceptors: {
    request: { use: mock() },
    response: { use: mock() },
  },
};

const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => { store.set(key, value); },
  removeItem: (key: string) => { store.delete(key); },
  clear: () => store.clear(),
  length: 0,
  key: () => null,
};

if (typeof globalThis.localStorage === "undefined") {
  (globalThis as any).localStorage = localStorageMock;
}

mock.module("../api/axios", () => ({
  default: mockAxiosInstance,
  apiClient: mockAxiosInstance,
}));

import authService from "../auth.service";

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("login()", () => {
    it("stores accessToken and refreshToken in localStorage on login", async () => {
      const mockLoginResponse = {
        data: {
          accessToken: "mock_access_token_123",
          refreshToken: "mock_refresh_token_456",
          user: { id: "1", name: "Alex Vane", email: "alex@acme.com" },
        },
      };
      (mockAxiosInstance.post as any).mockResolvedValue(mockLoginResponse);

      const result = await authService.login({ email: "alex@acme.com", password: "password123" });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/auth/login", {
        email: "alex@acme.com",
        password: "password123",
      });
      expect(localStorage.getItem("devbraid_access_token")).toBe("mock_access_token_123");
      expect(localStorage.getItem("devbraid_refresh_token")).toBe("mock_refresh_token_456");
      expect(result.accessToken).toBe("mock_access_token_123");
    });

    it("supports token property name variations (token, jwt, access_token)", async () => {
      const mockLoginResponse = {
        data: {
          token: "mock_token_jwt",
          refresh_token: "mock_refresh_xyz",
        },
      };
      (mockAxiosInstance.post as any).mockResolvedValue(mockLoginResponse);

      await authService.login({ email: "alex@acme.com", password: "password123" });

      expect(localStorage.getItem("devbraid_access_token")).toBe("mock_token_jwt");
      expect(localStorage.getItem("devbraid_refresh_token")).toBe("mock_refresh_xyz");
    });
  });

  describe("register()", () => {
    it("posts payload with fullName and stores returned tokens", async () => {
      const mockRegisterResponse = {
        data: {
          accessToken: "reg_access_token",
          refreshToken: "reg_refresh_token",
          user: { id: "2", name: "John Doe", email: "john@example.com" },
        },
      };
      (mockAxiosInstance.post as any).mockResolvedValue(mockRegisterResponse);

      const payload = {
        fullName: "John Doe",
        email: "john@example.com",
        password: "Password123!",
      };
      const result = await authService.register(payload);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/auth/register", payload);
      expect(localStorage.getItem("devbraid_access_token")).toBe("reg_access_token");
      expect(localStorage.getItem("devbraid_refresh_token")).toBe("reg_refresh_token");
      expect(result.user.name).toBe("John Doe");
    });
  });

  describe("me()", () => {
    it("fetches user profile from /auth/me", async () => {
      const mockMeResponse = {
        data: {
          user: { id: "1", name: "Alex Vane", email: "alex@acme.com" },
        },
      };
      (mockAxiosInstance.get as any).mockResolvedValue(mockMeResponse);

      const result = await authService.me();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/auth/me");
      expect(result.user.email).toBe("alex@acme.com");
    });
  });

  describe("refresh()", () => {
    it("sends refreshToken and updates localStorage tokens", async () => {
      localStorage.setItem("devbraid_refresh_token", "old_refresh_token");

      const mockRefreshResponse = {
        data: {
          accessToken: "new_access_token",
          refreshToken: "new_refresh_token",
        },
      };
      (mockAxiosInstance.post as any).mockResolvedValue(mockRefreshResponse);

      await authService.refresh();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/auth/refresh", {
        refreshToken: "old_refresh_token",
      });
      expect(localStorage.getItem("devbraid_access_token")).toBe("new_access_token");
      expect(localStorage.getItem("devbraid_refresh_token")).toBe("new_refresh_token");
    });
  });

  describe("logout()", () => {
    it("removes access and refresh tokens from localStorage", () => {
      localStorage.setItem("devbraid_access_token", "test_access");
      localStorage.setItem("devbraid_refresh_token", "test_refresh");

      authService.logout();

      expect(localStorage.getItem("devbraid_access_token")).toBeNull();
      expect(localStorage.getItem("devbraid_refresh_token")).toBeNull();
    });
  });
});
