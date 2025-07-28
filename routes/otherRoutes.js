const express = require('express');
const router = express.Router();
const otherController = require('../controllers/addother');

const baseRoute = '/other-services';

// Create a new service
router.post(baseRoute, otherController.createCommonService);

// Get all services
router.get(baseRoute, otherController.getAllCommonServices);

// Search for services
router.post(`${baseRoute}/search`, otherController.searchCommonServices);

// Get a single service by ID
router.get(`${baseRoute}/:id`, otherController.getCommonServiceById);

// Update a service by ID
router.put(`${baseRoute}/:id`, otherController.updateCommonService);

// Delete a service by ID
router.delete(`${baseRoute}/:id`, otherController.deleteCommonService);

module.exports = router;
