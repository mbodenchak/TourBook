const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const productionError = (err, res) => {
  //operation, trusted error: send msg to client
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other error: don't leak details
  } else {
    //log error
    console.error('*********** ERROR ***********', err);
    //send generic msg
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong.',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    productionError(err, res);
  }
};
