/**
 * Wallet Service
 *
 * Handles API communication for wallet operations:
 * - Get wallet balance: Fetch user's account balance
 *
 * API Endpoints:
 * - GET /wallets
 */

// Check if authentication is enabled via environment variable
const isAuthEnabled = import.meta.env.VITE_AUTH_ENABLED === "true";

// Backend API base URL
const getApiBaseUrl = () => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://172.27.16.1:5000";
  return baseUrl.replace(/\/+$/, "");
};

interface WalletResponse {
  balance?: number;
  message?: string;
}

export const walletService = {
  /**
   * Get user's wallet balance
   * @param token - JWT token for authentication (optional if auth is disabled)
   * @returns Promise with wallet balance
   */
  async getBalance(token?: string): Promise<number> {
    // If auth is disabled, return demo amount
    if (!isAuthEnabled) {
      console.warn("Authentication is disabled. Returning demo balance.");
      return 1000000; // 1 million naira
    }

    try {
      const url = `${getApiBaseUrl()}/wallets`;
      console.log("Get wallet balance request to:", url);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token is provided
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
        mode: "cors",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || "Failed to fetch wallet balance");
      }

      const data: WalletResponse = await response.json();
      
      // Return balance from response, or fallback to demo amount
      return data.balance ?? 1000000;
    } catch (error) {
      console.error("Get wallet balance error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        // If connection fails, return demo amount for development
        console.warn("Unable to connect to server. Using demo balance.");
        return 1000000;
      }
      // For other errors, return demo amount as fallback
      return 1000000;
    }
  },
};
