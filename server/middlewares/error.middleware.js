// Global Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal Server Error';
    console.error(err); // Log the error for debugging purposes

    res.status(statusCode).json({
        status,
        message,
    });
}

export default errorMiddleware;
