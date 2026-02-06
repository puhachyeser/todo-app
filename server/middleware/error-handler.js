const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || 'Something went wrong, please try again later',
  };

  if (err.name === 'SequelizeValidationError') {
    customError.msg = err.errors.map((item) => item.message).join(', ');
    customError.statusCode = 400;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    customError.msg = `Duplicate value entered for ${err.errors[0].path} field`;
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json({ message: customError.msg });
};

module.exports = errorHandler;