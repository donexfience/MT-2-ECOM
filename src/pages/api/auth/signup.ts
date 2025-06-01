import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  const { email, password, username } = req.body;
  const existing = await User.findOne({ email });

  if (existing) return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ email, password: hashedPassword, username });

  res
    .status(201)
    .json({ message: "User created successfully. Please log in.", user: user });
}
