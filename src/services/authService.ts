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
  token?: string; // JWT token for authenticated sessions (login returns this)
  user?: {
    id: string;
    name?: string;
    username?: string;
    email: string;
  };
  admin?: {
    id: string;
    email: string;
    role: string; // "ADMIN" or "SUPER_ADMIN" from backend
  };
  message?: string; // Success or error message
  role?: "main" | "super"; // Admin role (for admin logins) - mapped from backend
  userType?: string; // User type indicator (admin, main, super, user)
  // Signup returns user object directly (not nested)
  id?: string;
  name?: string;
  username?: string;
  email?: string;
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
   * Check if username is available
   * @param username - Username to check
   * @returns Promise with availability status
   */
  async checkUsername(
    username: string
  ): Promise<{ available: boolean; message?: string }> {
    // If auth is disabled, always return available
    if (!isAuthEnabled) {
      return { available: true };
    }

    try {
      const url = `${getApiBaseUrl()}/auth/check-username?username=${encodeURIComponent(
        username
      )}`;
      console.log("Check username request to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        // If endpoint doesn't exist (404), skip check - backend will validate during signup
        if (response.status === 404) {
          console.log(
            "Check username endpoint not available, skipping pre-validation"
          );
          return { available: true };
        }
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || "Failed to check username");
      }

      return await response.json();
    } catch (error) {
      console.error("Check username error:", error);
      // On error, assume available to not block signup (backend will validate anyway)
      return { available: true };
    }
  },

  /**
   * Check if email is available
   * @param email - Email to check
   * @returns Promise with availability status
   */
  async checkEmail(
    email: string
  ): Promise<{ available: boolean; message?: string }> {
    // If auth is disabled, always return available
    if (!isAuthEnabled) {
      return { available: true };
    }

    try {
      const url = `${getApiBaseUrl()}/auth/check-email?email=${encodeURIComponent(
        email
      )}`;
      console.log("Check email request to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        // If endpoint doesn't exist (404), skip check - backend will validate during signup
        if (response.status === 404) {
          console.log(
            "Check email endpoint not available, skipping pre-validation"
          );
          return { available: true };
        }
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || "Failed to check email");
      }

      return await response.json();
    } catch (error) {
      console.error("Check email error:", error);
      // On error, assume available to not block signup (backend will validate anyway)
      return { available: true };
    }
  },

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
          name: "User",
          username: "user",
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

        // Specific error messages for different status codes
        if (response.status === 401) {
          throw new Error(
            error.message ||
              "Invalid email or password. Please check your credentials."
          );
        } else if (response.status === 404) {
          throw new Error(
            error.message || "User not found. Please check your email address."
          );
        } else if (response.status === 403) {
          throw new Error(
            error.message || "Account is disabled or access denied."
          );
        }

        throw new Error(
          error.message || "Login failed. Please check your credentials."
        );
      }

      const data = await response.json();

      // Backend returns: { token }
      // JWT token contains userId in payload
      if (!data.token) {
        throw new Error("Invalid response from server. Login failed.");
      }

      return data;
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
          name: credentials.name,
          username: credentials.username,
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

        // Parse error message for duplicate key violations
        const errorMessage = error.message || error.error || "";
        const isDuplicateUsername =
          errorMessage.includes("users_username_key") ||
          (errorMessage.includes("duplicate key") &&
            errorMessage.includes("username"));
        const isDuplicateEmail =
          errorMessage.includes("users_email_key") ||
          (errorMessage.includes("duplicate key") &&
            errorMessage.includes("email"));

        // Specific error messages for different status codes
        if (
          response.status === 409 ||
          isDuplicateUsername ||
          isDuplicateEmail
        ) {
          if (isDuplicateUsername) {
            throw new Error(
              "This username is already taken. Please choose a different username."
            );
          } else if (isDuplicateEmail) {
            throw new Error(
              "This email is already registered. Please use a different email or try logging in."
            );
          }
          throw new Error(
            errorMessage ||
              "Email or username already exists. Please use different credentials."
          );
        } else if (response.status === 400) {
          throw new Error(
            errorMessage ||
              "Invalid registration data. Please check all fields."
          );
        } else if (response.status === 422) {
          throw new Error(
            errorMessage || "Validation failed. Please check your input."
          );
        } else if (response.status === 500) {
          // Handle 500 errors - might be duplicate key violations
          if (isDuplicateUsername) {
            throw new Error(
              "This username is already taken. Please choose a different username."
            );
          } else if (isDuplicateEmail) {
            throw new Error(
              "This email is already registered. Please use a different email or try logging in."
            );
          }
          throw new Error(
            errorMessage ||
              "Server error during signup. Please try again later."
          );
        }

        throw new Error(errorMessage || "Signup failed. Please try again.");
      }

      const data = await response.json();

      // Backend returns: { id, name, username, email } (status 201)
      // No token is returned from signup
      if (!data.id || !data.email) {
        throw new Error("Signup failed. Invalid response from server.");
      }

      // Return in format expected by frontend
      return {
        user: {
          id: data.id,
          name: data.name,
          username: data.username,
          email: data.email,
        },
      };
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

  /**
   * Delete user account
   * @param token - JWT token for authentication
   * @returns Promise with deletion response
   */
  async deleteAccount(token?: string): Promise<{ message?: string }> {
    // If auth is disabled, return a mock success response
    if (!isAuthEnabled) {
      console.warn("Authentication is disabled. Returning mock response.");
      return {
        message: "Authentication disabled - mock account deletion successful",
      };
    }

    try {
      const url = `${getApiBaseUrl()}/auth/delete-account`;
      console.log("Delete account request to:", url);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token is provided
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers,
        mode: "cors",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || "Failed to delete account");
      }

      return await response.json();
    } catch (error) {
      console.error("Delete account error:", error);
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
   * Admin login
   * @param credentials - Admin email and password
   * @returns Promise with authentication response including admin role
   */
  async adminLogin(
    credentials: LoginRequest
  ): Promise<AuthResponse & { role?: "main" | "super" }> {
    try {
      const url = `${getApiBaseUrl()}/admin/login`;
      console.log("Admin login request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        mode: "cors",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        // Specific error messages for different status codes
        if (response.status === 401) {
          throw new Error(
            error.message || "Invalid admin credentials. Access denied."
          );
        } else if (response.status === 404) {
          throw new Error(error.message || "Admin account not found.");
        } else if (response.status === 403) {
          throw new Error(
            error.message || "Admin access denied. Insufficient permissions."
          );
        }

        throw new Error(
          error.message || "Admin login failed. Please check your credentials."
        );
      }

      const data = await response.json();

      console.log("Admin login response:", data);

      // Backend returns: { token, admin: { id, email, role } }
      // role is "ADMIN" or "SUPER_ADMIN" (uppercase)
      if (!data.token || !data.admin) {
        throw new Error("Invalid response from server. Admin login failed.");
      }

      // Map backend role to frontend role
      // Backend: "ADMIN" -> Frontend: "main"
      // Backend: "SUPER_ADMIN" -> Frontend: "super"
      const backendRole = data.admin.role;
      console.log("Backend role:", backendRole);
      let role: "main" | "super" = "main";

      if (backendRole === "SUPER_ADMIN" || backendRole === "super") {
        role = "super";
      } else if (backendRole === "ADMIN" || backendRole === "main") {
        role = "main";
      }

      console.log("Mapped frontend role:", role);
      return { ...data, role };
    } catch (error) {
      console.error("Admin login error:", error);
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
