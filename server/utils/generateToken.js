import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  // ✅ Remove sensitive data before sending
  const sanitizedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ true in prod, false locally
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ cross-domain cookies
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    .json({
      success: true,
      message,
      user: sanitizedUser
    });
};
