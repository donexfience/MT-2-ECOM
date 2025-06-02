import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Set access refresh  tokens as httpOnly cookie
    res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${
        2 * 60
      }; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`,
    ]);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
