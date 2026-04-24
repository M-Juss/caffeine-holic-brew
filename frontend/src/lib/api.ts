
type ApiParams = Record<string, string | number | boolean | null | undefined>;

type ApiOptions = RequestInit & {
  params?: ApiParams;
};

function attachParams(url: string, params?: ApiParams): string {
  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  if (!query) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
}

export async function authFetch<T = unknown>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const { params, headers, body, ...rest } = options;
  const token = localStorage.getItem("auth_token")

  const normalizedHeaders = new Headers(headers);
  normalizedHeaders.set("Accept", "application/json");

  if (token && !normalizedHeaders.has("Authorization")) {
    normalizedHeaders.set("Authorization", token);
  }

  // Let browser set multipart boundary automatically for FormData
  if (body && !(body instanceof FormData) && !normalizedHeaders.has("Content-Type")) {
    normalizedHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(attachParams(url, params), {
    ...rest,
    body,
    headers: normalizedHeaders,
  });

  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  }

  if (!response.ok) {
    const err = new Error(
      (data as { message?: string }).message || "Request failed"
    ) as Error & { errors?: unknown };
    err.errors = (data as { errors?: unknown }).errors ?? null;
    throw err;
  }

  return data as T;
}
