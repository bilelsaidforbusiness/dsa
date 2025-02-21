import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type GetQueryFnOptions = {
  on401?: "throw" | "returnNull";
};

export async function apiRequest(
  method: RequestMethod,
  endpoint: string,
  body?: unknown
) {
  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = new Error(await response.text());
    error.name = `${response.status} ${response.statusText}`;
    throw error;
  }

  return response;
}

export function getQueryFn({ on401 = "throw" }: GetQueryFnOptions = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [endpoint] = queryKey;
    const response = await fetch(endpoint);

    if (response.status === 401) {
      if (on401 === "returnNull") return null;
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = new Error(await response.text());
      error.name = `${response.status} ${response.statusText}`;
      throw error;
    }

    return response.json();
  };
}