import { getUserFromRefreshToken } from "@/lib/cookie";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const decoded = getUserFromRefreshToken(req);
  const user = await User.findById(decoded?.userId).select("-password");

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({ user });
}
