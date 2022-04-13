const express = require('express')
const tourController = require('./../controllers/tourController')

const router = express.Router()

router.param('id', tourController.checkID)

router.use(express.json());
router.use(tourController.checkBody)

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.postTour)

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.patchTour)
    .delete(tourController.deleteTour)

module.exports = router