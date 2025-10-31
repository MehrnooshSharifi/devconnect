// src/lib/auth.ts
import { getCookie as getCookieClient, setCookie as setCookieClient, deleteCookie as deleteCookieClient } from "cookies-next";

export const setToken = (token: string) => {
  setCookieClient("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 });
};

export const getToken = (req?: any, res?: any): string | null => {
  const t = getCookieClient("token", { req, res });
  return t ? String(t) : null;
};

export const removeToken = (req?: any, res?: any) => {
  deleteCookieClient("token", { req, res, path: "/" });
};
