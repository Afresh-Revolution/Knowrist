/**
 * Authentication Service
 *
 * Handles API communication for user authentication:
 * - Login: Authenticate existing users
 * - Signup: Register new users
 *
 * API Endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/signup
 */

// Request interfaces
interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  fullname: string;
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

export const authService = {
  /**
   * Login user with email and password
   * @param credentials - User email and password
   * @returns Promise with authentication response
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Sign up new user
   * @param credentials - User registration data (fullname, username, email, password)
   * @returns Promise with authentication response
   */
  async signup(credentials: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Signup failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },
};
