import Axios from "@/config/axios";

class APIService {
  private makeRequest(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    service: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) {
    const queryParams = new URLSearchParams({
      service,
      endpoint,
      ...params,
    }).toString();

    return Axios({
      method,
      url: `/api/proxy?${queryParams}`,
      data,
      ...config,
    });
  }

  get(
    service: string,
    endpoint: string,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) {
    return this.makeRequest(
      "GET",
      service,
      endpoint,
      undefined,
      params,
      config,
    );
  }

  post(
    service: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) {
    return this.makeRequest("POST", service, endpoint, data, params, config);
  }

  put(
    service: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) {
    return this.makeRequest("PUT", service, endpoint, data, params, config);
  }

  patch(
    service: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) {
    return this.makeRequest("PATCH", service, endpoint, data, params, config);
  }

  delete(
    service: string,
    endpoint: string,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) {
    return this.makeRequest(
      "DELETE",
      service,
      endpoint,
      undefined,
      params,
      config,
    );
  }

  postBlob(
    service: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>,
    config?: Record<string, unknown>,
  ) {
    const queryParams = new URLSearchParams({
      service,
      endpoint,
      responseType: "blob",
      ...params,
    }).toString();

    return Axios({
      method: "POST",
      url: `/api/proxy?${queryParams}`,
      data,
      responseType: "blob",
      ...config,
    });
  }

  getBlob(service: string, endpoint: string, params?: Record<string, unknown>) {
    const queryParams = new URLSearchParams({
      service,
      endpoint,
      responseType: "blob",
      ...params,
    }).toString();

    return Axios({
      method: "GET",
      url: `/api/proxy?${queryParams}`,
      responseType: "blob",
    });
  }
}

export const apiService = new APIService();
