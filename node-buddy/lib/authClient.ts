// Client-side auth utilities for testing and frontend integration

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  token: string | null;
}

export class AuthClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
    // Try to load token from localStorage in browser environment
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async register(email: string, password: string, name: string) {
    const response = await this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getProtectedData() {
    return this.makeRequest("/protected", {
      method: "GET",
    });
  }

  async postProtectedData(data: any) {
    return this.makeRequest("/protected", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Export a default instance
export const authClient = new AuthClient();

// Export helper functions for easy use
export const authHelpers = {
  register: (email: string, password: string, name: string) =>
    authClient.register(email, password, name),

  login: (email: string, password: string) => authClient.login(email, password),

  logout: () => authClient.clearToken(),

  getProtectedData: () => authClient.getProtectedData(),

  postProtectedData: (data: any) => authClient.postProtectedData(data),

  isAuthenticated: () => authClient.isAuthenticated(),

  getToken: () => authClient.getToken(),
};
