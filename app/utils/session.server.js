import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["Spinora-Secret-Key-11332211"], // Replace with your own secret key
    // Ensure this key is kept secret and not exposed in your codebase
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false in dev
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
