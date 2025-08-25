const BASE = "http://localhost:5174";

export async function api<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new Error(`Erro ao buscar ${path}`);
    return res.json() as Promise<T>;
}