function sendErrorDev(err,res){
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

function sendErrorProd(err,res){
    //Operational, trusted error: send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    //Programming or other unknown error: don't leak error details
    } else{
            console.log('Error !!!',err)
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            })
    }
}

function errorHandler(err,req,res,next){
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res)
    }else if(process.env.NODE_ENV === 'production'){
        sendErrorProd(err, res)
    }
}

module.exports = errorHandler