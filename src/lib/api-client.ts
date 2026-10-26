type JsonMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Calls a JSON route handler and returns the parsed body.
 * Throws an Error with the route's `error` message, or `fallbackError` when it has none.
 */
async function requestJson<T>(
  url: string,
  fallbackError: string,
  method: JsonMethod = "GET",
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    ...(body !== undefined && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  });

  if (!res.ok) {
    const payload: { error?: string } = await res.json().catch(() => ({}));
    throw new Error(payload.error ?? fallbackError);
  }

  return res.json();
}

export type { JsonMethod };
export { requestJson };
