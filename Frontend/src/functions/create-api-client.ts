import { ApiClient } from "../clients/ApiClient";

/**
 * Create BackendClient with baseUrl pre-configured.
 *
 * @returns BackendClient instance.
 */
export function createApiClient(): ApiClient {
    const http = typeof window !== "undefined" ? window : { fetch };

    return new ApiClient(`${process.env.NEXT_PUBLIC_URL}/api/api-proxy`, http);
}
