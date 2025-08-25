import { api } from "./client";
import type { Language, Capture } from "./types";

export const getLanguages = () => api<Language[]>("/languages?_sort=dexNumber&_order=asc");

export const getUserCaptures = (userId = 1) => api<Capture[]>(`/captures?userId=${userId}`);