import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("👉 Token received:", token);  // STEP 1: Log token

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log("✅ Decoded token:", decode);  // STEP 2: Log decoded token

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        req.id = decode.userId;
        console.log("🆔 User ID set on req:", req.id);  // STEP 3: Log req.id

        next();
    } catch (error) {
        console.log("❌ Auth error:", error);  // STEP 4: Log error
        return res.status(401).json({
            success: false,
            message: "Authentication failed. Invalid or expired token."
        });
    }
};

export default isAuthenticated;
