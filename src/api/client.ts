// src/api/client.ts
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5174";

export async function request<T>(
  path: string,
  init?: RequestInit & { signal?: AbortSignal }
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status} em ${path}`);
  }
  return res.json() as Promise<T>;
}

export const getJSON = <T>(path: string, o?: { signal?: AbortSignal }) =>
  request<T>(path, { method: "GET", signal: o?.signal });

export const postJSON = <T>(
  path: string,
  body: unknown,
  o?: { signal?: AbortSignal }
) =>
  request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: o?.signal,
    body: JSON.stringify(body),
  });
