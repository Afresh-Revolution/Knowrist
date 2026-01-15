/**
 * Authentication Service
 *
 * Handles API communication for user authentication:
 * - Login: Authenticate existing users
 * - Signup: Register new users
 *
 * API Endpoints:
 * - POST /auth/login
 * - POST /auth/signup
 */

// Request interfaces
interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

// Response interface
interface AuthResponse {
  token?: string; // JWT token for authenticated sessions
  user?: {
    id: string;
    email: string;
  };
  message?: string; // Success or error message
}

// Check if authentication is enabled via environment variable
const isAuthEnabled = import.meta.env.VITE_AUTH_ENABLED === "true";

// Backend API base URL (always use the env var / explicit base URL — no dev proxy)
// IMPORTANT: This ensures requests do NOT go to the Vite dev server origin (e.g. http://localhost:5173).
const getApiBaseUrl = () => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://172.27.16.1:5000";
  return baseUrl.replace(/\/+$/, "");
};

export const authService = {
  /**
   * Login user with email and password
   * @param credentials - User email and password
   * @returns Promise with authentication response
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // If auth is disabled, return a mock success response
    if (!isAuthEnabled) {
      console.warn("Authentication is disabled. Returning mock response.");
      return {
        token: "mock-token",
        user: {
          id: "mock-user-id",
          email: credentials.email,
        },
        message: "Authentication disabled - mock login successful",
      };
    }

    try {
      const url = `${getApiBaseUrl()}/auth/login`;
      console.log("Login request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        mode: "cors", // Enable CORS
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Unable to connect to the server. Please check if the backend is running and accessible."
        );
      }
      throw error;
    }
  },

  /**
   * Sign up new user
   * @param credentials - User registration data (name, username, email, password)
   * @returns Promise with authentication response
   */
  async signup(credentials: SignupRequest): Promise<AuthResponse> {
    // If auth is disabled, return a mock success response
    if (!isAuthEnabled) {
      console.warn("Authentication is disabled. Returning mock response.");
      return {
        token: "mock-token",
        user: {
          id: "mock-user-id",
          email: credentials.email,
        },
        message: "Authentication disabled - mock signup successful",
      };
    }

    try {
      const url = `${getApiBaseUrl()}/auth/signup`;
      console.log("Signup request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        mode: "cors", // Enable CORS
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || "Signup failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Signup error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Unable to connect to the server. Please check if the backend is running and accessible."
        );
      }
      throw error;
    }
  },
};
