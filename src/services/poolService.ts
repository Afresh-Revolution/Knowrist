/**
 * Pool Service
 *
 * Handles API communication for pool operations:
 * - Create admin pool
 * - Get admin pools
 *
 * API Endpoints:
 * - POST /admin/pools
 * - GET /admin/get-pools
 */

// Backend API base URL
const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://172.27.16.1:5000";
  return baseUrl.replace(/\/+$/, "");
};

// Request interface for creating a pool
export interface CreatePoolRequest {
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: "SCIENCE" | "MATHS" | "ENGLISH" | "LITERATURE" | "HISTORY";
  word_length: number;
  entry_fee: number;
  reward_per_question: number;
  max_players: number;
  questions_per_user: number;
  scheduled_start: string; // ISO datetime string
  duration_minutes: number;
  status: "DRAFT" | "OPEN" | "WAITING" | "LIVE" | "ENDED" | "EXTENDED";
}

// Response interface
export interface CreatePoolResponse {
  id?: string;
  message?: string;
  pool?: any;
}

// Pool interface for admin pools list
export interface AdminPool {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: "SCIENCE" | "MATHS" | "ENGLISH" | "LITERATURE" | "HISTORY";
  word_length: number;
  entry_fee: number;
  reward_per_question: number;
  max_players: number;
  questions_per_user: number;
  scheduled_start: string; // ISO datetime string
  duration_minutes: number;
  status: "DRAFT" | "OPEN" | "WAITING" | "LIVE" | "ENDED" | "EXTENDED";
  created_by?: string;
  created_at?: string;
  image?: string;
}

export const poolService = {
  /**
   * Get all pools created by admin
   * @param adminToken - Admin JWT token for authentication
   * @returns Promise with array of pools
   */
  async getAdminPools(adminToken: string): Promise<AdminPool[]> {
    try {
      const url = `${getApiBaseUrl()}/admin/get-pools`;
      console.log("Get admin pools request to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        mode: "cors",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        // Specific error messages for different status codes
        if (response.status === 401) {
          throw new Error(
            error.message || "Unauthorized. Please check your admin credentials."
          );
        } else if (response.status === 403) {
          throw new Error(
            error.message || "Forbidden. Insufficient permissions to view pools."
          );
        }

        throw new Error(
          error.message || "Failed to fetch pools. Please try again."
        );
      }

      const data = await response.json();
      // Backend may return an array directly or wrapped in an object
      return Array.isArray(data) ? data : data.pools || data.data || [];
    } catch (error) {
      console.error("Get admin pools error:", error);
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
   * Create a new pool (admin only)
   * @param poolData - Pool data matching the database schema
   * @param adminToken - Admin JWT token for authentication
   * @returns Promise with creation response
   */
  async createAdminPool(
    poolData: CreatePoolRequest,
    adminToken: string
  ): Promise<CreatePoolResponse> {
    try {
      const url = `${getApiBaseUrl()}/admin/pools`;
      console.log("Create admin pool request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(poolData),
        mode: "cors",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        // Specific error messages for different status codes
        if (response.status === 401) {
          throw new Error(
            error.message || "Unauthorized. Please check your admin credentials."
          );
        } else if (response.status === 403) {
          throw new Error(
            error.message || "Forbidden. Insufficient permissions to create pools."
          );
        } else if (response.status === 400) {
          throw new Error(
            error.message || "Invalid pool data. Please check all fields."
          );
        } else if (response.status === 422) {
          throw new Error(
            error.message || "Validation failed. Please check your input."
          );
        }

        throw new Error(
          error.message || "Failed to create pool. Please try again."
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create admin pool error:", error);
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
