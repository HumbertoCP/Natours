const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')

const router = express.Router()

//router.use(tourController.checkBody)

router.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin'),tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin'),tourController.deleteTour)

module.exports = router