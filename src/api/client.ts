const BASE = "http://localhost:5174";

export async function api<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new Error(`Erro ao buscar ${path}`);
    return res.json() as Promise<T>;
}

export async function fetchJSON<T>(
    path: string,
    opts?: { signal?: AbortSignal; init?: RequestInit }
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, { signal: opts?.signal, ...(opts?.init || {}) });
    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `HTTP ${res.status} em ${path}`);
    }
    return res.json() as Promise<T>;
}