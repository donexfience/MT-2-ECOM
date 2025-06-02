import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET as string;
const ACCESS_TOKEN_NAME = "accessToken";
const REFRESH_TOKEN_NAME = "refreshToken";

export function getUserFromRefreshToken(
  req: NextApiRequest
): { userId: string } | null {
  const cookieHeader = req.headers.cookie || "";

  const refreshToken = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith(`${REFRESH_TOKEN_NAME}=`))
    ?.split("=")[1];

  if (!refreshToken) return null;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      userId: string;
    };
    return decoded;
  } catch (err) {
    console.error("Invalid or expired refresh token:", err);
    return null;
  }
}

export function clearAuthCookies(res: NextApiResponse) {
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = `; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${
    isProd ? "; Secure" : ""
  }`;

  const expiredAccessToken = `${ACCESS_TOKEN_NAME}=${cookieOptions}`;
  const expiredRefreshToken = `${REFRESH_TOKEN_NAME}=${cookieOptions}`;

  res.setHeader("Set-Cookie", [expiredAccessToken, expiredRefreshToken]);
}

export function setAuthCookies(
  res: NextApiResponse,
  accessToken: string,
  refreshToken: string
) {
  const isProd = process.env.NODE_ENV === "production";

  const accessCookie = `${ACCESS_TOKEN_NAME}=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${
    15 * 60
  }${isProd ? "; Secure" : ""}`;
  const refreshCookie = `${REFRESH_TOKEN_NAME}=${refreshToken}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${
    7 * 24 * 60 * 60
  }${isProd ? "; Secure" : ""}`;

  res.setHeader("Set-Cookie", [accessCookie, refreshCookie]);
}
