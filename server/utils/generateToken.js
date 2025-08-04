import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.SECRET_KEY,
    { expiresIn: '1d' }
  );

  // Sanitize user data to avoid sending password/hash/etc.
  const sanitizedUser = {
    id: user._id,
    name: user.name,
    email: user.email
  };

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      message,
      user: sanitizedUser
    });
};
