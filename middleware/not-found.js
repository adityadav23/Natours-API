const AppError = require("../utils/appError")

function notFound(req,res,next){
    // res.status(404).json({
    //     status: 'Fail',
    //     message: `Can't find ${req.originalUrl} on this server.`
    // })

    next(new AppError(`Can't find ${req.originalUrl} on this server.`,404))
}
module.exports = notFound