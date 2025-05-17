import jwt from "jsonwebtoken"; // Import jsonwebtoken

export const generateJWT = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};
