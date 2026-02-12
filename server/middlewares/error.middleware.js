// Global Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        status: status,
        message: message
    });
}

export default errorMiddleware;
