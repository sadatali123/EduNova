const authenticated = (req, res, next) => {
  const token = req.cookies.token;  
    if (!token) {
        return next(new AppError("Unauthorized, Please login to access this resource", 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verify token and decode user details
        req.user = decoded; // the meaning of this is that we are attaching the decoded user details to the request object so that it can be accessed in the next middleware or route handler
        next();
    } catch (error) {
        return next(new AppError("Token is invalid or expired, please try again", 401));
    }

}

export default authenticated;
