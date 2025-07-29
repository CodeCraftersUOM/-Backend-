const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller"); // <-- fixed path

// Import health routes
const healthRoutes = require("./healthRoutes");

router.post("/add_data", controller.addUser);
router.get("/get_data", controller.getUsers);
router.post("/updateuser", controller.updateUser);
router.post("/deleteuser", controller.deleteUser);
router.post("/login", controller.loginUser);

// Use health routes
router.use("/", healthRoutes);

module.exports = router;
