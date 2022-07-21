import  * as ChargeCloudError from '../lib/Errors/errors.js'

const devHandleErrors = (err, req, res, next) => {
  if (err instanceof ChargeCloudError.ChargeCloudError) {
    res.status(err.httpStatus).json({
      status: err.statusCode,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: 500,
      message: err.message
    });
  }
}

const handleErrors = (err, req, res, next) => {
  if (err instanceof ChargeCloudError) {
    return res.status(err.getCode()).json({
      status: err.statusCode,
      message: err.message
    });
  } else {
    return res.status(500).json({
      status: 500,
      message: err.message
    });
  }
}

export default  process.env.NODE_ENV === 'production' ? handleErrors : devHandleErrors;