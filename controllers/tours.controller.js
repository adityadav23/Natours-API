const fs = require('fs')

async function getAllTours(req, res){
    const tours = JSON.parse(
        fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
    )
    res.status(200).json({
        success: "true",
        results: tours.length,
        data:{
            tours
        }
    })

}



module.exports = {
    getAllTours,
}