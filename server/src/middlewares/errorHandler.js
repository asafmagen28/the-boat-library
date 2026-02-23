const errorHandler = (err, req, res, next) => {
  // Map Sequelize errors to appropriate HTTP status codes
  if (err.name === "SequelizeValidationError") {
    err.status = 400;
    err.message = err.errors.map((e) => {
      if (e.validatorKey !== "is_null") return e.message;
      return `${e.path} is required`;
    }).join(", ");
  } else if (err.name === "SequelizeUniqueConstraintError") {
    err.status = 409;
    const fields = err.errors.map((e) => e.path).join(", ");
    err.message = `${fields} already exists`;
  } else if (err.name === "SequelizeForeignKeyConstraintError") {
    err.status = 409;
    err.message = "Cannot delete: resource is referenced by other records";
  } else if (err.name?.startsWith("Sequelize")) {
    err.status = 500;
    err.message = "A database error occurred";
  }

  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV !== "production";

  const buildResponse = (statusCode, message, isDev, stack) => {
    return isDev ? { error: message, stack: stack } : { error: statusCode >= 500 ? "Internal Server Error" : message };
  };

  if (statusCode >= 500) {
    console.error(err);
  } else {
    console.warn(`${statusCode} - ${err.message}`);
  }

  res.status(statusCode).json(buildResponse(statusCode, err.message, isDev, err.stack));
};

export default errorHandler;
