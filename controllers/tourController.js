const Tour = require('./../models/tourModel')

exports.checkBody = (req, res, next) => {
    if(!req.body.name){
        return res.status(404).json({
            status: 'fail',
            message: 'Name invalid'
        })
    }
    if(!req.body.price || !(Number.isInteger(req.body.price))){
        return res.status(400).json({
            status: 'fail',
            message: 'Price invalid'
        })
    }
    next()
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        /* results: tours.length,
        data: {
            tours: tours
        } */
    })
}
exports.getTour = (req, res) => {
    //console.log(req.params)
    const id = req.params.id * 1

    /* const tour = tours.find(el => el.id === id)

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    }) */
}

exports.postTour = (req, res) => {
    res.status(201).json({
        status: 'success',
        /* data: {
            tour: newTour
        } */
    })
}

exports.patchTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid Id'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

exports.deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid Id'
        })
    }

    res.status(204).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}