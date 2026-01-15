/**
 * Game Service
 *
 * Handles API communication for game-related operations:
 * - Activation code verification
 *
 * API Endpoints:
 * - POST /game/verify-activation-code
 */

// Request interface
interface VerifyActivationCodeRequest {
  activationCode: string;
  poolId?: string;
}

// Response interface
interface VerifyActivationCodeResponse {
  valid: boolean;
  message?: string;
  poolId?: string;
}

// Backend API base URL
const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://172.27.16.1:5000";
  return baseUrl.replace(/\/+$/, "");
};

export const gameService = {
  /**
   * Verify activation code with backend
   * @param code - Activation code to verify
   * @param poolId - Optional pool ID for context
   * @returns Promise with verification response
   */
  async verifyActivationCode(
    code: string,
    poolId?: string
  ): Promise<VerifyActivationCodeResponse> {
    try {
      const url = `${getApiBaseUrl()}/game/verify-activation-code`;
      console.log("Verifying activation code:", code);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activationCode: code.trim().toUpperCase(),
          poolId,
        } as VerifyActivationCodeRequest),
        mode: "cors",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || "Verification failed");
      }

      const data = await response.json();
      return {
        valid: data.valid === true,
        message: data.message,
        poolId: data.poolId,
      };
    } catch (error) {
      console.error("Activation code verification error:", error);
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
