import { NextApiRequest, NextApiResponse } from "next";
import { clearAuthCookies } from "@/lib/cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
