const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV !== "production";
  
  const buildResponse = (statusCode, message, isDev, stack) => {
    return isDev ? { error: message, stack: stack } : { error: statusCode >= 500 ? "Internal Server Error" : message };
  };

  console.error(err);
  res.status(statusCode).json(buildResponse(statusCode, err.message, isDev, err.stack));
};

export default errorHandler;