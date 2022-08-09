const  DBAdapterError = require('../utils/error/errors.js')

const devHandleErrors = (err, req, res, next) => {
    if (err instanceof DBAdapterError.DBAdapterError){
        res.status(err.httpStatus).json({
            status: err.statusCode,
            message: err.message
        })
    }else{
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
}

const handleErrors = (err ,req, res ,next) =>{
    if(err instanceof DBAdapterError){
        res.status(err.httpStatus).json({
            status: err.statusCode,
            message: err.message
        })
    }else{
        res.status(500).json({
            status: err.statusCode,
            message: err.message
        })
    }
}

module.exports =  process.env.NODE_ENV === 'production' ? handleErrors : devHandleErrors;