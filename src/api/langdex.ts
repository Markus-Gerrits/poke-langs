import type { Capture, Language, User } from "./types";
import { getJSON, postJSON } from "./client";

export const getLanguages = (o?: { signal?: AbortSignal }) =>
  getJSON<Language[]>("/languages", o);

export const getUserCaptures = (userId: number, o?: { signal?: AbortSignal }) =>
  getJSON<Capture[]>(`/captures?userId=${userId}`, o);

export const getUser = (id: number, o?: { signal?: AbortSignal }) =>
  getJSON<User>(`/users/${id}`, o);

export const createCapture = (
  payload: Omit<Capture, "id">,
  o?: { signal?: AbortSignal }
) => postJSON<Capture>("/captures", payload, o);
