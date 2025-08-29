import { api, fetchJSON } from "./client";
import type { Language, Capture, User } from "./types";

export const getLanguages = () => api<Language[]>("/languages?_sort=dexNumber&_order=asc");

export const getUserCaptures = (userId = 1) => api<Capture[]>(`/captures?userId=${userId}`);

export const getUser = (id: number, o?: {signal?: AbortSignal }) => fetchJSON<User>(`/users/${id}`, o);