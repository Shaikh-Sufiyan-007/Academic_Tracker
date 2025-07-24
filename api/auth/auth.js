import jwt from "jsonwebtoken";

// SCHOOL, TEACHER, STUDENT
export const authMiddleware = (roles=[]) => {return async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token) {
            return res.status(401).json({success: false, message: "Unauthorized no token provided."});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded) {
            req.user = decoded;
            if(roles.length>0 && !roles.includes(req.user.role)) {
                return res.status(403).json({success: false, message: "Access Denied."});
            }
            next();
        }
        
    } catch (error) {
        console.error("Error in authMiddleware Controller :", error);
        res.status(500).json({ success: false, message: error.message });
    }
    
}}