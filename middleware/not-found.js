function notFound(req,res,next){
    res.status(404).json({
        status: 'Fail',
        message: `Can't find ${req.originalUrl} on this server.`

    })

}
module.exports = notFound