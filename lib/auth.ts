import { jwtVerify, SignJWT } from "jose";

export const AUTH_COOKIE_NAME = "admin_token";

const jwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET in environment");
  return new TextEncoder().encode(secret);
};

export type JwtUser = {
  id: string;
  email: string;
  role: "admin";
};

export async function signAuthToken(user: JwtUser) {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setSubject(user.id)
    .sign(jwtSecret());
}

export async function verifyAuthToken(token: string): Promise<JwtUser> {
  const { payload } = await jwtVerify(token, jwtSecret());

  const id = typeof payload.sub === "string" ? payload.sub : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const role = payload.role === "admin" ? "admin" : "admin";

  if (!id || !email) throw new Error("Invalid token payload");
  return { id, email, role };
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
