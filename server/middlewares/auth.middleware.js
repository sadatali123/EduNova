import AppError from "../utils/error.util.js"; 
import jwt from "jsonwebtoken";
import user from "../models/user.model.js";


// Middleware to check if the user is logged in
const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) return next(new AppError('Unauthenticated, please login', 401));

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return next(new AppError('Invalid or expired token. Please login again.', 401));
        }

        // If token payload contains an id, fetch fresh user from DB to ensure roles/status are current
        if (decoded && decoded.id) {
            const dbUser = await user.findById(decoded.id).select('-password');
            if (!dbUser) return next(new AppError('User not found', 401));
            req.user = dbUser;
        } else {
            req.user = decoded;
        }

        next();
    } catch (err) {
        next(err);
    }
};


// authorized rules for admin and user
const authorizedRoles = (...roles) => (req, res, next) => {
    const currentUserRole = req.user.role;

    if (!roles.includes(currentUserRole)) {
        return next(
            new AppError(
                "You do not have permission to access this route",
                403
            )
        );
    }

    next();
};

export { isLoggedIn, authorizedRoles };