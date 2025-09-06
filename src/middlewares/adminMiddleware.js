const jwt = require('jsonwebtoken');

// Ensure you have already loaded environment variables in your main server file:
// require('dotenv').config();

exports.AuthMiddleWare = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing in authorization header"
            });
        }

        const secretKey = process.env.SecretKey;
        if (!secretKey) {
            return res.status(500).json({
                success: false,
                message: "SecretKey not configured in environment"
            });
        }

        const adminInfo = jwt.verify(token, secretKey);

        if (!adminInfo || !adminInfo.adminId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        // Attach admin info to request
        req.admin_id = adminInfo.adminId;   
        req.role = adminInfo.role;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
        });
    }
};
